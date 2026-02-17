"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const questions = [
  {
    key: "taste",
    label: "How would you rate this product in taste?",
  },
  {
    key: "tryAgain",
    label: "Would you be willing to try this again outside of the stadium?",
  },
  {
    key: "hydrating",
    label: "Do you feel this product is hydrating enough?",
  },
];

export default function FeedbackPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const setRating = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const allAnswered = questions.every((q) => ratings[q.key]);

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratings),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="text-5xl">&#10003;</div>
              <h2 className="text-2xl font-bold text-white">Thank You!</h2>
              <p className="text-zinc-400">
                Your feedback has been submitted successfully.
              </p>
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

      <div className="flex-1 px-4 py-6 space-y-4 max-w-md mx-auto w-full">
        <h1 className="text-xl font-bold text-white text-center">
          Share Your Feedback
        </h1>
        <p className="text-zinc-400 text-sm text-center">
          Rate each question from 1 (lowest) to 5 (highest)
        </p>

        {questions.map((q, idx) => (
          <Card key={q.key} className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-5 pb-5 space-y-3">
              <p className="text-sm font-medium text-zinc-200">
                {idx + 1}. {q.label}
              </p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(q.key, n)}
                    className={`w-12 h-12 rounded-lg text-lg font-bold transition-all
                      ${
                        ratings[q.key] === n
                          ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/30"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-zinc-500 px-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || loading}
          className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-40"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
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
