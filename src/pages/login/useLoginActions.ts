import { useMutation } from "@tanstack/react-query";
import { useSessionStore } from "../../session/useSessionStore";
import { request } from "../../utils/request";
import { APIENDPOINTS } from "../../constants/APIEndpoints";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // add more fields if needed
}


export const useLoginUser = () => {
  const navigate = useNavigate()
  const { setToken } = useSessionStore();

  return useMutation({
    mutationFn: (data: LoginData) => {
      return request<LoginResponse>(APIENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (response:any) => {
      if(
        response?.success ){
        console.log("Login successful:", response);
        setToken(response.data.access);
        navigate("/")
      }
     else{
        console.log("Login failed:", response);
     }
    },
    onError: (error: unknown) => {
      console.error("Login failed:", error);
      // Example: show error toast
      // toast.error("Login failed. Please check your credentials.");
    },
  });
};
