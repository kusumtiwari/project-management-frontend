import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { NoData } from "@/assets";
import {
  ChevronDown,
  ChevronUp,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Target,
  Zap,
} from "lucide-react";
import { useDashboardActions } from "./useDashboardActions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import getStatusBadge from "@/utils/getStatusBadge";
import NoDataFound from "@/components/elements/no-data/NoData";
import { useSessionStore } from "@/session/useSessionStore";

dayjs.extend(relativeTime);

const Dashboard: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    projects: true,
    activity: true,
    performance: true,
  });
    const profile = useSessionStore((state: any) => state.profile);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const { data, isLoading } = useDashboardActions();

  const dashboard = data?.data?.data; // ✅ single source of truth

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div>No dashboard data</div>;
  }

  console.log(data?.data?.data, "data here");
  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-600 mt-2 mb-8">Welcome, {profile?.username ?? "User"}</h1>
      <div className="max-w-7xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Projects
                  </p>
                  <p className="text-3xl font-bold">
                    {dashboard?.totalProjects}
                  </p>
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
                  <p className="text-green-100 text-sm font-medium">
                    Completed Tasks
                  </p>
                  <p className="text-3xl font-bold">
                    {" "}
                    {dashboard?.completedTasks ?? 0}
                  </p>
                  <p className="text-green-100 text-sm flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 mr-1" />
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
                  <p className="text-yellow-100 text-sm font-medium">
                    In Progress
                  </p>
                  <p className="text-3xl font-bold">
                    {dashboard?.inProgressTasks}
                  </p>
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
                  <p className="text-purple-100 text-sm font-medium">
                    Team Members
                  </p>
                  <p className="text-3xl font-bold">
                    {dashboard?.teamMembersCount}
                  </p>
                  <p className="text-purple-100 text-sm flex items-center mt-2">
                    <Users className="w-4 h-4 mr-1" />4 teams active
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
          <h2 className="font-bold text-xl flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-600" />
            Recent Activity
          </h2>

          <button
            onClick={() => toggleSection("activity")}
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
              <NoDataFound desc="No recent Activity!" />
            )}

            {dashboard.recentActivity.map((activity) => (
              <div
                key={activity._id}
                className="flex flex-col justify-between w-[280px] h-[120px] bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                {/* Top row: title + status */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-800 truncate">
                    {activity.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(activity.status)}`}
                  >
                    {activity.status.replace("-", " ")}
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
  );
};
export default Dashboard;
