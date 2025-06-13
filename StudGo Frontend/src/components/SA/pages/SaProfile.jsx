import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { axiosInstance, getSAIdFromToken } from "../../../lib/axios";
import { BaseUrl } from "../../../lib/axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from "react-router-dom";

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Activity name is required"),
  biography: Yup.string().required("Biography is required").min(20, "Biography must be at least 20 characters"),
  foundingDate: Yup.date().required("Founding date is required"),
  contactEmail: Yup.string().email("Invalid email").required("Email is required"),
  contactPhoneNumber: Yup.string().required("Phone number is required"),
  university: Yup.string().required("University is required"),
  faculty: Yup.string().required("Faculty is required"),
  websiteUrl: Yup.string().url("Invalid website URL").nullable(),
  joinFormUrl: Yup.string().url("Invalid join form URL").nullable(),
  longitude: Yup.number().nullable(),
  latitude: Yup.number().nullable(),
  address: Yup.string().required("Address is required"),
});

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Add LocationMarker component
function LocationMarker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  // Update position when initialPosition changes
  useEffect(() => {
    if (initialPosition && Array.isArray(initialPosition) && initialPosition.length === 2) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newPosition = e.target.getLatLng();
          setPosition(newPosition);
          onLocationSelect(newPosition);
        },
      }}
    />
  );
}

