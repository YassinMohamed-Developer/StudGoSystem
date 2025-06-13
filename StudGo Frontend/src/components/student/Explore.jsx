import React from "react";

const ExploreSection = () => {
  const sections = [
    {
      title: "Student Activities",
      description: "Discover a variety of student activities designed to enhance learning, foster connections, and build essential skills for your future.",
      link: "/student-activities",
      icon: "🎓",
    },
    {
      title: "Events",
      description: "Stay updated on the latest educational events, career fairs, and student meetups to grow your network and explore new opportunities.",
      link: "/activities",
      icon: "📅",
    },
    {
      title: "Followed Activities",
      description: "View and manage the student activities you're following to stay updated with their latest events and opportunities.",
      link: "/followed-activities",
      icon: "🔧",
    },
    {
      title: "Profile",
      description: "Create and manage your personalized student profile to showcase your achievements, track your progress, and unlock tailored recommendations.",
      link: "/profile",
      icon: "👤",
    },
  ];

  return (
    <div className="bg-gray-800 py-20 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl text-center">
        <h3 className="text-5xl font-extrabold text-white mb-16 animate-fade-in">
          Explore What We Offer
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-700 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-6 text-indigo-400">{section.icon}</div>
              <h4 className="text-2xl font-bold text-white mb-4">{section.title}</h4>
              <p className="text-gray-400 mb-6 leading-relaxed">{section.description}</p>
              <a
                href={section.link}
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold text-lg"
              >
                Explore →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreSection;
