"use client";
import React, { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import { ToastAction } from "@radix-ui/react-toast";
import { REGEXP_ONLY_DIGITS } from "input-otp";
// import { CheckCircledIcon } from "@radix-ui/react-icons";
// import { ErrorResponse } from "@/app/(auth)/type";
interface InputOTPProps {
  getOTP: (otp: string) => void;
}
export default function InputOTPPattern({ getOTP }: InputOTPProps) {
  //   const { toast } = useToast();
  //   const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setEmail(email);
    }
  }, []);

  const handleChangeOTP = (otp: string) => {
    setValue(otp);
    getOTP(otp);
    if (otp.length === 6 && email) {
      console.log(otp);
    }
  };
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={handleChangeOTP}
      pattern={REGEXP_ONLY_DIGITS}
    >
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, i) => (
          <InputOTPSlot
            key={i}
            index={i}
            className="text-gray-500 border-gray-400 focus:outline-none w-10"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