export default function SaProfile() {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pictureFile, setPictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [initialPosition, setInitialPosition] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    biography: "",
    foundingDate: "",
    pictureUrl: "",
    joinFormUrl: "",
    websiteUrl: "",
    contactEmail: currentUser?.email || "",
    contactPhoneNumber: "",
    longitude: "0",
    latitude: "0",
    university: "",
    faculty: "",
    address: ""
  });

  const formik = useFormik({
    initialValues: profileData,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const saId = getSAIdFromToken();
        if (!saId) {
          toast.error("No SA ID found");
          navigate("/login");
          return;
        }

        const formattedData = {
          name: values.name,
          biography: values.biography,
          foundingDate: new Date(values.foundingDate).toISOString(),
          joinFormUrl: values.joinFormUrl,
          websiteUrl: values.websiteUrl,
          contactEmail: values.contactEmail,
          contactPhoneNumber: values.contactPhoneNumber,
          longitude: parseFloat(values.longitude),
          latitude: parseFloat(values.latitude),
          university: values.university,
          faculty: values.faculty,
          address: values.address
        };

        const response = await axiosInstance().post(`/sa/update-profile`, formattedData);
        
        if (response.data?.isSuccess) {
          toast.success("Profile updated successfully!");
          // Refresh profile data after update
          fetchProfile(saId);
        } else {
          toast.error(response.data?.message || "Failed to update profile");
        }
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error(error.response?.data?.message || "Failed to update profile");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const saId = getSAIdFromToken();
    if (!saId) {
      toast.error("No SA ID found");
      navigate("/login");
      return;
    }
    fetchProfile(saId);
  }, [navigate]);

  const fetchProfile = async (saId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance().get(`/sa/${saId}`);
      if (response.data?.isSuccess) {
        const data = response.data.data;
        const newProfileData = {
          name: data.name || "",
          biography: data.biography || "",
          foundingDate: data.foundingDate ? new Date(data.foundingDate).toISOString().split('T')[0] : "",
          pictureUrl: data.pictureUrl || "",
          joinFormUrl: data.joinFormUrl || "",
          websiteUrl: data.websiteUrl || "",
          contactEmail: data.contactEmail || currentUser?.email || "",
          contactPhoneNumber: data.contactPhoneNumber || "",
          longitude: data.longitude || "0",
          latitude: data.latitude || "0",
          university: data.university || "",
          faculty: data.faculty || "",
          address: data.address || ""
        };
        setProfileData(newProfileData);
        formik.setValues(newProfileData);

        if (data.pictureUrl) {
          setPreviewUrl(data.pictureUrl);
        }
      } else {
        toast.error(response.data?.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Update initialPosition when formik values change
  useEffect(() => {
    const lat = parseFloat(formik.values.latitude);
    const lng = parseFloat(formik.values.longitude);
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      setInitialPosition([lat, lng]);
    }
  }, [formik.values.latitude, formik.values.longitude]);

  // Handle picture upload
  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPictureFile(file);
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);

    const formData = new FormData();
    formData.append("picture", file);

    try {
      setIsLoading(true);
      const saId = getSAIdFromToken();
      if (!saId) {
        toast.error("No SA ID found");
        navigate("/login");
        return;
      }

      const response = await axiosInstance().post(`/sa/upload-picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.isSuccess) {
        formik.setFieldValue("pictureUrl", response.data.data.pictureUrl);
        toast.success("Profile picture uploaded successfully!");
      }
    } catch (error) {
      console.error("Picture upload error:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  // Add reverse geocoding function
  const reverseGeocode = async (lat, lng) => {
    try {
      setIsGeocoding(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        formik.setFieldValue('address', data.display_name);
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      toast.error('Failed to fetch address details');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Update handleLocationSelect to include reverse geocoding
  const handleLocationSelect = async (latlng) => {
    formik.setFieldValue("latitude", latlng.lat);
    formik.setFieldValue("longitude", latlng.lng);
    await reverseGeocode(latlng.lat, latlng.lng);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 rounded-b-2xl shadow-lg">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Student Activity Profile</h1>
          <p className="text-gray-200 text-sm sm:text-base">Manage your activity details and information.</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full w-fit">Active</span>
            <span className="text-xs sm:text-sm text-gray-200">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {/* Profile Form */}
            <div className="space-y-6 sm:space-y-8">
              <form onSubmit={formik.handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-700">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image load error:", e);
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePictureUpload}
                    className="hidden"
                    id="profile-picture"
                  />
                  <label
                    htmlFor="profile-picture"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2 transition-colors text-sm sm:text-base"
                  >
                    <Upload size={16} className="sm:size-5" />
                    {previewUrl ? "Change Picture" : "Upload Picture"}
                  </label>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Activity Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formik.touched.name && formik.errors.name ? "border-red-500" : ""
                      }`}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Founding Date
                    </label>
                    <input
                      type="date"
                      name="foundingDate"
                      value={formik.values.foundingDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formik.touched.foundingDate && formik.errors.foundingDate ? "border-red-500" : ""
                      }`}
                    />
                    {formik.touched.foundingDate && formik.errors.foundingDate && (
                      <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.foundingDate}</p>
                    )}
                  </div>
                </div>

                {/* Biography */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Biography
                  </label>
                  <textarea
                    name="biography"
                    value={formik.values.biography}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={4}
                    className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formik.touched.biography && formik.errors.biography ? "border-red-500" : ""
                    }`}
                  />
                  {formik.touched.biography && formik.errors.biography && (
                    <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.biography}</p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formik.values.contactEmail}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formik.touched.contactEmail && formik.errors.contactEmail ? "border-red-500" : ""
                      }`}
                    />
                    {formik.touched.contactEmail && formik.errors.contactEmail && (
                      <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.contactEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="contactPhoneNumber"
                      value={formik.values.contactPhoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber ? "border-red-500" : ""
                      }`}
                    />
                    {formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber && (
                      <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.contactPhoneNumber}</p>
                    )}
                  </div>
                </div>

                {/* Location Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <div className="h-48 sm:h-64 rounded-lg overflow-hidden">
                      <MapContainer
                        center={initialPosition || [30.0444, 31.2357]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker 
                          onLocationSelect={handleLocationSelect} 
                          initialPosition={initialPosition}
                        />
                      </MapContainer>
                    </div>
                    <div className="mt-2 text-xs sm:text-sm text-gray-400">
                      Click on the map to set the location or drag the marker to adjust
                    </div>
                    <div className="mt-2 text-xs sm:text-sm text-gray-400">
                      Selected Coordinates: {formik.values.latitude}, {formik.values.longitude}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <textarea
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your full address or select a location on the map"
                        rows={2}
                        className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formik.touched.address && formik.errors.address ? "border-red-500" : ""
                        }`}
                      />
                      {isGeocoding && (
                        <div className="absolute right-3 top-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                    </div>
                    {formik.touched.address && formik.errors.address && (
                      <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.address}</p>
                    )}
                    <p className="mt-1 text-xs sm:text-sm text-gray-400">
                      Click on the map to automatically fill the address
                    </p>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      University
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="university"
                        value={formik.values.university}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your university"
                        className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formik.touched.university && formik.errors.university ? "border-red-500" : ""
                        }`}
                      />
                      {formik.touched.university && formik.errors.university && (
                        <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.university}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Faculty
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="faculty"
                        value={formik.values.faculty}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your faculty"
                        className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formik.touched.faculty && formik.errors.faculty ? "border-red-500" : ""
                        }`}
                      />
                      {formik.touched.faculty && formik.errors.faculty && (
                        <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.faculty}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="websiteUrl"
                      value={formik.values.websiteUrl}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formik.touched.websiteUrl && formik.errors.websiteUrl ? "border-red-500" : ""
                      }`}
                    />
                    {formik.touched.websiteUrl && formik.errors.websiteUrl && (
                      <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.websiteUrl}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Join Form URL
                    </label>
                    <input
                      type="url"
                      name="joinFormUrl"
                      value={formik.values.joinFormUrl}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formik.touched.joinFormUrl && formik.errors.joinFormUrl ? "border-red-500" : ""
                      }`}
                    />
                    {formik.touched.joinFormUrl && formik.errors.joinFormUrl && (
                      <p className="mt-1 text-xs sm:text-sm text-red-400">{formik.errors.joinFormUrl}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading || !formik.isValid}
                    className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="bg-gray-800 p-4 sm:p-6 mt-8">
        <div className="container mx-auto px-4 sm:px-6 text-center text-gray-400 text-xs sm:text-sm">
          <p> {new Date().getFullYear()} StudGO - Student Activity Management</p>
          <p className="mt-2">Enhance your student activity experience with our platform</p>
        </div>
      </div>
    </div>
  );
}