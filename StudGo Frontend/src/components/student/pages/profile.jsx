import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useFormik } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "../../../lib/axios";
import axios from "axios";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Building2,
  Save,
  Loader2,
  Upload,
  FileText,
  Calendar,
  Clock,
  Activity,
  ListTodo,
  Users,
  Star,
  Award,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Search
} from "lucide-react";
import { toast } from "react-hot-toast";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';

// Fix for the default marker icon in react-leaflet
const defaultIcon = icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Map click handler component
function MapClickHandler({ onLocationSelect }) {
  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        // Reverse geocoding to get address from coordinates
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        if (data.display_name) {
          onLocationSelect(data.display_name, lat, lng);
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        toast.error('Failed to get location address');
      }
    }
  });
  return null;
}

// Map and search component
function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState([30.0444, 31.2357]); // Default to Cairo
  const [map, setMap] = useState(null);

  const handleMapLocationSelect = (address, lat, lng) => {
    setPosition([lat, lng]);
    onLocationSelect(address, lat, lng);
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-[300px] rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onLocationSelect={handleMapLocationSelect} />
          <Marker position={position} icon={defaultIcon} />
        </MapContainer>
      </div>
      <p className="text-sm text-gray-400">Click anywhere on the map to select a location.</p>
    </div>
  );
}

// Validation Schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  birthDate: Yup.date().required("Birth date is required"),
  contactPhoneNumber: Yup.string().required("Phone number is required"),
  contactEmail: Yup.string().email("Invalid email").required("Email is required"),
  fieldOfStudy: Yup.string().required("Field of study is required"),
  university: Yup.string().required("University is required"),
  faculty: Yup.string().required("Faculty is required"),
  address: Yup.string().required("Address is required"),
  longitude: Yup.number().nullable(),
  latitude: Yup.number().nullable(),
});

