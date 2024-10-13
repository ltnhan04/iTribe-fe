"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterBody, RegisterBodyType } from "@/schemaValidation/auth.schema";
import { useRouter } from "next/navigation";
import { signUpThunk } from "@/lib/features/authentication/authThunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { isLoading, error, signUpState } = useSelector(
    (state: RootState) => state.auth.signUp
  );
  const { message } = signUpState;
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterBodyType) => {
    const { name, email, password } = values;
    const user = { name, email, password };
    await dispatch(signUpThunk({ user, router }));
  };

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
    }
  }, [error, toast, message]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Name"
                  type="text"
                  {...field}
                  {...form.register("name")}
                  disabled={isLoading}
                  className={`text-gray-600 ${
                    isLoading && "cursor-not-allowed"
                  }`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  className={`text-gray-600 ${
                    isLoading && "cursor-not-allowed"
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
                <Input
                  placeholder="8+ characters"
                  type="password"
                  {...field}
                  {...form.register("password")}
                  disabled={isLoading}
                  className={`text-gray-600 ${
                    isLoading && "cursor-not-allowed"
                  }`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500">Nhập lại mật khẩu</FormLabel>
              <FormControl>
                <Input
                  placeholder="8+ characters"
                  type="password"
                  {...field}
                  {...form.register("confirmPassword")}
                  disabled={isLoading}
                  className={`text-gray-600 ${
                    isLoading && "cursor-not-allowed"
                  }`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="!mt-8 w-full transition-colors duration-300 ease-in-out hover:bg-[#333]"
        >
          {!isLoading ? (
            "Đăng ký"
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
