import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, ThumbsUp, Share2, Bookmark, Send, Image, Smile, Link2 } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';

function SaTalk() {
  const [newPost, setNewPost] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Fetch posts using React Query
  const { data: posts = [], isLoading } = useQuery('saTalkPosts', async () => {
    const { data } = await axios.get('https://studgov1.runasp.net/api/SaTalk/posts');
    return data.data || [];
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            SA Talk
          </h1>
          <p className="text-gray-300">Connect with your fellow students and organizations</p>
        </motion.div>

        {/* Create Post Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts with the community..."
                className="w-full bg-gray-700 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
              />
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <Image className="w-5 h-5" />
                    <span>Photo</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <Link2 className="w-5 h-5" />
                    <span>Link</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <Smile className="w-5 h-5" />
                    <span>Emoji</span>
                  </button>
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['all', 'trending', 'announcements', 'discussions', 'questions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-full capitalize whitespace-nowrap ${
                selectedTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                {/* Post Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{post.authorName}</h3>
                    <p className="text-sm text-gray-400">{post.timestamp}</p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-300 mb-4">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post attachment"
                    className="rounded-lg mb-4 w-full object-cover"
                  />
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-700">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <ThumbsUp className="w-5 h-5" />
                    <span>{post.likes || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors ml-auto">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SaTalk;