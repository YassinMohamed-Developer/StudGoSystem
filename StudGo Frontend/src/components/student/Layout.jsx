import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import FloatingChat from "./FloatingChat.jsx";

export default function Layout() {
//   const { userData } = useContext(UserContext); // Access user data from context (optional)

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="navbar-spacer h-14 md:h-16"></div> {/* Reduced spacer height */}
      <main className="flex-grow">
        <Outlet /> {/* Render child routes */}
      </main>
      <FloatingChat />
      {/* <Footer /> */}
    </div>
  );
}
