import config from "../utils/config";

export const BASE_URL_API = config.baseURL;

export const APIENDPOINTS = {
  LOGIN: `${BASE_URL_API}/api/auth/login`,
  REGISTER: `${BASE_URL_API}/api/auth/register`,
};

export const getAPIAUTHHEADERS = () => {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer `,
    };
}
  
