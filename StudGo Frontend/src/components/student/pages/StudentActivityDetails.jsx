/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { axiosInstance } from '../../../lib/axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, Mail, Phone, Globe, Calendar, MapPin, Users, Activity, ExternalLink, Share2, Check, Copy, Heart } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from 'react-hot-toast';

// Import all components
import HeaderSection from "../components/StudentActivity/Details/HeaderSection";
import ContactInfoCard from "../components/StudentActivity/Details/ContactInfoCard";
import OrganizationDetailsCard from "../components/StudentActivity/Details/OrganizationDetailsCard";
import QuickActionsCard from "../components/StudentActivity/Details/QuickActionsCard";
import ActivityCalendarCard from "../components/StudentActivity/Details/ActivityCalendarCard";
import AboutSection from "../components/StudentActivity/Details/AboutSection";
import MissionVisionSection from "../components/StudentActivity/Details/MissionVisionSection";
import TagsSection from "../components/StudentActivity/Details/TagsSection";
import RecentActivitiesSection from "../components/StudentActivity/Details/RecentActivitiesSection";
import UpcomingEventsSection from "../components/StudentActivity/Details/UpcomingEventsSection";
import WorkshopsSection from "../components/StudentActivity/Details/WorkshopsSection";
import AchievementsSection from "../components/StudentActivity/Details/AchievementsSection";
import TeamsSection from "../components/StudentActivity/Details/TeamsSection";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const StudentActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCopied, setShowCopied] = useState(false);
  const queryClient = useQueryClient();

  const defaultImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%230A84FF' rx='75'/%3E%3Ctext x='75' y='85' font-family='Arial' font-size='40' font-weight='bold' text-anchor='middle' fill='white'%3ESA%3C/text%3E%3C/svg%3E";

  // Query to check if user is following
  const { data: isFollowing, isLoading: isFollowingLoading, refetch: refetchFollowing } = useQuery(
    ['isFollowing', id],
    async () => {
      try {
        const { data } = await axiosInstance().get(`/sa/${id}/is-following`);
        return true; // If we get a success response, user is following
      } catch (error) {
        if (error.response?.status === 400) {
          return false; // If we get 400, user is not following
        }
        throw error; // Re-throw other errors
      }
    },
    {
      enabled: !!id,
    }
  );

  // Mutation to toggle follow/unfollow
  const toggleFollowMutation = useMutation(
    async () => {
      const { data } = await axiosInstance().post(`/sa/${id}/toggle-follow`);
      return data.data;
    },
    {
      onSuccess: () => {
        // After successful toggle, refetch the following status
        refetchFollowing();
        toast.success(isFollowing ? 'Successfully unfollowed' : 'Successfully followed');
      },
      onError: (error) => {
        toast.error('Failed to toggle follow status');
      }
    }
  );

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const { data: activityData, isLoading, error } = useQuery(
    ['studentActivity', id],
    async () => {
      const { data } = await axiosInstance().get(`/sa/${id}`);
      return data.data;
    },
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 rounded-full"></div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative h-16 w-16 border-t-2 border-b-2 border-blue-500 rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative">
          <div className="absolute inset-0 bg-red-500 blur-[100px] opacity-20 rounded-full"></div>
          <div className="relative text-red-500 bg-red-900/20 p-6 rounded-xl border border-red-500/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">Error Loading Activity</h3>
            <p>Failed to load student activity details. Please try again later.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 text-white pb-12">
      {/* Decorative Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="group mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span className="text-gray-300 group-hover:text-white transition-colors">Back to Activities</span>
          </motion.button>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Header with Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 group-hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-gray-600 group-hover:border-blue-500/50 transition-all duration-300">
                      {activityData.pictureUrl ? (
                        <img
                          src={activityData.pictureUrl}
                          alt={activityData.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = defaultImageUrl;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src={defaultImageUrl}
                            alt={activityData.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{activityData.name}</h1>
                      <p className="text-gray-400 mt-1">{activityData.university}</p>
                      <p className="text-gray-400">{activityData.faculty}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFollowMutation.mutate()}
                      disabled={isFollowingLoading || toggleFollowMutation.isLoading}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                        isFollowing
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFollowing ? 'fill-current' : ''}`} />
                      <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Biography Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 group-hover:border-blue-500/50 transition-all duration-300">
                  <h2 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors">About</h2>
                  <p className="text-gray-300 leading-relaxed">{activityData.biography}</p>
                </div>
              </motion.div>

              {/* Teams Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TeamsSection studentActivityId={id} />
              </motion.div>
            </motion.div>

            {/* Right Column - Contact & Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Contact Information */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 group-hover:border-blue-500/50 transition-all duration-300">
                  <h2 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span>{activityData.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone className="w-5 h-5 text-blue-400" />
                      <span>{activityData.contactPhoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <a
                        href={activityData.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span>Founded: {new Date(activityData.foundingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span>{activityData.address}</span>
                    </div>

                    {/* Share Section */}
                    <div className="pt-4 space-y-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Share2 className="w-5 h-5 text-blue-400" />
                        <span className="font-medium">Share Activity</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCopyUrl}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 hover:border-blue-500/50"
                      >
                        {showCopied ? (
                          <>
                            <Check className="w-5 h-5 text-green-400" />
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Join Form URL Button */}
                    <div className="pt-4">
                      <motion.button
                        whileHover={activityData.joinFormUrl ? { scale: 1.02 } : {}}
                        whileTap={activityData.joinFormUrl ? { scale: 0.98 } : {}}
                        onClick={() => activityData.joinFormUrl && window.open(activityData.joinFormUrl, '_blank')}
                        disabled={!activityData.joinFormUrl}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                          activityData.joinFormUrl
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/20 border border-blue-500/50'
                            : 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600'
                        }`}
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>
                          {activityData.joinFormUrl ? 'Apply Now' : 'Application Form Not Available'}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group h-[400px] rounded-xl overflow-hidden border border-gray-700 group-hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100"></div>
                <div className="relative h-full">
                  <MapContainer
                    center={[activityData.latitude, activityData.longitude]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-xl"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[activityData.latitude, activityData.longitude]}>
                      <Popup>
                        <div className="text-gray-800">
                          <h3 className="font-semibold">{activityData.name}</h3>
                          <p className="text-sm">{activityData.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentActivityDetails;