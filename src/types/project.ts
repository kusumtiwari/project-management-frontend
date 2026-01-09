// Project-related TypeScript interfaces

export interface ProjectMember {
  _id: string;
  username: string;
  email: string;
  role: 'lead' | 'member' | 'viewer';
  assignedAt: string;
  teamId: string;
}

export interface ProjectTeam {
  teamId: string;
  addedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'Not Started' | 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  teams: ProjectTeam[];
  teamMembers: ProjectMember[];
  createdBy: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMembersResponse {
  success: boolean;
  data: {
    projectId: string;
    projectName: string;
    members: ProjectMember[];
    teams: ProjectTeam[];
  };
}

export interface APIResponse<T> {
  status: number;
  data: T;
}

// Task-related interfaces
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done' | 'deployed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    _id: string;
    username: string;
    email: string;
  };
  project: string;
  createdBy: string;
  deadline?: string;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
}