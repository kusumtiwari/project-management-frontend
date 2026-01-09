import {
  Home,
  ClipboardList,
  Users,
  CheckSquare,
  Shield,
  BarChart3,
  UserCheck,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  route: string;
  icon: any;
  requiresSuperAdmin?: boolean;
  requiresAdmin?: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    route: "/",
    icon: Home,
  },
  {
    title: "Projects",
    route: "/projects",
    icon: ClipboardList,
  },
  {
    title: "Team Members",
    route: "/team-members",
    icon: Users,
    requiresAdmin: true,
  },
  {
    title: "Roles",
    route: "/roles",
    icon: CheckSquare,
    requiresAdmin: true,
  },
];

// SuperAdmin specific navigation items
const superAdminNavigationItems: NavigationItem[] = [
  {
    title: "System Overview",
    route: "/superadmin/overview",
    icon: BarChart3,
    requiresSuperAdmin: true,
  },
  {
    title: "Manage Admins",
    route: "/superadmin/admins",
    icon: Shield,
    requiresSuperAdmin: true,
  },
  {
    title: "All Users",
    route: "/superadmin/users",
    icon: UserCheck,
    requiresSuperAdmin: true,
  },
];

export default navigationItems;
export { superAdminNavigationItems };
