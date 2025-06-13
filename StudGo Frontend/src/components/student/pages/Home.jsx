import { 
  Users, 
  Calendar, 
  BookOpen, 
  Briefcase,
  ArrowRight,
  Star,
  Award,
  Target,
  Zap,
  Shield,
  Heart,
  GraduationCap,
  Globe,
  Clock,
  CheckCircle2,
  User,
  Building,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Lightbulb,
  Rocket,
  Bookmark,
  Trophy,
  Brain,
  Sparkles,
  X
} from 'lucide-react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { axiosInstance } from '../../../lib/axios';
import { useQuery } from 'react-query';

const Home = () => {
  const [showStats, setShowStats] = useState(false);

  // Use React Query to fetch stats
  const { data: stats = {
    activeStudents: 0,
    upcomingActivities: 0,
    internshipOpportunities: 0,
    totalActivities: 0,
    appliedEvents: 0,
    appliedWorkshops: 0,
    activeOrganizations: 0
  }, isLoading } = useQuery(
    'stats',
    async () => {
      const response = await axiosInstance().get('/State/GetStates');
      if (response.data.isSuccess) {
        return response.data.data;
      }
      throw new Error('Failed to fetch stats');
    }
  );

  const statsCards = [
    { label: 'Active Students', value: stats.activeStudents, icon: Users },
    { label: 'Upcoming Activities', value: stats.upcomingActivities, icon: Calendar },
    { label: 'Internship Opportunities', value: stats.internshipOpportunities, icon: Briefcase },
    { label: 'Total Activities', value: stats.totalActivities, icon: Calendar },
    { label: 'Applied Events', value: stats.appliedEvents, icon: CheckCircle2 },
    { label: 'Applied Workshops', value: stats.appliedWorkshops, icon: BookOpen },
    { label: 'Active Organizations', value: stats.activeOrganizations, icon: Building }
  ];

  const features = [
    {
      title: "Student Development Hub",
      description: "Access a comprehensive platform designed to enhance your academic and professional growth journey.",
      icon: GraduationCap,
      benefits: [
        "Personalized learning paths",
        "Skill development workshops",
        "Academic resources",
        "Progress tracking"
      ]
    },
    {
      title: "Career Growth Platform",
      description: "Connect with industry leaders and explore diverse career opportunities tailored to your interests.",
      icon: Target,
      benefits: [
        "Industry insights",
        "Career guidance",
        "Professional networking",
        "Job opportunities"
      ]
    },
    {
      title: "Community Building",
      description: "Join a vibrant community of students and professionals to share experiences and grow together.",
      icon: Users,
      benefits: [
        "Peer learning",
        "Group discussions",
        "Collaborative projects",
        "Knowledge sharing"
      ]
    }
  ];

  const benefits = [
    {
      title: "Enhanced Learning",
      description: "Access quality educational resources and interactive learning experiences.",
      icon: Star,
      color: "text-yellow-400"
    },
    {
      title: "Career Advancement",
      description: "Build your professional profile and connect with industry experts.",
      icon: Award,
      color: "text-blue-400"
    },
    {
      title: "Skill Enhancement",
      description: "Develop practical skills through hands-on projects and workshops.",
      icon: Zap,
      color: "text-purple-400"
    },
    {
      title: "Global Network",
      description: "Connect with students and professionals from around the world.",
      icon: Globe,
      color: "text-green-400"
    }
  ];

  const feedbacks = [
    {
      title: "Academic Excellence",
      description: "Access quality educational resources and learning materials to excel in your studies.",
      icon: GraduationCap,
      color: "text-blue-500"
    },
    {
      title: "Career Growth",
      description: "Connect with industry professionals and explore diverse career opportunities.",
      icon: Target,
      color: "text-purple-500"
    },
    {
      title: "Community Support",
      description: "Join a supportive community of students and professionals for collaborative learning.",
      icon: Users,
      color: "text-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/60 to-purple-600/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Your Gateway to Student Success
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Connect, Learn, and Grow with StudGo - Your comprehensive platform for academic and professional development
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                       p-4 rounded-full transition-all duration-300 transform hover:scale-110 
                       shadow-lg hover:shadow-xl group flex items-center gap-2"
            >
              <span className="text-white font-semibold">View Statistics</span>
              <ArrowRight className={`w-6 h-6 text-white transition-transform duration-300 ${showStats ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowStats(false)}
              className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center">StudGo Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-gray-800 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-transform duration-300 shadow-xl">
                    <Icon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-16 px-4 bg-gray-800/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose StudGo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-800 rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-300">
                  <Icon className="w-12 h-12 mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Using StudGo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-gray-800 rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-300">
                  <Icon className={`w-12 h-12 mb-4 ${benefit.color}`} />
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Students Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbacks.map((feedback, index) => {
              const Icon = feedback.icon;
              return (
                <div key={index} className="bg-gray-800 rounded-xl p-6 hover:transform hover:scale-105 transition-transform duration-300">
                  <Icon className={`w-12 h-12 mb-4 ${feedback.color}`} />
                  <h3 className="text-xl font-semibold mb-3">{feedback.title}</h3>
                  <p className="text-gray-400">{feedback.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Learning Journey */}
            <div className="bg-gray-700/50 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Rocket className="w-6 h-6 text-blue-500" />
                Your Learning Journey
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                  <Sparkles className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform" />
                  <span>Personalized Learning Path</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                  <Brain className="w-4 h-4 text-purple-500 group-hover:rotate-12 transition-transform" />
                  <span>Skill Development</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                  <Trophy className="w-4 h-4 text-green-500 group-hover:rotate-12 transition-transform" />
                  <span>Achievement Tracking</span>
                </li>
              </ul>
            </div>

            {/* Student Resources */}
            <div className="bg-gray-700/50 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-green-500" />
                Student Resources
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                  <BookOpen className="w-4 h-4 text-blue-500 group-hover:rotate-12 transition-transform" />
                  <span>Study Materials</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                  <Lightbulb className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform" />
                  <span>Learning Tips</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                  <Target className="w-4 h-4 text-red-500 group-hover:rotate-12 transition-transform" />
                  <span>Goal Setting</span>
                </li>
              </ul>
            </div>

            {/* Quick Access */}
            <div className="bg-gray-700/50 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Quick Access
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                  <Calendar className="w-4 h-4 text-blue-500 group-hover:rotate-12 transition-transform" />
                  <span>Upcoming Events</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                  <Briefcase className="w-4 h-4 text-purple-500 group-hover:rotate-12 transition-transform" />
                  <span>Opportunities</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group">
                  <Users className="w-4 h-4 text-green-500 group-hover:rotate-12 transition-transform" />
                  <span>Community Hub</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 StudGo - Empowering Student Success
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;