export default function Profile() {
  const { currentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletePictureModal, setShowDeletePictureModal] = useState(false);
  
  // Add refs for file inputs
  const cvInputRef = useRef(null);
  const pictureInputRef = useRef(null);
  const hasFetchedProfile = useRef(false);

  const initialFormValues = {
    firstName: "",
    lastName: "",
    address: "",
    longitude: null,
    latitude: null,
    fieldOfStudy: "",
    contactEmail: currentUser?.email || "",
    contactPhoneNumber: "",
    birthDate: "",
    university: "",
    faculty: ""
  };

  // Create formik instance first
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      const controller = new AbortController();
      
      try {
        const api = axiosInstance();
        const response = await api.post("/student/update-profile", values, {
          signal: controller.signal,
          timeout: 20000
        });
        
        if (response.data.isSuccess) {
          // Fetch the latest profile data after successful update
          const profileResponse = await api.get("/student/profile", {
            signal: controller.signal,
            timeout: 15000,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0',
            }
          });

          if (profileResponse.data.isSuccess) {
            const updatedProfileData = profileResponse.data.data;
            setProfileData(updatedProfileData);
            setIsProfileSaved(true);
            setShowProfileCard(true);
            
            // Update form values with the latest data
            formik.setValues({
              firstName: updatedProfileData.firstName || "",
              lastName: updatedProfileData.lastName || "",
              birthDate: updatedProfileData.birthDate ? new Date(updatedProfileData.birthDate).toISOString().split("T")[0] : "",
              contactPhoneNumber: updatedProfileData.contactPhoneNumber || "",
              contactEmail: updatedProfileData.contactEmail || currentUser?.email || "",
              fieldOfStudy: updatedProfileData.fieldOfStudy || "",
              university: updatedProfileData.university || "",
              faculty: updatedProfileData.faculty || "",
              address: updatedProfileData.address || "",
              longitude: updatedProfileData.longitude || null,
              latitude: updatedProfileData.latitude || null,
            });
            
            toast.success(response.data.message || "Profile updated successfully!");
          } else {
            toast.error("Failed to fetch updated profile data");
          }
        } else {
          toast.error(response.data.message || "Failed to update profile");
        }
      } catch (error) {
        if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
          console.warn('Update request was aborted:', error);
          toast.error("Request timed out. Please try again.");
        } else {
          console.error("Profile update error:", error);
          const errorMessage = error.response?.data?.message || error.response?.data?.errors?.join(", ") || "Failed to update profile";
          toast.error(errorMessage);
        }
      } finally {
        controller.abort();
        setIsLoading(false);
      }
    },
  });

  // Modify the useEffect to properly handle profile data updates
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        if (isMounted) toast.error("Please login to access your profile");
        return;
      }

      try {
        const api = axiosInstance();
        const response = await api.get("/student/profile", {
          signal: controller.signal,
          timeout: 15000,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });
        
        if (!isMounted) return;
        
        if (response.data.isSuccess) {
          const data = response.data.data;
          setProfileData(data);
          
          const isProfileComplete = data && 
            data.firstName && 
            data.lastName && 
            data.birthDate && 
            data.contactPhoneNumber && 
            data.contactEmail && 
            data.fieldOfStudy && 
            data.university && 
            data.faculty && 
            data.address;
          
          setIsProfileSaved(isProfileComplete);
          setShowProfileCard(true);
          
          if (data) {
            formik.setValues({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split("T")[0] : "",
              contactPhoneNumber: data.contactPhoneNumber || "",
              contactEmail: data.contactEmail || currentUser?.email || "",
              fieldOfStudy: data.fieldOfStudy || "",
              university: data.university || "",
              faculty: data.faculty || "",
              address: data.address || "",
              longitude: data.longitude || null,
              latitude: data.latitude || null,
            });
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
          console.warn('Network request was aborted:', error);
        } else if (error.response?.status === 400 && error.response.data.errors?.[0] === "Student not found.") {
          setShowProfileCard(false);
          setIsProfileSaved(false);
          toast("Please complete your profile information");
        } else if (error.response?.status === 401) {
          toast.error("Your session has expired. Please login again.");
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch profile");
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentUser?.email]); // Only depend on email changes

  // Add a useEffect to handle profile data changes
  useEffect(() => {
    if (profileData) {
      setShowProfileCard(true);
      setIsProfileSaved(true);
    }
  }, [profileData]);

  // Helper function to check if URL is valid (not null, undefined, or empty string)
  const isValidUrl = (url) => {
    return url && 
           url !== "null" && 
           url !== "undefined" && 
           url !== "" &&
           url !== "Picture have Issue" &&
           url !== "CV have Issue";
  };

  const handleLocationSelect = (address, lat, lng) => {
    // Only update if the formik object is still valid (component is mounted)
    if (formik && formik.setFieldValue) {
      formik.setFieldValue('address', address);
      formik.setFieldValue('latitude', lat);
      formik.setFieldValue('longitude', lng);
    }
  };

  const handleCVUpload = async (event) => {
    if (!isProfileSaved) {
      toast.error("You should first complete your profile before uploading a CV");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    // Accept common document and image formats (including images for testing)
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, Word document, or image file");
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    setUploadingCV(true);
    const formData = new FormData();
    formData.append('CV', file);
    
    try {
      const api = axiosInstance();
      const controller = new AbortController(); // Create abort controller
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await api.post("/student/upload-cv", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear timeout if request completes
      
      if (response.data.isSuccess) {
        toast.success(response.data.message || "CV uploaded successfully");
        // Update local state instead of making another API call
        setProfileData(prevData => ({
          ...prevData,
          cvUrl: response.data.data
        }));
      } else {
        toast.error(response.data.message || "Failed to upload CV");
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error("Upload timed out. Please try again.");
      } else {
        console.error("Error uploading CV:", error);
        const errorMsg = error.response?.data?.message || "Failed to upload CV";
        toast.error(errorMsg);
      }
    } finally {
      setUploadingCV(false);
      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleProfilePictureUpload = async (event) => {
    if (!isProfileSaved) {
      toast.error("You should first complete your profile before uploading a profile picture");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    // Only accept image files
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    setUploadingPicture(true);
    const formData = new FormData();
    formData.append('picture', file);
    
    try {
      const api = axiosInstance();
      const controller = new AbortController(); // Create abort controller
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await api.post("/student/upload-picture", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear timeout if request completes
      
      if (response.data.isSuccess) {
        toast.success(response.data.message || "Profile picture uploaded successfully");
        // Update local state instead of making another API call
        setProfileData(prevData => ({
          ...prevData,
          pictureUrl: response.data.data
        }));
      } else {
        toast.error(response.data.message || "Failed to upload profile picture");
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error("Upload timed out. Please try again.");
      } else {
        console.error("Error uploading profile picture:", error);
        const errorMsg = error.response?.data?.message || "Failed to upload profile picture";
        toast.error(errorMsg);
      }
    } finally {
      setUploadingPicture(false);
      // Reset the file input safely
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDeleteCV = async () => {
    if (!isProfileSaved) {
      toast.error("You should first complete your profile before managing your CV");
      return;
    }
    
    setShowDeleteModal(true);
  };

  const deleteCV = async () => {
    setIsLoading(true);
    setShowDeleteModal(false);
    
    try {
      const api = axiosInstance();
      const controller = new AbortController(); // Create abort controller
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await api.delete("/student/delete-cv", {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear timeout if request completes
      
      if (response.data.isSuccess) {
        toast.success(response.data.message || "CV deleted successfully");
        // Update local state instead of making another API call
        setProfileData(prevData => {
          const updatedData = {
            ...prevData,
            cvUrl: null
          };
          console.log("Updated profile data after CV deletion:", updatedData);
          return updatedData;
        });
        
        // Force refresh to ensure UI updates properly
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to delete CV");
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error("Request timed out. Please try again.");
      } else {
        console.error("Error deleting CV:", error);
        const errorMsg = error.response?.data?.message || "Failed to delete CV";
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePicture = async () => {
    if (!isProfileSaved) {
      toast.error("You should first complete your profile before managing your profile picture");
      return;
    }
    
    setShowDeletePictureModal(true);
  };

  const deletePicture = async () => {
    setIsLoading(true);
    setShowDeletePictureModal(false);
    
    try {
      const api = axiosInstance();
      const controller = new AbortController(); // Create abort controller
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await api.delete("/student/delete-picture", {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear timeout if request completes
      
      if (response.data.isSuccess) {
        toast.success(response.data.message || "Profile picture deleted successfully");
        // Update local state instead of making another API call
        setProfileData(prevData => {
          const updatedData = {
            ...prevData,
            pictureUrl: null
          };
          console.log("Updated profile data after picture deletion:", updatedData);
          return updatedData;
        });
        
        // Force refresh to ensure UI updates properly
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to delete profile picture");
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error("Request timed out. Please try again.");
      } else {
        console.error("Error deleting profile picture:", error);
        const errorMsg = error.response?.data?.message || "Failed to delete profile picture";
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Delete Picture Confirmation Modal */}
      {showDeletePictureModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-3">Delete Profile Picture</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete your profile picture? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeletePictureModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deletePicture}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-3">Delete CV</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete your CV? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteCV}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Profile Image */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Creative background with animated particles */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 animate-gradient"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM2LjYyNyAwIDEyLTUuMzczIDEyLTEyUzQyLjYyNyAxMCAzNiAxMCAyNCAxNS4zNzMgMjQgMjJzNS4zNzMgMTIgMTIgMTJ6bTAgMGM2LjYyNyAwIDEyLTUuMzczIDEyLTEyUzQyLjYyNyAxMCAzNiAxMCAyNCAxNS4zNzMgMjQgMjJzNS4zNzMgMTIgMTIgMTJ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-800/50"></div>
        </div>

        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float-delay"></div>
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl animate-float-reverse"></div>
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <div className="relative inline-block mb-6 group">
              {/* Animated background for profile picture */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              <div className="relative w-40 h-40 rounded-full border-4 border-blue-500 overflow-hidden bg-gray-800 transform transition duration-300 group-hover:scale-105">
                <img
                  src={isValidUrl(profileData?.pictureUrl) ? profileData.pictureUrl : "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                
                {/* Action buttons positioned in the center */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {isValidUrl(profileData?.pictureUrl) && (
                    <button 
                      className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-red-500/50 group/delete"
                      onClick={handleDeletePicture}
                      disabled={!isProfileSaved || uploadingPicture}
                      title="Delete profile picture"
                    >
                      <XCircle className="w-5 h-5 text-white group-hover/delete:animate-pulse" />
                    </button>
                  )}
                  <button 
                    className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:-rotate-12 shadow-lg ${
                      isProfileSaved 
                        ? 'bg-blue-500 hover:bg-blue-600 hover:shadow-blue-500/50 group/upload' 
                        : 'bg-gray-500 cursor-not-allowed'
                    }`}
                    onClick={() => isProfileSaved && pictureInputRef.current?.click()}
                    disabled={!isProfileSaved || uploadingPicture}
                    title={isProfileSaved ? "Upload profile picture" : "Complete your profile first"}
                  >
                    {uploadingPicture ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5 text-white group-hover/upload:animate-bounce" />
                    )}
                  </button>
                </div>
              </div>
              
              <input
                ref={pictureInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureUpload}
              />
            </div>
            
            <h1 className="text-4xl font-bold mb-2 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              {profileData?.firstName || formik.values.firstName || "Your"} {profileData?.lastName || formik.values.lastName || "Profile"}
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in-delay">
              {profileData?.university || formik.values.university || "University"} • {profileData?.fieldOfStudy || formik.values.fieldOfStudy || "Field of Study"}
            </p>
            
            {/* Enhanced CV upload button */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => isProfileSaved && cvInputRef.current?.click()}
                className={`px-6 py-3 text-white rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  isProfileSaved 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/50 group/cv' 
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
                disabled={!isProfileSaved || uploadingCV}
                title={isProfileSaved ? "Upload your CV" : "Complete your profile first"}
              >
                {uploadingCV ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group-hover/cv:animate-pulse">
                    <FileText className="w-5 h-5" />
                    <span>{isValidUrl(profileData?.cvUrl) ? "Replace CV" : "Upload CV"}</span>
                  </div>
                )}
              </button>
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpeg"
                className="hidden"
                onChange={handleCVUpload}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations to the CSS */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(5deg); }
          50% { transform: translate(0, -20px) rotate(0deg); }
          75% { transform: translate(-10px, -10px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 8s ease-in-out 2s infinite;
        }
        .animate-float-reverse {
          animation: float 8s ease-in-out 4s infinite reverse;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8">
          {/* Profile Card - Shown after fetch or save */}
          {showProfileCard && profileData && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8 transform transition-all duration-300 ease-in-out">
              <h2 className="text-2xl font-semibold mb-6 text-blue-400">Student Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300">Personal Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-400">Full Name</p>
                          <p className="text-white">{profileData.firstName} {profileData.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-400">Address</p>
                          <p className="text-white">{profileData.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-400">Birth Date</p>
                          <p className="text-white">{new Date(profileData.birthDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-300">Contact Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white">{profileData.contactEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white">{profileData.contactPhoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300">Academic Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start">
                        <Building2 className="w-5 h-5 text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-400">University</p>
                          <p className="text-white">{profileData.university}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <GraduationCap className="w-5 h-5 text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-400">Faculty</p>
                          <p className="text-white">{profileData.faculty}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <GraduationCap className="w-5 h-5 text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-400">Field of Study</p>
                          <p className="text-white">{profileData.fieldOfStudy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-300">Documents</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-400">CV Status</p>
                          <p className="text-white">{isValidUrl(profileData.cvUrl) ? "Uploaded" : "Not uploaded"}</p>
                        </div>
                      </div>
                      {profileData && isValidUrl(profileData.cvUrl) && (
                        <div className="mt-2 flex space-x-4">
                          <a 
                            href={profileData.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View CV
                          </a>
                          <button
                            onClick={handleDeleteCV}
                            className="inline-flex items-center text-red-400 hover:text-red-300"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Delete CV
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowProfileCard(false);
                    setIsProfileSaved(false); // Disable upload buttons when editing profile
                  }}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* Profile Form - Hidden when card is shown */}
          {!showProfileCard && (
            <div className="relative z-10">
              {/* Reduce background blob opacity */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl animate-blob"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/5 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 -left-20 w-60 h-60 bg-pink-500/5 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>

              <form onSubmit={formik.handleSubmit} className="space-y-10 relative z-10">
                <div className="backdrop-blur-sm bg-gray-900/70 rounded-3xl p-8 shadow-lg border border-gray-800/50 overflow-hidden relative">
                  {/* Remove decorative elements that cause excessive glow */}
                  
                  <div className="relative">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
                        Complete Your Profile
                      </span>
                    </h2>

                    <div className="space-y-12">
                      {/* Personal Information */}
                      <div className="form-section">
                        <h3 className="text-xl font-bold mb-6 flex items-center group">
                          <span className="inline-block mr-4 bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-md">
                            <User className="w-6 h-6 text-white" />
                          </span>
                          <span className="text-white tracking-tight">
                            Personal Information
                          </span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Name group - Full row on mobile, side by side on desktop */}
                          <div className="form-group group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors duration-300 ml-1">
                              First Name
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                                </div>
                                <input
                                  type="text"
                                  name="firstName"
                                  value={formik.values.firstName}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  placeholder="Enter your first name"
                                  className={`w-full bg-gray-800 pl-10 pr-4 py-3 rounded-xl border ${
                                    formik.touched.firstName && formik.errors.firstName 
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
                                      : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/30"
                                  } focus:outline-none focus:ring-2 transition-all duration-300 text-white shadow-sm`}
                                />
                              </div>
                            </div>
                            {formik.touched.firstName && formik.errors.firstName && (
                              <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                                <XCircle className="w-4 h-4" /> {formik.errors.firstName}
                              </p>
                            )}
                          </div>

                          <div className="form-group group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors duration-300 ml-1">
                              Last Name
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                                </div>
                                <input
                                  type="text"
                                  name="lastName"
                                  value={formik.values.lastName}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  placeholder="Enter your last name"
                                  className={`w-full bg-gray-800 pl-10 pr-4 py-3 rounded-xl border ${
                                    formik.touched.lastName && formik.errors.lastName 
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
                                      : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/30"
                                  } focus:outline-none focus:ring-2 transition-all duration-300 text-white shadow-sm`}
                                />
                              </div>
                            </div>
                            {formik.touched.lastName && formik.errors.lastName && (
                              <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                                <XCircle className="w-4 h-4" /> {formik.errors.lastName}
                              </p>
                            )}
                          </div>
                          
                          {/* Birth Date - Full row on mobile, half on desktop */}
                          <div className="form-group group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors duration-300 ml-1">
                              Birth Date
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                                </div>
                                <input
                                  type="date"
                                  name="birthDate"
                                  value={formik.values.birthDate}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className={`w-full bg-gray-800 pl-10 pr-4 py-3 rounded-xl border ${
                                    formik.touched.birthDate && formik.errors.birthDate 
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
                                      : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/30"
                                  } focus:outline-none focus:ring-2 transition-all duration-300 text-white shadow-sm`}
                                />
                              </div>
                            </div>
                            {formik.touched.birthDate && formik.errors.birthDate && (
                              <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                                <XCircle className="w-4 h-4" /> {formik.errors.birthDate}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="form-section">
                        <h3 className="text-xl font-bold mb-6 flex items-center group">
                          <span className="inline-block mr-4 bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl shadow-md">
                            <Mail className="w-6 h-6 text-white" />
                          </span>
                          <span className="text-white tracking-tight">
                            Contact Information
                          </span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="form-group group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-teal-400 transition-colors duration-300 ml-1">
                              Email
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-teal-400 transition-colors duration-300" />
                                </div>
                                <input
                                  type="email"
                                  name="contactEmail"
                                  placeholder="Enter your email"
                                  value={formik.values.contactEmail}
                                  onChange={formik.handleChange}
                                  className={`w-full bg-gray-800 pl-10 pr-4 py-3 rounded-xl border ${
                                    formik.touched.contactEmail && formik.errors.contactEmail 
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
                                      : "border-gray-700 focus:border-teal-500 focus:ring-teal-500/30"
                                  } focus:outline-none focus:ring-2 transition-all duration-300 text-white shadow-sm`}
                                />
                              </div>
                            </div>
                            {formik.touched.contactEmail && formik.errors.contactEmail && (
                              <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                                <XCircle className="w-4 h-4" /> {formik.errors.contactEmail}
                              </p>
                            )}
                          </div>

                          <div className="form-group group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-teal-400 transition-colors duration-300 ml-1">
                              Phone Number
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-teal-400 transition-colors duration-300" />
                                </div>
                                <input
                                  type="tel"
                                  name="contactPhoneNumber"
                                  value={formik.values.contactPhoneNumber}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  placeholder="Enter your phone number"
                                  className={`w-full bg-gray-800 pl-10 pr-4 py-3 rounded-xl border ${
                                    formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber 
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
                                      : "border-gray-700 focus:border-teal-500 focus:ring-teal-500/30"
                                  } focus:outline-none focus:ring-2 transition-all duration-300 text-white shadow-sm`}
                                />
                              </div>
                            </div>
                            {formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber && (
                              <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                                <XCircle className="w-4 h-4" /> {formik.errors.contactPhoneNumber}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Location Picker - Full width */}
                        <div className="form-group group mt-8">
                          <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-teal-400 transition-colors duration-300 ml-1">
                            Location
                          </label>
                          <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-700 transition-all duration-300 group-hover:border-teal-500/50">
                            <LocationPicker onLocationSelect={handleLocationSelect} />
                          </div>
                          <div className="relative mt-3">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-teal-400 transition-colors duration-300" />
                              </div>
                              <input
                                type="text"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                placeholder="Selected location address"
                                className="w-full bg-gray-800 pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-300 text-white shadow-sm"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Academic Information */}
                      <div className="form-section">
                        <h3 className="text-xl font-bold mb-6 flex items-center group">
                          <span className="inline-block mr-4 bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl shadow-md">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </span>
                          <span className="text-white tracking-tight">
                            Academic Information
                          </span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="form-group group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-orange-400 transition-colors duration-300 ml-1">
                              University
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors duration-300" />
                                </div>
                                <input
                                  type="text"
                                  name="university"
                                  value={formik.values.university}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  placeholder="Enter your university"
                                  className={`w-full bg-gray-800 pl-10 pr-4 py-3 rounded-xl border ${
                                    formik.touched.university && formik.errors.university 
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
                                      : "border-gray-700 focus:border-orange-500 focus:ring-orange-500/30"
                                  } focus:outline-none focus:ring-2 transition-all duration-300 text-white shadow-sm`}
                                />
                              </div>
                            </div>
                            {formik.touched.university && formik.errors.university && (
                              <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                                <XCircle className="w-4 h-4" /> {formik.errors.university}
                              </p>
                            )}
                          </div>

                          <div className="form-group group">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-orange-400 transition-colors duration-300 ml-1">
                              Faculty
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors duration-300" />
                                </div>
                                <input
                                  type="text"
                                  name="faculty"
                                  value={formik.values.faculty}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  placeholder="Enter your faculty"
                                  className={`w-full bg-gray-800 pl-10 pr-4 py-3 rounded-xl border ${
                                    formik.touched.faculty && formik.errors.faculty 
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
                                      : "border-gray-700 focus:border-orange-500 focus:ring-orange-500/30"
                                  } focus:outline-none focus:ring-2 transition-all duration-300 text-white shadow-sm`}
                                />
                              </div>
                            </div>
                            {formik.touched.faculty && formik.errors.faculty && (
                              <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                                <XCircle className="w-4 h-4" /> {formik.errors.faculty}
                              </p>
                            )}
                          </div>

                          <div className="form-group group md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-orange-400 transition-colors duration-300 ml-1">
                              Field of Study
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <GraduationCap className="h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors duration-300" />
                                </div>
                                <input
                                  type="text"
                                  name="fieldOfStudy"
                                  value={formik.values.fieldOfStudy}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  placeholder="Enter your field of study"
                                  className={`w-full bg-gray-800 pl-10 pr-4 py-3 rounded-xl border ${
                                    formik.touched.fieldOfStudy && formik.errors.fieldOfStudy 
                                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
                                      : "border-gray-700 focus:border-orange-500 focus:ring-orange-500/30"
                                  } focus:outline-none focus:ring-2 transition-all duration-300 text-white shadow-sm`}
                                />
                              </div>
                            </div>
                            {formik.touched.fieldOfStudy && formik.errors.fieldOfStudy && (
                              <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                                <XCircle className="w-4 h-4" /> {formik.errors.fieldOfStudy}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 relative">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="relative w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                          {isLoading ? (
                            <>
                              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              <span>Updating Profile...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-6 h-6" />
                              Save Profile
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
