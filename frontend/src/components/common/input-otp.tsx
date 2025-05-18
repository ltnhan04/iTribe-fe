"use client";
import React, { useState, memo, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface InputOTPProps {
  getOTP: (otp: string) => void;
  isLoading: boolean;
  resetTrigger: boolean;
}

function InputOTPPattern({ getOTP, isLoading, resetTrigger }: InputOTPProps) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue("");
  }, [resetTrigger]);
  const handleChangeOTP = (otp: string) => {
    setValue(otp);
    getOTP(otp);
  };

  return (
    <InputOTP
      disabled={isLoading}
      value={value}
      maxLength={6}
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

export default memo(InputOTPPattern);
