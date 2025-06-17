import React from 'react';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { useLoginUser, useRegisterUser } from './useLoginActions';
import { toast } from 'sonner';

import ButtonLoadingSpinner from '../../components/elements/ButtonLoadingSpinner';

type Props = {
  // Define your props here
}

const Login: React.FC<Props> = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isRegisterMode, setIsRegisterMode] = React.useState(false);
  const { mutate, isPending } = useLoginUser();
  const {mutate:register, isPending:registerLoading} = useRegisterUser();

  const onHandleLogin = () => {
    const payload = {
      email: email,
      password: password
    }
    mutate(payload)
  }

  const onHandleRegister = () => {
    // Add your registration logic here
    const payload = {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    }

    console.log('Register payload:', payload);
    register(payload,{
      onSuccess: (response: any) => {
        if (response?.success) {
          toast.success("Registration successful");
          setIsRegisterMode(false)
        } else {
          console.log("register failed:", response);
        }
      },
      onError: (error: unknown) => {
        console.error("register failed:", error);
        // Example: show error toast
        toast.error("Registration failed. Please check your credentials.");
      },
    })
    // You can add your register mutation here similar to login
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    // Clear form fields when switching modes
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center bg-stone-100">
      {/* Main centered container */}
      <div className="flex w-full max-w-4xl h-[80%] shadow-2xl rounded overflow-hidden">

        {/* Left section - maroon welcome area with curved right edge */}
        <div className="hidden md:flex md:w-[45%] bg-red-900 flex-col justify-center items-center p-8 text-white overflow-hidden relative">
          <div className="w-full max-w-md space-y-6">
            <h1 className="text-3xl md:text-4xl font-semibold leading-snug tracking-tight z-10 text-center">
              <span className="block text-white/90 text-lg md:text-xl">
                {isRegisterMode ? 'Welcome back to' : 'Hello, Welcome To'}
              </span>
              <span className="block text-4xl md:text-5xl font-extrabold text-amber-200 mt-2 drop-shadow-sm">
                PLANORA
              </span>
            </h1>

            <p className="text-sm opacity-80 text-center">
              {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <Button
              variant="outline"
              className="border border-white text-white hover:bg-white/10 w-full"
              onClick={toggleMode}
            >
              {isRegisterMode ? 'Login' : 'Register'}
            </Button>
          </div>
          <p className="absolute bottom-6 text-xs text-stone-200 italic z-10">
            Plan wisely. Execute flawlessly.
          </p>
        </div>

        {/* Right section - login/register form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white">
          <Card className="w-full max-w-md bg-transparent border-none shadow-none">
            <CardContent className="p-2 md:p-6">
              <h2 className="text-2xl font-bold text-red-900 mb-6 text-center">
                {isRegisterMode ? 'Register' : 'Login'}
              </h2>

              <div className="space-y-4">
                {/* Username field */}
              
                <div className="relative">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="pl-10 pr-4 py-6 bg-stone-200 border-none rounded-md text-red-900"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5"
                  />
                </div>

                {/* Email field - only show in register mode */}
                {isRegisterMode && (
                  <div className="relative">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      placeholder="Username"
                      className="pl-10 pr-4 py-6 bg-stone-200 border-none rounded-md text-red-900"
                    />
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5"
                    />
                  </div>
                )}

                {/* Password field */}
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 py-6 bg-stone-200 border-none rounded-md text-red-900"
                  />
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5"
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute bg-transparent right-3 top-1/2 transform -translate-y-1/2 text-red-900 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>

                {/* Confirm Password field - only show in register mode */}
                {isRegisterMode && (
                  <div className="relative">
                    <Input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="pl-10 pr-10 py-6 bg-stone-200 border-none rounded-md text-red-900"
                    />
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-900 w-5 h-5"
                    />
                    <div
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute bg-transparent right-3 top-1/2 transform -translate-y-1/2 text-red-900 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
                )}

                {/* Forgot password link - only show in login mode */}
                {!isRegisterMode && (
                  <div className="flex justify-end">
                    <p className="text-xs cursor-pointer underline text-gray-500 font-medium hover:underline">
                      Forgot Password?
                    </p>
                  </div>
                )}

                {/* Login/Register button */}
                <Button
                  onClick={isRegisterMode ? onHandleRegister : onHandleLogin}
                  disabled={isPending}
                  className="w-full py-6 bg-red-900 text-white font-semibold border-2 border-red-900 rounded-md"
                >
                  {isPending ? <ButtonLoadingSpinner /> : (isRegisterMode ? "Register" : "Login")}
                </Button>

                {/* Mobile toggle for register/login */}
                <div className="md:hidden text-center">
                  <p className="text-sm text-stone-500">
                    {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
                    <span
                      onClick={toggleMode}
                      className="text-red-900 font-semibold cursor-pointer hover:underline ml-1"
                    >
                      {isRegisterMode ? 'Login' : 'Register'}
                    </span>
                  </p>
                </div>

                {/* Social login section - only show in login mode */}
                {!isRegisterMode && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-stone-500 mb-4">Or login with social platforms</p>
                    <div className="flex justify-center space-x-3">
                      {/* Google */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="border border-stone-300 rounded-md h-10 w-10 p-2"
                      >
                        <svg viewBox="0 0 24 24" className="w-full h-full text-red-900">
                          <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                      </Button>

                      {/* Facebook */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="border border-stone-300 rounded-md h-10 w-10 p-2"
                      >
                        <svg viewBox="0 0 24 24" className="w-full h-full text-red-900">
                          <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                        </svg>
                      </Button>

                      {/* GitHub */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="border border-stone-300 rounded-md h-10 w-10 p-2"
                      >
                        <svg viewBox="0 0 24 24" className="w-full h-full text-red-900">
                          <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                        </svg>
                      </Button>

                      {/* LinkedIn */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="border border-stone-300 rounded-md h-10 w-10 p-2"
                      >
                        <svg viewBox="0 0 24 24" className="w-full h-full text-red-900">
                          <path fill="currentColor" d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;