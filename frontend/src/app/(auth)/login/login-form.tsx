/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  clearMessage,
  clearError,
  updateGoogleAuth,
} from "@/lib/features/authentication/authSlice";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, loginState } = useAppSelector(
    (state) => state.auth.login
  );
  const { message } = loginState;

  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: error,
        action: <ToastAction altText="Try again">Try Again!</ToastAction>,
      });
      dispatch(clearError("login"));
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
      dispatch(clearMessage("login"));
    }
  }, [error, toast, message, dispatch]);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (accessToken && name && email) {
      try {
        dispatch(updateGoogleAuth({ accessToken, name, email }));
        toast({
          title: "Đăng nhập thành công",
          description: `Xin chào ${name}!`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Lỗi đăng nhập",
          description: "Có lỗi xảy ra khi xử lý đăng nhập Google",
          variant: "destructive",
        });
      } finally {
        window.history.replaceState({}, "", "/");
      }
    }
  }, [dispatch, searchParams, toast]);

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
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      isLoading
                        ? "cursor-not-allowed opacity-50"
                        : "opacity-100"
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        onClick={() =>
          (window.location.href = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/login-google`)
        }
        className="w-full"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Đăng nhập với Google
      </Button>
    </div>
  );
}
