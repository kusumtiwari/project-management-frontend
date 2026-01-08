import { useSessionStore } from "../session/useSessionStore";
import config from "../utils/config";

export const BASE_URL_API = config.baseURL;

export const APIENDPOINTS = {
  LOGIN: `${BASE_URL_API}/api/auth/login`,
  REGISTER: `${BASE_URL_API}/api/auth/register`,
  PROJECTS: `${BASE_URL_API}/api/projects/`,
  TASK: `${BASE_URL_API}/api/tasks/`,
  TEAMSETUP: `${BASE_URL_API}/api/teams/`,
  VERIFY_EMAIL: `${BASE_URL_API}/api/auth/verify-email`,
  LOGOUT: `${BASE_URL_API}/api/auth/logout`,
  PERMISSION_LIST: `${BASE_URL_API}/api/roles/permissions/`,
  ROLE: `${BASE_URL_API}/api/roles/`,
  CREATE_TEAM_MEMBER: `${BASE_URL_API}/api/auth/create-team-member`,
  UPDATE_TEAM_MEMBER: `${BASE_URL_API}/api/teams/`, // + :teamId/members/:memberId
  DELETE_TEAM_MEMBER: `${BASE_URL_API}/api/teams/`,
  DASHBOARD_SUMMARY: `${BASE_URL_API}/api/dashboard/summary`,
};

export const getAPIAUTHHEADERS = () => {
  const token = useSessionStore.getState().token; // Get fresh token each time
  const base: any = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) base.Authorization = `Bearer ${token}`;
  return base;
};
  
