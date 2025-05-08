"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/recover_password", {
        email, // Enviar solo el email desde el formulario
      });
  
      if (response.status === 200) {
        setSuccess("Password reset instructions have been sent to your email.");
        setError("");
      } else {
        setError("Failed to send reset instructions. Please try again.");
        setSuccess("");
      }
    } catch (error: any) {
      console.error("Error occurred while sending the request:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while sending the request. Please try again."
      );
      setSuccess("");
    }
  };

  return (
    <div className={cn("w-1/2 flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive password reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <Button type="submit" className="w-full">
                Send Reset Instructions
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Remembered your password?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </div>
  );
}
