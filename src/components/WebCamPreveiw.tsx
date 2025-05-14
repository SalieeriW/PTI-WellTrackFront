"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function WebcamPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [calibrated, setCalibrated] = useState(false);
  const [lastData, setLastData] = useState<any>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const session = useSession();
  const userId = session.data?.user?.id;

  const fetchSettings = async () => {
    const res = await fetch(
      `http://localhost:3001/api/generalSettings/${userId}`
    );
    const data = await res.json();
    setSettings(data);
    console.log("⚙️ Settings loaded:", data);
  };

  const startCamera = async () => {
    try {
      if (settings?.camera_access === false) {
        toast.error("❌ Camera access denied");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setStreaming(false);
    if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
  };

  const captureAndSend = async (event: string) => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg")
    );
    if (!blob) return;

    const form = new FormData();
    form.append("image", blob, "frame.jpg");

    const response = await fetch("http://localhost:3001/api/ml/" + event, {
      method: "POST",
      body: form,
    });

    const result = await response.json();
    console.log("📸 Result:", result);
    return result;
  };

  // 1️⃣ Load settings and start camera
  useEffect(() => {
    const loadContent = async () => {
      await fetchSettings();
    };
    loadContent();
  }, []);

  useEffect(() => {
    if (settings?.camera_access) {
      startCamera();
    }
    return () => stopCamera();
  }, [settings]);

  // 2️⃣ Automatic calibration
  useEffect(() => {
    if (!streaming || !settings || calibrated || !settings.camera_access)
      return;

    const calibrate = async () => {
      for (let i = 5; i > 0; i--) {
        console.log(`⏳ Calibrating in ${i} seconds`);
        toast.info(`Calibrating in ${i} seconds`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      toast.info("🔧 Starting calibration");
      const result = await captureAndSend("calibrate");

      if (result?.calibration_values) {
        setCalibrated(true);
        toast.success("✅ Calibration completed");
        toast.info(
          "🔧 Enabling scan with interval " +
            parseInt(settings.scan_freq) +
            " seconds"
        );
      } else {
        toast.error("❌ Calibration failed");
      }
    };

    calibrate();
  }, [streaming, settings, calibrated]);

  // 3️⃣ Automatic scanning post-calibration
  useEffect(() => {
    const postCalibration = async () => {
      if (!calibrated || !settings?.camera_access) return;

      const intervalMs = parseInt(settings.scan_freq || "10") * 1000;
      toast.info(`🔍 Scanning every ${intervalMs / 1000} seconds`);
      if (!intervalMs || isNaN(intervalMs)) return;

      captureIntervalRef.current = setInterval(async () => {
        console.log(intervalMs);
        toast.info("🔍 Scanning...");
        const result = await captureAndSend(`analyze/${userId}`);
        setLastData(result.parsedData);
      }, intervalMs);
    };

    postCalibration();

    return () => {
      if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
    };
  }, [calibrated, settings]);

  return (
    <div className="justify-center items-center h-full w-full min-w-[50%] min-h-screen">
      <Card className="flex flex-col flex-1 p-4 rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4 ">
          <video
            ref={videoRef}
            className="rounded-2xl aspect-video bg-black"
            autoPlay
            playsInline
            muted
          />
          <div className="flex gap-2">
            {streaming ? (
              <Button variant="destructive" onClick={stopCamera}>
                Stop Camera
              </Button>
            ) : (
              <Button onClick={startCamera}>Start Camera</Button>
            )}
          </div>

          {lastData && (
            <div className="w-full bg-gray-100 p-4 rounded-xl border mt-4 text-sm text-center">
              <h3 className="font-semibold text-lg mb-4">🧠 Analysis Result</h3>

              <div className="flex flex-wrap justify-center gap-3">
                <span
                  className={`rounded-full px-4 py-1 text-white font-medium ${
                    lastData.is_tired ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {lastData.is_tired ? "😴 Tired" : "✅ Alert"}
                </span>

                <span
                  className={`rounded-full px-4 py-1 font-medium ${
                    !lastData.is_drinking
                      ? "bg-yellow-400 text-black"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {lastData.is_drinking ? "🥤 Drinking" : "🚫 Not Drinking"}
                </span>

                <span
                  className={`rounded-full px-4 py-1 text-white font-medium ${
                    lastData.is_badpos ? "bg-orange-500" : "bg-green-500"
                  }`}
                >
                  {lastData.is_badpos ? "💺 Bad Posture" : "🧍 Good Posture"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
