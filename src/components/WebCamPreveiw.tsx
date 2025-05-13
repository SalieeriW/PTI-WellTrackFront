"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WebcamPreview({ userId }: { userId: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [calibrated, setCalibrated] = useState(false);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSettings = async () => {
    const res = await fetch(`/api/settings/${userId}`);
    const data = await res.json();
    setSettings(data);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setStreaming(false);
    if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
  };

  const captureAndSend = async (endpoint: string) => {
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

    const response = await fetch(endpoint, {
      method: "POST",
      body: form,
    });

    const result = await response.json();
    console.log("📸 Resultado:", result);
    return result;
  };

  useEffect(() => {
    fetchSettings();
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (!streaming || !settings) return;

    const calibrate = async () => {
      console.log("🔧 Iniciando calibración");
      const result = await captureAndSend("/calibrate");
      if (result?.calibration_values) {
        setCalibrated(true);
        console.log("✅ Calibración completada");
      }
    };

    const startScanning = () => {
      const intervalMs = parseInt(settings.scan_freq || "10000");
      if (!intervalMs || isNaN(intervalMs)) return;

      captureIntervalRef.current = setInterval(() => {
        captureAndSend(`/analyze/${userId}`);
      }, intervalMs);
    };

    if (!calibrated && settings.camera_access) {
      calibrate();
    } else if (calibrated && settings.camera_access) {
      startScanning();
    }
  }, [streaming, settings, calibrated]);

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
                Detener cámara
              </Button>
            ) : (
              <Button onClick={startCamera}>Iniciar cámara</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
