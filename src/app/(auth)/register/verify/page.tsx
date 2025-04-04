"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { verifySignUpThunk } from "@/lib/features/authentication/authThunk";
import {
  clearMessage,
  clearError,
} from "@/lib/features/authentication/authSlice";
import { resentOTP } from "@/services/auth/authApi";
import InputOTPPattern from "@/components/common/input-otp";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyRegister() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signUpState } = useAppSelector((state) => state.auth.signUp);
  const { isLoading, error, verifySignUpState } = useAppSelector(
    (state) => state.auth.verifySignUp
  );
  const { message } = verifySignUpState;

  const [otp, setOtp] = useState<string>("");
  const [counter, setCounter] = useState<number>(60);
  const [resetTrigger, setResetTrigger] = useState<boolean>(false);
  const [isHideCountDown, setIsHideCountDown] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (otp.length === 6) {
      timer = setInterval(() => {
        setCounter((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otp]);

  useEffect(() => {
    if (counter === 0) setIsHideCountDown(true);
    if (counter === 60) setIsHideCountDown(false);
  }, [counter]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: error,
        action: <ToastAction altText="Try again">Try Again!</ToastAction>,
      });
      dispatch(clearError("verifySignUp"));
    }
    if (message) {
      toast({
        className: `
          bg-[#0D99FF] 
          text-white    
          border border-[#0B85DC] 
          rounded-lg 
          shadow-lg 
          p-4 
          flex items-center
          transition-all 
          duration-300 
          ease-in-out
        `,
        description: (
          <span className="flex items-center gap-2">
            <ReloadIcon className="w-4 h-4 text-white" />
            {message}
          </span>
        ),
      });
      dispatch(clearMessage("verifySignUp"));
    }
  }, [error, toast, message, dispatch]);

  const handleChangeOTP = useCallback(
    async (otp: string) => {
      setOtp(otp);
      if (otp.length === 6) {
        const email = signUpState?.email;
        const verify = { email, otp };
        await dispatch(verifySignUpThunk({ verify, router }));
      }
    },
    [dispatch, signUpState?.email, router]
  );

  const handleResendOTP = async () => {
    await resentOTP(signUpState?.email);
    setOtp("");
    setCounter(60);
    setResetTrigger((prev) => !prev);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f3f4f6] relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
          <Spinner className="text-[#0D99FF]" size="small" />
        </div>
      )}
      <div className="max-w-4xl w-full mx-auto p-8 md:p-12 bg-white border-[#d1d5db] rounded-xl shadow-xl relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <Image
            src={"/assets/images/two-factor-authentication.jpg"}
            width={400}
            height={400}
            alt="Image"
            quality={100}
            priority={true}
          />
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center text-primary mb-3">
              Xác thực tài khoản
            </h1>
            <p className="text-center text-gray-600 font-medium mb-6">
              Mã OTP đã được gửi đến{" "}
              <span className="text-[#0D99FF]">{signUpState?.email}</span>
            </p>
            <InputOTPPattern
              getOTP={handleChangeOTP}
              isLoading={isLoading}
              resetTrigger={resetTrigger}
            />
            {!isHideCountDown && otp.length === 6 && (
              <p className="text-right text-gray-600 mt-4">
                Mã OTP sẽ hết hạn sau{" "}
                <span className="text-[#0D99FF] font-bold">{counter}s</span>
              </p>
            )}
            {counter === 0 && (
              <div
                onClick={handleResendOTP}
                className="cursor-pointer w-full max-w-60 text-right py-2 text-sm text-[#0D99FF] font-bold hover:text-[#0d9aff92] transition-colors mt-3"
              >
                Gửi lại mã OTP
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
