import { useSessionStore } from "../session/useSessionStore";
import config from "../utils/config";

export const BASE_URL_API = config.baseURL;

export const APIENDPOINTS = {
  LOGIN: `${BASE_URL_API}/api/auth/login`,
  REGISTER: `${BASE_URL_API}/api/auth/register`,
  PROJECTS: `${BASE_URL_API}/api/projects/`,
  TEAMSETUP: `${BASE_URL_API}/api/teams/`,
  VERIFY_EMAIL: `${BASE_URL_API}/api/auth/verify-email`,
  VERITY_TEAM_MEMBER: `${BASE_URL_API}/api/auth/verify-team-member/`,
  INVITE_MEMBERS: `${BASE_URL_API}/api/invite-members`,
  REGISTER_INVITED_MEMBER: `${BASE_URL_API}/api/auth/register-invited-member`,
};

export const getAPIAUTHHEADERS = () => {
  const token = useSessionStore.getState().token; // Get fresh token each time
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
  
