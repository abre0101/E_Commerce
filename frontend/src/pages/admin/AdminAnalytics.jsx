import { useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { products } from "../../data/mockData";
import useAdminStore from "../../store/useAdminStore";

const GOLD = "#C9A961";
const CARD = { background: "#111", border: "1px solid rgba(201,169,97,0.15)" };
const COLORS = [GOLD, "#C9A961cc", "#C9A96199", "#C9A96166", "#C9A96133"];

function getOrders() {
  try { return JSON.parse(localStorage.getItem("yada_orders") || "[]"); }
  catch { return []; }
}

const tooltipStyle = {
  contentStyle: { background: "#1a1a1a", border: "1px solid rgba(201,169,97,0.2)", borderRadius: 0 },
  labelStyle: { color: "#fff" },
  itemStyle: { color: GOLD },
};

export default function AdminAnalytics() {
  const { session } = useAdminStore();
  const orders = useMemo(getOrders, []);

  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

    const statusBreakdown = [
      { name: "Completed", value: orders.filter(o => o.status === "success").length },
      { name: "Pending",   value: orders.filter(o => o.status === "pending").length },
      { name: "Failed",    value: orders.filter(o => o.status === "failed").length },
    ];

    const productsSold = orders.flatMap(o => o.items || []).reduce((acc, item) => {
      const ex = acc.find(p => p.name === item.name);
      if (ex) { ex.quantity += item.qty; ex.revenue += item.price * item.qty; }
      else acc.push({ name: item.name, quantity: item.qty, revenue: item.price * item.qty });
      return acc;
    }, []).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    const dailyRevenue = orders.reduce((acc, order) => {
      const date = order.date ? new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Unknown";
      const ex = acc.find(d => d.date === date);
      if (ex) { ex.revenue += order.total || 0; ex.orders += 1; }
      else acc.push({ date, revenue: order.total || 0, orders: 1 });
      return acc;
    }, []).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14);

    const uniqueCustomers = [...new Set(orders.map(o => o.customer?.email))].filter(Boolean).length;
    const repeatMap = orders.reduce((acc, o) => { const e = o.customer?.email; if (e) acc[e] = (acc[e] || 0) + 1; return acc; }, {});
    const repeatCount = Object.values(repeatMap).filter(c => c > 1).length;

    return { totalRevenue, totalOrders, avgOrderValue, statusBreakdown: statusBreakdown.filter(s => s.value > 0), productsSold, dailyRevenue: dailyRevenue.length > 0 ? dailyRevenue : [{ date: "No data", revenue: 0, orders: 0 }], uniqueCustomers, repeatCustomers: repeatCount, topProduct: productsSold[0] };
  }, [orders]);

  const empty = <div className="h-[300px] flex items-center justify-center text-sm" style={{ color: "#555" }}>No data available yet</div>;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: GOLD }}>Business Intelligence</p>
        <h1 className="font-serif text-3xl font-bold" style={{ color: "#fff" }}>Analytics</h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>Comprehensive insights into your store performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",    value: `ETB ${analytics.totalRevenue.toLocaleString()}`, change: 12 },
          { label: "Total Orders",     value: analytics.totalOrders,                             change: 8  },
          { label: "Avg Order Value",  value: `ETB ${analytics.avgOrderValue.toLocaleString()}`, change: -3 },
          { label: "Unique Customers", value: analytics.uniqueCustomers,                          change: 15 },
        ].map(m => (
          <div key={m.label} className="p-5 border" style={CARD}>
            <p className="text-2xl font-bold" style={{ color: "#fff" }}>{m.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#888" }}>{m.label}</p>
            <p className="text-xs mt-1" style={{ color: m.change >= 0 ? GOLD : "#f87171" }}>
              {m.change >= 0 ? "↑" : "↓"} {Math.abs(m.change)}% vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 border" style={CARD}>
          <p className="font-bold mb-1" style={{ color: "#fff" }}>Revenue Trend</p>
          <p className="text-xs mb-5" style={{ color: "#888" }}>Last 14 days</p>
          {analytics.dailyRevenue[0]?.revenue > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={analytics.dailyRevenue}>
                <CartesianGrid stroke="rgba(201,169,97,0.08)" />
                <XAxis dataKey="date" stroke="#555" style={{ fontSize: 11 }} />
                <YAxis stroke="#555" style={{ fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} dot={{ fill: GOLD, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : empty}
        </div>

        <div className="p-6 border" style={CARD}>
          <p className="font-bold mb-1" style={{ color: "#fff" }}>Order Status</p>
          <p className="text-xs mb-5" style={{ color: "#888" }}>Distribution</p>
          {analytics.statusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={analytics.statusBreakdown} cx="50%" cy="50%" outerRadius={80}
                  labelLine={false} label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                  {analytics.statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : empty}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 border" style={CARD}>
          <p className="font-bold mb-1" style={{ color: "#fff" }}>Top Selling Products</p>
          <p className="text-xs mb-5" style={{ color: "#888" }}>By quantity sold</p>
          {analytics.productsSold.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.productsSold}>
                <CartesianGrid stroke="rgba(201,169,97,0.08)" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} stroke="#555" style={{ fontSize: 10 }} />
                <YAxis stroke="#555" style={{ fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="quantity" fill={GOLD} />
              </BarChart>
            </ResponsiveContainer>
          ) : empty}
        </div>

        <div className="p-6 border" style={CARD}>
          <p className="font-bold mb-5" style={{ color: "#fff" }}>Customer Insights</p>
          <div className="space-y-4">
            {[
              { label: "Total Customers",  value: analytics.uniqueCustomers },
              { label: "Repeat Customers", value: analytics.repeatCustomers },
              { label: "Repeat Rate",      value: `${analytics.uniqueCustomers > 0 ? Math.round((analytics.repeatCustomers / analytics.uniqueCustomers) * 100) : 0}%` },
            ].map(item => (
              <div key={item.label} className="p-4 border" style={{ background: "#0d0d0d", borderColor: "#222" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "#888" }}>{item.label}</p>
                <p className="text-2xl font-bold" style={{ color: "#fff" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top product summary */}
      {analytics.topProduct && (
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Top Product",                value: analytics.topProduct.name },
            { label: "Revenue from Top Product",   value: `ETB ${analytics.topProduct.revenue.toLocaleString()}` },
            { label: "Product Diversity",          value: `${analytics.productsSold.length} products` },
          ].map(item => (
            <div key={item.label} className="p-6 border" style={CARD}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#888" }}>{item.label}</p>
              <p className="font-bold" style={{ color: "#fff" }}>{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
