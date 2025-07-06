// src/pages/Login.tsx
import React from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { useLoginUser } from './useLoginActions';
import { toast } from 'sonner';
import ButtonLoadingSpinner from '../../components/elements/ButtonLoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { mutate, isPending } = useLoginUser();
  const navigate = useNavigate();

  const onHandleLogin = () => {
    const payload = { email, password };
    mutate(payload, {
      onSuccess: () => toast.success("Login successful"),
      onError: () => toast.error("Login failed")
    });
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center bg-stone-100">
      <div className="flex w-full max-w-4xl h-[80%] shadow-2xl rounded overflow-hidden">
        {/* Left welcome */}
        <div className="hidden md:flex md:w-[45%] bg-red-900 flex-col justify-center items-center p-8 text-white relative">
          <div className="w-full max-w-md space-y-6">
            <h1 className="text-4xl font-extrabold text-amber-200 text-center drop-shadow-sm">
              Welcome To PLANORA
            </h1>
            <p className="text-sm opacity-80 text-center">Don't have an account?</p>
            <Button
              variant="outline"
              className="border border-white text-white hover:bg-white/10 w-full"
              onClick={() => navigate('/signup')}
            >
              Register
            </Button>
          </div>
          <p className="absolute bottom-6 text-xs text-stone-200 italic">
            Plan wisely. Execute flawlessly.
          </p>
        </div>

        {/* Right login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white">
          <Card className="w-full max-w-md bg-transparent border-none shadow-none">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-red-900 mb-6 text-center">Login</h2>

              <div className="space-y-4">
                {/* Email */}
                <div className="relative">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="pl-10 pr-4 py-6 bg-stone-200 border-none rounded-md text-red-900"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-red-900 w-5 h-5" />
                </div>

                {/* Password */}
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 py-6 bg-stone-200 border-none rounded-md text-red-900"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-red-900 w-5 h-5" />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-red-900"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>

                <div className="flex justify-end">
                  <p className="text-xs cursor-pointer text-gray-500 hover:underline">Forgot Password?</p>
                </div>

                {/* Submit */}
                <Button
                  onClick={onHandleLogin}
                  disabled={isPending}
                  className="w-full py-6 bg-red-900 text-white font-semibold"
                >
                  {isPending ? <ButtonLoadingSpinner /> : "Login"}
                </Button>

                {/* Mobile Register Redirect */}
                <div className="md:hidden text-center">
                  <p className="text-sm text-stone-500">
                    Don't have an account?
                    <span
                      onClick={() => navigate('/signup')}
                      className="text-red-900 font-semibold cursor-pointer hover:underline ml-1"
                    >
                      Register
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

export default Login;
