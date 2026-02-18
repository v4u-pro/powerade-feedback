"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QRPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [feedbackUrl, setFeedbackUrl] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = window.location.origin;
    setFeedbackUrl(url);

    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(url, {
        width: 2000,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      }).then(setQrDataUrl);
    });
  }, []);

  const downloadPng = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas-pro")).default;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 5,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = "powerade-qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Image
        src="/banner-top.png"
        alt="Powerade"
        width={800}
        height={200}
        className="w-full h-auto"
        priority
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-4">
        <div
          ref={cardRef}
          style={{ borderRadius: 24, overflow: "hidden", background: "#18181b", padding: 32 }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", margin: 0 }}>
              Scan to Give Feedback
            </p>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="QR Code"
                style={{ width: 400, height: 400, borderRadius: 12 }}
              />
            )}
            <p style={{ fontSize: 11, color: "#a1a1aa", margin: 0, textAlign: "center" }}>
              {feedbackUrl}
            </p>
            <p style={{ fontSize: 11, color: "#71717a", margin: 0 }}>
              Print this QR code for stadium visitors
            </p>
          </div>
        </div>

        <Button
          onClick={downloadPng}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Download PNG
        </Button>
      </div>

      <Image
        src="/banner-bottom.png"
        alt="Fuel Your Power with Powerade"
        width={800}
        height={200}
        className="w-full h-auto"
      />
    </div>
  );
}
