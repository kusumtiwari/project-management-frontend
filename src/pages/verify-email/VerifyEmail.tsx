import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "../login/useLoginActions";
import { Loader2 } from "lucide-react";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const { mutate, isPending, isError, isSuccess } = useVerifyEmail();

    useEffect(() => {
        if (token) mutate(token);
    }, [token]);

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Verifying...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-destructive">Verification failed.</p>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-green-600">Email verified! Redirecting...</p>
            </div>
        );
    }

    return null; // Nothing before mutate runs
}

export default VerifyEmail;
