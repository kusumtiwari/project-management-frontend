import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ChevronDown, ChevronUp, Users, CheckCircle, Clock, TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import { useDashboardActions } from './useDashboardActions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import getStatusBadge from '@/utils/getStatusBadge';

dayjs.extend(relativeTime);

const tasksOverTime = [
  { name: 'Jan', tasks: 40, completed: 35, inProgress: 5 },
  { name: 'Feb', tasks: 30, completed: 28, inProgress: 2 },
  { name: 'Mar', tasks: 20, completed: 15, inProgress: 5 },
  { name: 'Apr', tasks: 27, completed: 20, inProgress: 7 },
  { name: 'May', tasks: 18, completed: 16, inProgress: 2 },
  { name: 'Jun', tasks: 23, completed: 18, inProgress: 5 },
];

const projectData = [
  { name: 'Website Redesign', progress: 85, tasks: 24, completed: 20, team: 5, priority: 'high' },
  { name: 'Mobile App', progress: 62, tasks: 18, completed: 11, team: 4, priority: 'medium' },
  { name: 'API Integration', progress: 90, tasks: 12, completed: 11, team: 3, priority: 'high' },
  { name: 'Marketing Campaign', progress: 45, tasks: 15, completed: 7, team: 6, priority: 'low' },
];

const taskDistribution = [
  { name: 'Completed', value: 156, color: '#10b981' },
  { name: 'In Progress', value: 28, color: '#f59e0b' },
  { name: 'Pending', value: 12, color: '#ef4444' },
  { name: 'Review', value: 8, color: '#8b5cf6' },
];

const teamPerformance = [
  { name: 'Design', efficiency: 92, tasks: 45 },
  { name: 'Development', efficiency: 88, tasks: 67 },
  { name: 'QA', efficiency: 95, tasks: 23 },
  { name: 'Marketing', efficiency: 78, tasks: 34 },
];

const recentActivity = [
  { user: 'Sarah Chen', action: 'completed task', item: 'UI Design Review', time: '2 min ago', avatar: '👩‍💻' },
  { user: 'Mike Johnson', action: 'created project', item: 'E-commerce Platform', time: '15 min ago', avatar: '👨‍💼' },
  { user: 'Emma Davis', action: 'updated milestone', item: 'Beta Release', time: '1 hour ago', avatar: '👩‍🎨' },
  { user: 'Alex Kumar', action: 'resolved bug', item: 'Login Authentication', time: '2 hours ago', avatar: '👨‍💻' },
];

const Dashboard: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    projects: true,
    activity: true,
    performance: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const { data, isLoading } = useDashboardActions();

  const dashboard = data?.data?.data; // ✅ single source of truth

if (isLoading) {
  return <div>Loading dashboard...</div>;
}

if (!dashboard) {
  return <div>No dashboard data</div>;
}

  console.log(data?.data?.data,'data here')
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                    <p className="text-3xl font-bold">{dashboard?.totalProjects}</p>
                    <p className="text-blue-100 text-sm flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12% this month
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Target className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Completed Tasks</p>
                    <p className="text-3xl font-bold">156</p>
                    <p className="text-green-100 text-sm flex items-center mt-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                     {dashboard?.completedTasks}
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">In Progress</p>
                    <p className="text-3xl font-bold">{dashboard?.inProgressTasks}</p>
                    <p className="text-yellow-100 text-sm flex items-center mt-2">
                      <Clock className="w-4 h-4 mr-1" />
                      Avg 3.2 days
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Clock className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Team Members</p>
                    <p className="text-3xl font-bold">{dashboard?.teamMembersCount}</p>
                    <p className="text-purple-100 text-sm flex items-center mt-2">
                      <Users className="w-4 h-4 mr-1" />
                      4 teams active
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Users className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Recent Activity
                </h2>

                <button
                  onClick={() => toggleSection('activity')}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {expandedSections.activity ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {expandedSections.activity && (
                <div className="flex flex-wrap gap-4">
                  {dashboard.recentActivity.length === 0 && (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}

                  {dashboard.recentActivity.map((activity) => (
                    <div
                      key={activity._id}
                      className="flex flex-col justify-between w-[280px] h-[120px] bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                    >
                      {/* Top row: title + status */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-800 truncate">{activity.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(activity.status)}`}
                        >
                          {activity.status.replace('-', ' ')}
                        </span>
                      </div>

                      {/* Bottom row: time + icon */}
                      <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                        <span>{dayjs(activity.updatedAt).fromNow()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
       

       </div>
      </div>
    )
}
export default Dashboard;