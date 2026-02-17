"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function QRPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [feedbackUrl, setFeedbackUrl] = useState<string>("");

  useEffect(() => {
    const url = window.location.origin;
    setFeedbackUrl(url);

    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      }).then(setQrDataUrl);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Image
        src="/banner-top.png"
        alt="Powerade"
        width={800}
        height={200}
        className="w-full object-cover max-h-[100px] md:max-h-[80px]"
        priority
      />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="bg-zinc-900 border-zinc-800 max-w-sm w-full">
          <CardContent className="pt-6 pb-6 flex flex-col items-center space-y-4">
            <h1 className="text-xl font-bold text-white">Scan to Give Feedback</h1>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-64 h-64 rounded-lg"
              />
            )}
            <p className="text-zinc-400 text-xs text-center break-all">{feedbackUrl}</p>
            <p className="text-zinc-500 text-xs">Print this QR code for stadium visitors</p>
          </CardContent>
        </Card>
      </div>

      <Image
        src="/banner-bottom.png"
        alt="Fuel Your Power with Powerade"
        width={800}
        height={200}
        className="w-full object-cover max-h-[100px] md:max-h-[80px]"
      />
    </div>
  );
}
