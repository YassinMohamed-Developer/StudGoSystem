const AuthImagePattern = ({ title, subtitle, image }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gray-900 h-full">
      <div className="max-w-md text-center flex flex-col justify-center items-center h-full py-8">
        {/* Image Container */}
        <div className="flex justify-center mb-4">
          <img
            src={image}
            alt="Authentication Illustration"
            className="w-90 h-90 object-contain"
          />
        </div>
        {/* Title and Subtitle */}
        <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
        <p className="text-gray-300 text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;