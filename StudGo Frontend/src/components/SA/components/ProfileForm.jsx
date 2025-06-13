import { Save, Loader2 } from "lucide-react";

export default function ProfileForm({ formik, isLoading }) {
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      {/* Activity Information */}
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
        {/* Additional fields for founding date, member count, etc. */}
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
          <Mail className="w-5 h-5" />
          Contact Information
        </h2>
        {/* Email, Phone, Location fields */}
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
          <FileText className="w-5 h-5" />
          Activity Description
        </h2>
        {/* Description field */}
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission and Vision fields */}
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
          <FileText className="w-5 h-5" />
          Tags
        </h2>
        {/* Tags input and display */}
      </div>

      {/* Submit Button */}
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
  );
}