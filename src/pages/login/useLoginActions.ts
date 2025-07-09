import { useMutation } from "@tanstack/react-query";
import { useSessionStore } from "../../session/useSessionStore";
import { request } from "../../utils/request";
import { APIENDPOINTS, getAPIAUTHHEADERS } from "../../constants/APIEndpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


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
  const { setToken , setProfile} = useSessionStore();

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
        setProfile(response?.profile);
        setToken(response?.token);
        toast.success("Login successful")
        navigate("/");
      }
     else{
        console.log("Login failed:", response);
     }
    },
    onError: (error: unknown) => {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    },
  });
};

export const useRegisterUser = () => {
  const { setToken, setProfile } = useSessionStore();
  return useMutation({
    mutationFn: (data:any) => {
      return request(APIENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (response:any) => {
      if (response?.success) {
        console.log("Registration successful:", response);
        setProfile(response?.profile);
        setToken(response?.token);
        toast.success("Registration successful");
      } else {
        console.log("Registration failed:", response);
        toast.error("Registration failed. Please check your information.");
      }
    }
  });
};

export const useTeamSetup = () => {
  const token = useSessionStore((state) => state?.token);
console.log(token,'token')
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return request(APIENDPOINTS.TEAMSETUP, {
        method: "POST",
        headers: getAPIAUTHHEADERS(),
        body: JSON.stringify(data),
      });
    },

  });

  console.log("useTeamSetup hook initialized"); // Less confusing log

  return mutation;
};

export const useVerifyEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (token: string) => {
      // Call backend verify endpoint with token as query param
      return request(`${APIENDPOINTS.VERIFY_EMAIL}?token=${token}`, {
        method: "GET",
      });
    },
    onSuccess: (response: any) => {
      if (response?.success) {
        toast.success("Email verified successfully!");
        // Redirect to login or homepage after verification
        navigate("/login");
      } else {
        toast.error(response?.message || "Verification failed");
      }
    },
    onError: (error: any) => {
      toast.error("Verification failed. Please try again.");
      console.error("Verify email error:", error);
    },
  });
};