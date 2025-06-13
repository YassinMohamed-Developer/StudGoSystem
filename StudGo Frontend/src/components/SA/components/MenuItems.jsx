import { 
  Home,
  Users,
  Activity,
  UserPlus,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function MenuItems({ isCollapsed, pathname }) {
  // Define menu items
  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      path: "/student-activity",
      exact: true,
    },
    {
      title: "Activities",
      icon: <Activity size={20} />,
      path: "/student-activity/activities",
    },
    {
      title: "Teams",
      icon: <Users size={20} />,
      path: "/student-activity/teams",
    },
    {
      title: "Followers",
      icon: <UserPlus size={20} />,
      path: "/student-activity/followers",
    },
  ];

  // Render menu item
  const renderMenuItem = (item) => {
    const isActive = 
      (item.exact && pathname === item.path) || 
      (!item.exact && pathname.startsWith(item.path));

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center ${
          isCollapsed ? "justify-center" : ""
        } px-3 py-2.5 my-1 rounded-md transition-colors ${
          isActive
            ? "bg-blue-600/20 text-blue-400"
            : "text-gray-400 hover:text-white hover:bg-gray-800/70"
        }`}
        title={isCollapsed ? item.title : ""}
      >
        <span className={isActive ? "text-blue-400" : "text-gray-400"}>
          {item.icon}
        </span>
        {!isCollapsed && (
          <span className="ml-3 text-sm font-medium">{item.title}</span>
        )}
      </Link>
    );
  };

  return (
    <div className="px-2">
      {/* Main menu items */}
      <div className="mb-4">
        {menuItems.map((item) => renderMenuItem(item))}
      </div>
    </div>
  );
}

export default MenuItems;
