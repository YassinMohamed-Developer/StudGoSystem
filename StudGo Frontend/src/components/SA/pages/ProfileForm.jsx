import React from 'react';
import { useFormikContext } from 'formik';
import { Loader2, Save, User, Mail, Phone, FileText, Target, Bookmark, XCircle, Upload, MapPin, Building, GraduationCap, BookOpen } from 'lucide-react';

const ProfileForm = ({ isLoading, api, toast }) => {
  const formik = useFormikContext();

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("picture", file);

    try {
      const response = await api.post("/student-activity/upload-profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        formik.setFieldValue("pictureUrl", response.data.pictureUrl);
        toast.success("Profile picture uploaded successfully!");
      }
    } catch (error) {
      console.error("Profile picture upload error:", error);
      toast.error("Failed to upload profile picture");
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
      {/* Profile Picture Section - Moved to Top */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden bg-gray-800">
            <img
              src={formik.values.pictureUrl || "https://via.placeholder.com/150"}
              alt="Profile Picture"
              className="w-full h-full object-cover"
            />
          </div>
          <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
            <Upload className="w-5 h-5 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureUpload}
            />
          </label>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
              <User className="w-5 h-5" />
              Activity Information
            </h2>
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
                placeholder="Enter activity name"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.name && formik.errors.name ? "border-red-500" : ""
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biography
              </label>
              <textarea
                name="biography"
                value={formik.values.biography}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter biography"
                rows={4}
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.biography && formik.errors.biography ? "border-red-500" : ""
                }`}
              />
              {formik.touched.biography && formik.errors.biography && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.biography}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter address"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.address && formik.errors.address ? "border-red-500" : ""
                }`}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter city"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.city && formik.errors.city ? "border-red-500" : ""
                }`}
              />
              {formik.touched.city && formik.errors.city && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Governorate
              </label>
              <input
                type="text"
                name="governorate"
                value={formik.values.governorate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter governorate"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.governorate && formik.errors.governorate ? "border-red-500" : ""
                }`}
              />
              {formik.touched.governorate && formik.errors.governorate && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.governorate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                University
              </label>
              <input
                type="text"
                name="university"
                value={formik.values.university}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter university"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.university && formik.errors.university ? "border-red-500" : ""
                }`}
              />
              {formik.touched.university && formik.errors.university && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.university}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Faculty
              </label>
              <input
                type="text"
                name="faculty"
                value={formik.values.faculty}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter faculty"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.faculty && formik.errors.faculty ? "border-red-500" : ""
                }`}
              />
              {formik.touched.faculty && formik.errors.faculty && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.faculty}</p>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
              <MapPin className="w-5 h-5" />
              Location Information
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter address"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.address && formik.errors.address ? "border-red-500" : ""
                }`}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter city"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.city && formik.errors.city ? "border-red-500" : ""
                }`}
              />
              {formik.touched.city && formik.errors.city && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Governorate
              </label>
              <input
                type="text"
                name="governorate"
                value={formik.values.governorate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter governorate"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.governorate && formik.errors.governorate ? "border-red-500" : ""
                }`}
              />
              {formik.touched.governorate && formik.errors.governorate && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.governorate}</p>
              )}
            </div>
            <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-400 mt-8">
              <Mail className="w-5 h-5" />
              Contact Information
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formik.values.contactEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter contact email"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.contactEmail && formik.errors.contactEmail ? "border-red-500" : ""
                }`}
              />
              {formik.touched.contactEmail && formik.errors.contactEmail && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.contactEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="contactPhoneNumber"
                value={formik.values.contactPhoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter contact phone number"
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber ? "border-red-500" : ""
                }`}
              />
              {formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.contactPhoneNumber}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
