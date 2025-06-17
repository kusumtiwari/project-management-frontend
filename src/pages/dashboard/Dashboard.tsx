import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ChevronDown, ChevronUp, Users, CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar, Target, Zap } from 'lucide-react';

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
                    <p className="text-3xl font-bold">24</p>
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
                      85% completion rate
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
                    <p className="text-3xl font-bold">28</p>
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
                    <p className="text-3xl font-bold">18</p>
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

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Tasks Over Time
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={tasksOverTime}>
                    <defs>
                      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="tasks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTasks)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Task Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 mt-4">
                  {taskDistribution.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects and Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-xl text-gray-800 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Active Projects
                  </h2>
                  <button
                    onClick={() => toggleSection('projects')}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {expandedSections.projects ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                {expandedSections.projects && (
                  <div className="space-y-4">
                    {projectData.map((project, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-800">{project.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                            {project.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                              {project.completed}/{project.tasks} tasks
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1 text-blue-500" />
                              {project.team} members
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-xl text-gray-800 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                    Recent Activity
                  </h2>
                  <button
                    onClick={() => toggleSection('activity')}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {expandedSections.activity ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                {expandedSections.activity && (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl">{activity.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">
                            <span className="font-medium">{activity.user}</span>
                            <span className="text-gray-600"> {activity.action} </span>
                            <span className="font-medium text-blue-600">{activity.item}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Team Performance */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-gray-800 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-indigo-600" />
                  Team Performance
                </h2>
                <button
                  onClick={() => toggleSection('performance')}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {expandedSections.performance ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              {expandedSections.performance && (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={teamPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="efficiency" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              </CardContent>
          </Card>
       </div>
      </div>
    )
}
export default Dashboard;