import { useMutation } from "@tanstack/react-query";
import { useSessionStore } from "../../session/useSessionStore";
import { request } from "../../utils/request";
import { APIENDPOINTS, getAPIAUTHHEADERS } from "../../constants/APIEndpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useVerifyTeamMember = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (token: string) => {
            // Call backend verify endpoint with token as query param
            return request(`${APIENDPOINTS.VERITY_TEAM_MEMBER}?token=${token}`, {
                method: "GET",
            });
        },
        onSuccess: (response: any) => {
            if (response?.success) {
                toast.success("Email verified successfully");
                // setToken(response?.token);
                // Redirect to login or homepage after verification
                // navigate("/team-setup");
            }
        },
        onError: (error: any) => {
            toast.error("Verification failed. Please try again");
            console.error("Verify email error:", error);
        },
    });
};

export const useRegisterInvitedMember = () => {
    const { setToken, setProfile } = useSessionStore();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data: any) => {
            return request(APIENDPOINTS.REGISTER_INVITED_MEMBER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        },
        onSuccess: (response: any) => {
            if (response?.success) {
                console.log("Registration successful:", response);
                setProfile(response?.profile);
                setToken(response?.token);
                toast.success(response?.message);
                navigate("/");
            } else {
                console.log("Registration failed:", response);
                toast.error(response?.message);
            }
        },
        onError: (response: any) => {
            console.error("Registration failed:", response);
            toast.error(response?.message);
        },
    });
}