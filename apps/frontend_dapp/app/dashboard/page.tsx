"use client";
import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  X
} from 'lucide-react';
import { useWebsite } from '@/hooks/useWebsite';
import axios from 'axios';
import { API_BACKEND_URL } from '@/config';
import { useAuth } from '@clerk/nextjs';

interface UptimeData {
  timestamp: string;
  status: 'up' | 'down';
}

interface Website {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'warning';
  responseTime: number;
  uptime: number;
  lastChecked: string;
  uptimeData: UptimeData[];
}

interface NewWebsiteForm {
  name: string;
  url: string;
}

const Dashboard: React.FC = () => {
  const [expandedWebsite, setExpandedWebsite] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWebsite, setNewWebsite] = useState<NewWebsiteForm>({ name: '', url: '' });
  const [websites, setWebsites] = useState<Website[]>([]);
  const { website, refreshWebsites } = useWebsite();
  const { getToken } = useAuth();

  // Convert the API response to the expected format
  useEffect(() => {
    if (!website) return;
    
    const formattedWebsites = website.map(site => {
      // Get the most recent tick to determine status
      const latestTick = site.websiteTick?.[0];
      // const isUp = latestTick?.status?.toLowerCase() === 'good';
      const lastChecked = latestTick?.createdAt 
        ? new Date(latestTick.createdAt).toLocaleTimeString() 
        : 'Never';
      
      // Calculate uptime percentage
      const totalTicks = site.websiteTick?.length || 1;
      const upTicks = site.websiteTick?.filter(t => t.status?.toLowerCase() === 'good').length || 0;
      const uptimePercentage = Math.round((upTicks / totalTicks) * 100);
      
      // Generate uptime data for the last 30 minutes
      const now = new Date();
      
      const uptimeData = Array.from({ length: 30 }, (_, i) => {
        const timestamp = new Date(now.getTime() - (29 - i) * 60000);
        // Check if we have a tick for this minute
        const tickForMinute = site.websiteTick?.find(tick => {
          const tickTime = new Date(tick.createdAt);
          return tickTime >= new Date(timestamp.getTime() - 30000) && 
                 tickTime <= new Date(timestamp.getTime() + 30000);
        });
        
        return {
          timestamp: timestamp.toISOString(),
          status: tickForMinute ? (tickForMinute.status?.toLowerCase() === 'good' ? 'up' as const : 'down' as const) : 'down' as const
        };
      });
      
      // Determine status based on uptime percentage
      let status: 'up' | 'down' | 'warning';
      if (uptimePercentage > 80) {
        status = 'up';
      } else if (uptimePercentage > 50) {
        status = 'warning';
      } else {
        status = 'down';
      }
      
      return {
        id: site.id,
        name: site.url.replace(/^https?:\/\//, '').split('/')[0],
        url: site.url,
        status,
        responseTime: latestTick?.latency || 0, // Using latency instead of responseTime
        uptime: uptimePercentage,
        lastChecked,
        uptimeData
      } as const;
    });
    
    setWebsites(formattedWebsites);
  }, [website]); // Only re-run when website data changes

  const toggleExpanded = (websiteId: string) => {
    setExpandedWebsite(expandedWebsite === websiteId ? null : websiteId);
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWebsite.name.trim() || !newWebsite.url.trim()) {
      return;
    }

    try {
      const token = await getToken();
      await axios.post(`${API_BACKEND_URL}/api/v1/website`, {
        url: newWebsite.url.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      refreshWebsites();
      setNewWebsite({ name: '', url: '' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding website:', error);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setNewWebsite({ name: '', url: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'bg-green-500';
      case 'down':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="h-5 w-5" />;
      case 'down':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Website Monitoring Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your websites and services in real-time
            </p>
          </div>
          
          {/* Add Website Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Add Website</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {websites.filter(w => w.status === 'up').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Offline</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {websites.filter(w => w.status === 'down').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Warning</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {websites.filter(w => w.status === 'warning').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sites</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {websites.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Website List */}
        <div className="space-y-4">
          {websites.map((website) => (
            <div key={website.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {/* Website Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleExpanded(website.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Status Circle */}
                    <div className={`w-4 h-4 rounded-full ${getStatusBgColor(website.status)}`}></div>
                    
                    {/* Website Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {website.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        {website.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Status */}
                    <div className="text-center">
                      <div className={`flex items-center ${getStatusColor(website.status)}`}>
                        {getStatusIcon(website.status)}
                        <span className="ml-1 font-medium capitalize">{website.status}</span>
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {website.responseTime > 0 ? `${website.responseTime}ms` : 'N/A'}
                      </p>
                    </div>

                    {/* Uptime */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{website.uptime}%</p>
                    </div>

                    {/* Expand Icon */}
                    <div className="text-gray-400">
                      {expandedWebsite === website.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedWebsite === website.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Uptime Chart */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Last 30 Minutes
                      </h4>
                      <div className="flex items-center space-x-1">
                        {website.uptimeData.map((data, index) => (
                          <div
                            key={index}
                            className={`w-4 h-8 rounded-sm ${
                              data.status === 'up' 
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                            }`}
                            title={`${new Date(data.timestamp).toLocaleTimeString()} - ${data.status}`}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span>30 min ago</span>
                        <span>Now</span>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600 dark:text-gray-400">Last checked:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{website.lastChecked}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Monitor className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600 dark:text-gray-400">Check frequency:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">Every 1 minute</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Globe className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600 dark:text-gray-400">Monitoring from:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">Multiple locations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Website Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Website
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddWebsite} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="website-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website Name
                  </label>
                  <input
                    type="text"
                    id="website-name"
                    value={newWebsite.name}
                    onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., My Website"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="website-url"
                    value={newWebsite.url}
                    onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;