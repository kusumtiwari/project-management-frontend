import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "../login/useLoginActions";

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

    if (verifyEmailMutation.isPending) return <p>Verifying...</p>;
    if (verifyEmailMutation.isError) return <p>Verification failed.</p>;
    if (verifyEmailMutation.isSuccess) return <p>Email verified! Redirecting...</p>;

    return (
        <div>
            <h1>Email Verification</h1>
            <p>{message}</p>
        </div>
    );
}

export default VerifyEmail;
