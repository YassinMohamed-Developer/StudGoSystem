import { useNavigate } from "react-router-dom";

function Card({ type, count, isLoading, icon }) {
  const navigate = useNavigate();

  // Define the navigation paths for each type
  const paths = {
    Events: "/student-activity/events",
    Talks: "/student-activity/talks",
    Workshops: "/student-activity/workshops",
    Members: "/student-activity/members",
  };

  // Define colors for each card type
  const colors = {
    Events: "bg-indigo-600 hover:bg-indigo-700",
    Talks: "bg-green-600 hover:bg-green-700",
    Workshops: "bg-yellow-600 hover:bg-yellow-700",
    Members: "bg-red-600 hover:bg-red-700",
  };

  return (
    <div
      className={`${colors[type]} text-white rounded-xl p-5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col`}
      onClick={() => navigate(paths[type])}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium uppercase tracking-wider opacity-80">{type}</span>
        <div className="text-white opacity-80">
          {icon}
        </div>
      </div>
      <h1 className="text-3xl font-bold mt-2">
        {isLoading ? (
          <div className="animate-pulse bg-white bg-opacity-20 h-8 w-16 rounded"></div>
        ) : (
          count
        )}
      </h1>
      <p className="text-xs mt-2 opacity-70">Click to view details</p>
    </div>
  );
}

export default Card;
