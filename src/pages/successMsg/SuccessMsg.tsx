import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type Props = {};

const SuccessMsg: React.FC<Props> = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-white px-4">
            <Card className="w-full max-w-md shadow-xl rounded-2xl border border-green-200">
                <CardContent className="p-8 flex flex-col items-center text-center">
                    <CheckCircle className="h-14 w-14 text-green-500 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2 text-green-700">Almost There!</h2>
                    <p className="text-gray-600 mb-6">
                        We've sent a verification link to your email. Please check your inbox to complete the sign-up process.
                    </p>
                    <Button onClick={() => navigate("/login")} className="w-full text-white bg-green-600 hover:bg-green-700">
                        Go to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default SuccessMsg;
