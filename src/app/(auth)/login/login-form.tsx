"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon, EyeOpenIcon, EyeNoneIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidation/auth.schema";
import { loginThunk } from "@/lib/features/authentication/authThunk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, loginState } = useSelector(
    (state: RootState) => state.auth.login
  );
  const { message } = loginState;

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: error,
        action: <ToastAction altText="Try again">Try Again!</ToastAction>,
      });
    }
    if (message) {
      toast({
        className: `bg-[#0D99FF] text-white border border-[#0B85DC] rounded-lg shadow-lg p-4 flex items-center transition-all duration-300 ease-in-out`,
        description: (
          <span className="flex items-center gap-2">
            <ReloadIcon className="w-4 h-4 text-white" />
            {message}
          </span>
        ),
      });
    }
  }, [error, toast, message]);

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginBodyType) => {
    await dispatch(loginThunk({ user: values, router }));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@gmail.com"
                  type="email"
                  {...field}
                  {...form.register("email")}
                  disabled={isLoading}
                  className={`text-gray-600 transition duration-200 ease-in-out ${
                    isLoading ? "cursor-not-allowed opacity-50" : "opacity-100"
                  }`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500">Mật khẩu</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="8+ characters"
                    type={showPassword ? "text" : "password"}
                    {...field}
                    {...form.register("password")}
                    disabled={isLoading}
                    className={`text-gray-600 transition duration-200 ease-in-out ${
                      isLoading
                        ? "cursor-not-allowed opacity-50"
                        : "opacity-100"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 transition duration-200 ease-in-out hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeNoneIcon className="w-5 h-5 text-primary" />
                    ) : (
                      <EyeOpenIcon className="w-5 h-5 text-primary" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-sm text-right py-2 text-primary hover:underline transition-colors duration-300 ease-in-out font-normal">
          <Link href={"/forgot-password"}>Quên mật khẩu?</Link>
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="!mt-3 w-full transition-colors duration-300 ease-in-out hover:bg-[#333]"
        >
          {!isLoading ? (
            "Đăng nhập"
          ) : (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
