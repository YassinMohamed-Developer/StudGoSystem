import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  X, 
  MoreVertical, 
  Edit, 
  Trash, 
  Users, 
  ArrowUpDown,
  ChevronDown,
  UserPlus,
  AlertTriangle
} from "lucide-react";
import { axiosInstance, getSAIdFromToken } from "../../../lib/axios";
import { toast } from "react-hot-toast";


function SaTeams() {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [studentActivityId, setStudentActivityId] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: ""
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  // Fetch student activity ID and teams on component mount
  useEffect(() => {
    const saId = getSAIdFromToken();
    if (saId) {
      setStudentActivityId(saId);
      fetchTeams(saId);
    } else {
      toast.error("Student Activity ID not found");
    }
  }, []);

  const fetchTeams = async (saId) => {
    try {
      const response = await axiosInstance().get(`/team/sa/${saId}`);
      if (response.data?.isSuccess && response.data?.data) {
        setTeams(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams");
    } finally {
      setIsLoading(false);
    }
  };

  // Get all unique tags from teams
  const allTags = Array.from(
    new Set(teams.flatMap(team => team.tags || []))
  ).sort();

  // Filter and sort teams
  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      team.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }).sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTeamForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle team form submit (create or edit)
  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let response;
      
      if (selectedTeam) {
        // Edit existing team
        response = await axiosInstance().put(`/team/${selectedTeam.id}`, teamForm);
      } else {
        // Create new team
        response = await axiosInstance().post("/team/", teamForm);
      }

      if (response.data?.isSuccess) {
        toast.success(selectedTeam ? "Team updated successfully" : "Team created successfully");
        fetchTeams(studentActivityId);
        setShowTeamModal(false);
        setTeamForm({ name: "", description: "" });
        setSelectedTeam(null);
      }
    } catch (error) {
      console.error("Error saving team:", error);
      toast.error(error.response?.data?.message || `Failed to ${selectedTeam ? 'update' : 'create'} team`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle team selection for edit
  const handleEditTeam = (team, e) => {
    e.stopPropagation();
    setSelectedTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description
    });
    setShowTeamModal(true);
  };

  // Handle team deletion
  const handleDeleteTeam = (team, e) => {
    e.stopPropagation();
    setTeamToDelete(team);
    setShowDeleteModal(true);
  };

  // Handle actual team deletion
  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;
    
    try {
      setIsLoading(true);
      const response = await axiosInstance().delete(`/team/${teamToDelete.id}`);
      if (response.data?.isSuccess) {
        toast.success("Team deleted successfully");
        fetchTeams(studentActivityId);
        setShowDeleteModal(false);
        setTeamToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error(error.response?.data?.message || "Failed to delete team");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header with search and filters */}
      <div className="mb-6 bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Teams</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search teams..."
                className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            
            {/* Add Team Button */}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              onClick={() => {
                setSelectedTeam(null);
                setTeamForm({ name: "", description: "" });
                setShowTeamModal(true);
              }}
            >
              <Plus size={18} />
              <span>Add Team</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <Users size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No teams found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search criteria</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={() => setSearchTerm("")}
          >
            <X size={18} />
            <span>Clear Search</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => (
            <div 
              key={team.id} 
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-700 hover:border-gray-600"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                      <Users size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                      <div className="text-gray-400 text-sm mt-1">
                        {team.studentActivityName}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleEditTeam(team, e)}
                      className="p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Edit Team"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteTeam(team, e)}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Delete Team"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-400 mt-4">{team.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {selectedTeam ? 'Edit Team' : 'Create New Team'}
              </h3>
              <button 
                className="text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 p-2"
                onClick={() => {
                  setShowTeamModal(false);
                  setSelectedTeam(null);
                  setTeamForm({ name: "", description: "" });
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleTeamSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={teamForm.name}
                  onChange={handleFormChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter team name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={teamForm.description}
                  onChange={handleFormChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter team description"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTeamModal(false);
                    setSelectedTeam(null);
                    setTeamForm({ name: "", description: "" });
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Saving..."
                  ) : selectedTeam ? (
                    "Update Team"
                  ) : (
                    "Create Team"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Delete Team</h3>
                <p className="text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">"{teamToDelete?.name}"</span>?
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setTeamToDelete(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTeam}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash size={16} />
                    <span>Delete Team</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaTeams;
