import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { useLoginUser } from "./useLoginActions";
import ButtonLoadingSpinner from "../../components/elements/ButtonLoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/elements/formFields/FormFields";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { mutate, isPending } = useLoginUser();
  const navigate = useNavigate();

  const methods = useForm<LoginFormInputs>();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onHandleLogin = (data: LoginFormInputs) => {
    mutate(data)
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center bg-stone-100">
      <div className="flex w-full max-w-4xl h-[80%] rounded-md overflow-hidden">
        {/* Left side */}
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
              Dont have an account ?
            </p>
            <Button
              variant="outline"
              className="border border-white text-white hover:bg-white/10 w-full"
              onClick={() => navigate('/signup')}
            >
              Register
            </Button>
          </div>
          <p className="absolute bottom-6 text-xs text-stone-200 italic z-10">
            Plan wisely. Execute flawlessly.
          </p>
        </div>

        {/* Right login form - REMOVED Card components */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white rounded-r-md">
          <div className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-red-900 mb-6 text-center">Login</h2>

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onHandleLogin)} className="space-y-4">
                
                    <Input
                      name="email"
                      label="Email"
                      type="email"
                      rules={{ required: "Email is required" }}
                      error={errors.email?.message}
                      placeholder="Email"
                    />
              

        
                    <Input
                      name="password"
                      label="Password"
                      type="password"
                      rules={{ required: "Password is required" }}
                      error={errors.password?.message}
                      placeholder="Password"
                    />
                  

                  <div className="flex justify-end">
                    <p className="text-xs cursor-pointer text-gray-500 hover:underline">Forgot Password?</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-red-900 text-white font-semibold"
                  >
                    {isSubmitting || isPending? <ButtonLoadingSpinner/> : "Login"}
                  </Button>
                </form>
              </FormProvider>

              {/* Mobile Register Redirect */}
              <div className="md:hidden text-center mt-4">
                <p className="text-sm text-stone-500">
                  Don't have an account?
                  <span
                    onClick={() => navigate("/signup")}
                    className="text-red-900 font-semibold cursor-pointer hover:underline ml-1"
                  >
                    Register
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;