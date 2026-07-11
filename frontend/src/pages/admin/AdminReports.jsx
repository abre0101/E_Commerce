import { useState } from "react";

const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };

export default function AdminReports() {
  const [timeFrame, setTimeFrame] = useState("week");

  const data = {
    week:  [{ day: "Mon", sales: 12500 },{ day: "Tue", sales: 15800 },{ day: "Wed", sales: 18200 },{ day: "Thu", sales: 14300 },{ day: "Fri", sales: 22100 },{ day: "Sat", sales: 28900 },{ day: "Sun", sales: 19400 }],
    month: [{ day: "Week 1", sales: 89200 },{ day: "Week 2", sales: 105600 },{ day: "Week 3", sales: 98400 },{ day: "Week 4", sales: 112800 }],
  };

  const bestSellers = [
    { name: "Raw Cambodian Body Wave",   units: 145, revenue: "ETB 75,400", pct: 100 },
    { name: "Kinky Curly Premium",        units: 112, revenue: "ETB 53,760", pct: 77 },
    { name: "Loose Deep Wave",            units: 89,  revenue: "ETB 40,050", pct: 61 },
    { name: "Deep Hair Closure",          units: 67,  revenue: "ETB 21,440", pct: 46 },
  ];

  const payments = [
    { method: "Telebirr",         count: 156, pct: 45 },
    { method: "CBE Birr",         count: 98,  pct: 28 },
    { method: "Cash on Delivery", count: 72,  pct: 21 },
    { method: "Other",            count: 18,  pct: 6  },
  ];

  const current = data[timeFrame];
  const maxVal = Math.max(...current.map(d => d.sales));

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Revenue",    value: "ETB 406,000", sub: "+12% vs last month" },
          { label: "Orders",     value: "283",          sub: "+8% vs last month"  },
          { label: "Avg Order",  value: "ETB 1,434",   sub: "+3% vs last month"  },
          { label: "Conversion", value: "3.2%",         sub: "Industry avg 2.8%"  },
        ].map(m => (
          <div key={m.label} className="p-5 border" style={CARD}>
            <p className="text-xl font-bold" style={{ color: "#fff" }}>{m.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>{m.label}</p>
            <p className="text-xs mt-1" style={{ color: GOLD }}>{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Sales chart */}
        <div className="md:col-span-2 p-6 border" style={CARD}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-bold" style={{ color: "#fff" }}>Sales Trend</p>
              <p className="text-xs mt-0.5" style={{ color: "#888" }}>Revenue over time</p>
            </div>
            <div className="flex gap-2">
              {[["week", "Week"], ["month", "Month"]].map(([tf, label]) => (
                <button key={tf} onClick={() => setTimeFrame(tf)}
                  className="px-3 py-1.5 text-xs font-semibold border transition-all"
                  style={{ background: timeFrame === tf ? GOLD : "transparent", color: timeFrame === tf ? "#111" : GOLD, borderColor: "rgba(201,169,97,0.3)" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {current.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold" style={{ color: GOLD }}>{(d.sales / 1000).toFixed(0)}K</span>
                <div className="w-full transition-all"
                  style={{ height: `${(d.sales / maxVal) * 110}px`, background: i === current.length - 1 ? GOLD : "rgba(201,169,97,0.15)" }} />
                <span className="text-[11px]" style={{ color: "#666" }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="p-6 border" style={CARD}>
          <p className="font-bold mb-0.5" style={{ color: "#fff" }}>Payment Methods</p>
          <p className="text-xs mb-5" style={{ color: "#888" }}>Transaction breakdown</p>
          <div className="space-y-4">
            {payments.map((pm, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: "#ccc" }}>{pm.method}</span>
                  <span className="text-xs font-bold" style={{ color: GOLD }}>{pm.pct}%</span>
                </div>
                <div className="h-1.5" style={{ background: "#1a1a1a" }}>
                  <div className="h-1.5 transition-all" style={{ width: `${pm.pct}%`, background: GOLD, opacity: 1 - i * 0.18 }} />
                </div>
                <p className="text-xs mt-1" style={{ color: "#666" }}>{pm.count} transactions</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best sellers */}
      <div className="p-6 border" style={CARD}>
        <p className="font-bold mb-5" style={{ color: "#fff" }}>Top Selling Products</p>
        <div className="space-y-4">
          {bestSellers.map((p, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-7 h-7 flex items-center justify-center text-xs font-bold text-black shrink-0"
                style={{ background: GOLD, opacity: 1 - i * 0.15 }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: "#fff" }}>{p.name}</span>
                  <span className="text-sm font-bold" style={{ color: GOLD }}>{p.revenue}</span>
                </div>
                <div className="h-1.5" style={{ background: "#1a1a1a" }}>
                  <div className="h-1.5 transition-all" style={{ width: `${p.pct}%`, background: GOLD }} />
                </div>
                <p className="text-xs mt-1" style={{ color: "#666" }}>{p.units} units sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="p-6 border" style={CARD}>
        <p className="font-bold mb-4" style={{ color: "#fff" }}>Export Reports</p>
        <div className="flex flex-wrap gap-3">
          {["📊 Download PDF", "📋 Download CSV", "📧 Email Report"].map(label => (
            <button key={label}
              className="px-5 py-2.5 text-sm font-semibold border transition-all"
              style={{ borderColor: "rgba(201,169,97,0.3)", color: GOLD }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,97,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
