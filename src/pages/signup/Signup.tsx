import React from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/elements/formFields/FormFields';
import { useRegisterUser } from '../login/useLoginActions';
import ButtonLoadingSpinner from '@/components/elements/ButtonLoadingSpinner';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const methods = useForm({
        defaultValues: {
            email: "",
            username: "",
            phone_num: "",
            password: "",
            confirmPassword: "",

        },
    });
    const { mutate: register, isPending: registerLoading } = useRegisterUser();
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;
    const onHandleRegister = (data:any) => {
        console.log(data,'data of register')
        if (data?.password !== data?.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!data?.username || !data?.email || !data?.password) {
            toast.error("Please fill in all fields");
            return;
        }

        register(data, {
            onSuccess: (response: any) => {
           
                    toast.success(response?.message);
                    navigate('/verify-info')
              
            },
            onError: (error: any) => {
                console.error("register failed:", error);
                toast.error(error?.message);
            },
        });
    };

    return (
        <div className="flex h-screen w-screen justify-center items-center bg-stone-100">
            <div className="flex w-full max-w-4xl h-[80%] rounded-md overflow-hidden">
                {/* Left section */}
                <div className="hidden md:flex md:w-[50%] bg-red-900 flex-col justify-center items-center p-8 text-white overflow-hidden relative">
                    <div className="w-full max-w-md space-y-6">
                        <h1 className="text-3xl md:text-4xl font-semibold leading-snug tracking-tight z-10 text-center">
                            <span className="block text-white/90 text-lg md:text-xl">
                                Join Us Today
                            </span>
                            <span className="block text-4xl md:text-5xl font-extrabold text-amber-200 mt-2 drop-shadow-sm">
                                PLANORA
                            </span>
                        </h1>

                        <p className="text-sm opacity-80 text-center">
                            Already have an account?
                        </p>
                        <Button
                            variant="outline"
                            className="border border-white text-white hover:bg-white/10 w-full"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                    </div>
                    <p className="absolute bottom-6 text-xs text-stone-200 italic z-10">
                        Plan wisely. Execute flawlessly.
                    </p>
                </div>

                {/* Right section */}
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onHandleRegister)}
                        className="w-full max-w-md mx-auto bg-white px-6 py-8 rounded-r-md shadow-md relative"
                    >
                        <h2 className="text-2xl font-bold text-red-900 mb-6 text-center">
                            Create Account
                        </h2>

                        <div className="space-y-5">
                            <Input
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="Email"
                                rules={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email format",
                                    },
                                }}
                                error={errors.email?.message}
                                leftIcon={<Mail size={18} />}
                            />

                            <Input
                                name="username"
                                label="Username"
                                type="text"
                                placeholder="Username"
                                rules={{ required: "Username is required" }}
                                error={errors.username?.message}
                                leftIcon={<User size={18} />}
                            />

                            <Input
                                name="password"
                                label="Password"
                                type="password"
                                placeholder="Password"
                                rules={{
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                    pattern: {
                                        value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                                        message: "Password must include at least one number and one special character",
                                    },
                                }}
                                error={errors.password?.message}
                                leftIcon={<Lock size={18} />}
                            />


                            <Input
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm Password"
                                rules={{
                                    required: "Please confirm your password",
                                    validate: (value:any) =>
                                        value === methods.getValues("password") ||
                                        "Passwords do not match",
                                }}
                                error={errors.confirmPassword?.message}
                                leftIcon={<Lock size={18} />}
                            />

                            <Button
                                type="submit"
                                disabled={registerLoading}
                                className="w-[90%] cursor-pointer py-6 bg-red-900 text-white font-semibold border-2 border-red-900 rounded-md hover:bg-red-800 absolute bottom-2"
                            >
                                {registerLoading ? <ButtonLoadingSpinner /> : "Create Account"}
                            </Button>

                            <p className="text-sm text-center text-stone-500 md:hidden">
                                Already have an account?
                                <span className="text-red-900 font-semibold cursor-pointer hover:underline ml-1">
                                    Login
                                </span>
                            </p>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default Signup;
