import React from 'react';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { useRegisterUser } from '../login/useLoginActions';
import { toast } from 'sonner';
import ButtonLoadingSpinner from '../../components/elements/ButtonLoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const navigate = useNavigate();
    const { mutate: register, isPending: registerLoading } = useRegisterUser();

    const onHandleRegister = () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!username || !email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        const payload = {
            username,
            email,
            password,
            confirmPassword
        };

        register(payload, {
            onSuccess: (response: any) => {
                if (response?.success) {
                    toast.success("Registration successful");
                    navigate('/team-setup');
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                } else {
                    console.log("register failed:", response);
                    toast.error("Registration failed. Please try again.");
                }
            },
            onError: (error: unknown) => {
                console.error("register failed:", error);
                toast.error("Registration failed. Please check your information.");
            },
        });
    };

    return (
        <div className="flex h-screen w-screen justify-center items-center bg-stone-100">
            <div className="flex w-full max-w-4xl h-[80%] shadow-2xl rounded overflow-hidden">
                {/* Left section */}
                <div className="hidden md:flex md:w-[45%] bg-red-900 flex-col justify-center items-center p-8 text-white overflow-hidden relative">
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
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white">
                    <Card className="w-full max-w-md bg-transparent border-none shadow-none">
                        <CardContent className="p-2 md:p-6">
                            <h2 className="text-2xl font-bold text-red-900 mb-6 text-center">
                                Create Account
                            </h2>

                            <div className="space-y-4">
                                {/* Email field */}
                                <div className="relative">
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder="Email"
                                        className="pl-10 pr-4 py-6 bg-stone-200 border-none rounded-md text-red-900"
                                        required
                                    />
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5" />
                                </div>

                                {/* Username field */}
                                <div className="relative">
                                    <Input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        type="text"
                                        placeholder="Username"
                                        className="pl-10 pr-4 py-6 bg-stone-200 border-none rounded-md text-red-900"
                                        required
                                    />
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5" />
                                </div>

                                {/* Password field */}
                                <div className="relative">
                                    <Input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="pl-10 pr-10 py-6 bg-stone-200 border-none rounded-md text-red-900"
                                        required
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5" />
                                    <div
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-900 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </div>
                                </div>

                                {/* Confirm Password field */}
                                <div className="relative">
                                    <Input
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        className="pl-10 pr-10 py-6 bg-stone-200 border-none rounded-md text-red-900"
                                        required
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5" />
                                    <div
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-900 cursor-pointer"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="text-xs text-stone-500 text-center">
                                    By creating an account, you agree to our{' '}
                                    <span className="text-red-900 cursor-pointer hover:underline">Terms of Service</span>{' '}
                                    and{' '}
                                    <span className="text-red-900 cursor-pointer hover:underline">Privacy Policy</span>
                                </div>

                                {/* Register button */}
                                <Button
                                    onClick={onHandleRegister}
                                    disabled={registerLoading}
                                    className="w-full py-6 bg-red-900 text-white font-semibold border-2 border-red-900 rounded-md hover:bg-red-800"
                                >
                                    {registerLoading ? <ButtonLoadingSpinner /> : "Create Account"}
                                </Button>

                                {/* Mobile login link */}
                                <div className="md:hidden text-center">
                                    <p className="text-sm text-stone-500">
                                        Already have an account?
                                        <span
                                            onClick={() => navigate('/login')}
                                            className="text-red-900 font-semibold cursor-pointer hover:underline ml-1"
                                        >
                                            Login
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Signup;
