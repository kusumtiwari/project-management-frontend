import {
  Home,
  ClipboardList,
  Users,
  CheckSquare,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  route: string;
  icon:any;
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
  },
  {
    title: "Roles",
    route: "/roles",
    icon: CheckSquare,
  },
];

export default navigationItems;
