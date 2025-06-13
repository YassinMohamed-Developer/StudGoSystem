import logging
import logging.config
from typing import Dict, Any, Optional
import spacy
from config import LOGGING_CONFIG
from spacy.matcher import Matcher
import requests
import PyPDF2
import io
from urllib.parse import urljoin
import os
import hashlib
from typing import List

# Configure logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

class CVProcessor:
    def __init__(self, nlp: Optional[spacy.Language] = None):
        # Use the provided spaCy model (which should be the singleton from FastAPI)
        self.nlp = nlp
        if not self.nlp:
            logger.warning("No spaCy model provided, creating a new one")
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except OSError:
                logger.error("spaCy model not found. Please run 'python -m spacy download en_core_web_sm'")
                raise
                
        logger.info("CV Processor initialized successfully")
        self._setup_cv_patterns()
        
        # Create CV cache directory if it doesn't exist
        self.cv_cache_dir = os.path.join(os.path.dirname(__file__), 'cv_cache')
        os.makedirs(self.cv_cache_dir, exist_ok=True)

    def _setup_cv_patterns(self):
        """Setup spaCy patterns for CV parsing."""
        # Skills patterns - expanded to include more field-specific patterns
        self.skills_pattern = [
            # General skills patterns
            [{"LOWER": {"IN": ["skills", "technical", "competencies", "expertise", "proficiencies"]}}],
            [{"LOWER": "key"}, {"LOWER": "skills"}],
            [{"LOWER": "core"}, {"LOWER": "competencies"}],
            [{"LOWER": "technical"}, {"LOWER": "expertise"}],
            
            # Field-specific patterns
            [{"LOWER": "programming"}, {"LOWER": "skills"}],
            [{"LOWER": "software"}, {"LOWER": "skills"}],
            [{"LOWER": "language"}, {"LOWER": "skills"}],
            [{"LOWER": "technical"}, {"LOWER": "skills"}],
            [{"LOWER": "soft"}, {"LOWER": "skills"}],
            [{"LOWER": "interpersonal"}, {"LOWER": "skills"}],
            [{"LOWER": "professional"}, {"LOWER": "skills"}],
            [{"LOWER": "domain"}, {"LOWER": "expertise"}],
            [{"LOWER": "industry"}, {"LOWER": "knowledge"}],
            [{"LOWER": "tools"}, {"LOWER": "and"}, {"LOWER": "technologies"}],
            [{"LOWER": "certifications"}, {"LOWER": "and"}, {"LOWER": "skills"}]
        ]
        
        # Experience patterns
        self.experience_pattern = [
            [{"LOWER": {"IN": ["experience", "work", "employment", "professional"]}}],
            [{"LOWER": "work"}, {"LOWER": "history"}],
            [{"LOWER": "employment"}, {"LOWER": "history"}]
        ]
        
        # Education patterns
        self.education_pattern = [
            [{"LOWER": {"IN": ["education", "academic", "qualifications"]}}],
            [{"LOWER": "academic"}, {"LOWER": "background"}],
            [{"LOWER": "educational"}, {"LOWER": "background"}]
        ]

        # Extracurricular activities patterns
        self.extracurricular_pattern = [
            [{"LOWER": {"IN": ["extracurricular", "activities", "involvement"]}}],
            [{"LOWER": "student"}, {"LOWER": "activities"}],
            [{"LOWER": "campus"}, {"LOWER": "involvement"}],
            [{"LOWER": "volunteer"}, {"LOWER": "work"}],
            [{"LOWER": "community"}, {"LOWER": "service"}],
            [{"LOWER": "clubs"}, {"LOWER": "and"}, {"LOWER": "organizations"}],
            [{"LOWER": "leadership"}, {"LOWER": "roles"}],
            [{"LOWER": "student"}, {"LOWER": "organizations"}],
            [{"LOWER": "sports"}, {"LOWER": "and"}, {"LOWER": "activities"}],
            [{"LOWER": "hobbies"}, {"LOWER": "and"}, {"LOWER": "interests"}]
        ]
        
        # Initialize matchers
        self.skills_matcher = Matcher(self.nlp.vocab)
        self.experience_matcher = Matcher(self.nlp.vocab)
        self.education_matcher = Matcher(self.nlp.vocab)
        self.extracurricular_matcher = Matcher(self.nlp.vocab)
        
        self.skills_matcher.add("SKILLS", self.skills_pattern)
        self.experience_matcher.add("EXPERIENCE", self.experience_pattern)
        self.education_matcher.add("EDUCATION", self.education_pattern)
        self.extracurricular_matcher.add("EXTRACURRICULAR", self.extracurricular_pattern)

    def _get_cv_cache_path(self, cv_url: str) -> str:
        """Generate cache file path for a CV URL."""
        url_hash = hashlib.md5(cv_url.encode()).hexdigest()
        return os.path.join(self.cv_cache_dir, f"{url_hash}.txt")

    def _download_and_cache_cv(self, cv_url: str) -> str:
        """Download CV and cache it if not already cached."""
        cache_path = self._get_cv_cache_path(cv_url)
        
        # Check if CV is already cached
        if os.path.exists(cache_path):
            logger.info(f"Using cached CV from {cache_path}")
            with open(cache_path, 'r', encoding='utf-8') as f:
                return f.read()

        logger.info(f"Downloading CV from {cv_url}")
        try:
            # Convert relative URL to absolute URL if needed
            if not cv_url.startswith(('http://', 'https://')):
                base_url = "https://studgo.runasp.net/"
                cv_url = urljoin(base_url, cv_url)
                logger.info(f"Converted relative URL to absolute URL: {cv_url}")

            # Download the CV
            response = requests.get(cv_url)
            response.raise_for_status()
            logger.info("Successfully downloaded CV")

            # Check content type to determine parsing method
            content_type = response.headers.get('content-type', '').lower()
            logger.info(f"CV content type: {content_type}")


            logger.info("Parsing PDF CV")
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(response.content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            logger.info(f"Successfully extracted {len(text)} characters from PDF")


            # Cache the extracted text
            with open(cache_path, 'w', encoding='utf-8') as f:
                f.write(text)
            logger.info(f"Cached CV to {cache_path}")

            return text

        except Exception as e:
            logger.error(f"Error downloading/parsing CV: {str(e)}")
            raise

    def parse_cv(self, cv_url: str) -> Dict:
        """Parse CV content from URL and extract text using NLP."""
        try:
            logger.info(f"Starting CV parsing for URL: {cv_url}")
            
            # Download and cache CV if needed
            text = self._download_and_cache_cv(cv_url)
            logger.info(f"CV text length: {len(text)} characters")
            
            # Process text with spaCy
            logger.info("Processing CV text with spaCy...")
            doc = self.nlp(text)
            logger.info(f"Processed {len(doc)} tokens")
            
            # Extract sections
            logger.info("Extracting skills...")
            skills = self._extract_skills_nlp(doc)
            logger.info(f"Extracted {len(skills)} skills: {skills}")
            
            logger.info("Extracting experience...")
            experience = self._extract_experience_nlp(doc)
            logger.info(f"Extracted {len(experience)} experience entries")
            
            logger.info("Extracting education...")
            education = self._extract_education_nlp(doc)
            logger.info(f"Extracted {len(education)} education entries")
            
            logger.info("Extracting extracurricular activities...")
            extracurricular = self._extract_extracurricular_nlp(doc)
            logger.info(f"Extracted {len(extracurricular)} extracurricular activities")
            
            result = {
                'raw_text': text,
                'skills': skills,
                'experience': experience,
                'education': education,
                'extracurricular': extracurricular
            }
            
            logger.info("CV parsing completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error parsing CV: {str(e)}")
            raise

    def _extract_skills_nlp(self, doc) -> List[str]:
        """Extract skills using NLP with enhanced field-specific extraction."""
        logger.info("Starting skills extraction...")
        skills = set()
        
        # Find skills sections
        matches = self.skills_matcher(doc)
        logger.info(f"Found {len(matches)} skills sections")
        
        for match_id, start, end in matches:
            section = doc[start:end]
            logger.info(f"Processing skills section: {section.text}")
            
            # Look for skills in the next few sentences
            next_sents = list(doc.sents)[:5]
            logger.info(f"Analyzing {len(next_sents)} sentences for skills")
            
            for sent in next_sents:
                logger.debug(f"Analyzing sentence: {sent.text}")
                
                # Extract noun phrases and proper nouns as potential skills
                for token in sent:
                    # Basic skills (single words)
                    if token.pos_ in ["NOUN", "PROPN"] and len(token.text) > 2:
                        skills.add(token.text.lower())
                        logger.debug(f"Found basic skill: {token.text}")
                    
                    # Compound skills (e.g., "Python programming")
                    if token.dep_ == "compound":
                        skill = f"{token.text} {token.head.text}".lower()
                        skills.add(skill)
                        logger.debug(f"Found compound skill: {skill}")
                    
                    # Skills with adjectives (e.g., "advanced Python")
                    if token.pos_ == "ADJ" and token.head.pos_ in ["NOUN", "PROPN"]:
                        skill = f"{token.text} {token.head.text}".lower()
                        skills.add(skill)
                        logger.debug(f"Found adjective-modified skill: {skill}")
                    
                    # Skills with prepositions (e.g., "experience in Python")
                    if token.dep_ == "prep" and token.head.pos_ in ["NOUN", "PROPN"]:
                        skills.add(token.head.text.lower())
                        logger.debug(f"Found skill with preposition: {token.head.text}")
                
                # Extract noun chunks as potential multi-word skills
                for chunk in sent.noun_chunks:
                    if len(chunk.text.split()) <= 3:
                        skills.add(chunk.text.lower())
                        logger.debug(f"Found noun chunk skill: {chunk.text}")
                
                # Extract skills from bullet points or lists
                if any(char in sent.text for char in ['•', '-', '*']):
                    for token in sent:
                        if token.pos_ in ["NOUN", "PROPN"]:
                            skills.add(token.text.lower())
                            logger.debug(f"Found bullet point skill: {token.text}")
        
        # Post-processing to clean and categorize skills
        cleaned_skills = []
        for skill in skills:
            # Remove common stop words and punctuation
            skill = skill.strip('.,;:()[]{}"\'')
            
            # Skip if too short or just a common word
            if len(skill) < 3 or skill in ['the', 'and', 'with', 'using', 'experience']:
                continue
                
            # Add cleaned skill
            cleaned_skills.append(skill)
        
        logger.info(f"Extracted {len(cleaned_skills)} unique skills after cleaning")
        return cleaned_skills

    def _extract_experience_nlp(self, doc) -> List[Dict]:
        """Extract work experience using NLP."""
        logger.info("Starting experience extraction...")
        experiences = []
        
        # Find experience section
        matches = self.experience_matcher(doc)
        logger.info(f"Found {len(matches)} experience sections")
        
        for match_id, start, end in matches:
            section = doc[start:end]
            logger.info(f"Processing experience section: {section.text}")
            
            # Look for experience entries in the next few sentences
            next_sents = list(doc.sents)[:10]
            logger.info(f"Analyzing {len(next_sents)} sentences for experience")
            
            current_experience = {}
            for sent in next_sents:
                logger.debug(f"Analyzing sentence: {sent.text}")
                
                # Extract dates
                for ent in sent.ents:
                    if ent.label_ == "DATE":
                        current_experience['date'] = ent.text
                        logger.debug(f"Found date: {ent.text}")
                
                # Extract organization names
                for ent in sent.ents:
                    if ent.label_ == "ORG":
                        current_experience['organization'] = ent.text
                        logger.debug(f"Found organization: {ent.text}")
                
                # Extract job titles
                for token in sent:
                    if token.pos_ == "PROPN" and token.dep_ == "compound":
                        title = f"{token.text} {token.head.text}"
                        current_experience['title'] = title
                        logger.debug(f"Found job title: {title}")
                
                # If we have a complete experience entry, add it
                if current_experience and len(current_experience) >= 2:
                    experiences.append(current_experience)
                    logger.info(f"Added experience entry: {current_experience}")
                    current_experience = {}
        
        logger.info(f"Extracted {len(experiences)} experience entries")
        return experiences

    def _extract_education_nlp(self, doc) -> List[Dict]:
        """Extract education information using NLP."""
        logger.info("Starting education extraction...")
        education = []
        
        # Find education section
        matches = self.education_matcher(doc)
        logger.info(f"Found {len(matches)} education sections")
        
        for match_id, start, end in matches:
            section = doc[start:end]
            logger.info(f"Processing education section: {section.text}")
            
            # Look for education entries in the next few sentences
            next_sents = list(doc.sents)[:10]
            logger.info(f"Analyzing {len(next_sents)} sentences for education")
            
            current_education = {}
            for sent in next_sents:
                logger.debug(f"Analyzing sentence: {sent.text}")
                
                # Extract dates
                for ent in sent.ents:
                    if ent.label_ == "DATE":
                        current_education['date'] = ent.text
                        logger.debug(f"Found date: {ent.text}")
                
                # Extract institution names
                for ent in sent.ents:
                    if ent.label_ == "ORG":
                        current_education['institution'] = ent.text
                        logger.debug(f"Found institution: {ent.text}")
                
                # Extract degrees
                for token in sent:
                    if token.pos_ == "PROPN" and token.dep_ == "compound":
                        degree = f"{token.text} {token.head.text}"
                        current_education['degree'] = degree
                        logger.debug(f"Found degree: {degree}")
                
                # If we have a complete education entry, add it
                if current_education and len(current_education) >= 2:
                    education.append(current_education)
                    logger.info(f"Added education entry: {current_education}")
                    current_education = {}
        
        logger.info(f"Extracted {len(education)} education entries")
        return education

    def _extract_extracurricular_nlp(self, doc) -> List[Dict]:
        """Extract extracurricular activities using NLP."""
        logger.info("Starting extracurricular activities extraction...")
        activities = []
        
        # Find extracurricular sections
        matches = self.extracurricular_matcher(doc)
        logger.info(f"Found {len(matches)} extracurricular sections")
        
        for match_id, start, end in matches:
            section = doc[start:end]
            logger.info(f"Processing extracurricular section: {section.text}")
            
            # Look for activities in the next few sentences
            next_sents = list(doc.sents)[:10]
            logger.info(f"Analyzing {len(next_sents)} sentences for activities")
            
            current_activity = {}
            for sent in next_sents:
                logger.debug(f"Analyzing sentence: {sent.text}")
                
                # Extract dates
                for ent in sent.ents:
                    if ent.label_ == "DATE":
                        current_activity['date'] = ent.text
                        logger.debug(f"Found date: {ent.text}")
                
                # Extract organization/activity names
                for ent in sent.ents:
                    if ent.label_ == "ORG":
                        current_activity['organization'] = ent.text
                        logger.debug(f"Found organization: {ent.text}")
                
                # Extract role/position
                for token in sent:
                    if token.pos_ == "PROPN" and token.dep_ in ["compound", "nsubj"]:
                        if 'role' not in current_activity:
                            current_activity['role'] = token.text
                        else:
                            current_activity['role'] += f" {token.text}"
                        logger.debug(f"Found role: {current_activity['role']}")
                
                # Extract description
                if sent.text.strip():
                    current_activity['description'] = sent.text.strip()
                    logger.debug(f"Found description: {current_activity['description']}")
                
                # If we have a complete activity entry, add it
                if current_activity and len(current_activity) >= 2:
                    activities.append(current_activity)
                    logger.info(f"Added activity entry: {current_activity}")
                    current_activity = {}
        
        logger.info(f"Extracted {len(activities)} extracurricular activities")
        return activities 