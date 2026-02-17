"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Stats {
  total: number;
  avg_taste: number;
  avg_try_again: number;
  avg_hydrating: number;
}

interface DistItem {
  rating: number;
  count: number;
}

interface Distribution {
  taste: DistItem[];
  try_again: DistItem[];
  hydrating: DistItem[];
}

interface FeedbackRow {
  id: number;
  taste: number;
  try_again: number;
  hydrating: number;
  created_at: string;
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

const QUESTION_LABELS: Record<string, string> = {
  taste: "Taste Rating",
  try_again: "Try Again Outside Stadium",
  hydrating: "Hydrating Enough",
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="pt-4 pb-4 text-center">
        <p className="text-3xl font-bold text-blue-400">{value}</p>
        <p className="text-xs text-zinc-400 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function DistributionChart({ data, title }: { data: DistItem[]; title: string }) {
  const full = [1, 2, 3, 4, 5].map((r) => ({
    rating: r.toString(),
    count: data.find((d) => d.rating === r)?.count || 0,
  }));

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="pt-4 pb-4">
        <p className="text-sm font-medium text-zinc-300 mb-3">{title}</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={full}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="rating" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {full.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function AvgPieChart({ stats }: { stats: Stats }) {
  const data = [
    { name: "Taste", value: stats.avg_taste || 0 },
    { name: "Try Again", value: stats.avg_try_again || 0 },
    { name: "Hydrating", value: stats.avg_hydrating || 0 },
  ];

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="pt-4 pb-4">
        <p className="text-sm font-medium text-zinc-300 mb-3">Average Scores</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i + 2]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/feedback")
        .then((r) => r.json())
        .then((data) => {
          setStats(data.stats);
          setDistribution(data.distribution);
          setFeedback(data.feedback);
        })
        .finally(() => setLoading(false));
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400">Loading dashboard...</p>
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
        className="w-full h-auto"
        priority
      />

      <div className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-sm"
          >
            <a href="/api/feedback/csv">Export CSV</a>
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Responses" value={stats.total} />
            <StatCard label="Avg Taste" value={stats.avg_taste ?? "—"} />
            <StatCard label="Avg Try Again" value={stats.avg_try_again ?? "—"} />
            <StatCard label="Avg Hydrating" value={stats.avg_hydrating ?? "—"} />
          </div>
        )}

        {stats && <AvgPieChart stats={stats} />}

        {distribution && (
          <div className="space-y-4">
            {(Object.keys(QUESTION_LABELS) as (keyof Distribution)[]).map((key) => (
              <DistributionChart
                key={key}
                title={QUESTION_LABELS[key]}
                data={distribution[key]}
              />
            ))}
          </div>
        )}

        {feedback.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <CardContent className="p-0">
              <p className="text-sm font-medium text-zinc-300 p-4 pb-2">
                Recent Responses ({feedback.length})
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-center">Taste</th>
                      <th className="px-4 py-2 text-center">Try Again</th>
                      <th className="px-4 py-2 text-center">Hydrating</th>
                      <th className="px-4 py-2 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAll ? feedback : feedback.slice(0, 20)).map((row) => (
                      <tr key={row.id} className="border-b border-zinc-800/50 text-zinc-300">
                        <td className="px-4 py-2">{row.id}</td>
                        <td className="px-4 py-2 text-center">{row.taste}</td>
                        <td className="px-4 py-2 text-center">{row.try_again}</td>
                        <td className="px-4 py-2 text-center">{row.hydrating}</td>
                        <td className="px-4 py-2 text-right text-zinc-500 text-xs">
                          {row.created_at}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {feedback.length > 20 && (
                <div className="p-3 text-center border-t border-zinc-800">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {showAll ? "Show Less" : `View All (${feedback.length})`}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
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
