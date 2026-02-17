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
        color: { dark: "#1d4ed8", light: "#000000" },
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
        <Card className="bg-zinc-900 border-blue-800/50 max-w-sm w-full shadow-lg shadow-blue-900/20">
          <CardContent className="pt-6 pb-6 flex flex-col items-center space-y-4">
            <h1 className="text-xl font-bold text-blue-400">Scan to Give Feedback</h1>
            {qrDataUrl && (
              <div className="p-3 bg-black rounded-xl border border-blue-800/30">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-60 h-60 rounded-lg"
                />
              </div>
            )}
            <p className="text-blue-300/70 text-xs text-center break-all">{feedbackUrl}</p>
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
