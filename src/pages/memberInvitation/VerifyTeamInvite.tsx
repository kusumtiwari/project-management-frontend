import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/elements/formFields/FormFields";
import { Button } from "@/components/ui/button";
import ButtonLoadingSpinner from "@/components/elements/ButtonLoadingSpinner";
import { useVerifyTeamMember } from "./useVerifyTeamMember";
import { useRegisterInvitedMember } from "./useVerifyTeamMember";

const VerifyTeamInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");

  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const methods = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    getValues,
  } = methods;

  const { mutate: verify, isPending: verifying } = useVerifyTeamMember({
    onSuccess: (data: any) => {
      setEmail(data?.email);
      methods.setValue("email", data?.email);
      setVerificationSuccess(true);
    },
    onError: () => {
      toast.error("Invalid or expired invite.");
      setVerificationSuccess(false);
    },
  });

  const { mutate: register, isPending: registering } = useRegisterInvitedMember();

  useEffect(() => {
    if (token) {
      verify(token);
    }
  }, [token]);

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    register(
      { ...data, token },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Account created successfully!");
          navigate("/login");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Registration failed");
        },
      }
    );
  };

  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-semibold">Verifying invite...</span>
      </div>
    );
  }

  if (!verificationSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Invalid or expired invite.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-stone-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-red-900 mb-4">Complete Your Registration</h2>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              name="email"
              label="Email"
              type="email"
              disabled
              leftIcon={<Mail size={18} />}
              rules={{ required: "Email is required" }}
              error={errors.email?.message}
            />

            <Input
              name="name"
              label="Name"
              placeholder="Your full name"
              leftIcon={<User size={18} />}
              rules={{ required: "Name is required" }}
              error={errors.name?.message}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Password"
              leftIcon={<Lock size={18} />}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "At least 8 characters required",
                },
                pattern: {
                  value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                  message: "Include at least one number and special character",
                },
              }}
              error={errors.password?.message}
            />

            <Input
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              leftIcon={<Lock size={18} />}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              }}
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              disabled={registering}
              className="w-full bg-red-900 text-white py-6 font-semibold hover:bg-red-800"
            >
              {registering ? <ButtonLoadingSpinner /> : "Create Account"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default VerifyTeamInvite;
