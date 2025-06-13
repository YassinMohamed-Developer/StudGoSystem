import logging
import logging.config
from typing import Dict, List
from pydantic import BaseModel
from config import LOGGING_CONFIG
from cv_processor import CVProcessor
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Configure logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

class Activity(BaseModel):
    id: int
    title: str
    description: str
    start_date: str
    end_date: str

class ActivityConflict(BaseModel):
    activities: List[Activity]
    recommendation: str

class ActivityConflictResponse(BaseModel):
    conflicts: List[ActivityConflict]
    message: str

class ActivityManager:
    def __init__(self, db_pool, cv_processor: CVProcessor, model: SentenceTransformer):
        self.db_pool = db_pool
        self.cv_processor = cv_processor
        self.model = model
        logger.info("Activity Manager initialized successfully")

    def get_student_activities(self, student_id: int) -> List[Activity]:
        try:
            with self.db_pool.get_cursor() as cursor:
                cursor.execute("""
                    SELECT a.id, a.Title, a.Description, a.StartDate, a.EndDate
                    FROM activities a
                    JOIN activitystudent ast ON a.id = ast.activitiesId
                    WHERE ast.studentsId = %s AND a.EndDate >= GETDATE()
                    ORDER BY a.StartDate ASC
                """, (student_id,))
                return [Activity(
                    id=row[0], title=row[1], description=row[2],
                    start_date=row[3].isoformat(), end_date=row[4].isoformat()
                ) for row in cursor.fetchall()]
        except Exception as e:
            logger.error(f"Error getting student activities: {str(e)}")
            raise

    def check_conflicts(self, activities: List[Activity]) -> List[List[Activity]]:
        if not activities:
            return []

        sorted_activities = sorted(activities, key=lambda x: x.start_date)
        conflict_groups = []
        current_group = [sorted_activities[0]]

        for activity in sorted_activities[1:]:
            if any(activity.start_date <= group_act.end_date and 
                  group_act.start_date <= activity.end_date 
                  for group_act in current_group):
                current_group.append(activity)
            else:
                if len(current_group) > 1:
                    conflict_groups.append(current_group)
                current_group = [activity]

        if len(current_group) > 1:
            conflict_groups.append(current_group)

        return conflict_groups

    def _create_embedding(self, text: str) -> np.ndarray:
        try:
            return self.model.encode(text)
        except Exception as e:
            logger.error(f"Error creating embedding: {str(e)}")
            return np.zeros(384)

    def get_activity_recommendation(self, activities: List[Activity], student_info: Dict) -> str:
        try:
            cv_url = student_info.get('cvUrl')
            if not cv_url:
                activity_titles = [f"'{act.title}'" for act in activities]
                return f"Conflict between {', '.join(activity_titles[:-1])} and {activity_titles[-1]}. Please choose based on your preferences."

            cv_data = self.cv_processor.parse_cv(cv_url)
            cv_text = " ".join([
                " ".join(cv_data.get('skills', [])),
                " ".join(f"{exp.get('title', '')} {exp.get('organization', '')} {exp.get('description', '')}"
                        for exp in cv_data.get('experience', [])),
                " ".join(f"{edu.get('degree', '')} {edu.get('institution', '')} {edu.get('field', '')}"
                        for edu in cv_data.get('education', []))
            ])
            cv_embedding = self._create_embedding(cv_text)

            # Calculate similarities for all activities
            activity_similarities = []
            for activity in activities:
                act_embedding = self._create_embedding(f"{activity.title} {activity.description}")
                similarity = cosine_similarity([cv_embedding], [act_embedding])[0][0]
                
                # Add bonus for skill matches
                if any(skill.lower() in activity.title.lower() 
                      for skill in cv_data.get('skills', [])):
                    similarity += 0.1
                
                activity_similarities.append((activity, similarity))

            # Sort and generate recommendation
            sorted_activities = sorted(activity_similarities, key=lambda x: x[1], reverse=True)
            best_activity = sorted_activities[0][0]
            other_activities = [act[0].title for act in sorted_activities[1:]]

            if len(activities) == 2:
                return f"Recommend attending '{best_activity.title}' over '{other_activities[0]}' based on your background."
            else:
                return f"Recommend '{best_activity.title}' over {', '.join(f"'{act}'" for act in other_activities[:-1])} and '{other_activities[-1]}' based on your background."

        except Exception as e:
            logger.error(f"Error generating recommendation: {str(e)}")
            activity_titles = [f"'{act.title}'" for act in activities]
            return f"Conflict between {', '.join(activity_titles[:-1])} and {activity_titles[-1]}. Please choose based on your preferences."

    def process_conflicts(self, student_id: int, student_info: Dict) -> ActivityConflictResponse:
        try:
            activities = self.get_student_activities(student_id)
            if not activities:
                return ActivityConflictResponse(conflicts=[], message="No activities found")

            conflict_groups = self.check_conflicts(activities)
            if not conflict_groups:
                return ActivityConflictResponse(conflicts=[], message="No conflicts found")

            conflicts = [
                ActivityConflict(
                    activities=group,
                    recommendation=self.get_activity_recommendation(group, student_info)
                )
                for group in conflict_groups
            ]

            message = "Found conflicts in your activities. Recommendations based on your CV:\n"
            message += "\n".join(f"• {conflict.recommendation}" for conflict in conflicts)

            return ActivityConflictResponse(conflicts=conflicts, message=message)

        except Exception as e:
            logger.error(f"Error processing conflicts: {str(e)}")
            raise 