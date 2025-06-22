"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Monitor, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  TrendingUp,
  ArrowRight,
  Play
} from 'lucide-react';

function App() {
  const router = useRouter();
  
  // Set dark mode based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const features = [
    {
      icon: Monitor,
      title: "Real-time Monitoring",
      description: "Monitor your websites, APIs, and services 24/7 with sub-second precision from multiple global locations."
    },
    {
      icon: Shield,
      title: "99.9% Uptime SLA",
      description: "Enterprise-grade reliability with guaranteed uptime and instant alerts when issues are detected."
    },
    {
      icon: Zap,
      title: "Lightning Fast Alerts",
      description: "Get notified instantly via SMS, email, Slack, or webhook when your services go down."
    },
    {
      icon: Globe,
      title: "Global Monitoring",
      description: "Monitor from 50+ locations worldwide to ensure your users have the best experience everywhere."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Collaborate with your team, assign incidents, and track resolution progress in real-time."
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Deep insights into performance trends, response times, and availability metrics."
    }
  ];

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300`}>
      {/* Navigation is now handled by the Appbar component */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Monitor Your Website
              <span className="block text-blue-600 dark:text-blue-400">Like a Pro</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant alerts when your website goes down. Monitor uptime, performance, and user experience 
              from 50+ global locations with enterprise-grade reliability.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2 hover:scale-105">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Professional monitoring • 99.9% uptime guarantee • Global coverage
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Monitoring
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive monitoring tools designed to keep your business running smoothly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-800 dark:to-green-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Monitoring?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies that trust BetterUptime to keep their services running smoothly.
          </p>
          <button onClick={() => router.push('/dashboard')} className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105">
            Start Monitoring Today
          </button>
          <p className="text-blue-100 text-sm mt-4">Professional monitoring • No setup fees • Global coverage</p>
        </div>
      </section>
    </div>
  );
}

export default App;