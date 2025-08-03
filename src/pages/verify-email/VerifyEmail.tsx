import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "../login/useLoginActions";
import { Loader2 } from "lucide-react"; // spinner icon from shadcn

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Verifying...");
    const token = searchParams.get("token");
    const verifyEmailMutation = useVerifyEmail();

    useEffect(() => {
        if (token) {
            verifyEmailMutation.mutate(token);
        }
    }, [token]);

    if (verifyEmailMutation.isPending) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Verifying...</p>
            </div>
        );
    }

    if (verifyEmailMutation.isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-destructive">Verification failed.</p>
            </div>
        );
    }

    if (verifyEmailMutation.isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-green-600">Email verified! Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-semibold">Email Verification</h1>
            <p className="text-muted-foreground">{message}</p>
        </div>
    );
}

export default VerifyEmail;
