import { BriefcaseIcon, CalendarIcon, CloudArrowUpIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Available Internships & Opportunities',
    description:
      'Browse and apply for internships, scholarships, and job opportunities tailored to your interests and career goals.',
    icon: BriefcaseIcon,
  },
  {
    name: 'Available Events',
    description:
      'Stay informed about upcoming events, workshops, and seminars relevant to your academic and professional growth.',
    icon: CalendarIcon,
  },
  {
    name: 'Personalized Notifications',
    description:
      'Get real-time updates about events, internships, and opportunities that match your preferences.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Community Engagement',
    description:
      'Join a vibrant student community, participate in activities, and connect with peers and professionals.',
    icon: UserGroupIcon,
  },
];

export default function Features() {
  return (
    <div className="bg-gray-900 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-indigo-500">Explore Features</h2>
          <p className="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Your gateway to growth and opportunities
          </p>
          <p className="mt-6 text-lg text-gray-300">
            Explore a suite of features designed to connect you with opportunities, events, and a supportive community.
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative bg-gray-800 p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="absolute -top-6 left-6 flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white">
                <feature.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <div className="ml-20 mt-4">
                <h3 className="text-lg font-bold text-white">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
