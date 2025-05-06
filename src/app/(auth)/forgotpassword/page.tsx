"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { ForgotPasswordForm } from "@/modules/ForgotPasswordForm";

export default function LoginPage() {
  return (
    <div className="flex flex-row w-full h-full bg-muted">
      <div className="w-1/2 h-full flex flex-col justify-center items-center">
        <div className="flex flex-row gap-4 text-center justify-center items-center text-8xl">
          <GalleryVerticalEnd className="size-20" />
          WellTrack Inc.
        </div>
      </div>
      <div className="flex flex-col w-1/2 h-full justify-center items-center">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
