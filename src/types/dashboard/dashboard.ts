export interface DashboardSummary {
  totalProjects: number;
  totalTasks: number;
  tasksByStatus: {
    backlog: number;
    inProgress: number;
    review: number;
    done: number;
    deployed: number;
  };
  completedTasks: number;
  inProgressTasks: number;
  upcomingDeadlines: {
    _id: string;
    title: string;
    deadline?: string;
    status: string;
  }[];
  teamMembersCount: number;
  recentActivity: {
    _id: string;
    title: string;
    status: string;
    updatedAt: string;
  }[];
}
