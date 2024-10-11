"use client";
import React from "react";
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

export default function RegisterForm() {
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterBodyType) => {
    console.log(values);
  };
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
                  className=" text-gray-600"
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
                  className=" text-gray-600"
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
                  className=" text-gray-600"
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
                  className=" text-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="!mt-8 w-full transition-colors duration-300 ease-in-out hover:bg-[#333]"
        >
          Đăng ký
          {/* {!isLoading ? (
        "Đăng nhập"
      ) : (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      )} */}
        </Button>
      </form>
    </Form>
  );
}
