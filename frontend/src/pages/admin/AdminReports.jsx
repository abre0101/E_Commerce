import { useState } from "react";

export default function AdminReports() {
  const [timeFrame, setTimeFrame] = useState("week");

  const data = {
    week: [
      { day: "Mon", sales: 12500 }, { day: "Tue", sales: 15800 },
      { day: "Wed", sales: 18200 }, { day: "Thu", sales: 14300 },
      { day: "Fri", sales: 22100 }, { day: "Sat", sales: 28900 },
      { day: "Sun", sales: 19400 },
    ],
    month: [
      { day: "Week 1", sales: 89200 }, { day: "Week 2", sales: 105600 },
      { day: "Week 3", sales: 98400 }, { day: "Week 4", sales: 112800 },
    ],
  };

  const bestSellers = [
    { name: "Raw Cambodian Body Wave", units: 145, revenue: "ETB 75,400", pct: 100 },
    { name: "Kinky Curly Premium", units: 112, revenue: "ETB 53,760", pct: 77 },
    { name: "Loose Deep Wave", units: 89, revenue: "ETB 40,050", pct: 61 },
    { name: "Deep Hair Closure", units: 67, revenue: "ETB 21,440", pct: 46 },
  ];

  const payments = [
    { method: "Telebirr", count: 156, pct: 45, color: "#22c55e" },
    { method: "CBE Birr", count: 98, pct: 28, color: "#16a34a" },
    { method: "Cash on Delivery", count: 72, pct: 21, color: "#60a5fa" },
    { method: "Other", count: 18, pct: 6, color: "#6b7280" },
  ];

  const rankColors = [
    "linear-gradient(135deg,#15803d,#22c55e)",
    "linear-gradient(135deg,#0369a1,#38bdf8)",
    "linear-gradient(135deg,#60a5fa,#3b82f6)",
    "linear-gradient(135deg,#34d399,#10b981)",
  ];

  const current = data[timeFrame];
  const maxVal = Math.max(...current.map(d => d.sales));

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Revenue",    value: "ETB 406,000", sub: "+12% vs last month", grad: "linear-gradient(135deg,#15803d,#22c55e)" },
          { label: "Orders",     value: "283",          sub: "+8% vs last month",  grad: "linear-gradient(135deg,#0369a1,#38bdf8)" },
          { label: "Avg Order",  value: "ETB 1,434",   sub: "+3% vs last month",  grad: "linear-gradient(135deg,#34d399,#10b981)" },
          { label: "Conversion", value: "3.2%",         sub: "Industry avg 2.8%",  grad: "linear-gradient(135deg,#60a5fa,#3b82f6)" },
        ].map(m => (
          <div key={m.label} className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: m.grad }}>
            <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-white/10" />
            <p className="text-xl font-bold">{m.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-75 mt-0.5">{m.label}</p>
            <p className="text-xs opacity-60 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Sales chart */}
        <div className="md:col-span-2 bg-white rounded-2xl border p-6" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-bold" style={{ color: "#111827" }}>Sales Trend</p>
              <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Revenue over time</p>
            </div>
            <div className="flex gap-2">
              {[["week", "Week"], ["month", "Month"]].map(([tf, label]) => (
                <button key={tf} onClick={() => setTimeFrame(tf)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: timeFrame === tf ? "#16a34a" : "rgba(22,163,74,0.08)",
                    color: timeFrame === tf ? "#fff" : "#16a34a",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {current.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold" style={{ color: "#22c55e" }}>
                  {(d.sales / 1000).toFixed(0)}K
                </span>
                <div className="w-full rounded-t-xl transition-all"
                  style={{
                    height: `${(d.sales / maxVal) * 110}px`,
                    background: i === current.length - 1
                      ? "linear-gradient(180deg,#15803d,#22c55e)"
                      : "rgba(22,163,74,0.12)",
                  }} />
                <span className="text-[11px]" style={{ color: "#6b7280" }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e5e7eb" }}>
          <p className="font-bold mb-0.5" style={{ color: "#111827" }}>Payment Methods</p>
          <p className="text-xs mb-5" style={{ color: "#6b7280" }}>Transaction breakdown</p>
          <div className="space-y-4">
            {payments.map((pm, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: "#111827" }}>{pm.method}</span>
                  <span className="text-xs font-bold" style={{ color: pm.color }}>{pm.pct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#f3f4f6" }}>
                  <div className="h-2 rounded-full transition-all"
                    style={{ width: `${pm.pct}%`, background: pm.color }} />
                </div>
                <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{pm.count} transactions</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best sellers */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e5e7eb" }}>
        <p className="font-bold mb-5" style={{ color: "#111827" }}>Top Selling Products</p>
        <div className="space-y-4">
          {bestSellers.map((p, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: rankColors[i] }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: "#111827" }}>{p.name}</span>
                  <span className="text-sm font-bold" style={{ color: "#16a34a" }}>{p.revenue}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#f3f4f6" }}>
                  <div className="h-1.5 rounded-full transition-all"
                    style={{ width: `${p.pct}%`, background: "linear-gradient(90deg,#15803d,#4ade80)" }} />
                </div>
                <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{p.units} units sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e5e7eb" }}>
        <p className="font-bold mb-4" style={{ color: "#111827" }}>Export Reports</p>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg,#15803d,#22c55e)" }}>
            📊 Download PDF
          </button>
          <button className="px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a" }}>
            📋 Download CSV
          </button>
          <button className="px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a" }}>
            📧 Email Report
          </button>
        </div>
      </div>

    </div>
  );
}
