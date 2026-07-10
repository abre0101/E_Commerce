import { useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { products } from "../../data/mockData";
import useAdminStore from "../../store/useAdminStore";

function getOrders() {
  try { return JSON.parse(localStorage.getItem("yada_orders") || "[]"); }
  catch { return []; }
}

const COLORS = ["#8B4F6D", "#C9A961", "#6b6361", "#d9534f", "#5a9e6f"];

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: "rgba(139,79,109,0.15)" }}>
      <h3 className="font-semibold mb-6" style={{ color: "#2a2220" }}>{title}</h3>
      {children}
    </div>
  );
}

function MetricBox({ label, value, change, icon }) {
  const positive = change >= 0;
  return (
    <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(139,79,109,0.15)" }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: "#6b6361" }}>{label}</p>
          <p className="text-2xl font-bold" style={{ color: "#2a2220" }}>{value}</p>
        </div>
        <span className="text-xl">{icon}</span>
      </div>
      {change !== undefined && (
        <p className="text-xs font-semibold" style={{ color: positive ? "#5a9e6f" : "#d9534f" }}>
          {positive ? "↑" : "↓"} {Math.abs(change)}% vs last month
        </p>
      )}
    </div>
  );
}

export default function AdminAnalytics() {
  const { session } = useAdminStore();
  const orders = useMemo(getOrders, []);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
    
    // Status breakdown
    const statusBreakdown = [
      { name: "Completed", value: orders.filter(o => o.status === "success").length },
      { name: "Pending", value: orders.filter(o => o.status === "pending").length },
      { name: "Failed", value: orders.filter(o => o.status === "failed").length },
    ];

    // Products sold
    const productsSold = orders.flatMap(o => o.items || []).reduce((acc, item) => {
      const existing = acc.find(p => p.name === item.name);
      if (existing) {
        existing.quantity += item.qty;
        existing.revenue += item.price * item.qty;
      } else {
        acc.push({ name: item.name, quantity: item.qty, revenue: item.price * item.qty });
      }
      return acc;
    }, []).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Daily revenue (simulated based on order dates)
    const dailyRevenue = orders.reduce((acc, order) => {
      const date = order.date ? new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown';
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.revenue += order.total || 0;
        existing.orders += 1;
      } else {
        acc.push({ date, revenue: order.total || 0, orders: 1 });
      }
      return acc;
    }, []).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14);

    // Customer insights
    const uniqueCustomers = [...new Set(orders.map(o => o.customer?.email))].filter(Boolean).length;
    const repeatCustomers = orders.reduce((acc, order) => {
      const email = order.customer?.email;
      if (email) acc[email] = (acc[email] || 0) + 1;
      return acc;
    }, {});
    const repeatCount = Object.values(repeatCustomers).filter(count => count > 1).length;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      statusBreakdown: statusBreakdown.filter(s => s.value > 0),
      productsSold,
      dailyRevenue: dailyRevenue.length > 0 ? dailyRevenue : [{ date: 'No data', revenue: 0, orders: 0 }],
      uniqueCustomers,
      repeatCustomers: repeatCount,
      topProduct: productsSold[0],
    };
  }, [orders]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#2a2220" }}>Analytics</h1>
        <p style={{ color: "#6b6361" }}>Comprehensive insights into your business performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox 
          label="Total Revenue" 
          value={`ETB ${analytics.totalRevenue.toLocaleString()}`}
          icon="💰"
          change={12}
        />
        <MetricBox 
          label="Total Orders" 
          value={analytics.totalOrders}
          icon="📦"
          change={8}
        />
        <MetricBox 
          label="Avg Order Value" 
          value={`ETB ${analytics.avgOrderValue.toLocaleString()}`}
          icon="💳"
          change={-3}
        />
        <MetricBox 
          label="Unique Customers" 
          value={analytics.uniqueCustomers}
          icon="👥"
          change={15}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <ChartCard title="Revenue Trend (Last 14 Days)">
          {analytics.dailyRevenue.length > 0 && analytics.dailyRevenue[0].revenue > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyRevenue}>
                <CartesianGrid stroke="rgba(139,79,109,0.1)" />
                <XAxis dataKey="date" stroke="#6b6361" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b6361" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ background: "#f7f3f0", border: "1px solid rgba(139,79,109,0.2)", borderRadius: "8px" }}
                  labelStyle={{ color: "#2a2220" }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8B4F6D" strokeWidth={2} dot={{ fill: "#8B4F6D", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center" style={{ color: "#b8b8b8" }}>
              No data available yet
            </div>
          )}
        </ChartCard>

        {/* Order Status Distribution */}
        <ChartCard title="Order Status Distribution">
          {analytics.statusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8B4F6D"
                  dataKey="value"
                >
                  {analytics.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "#f7f3f0", border: "1px solid rgba(139,79,109,0.2)", borderRadius: "8px" }}
                  labelStyle={{ color: "#2a2220" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center" style={{ color: "#b8b8b8" }}>
              No data available yet
            </div>
          )}
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Products */}
        <ChartCard title="Top Selling Products">
          {analytics.productsSold.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.productsSold}>
                <CartesianGrid stroke="rgba(139,79,109,0.1)" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} style={{ fontSize: '12px' }} stroke="#6b6361" />
                <YAxis stroke="#6b6361" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ background: "#f7f3f0", border: "1px solid rgba(139,79,109,0.2)", borderRadius: "8px" }}
                  labelStyle={{ color: "#2a2220" }}
                />
                <Bar dataKey="quantity" fill="#8B4F6D" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center" style={{ color: "#b8b8b8" }}>
              No sales data yet
            </div>
          )}
        </ChartCard>

        {/* Customer Insights */}
        <ChartCard title="Customer Insights">
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: "rgba(139,79,109,0.08)", borderLeft: "3px solid #8B4F6D" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#6b6361" }}>Total Customers</p>
              <p className="text-2xl font-bold" style={{ color: "#2a2220" }}>{analytics.uniqueCustomers}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "rgba(201,169,97,0.08)", borderLeft: "3px solid #C9A961" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#6b6361" }}>Repeat Customers</p>
              <p className="text-2xl font-bold" style={{ color: "#2a2220" }}>{analytics.repeatCustomers}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "rgba(106,107,97,0.08)", borderLeft: "3px solid #6b6361" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#6b6361" }}>Repeat Rate</p>
              <p className="text-2xl font-bold" style={{ color: "#2a2220" }}>
                {analytics.uniqueCustomers > 0 ? Math.round((analytics.repeatCustomers / analytics.uniqueCustomers) * 100) : 0}%
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Summary Stats */}
      {analytics.topProduct && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "rgba(139,79,109,0.15)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "#6b6361" }}>Top Product</p>
            <p className="font-semibold mb-1" style={{ color: "#2a2220" }}>{analytics.topProduct.name}</p>
            <p className="text-sm" style={{ color: "#8B4F6D" }}>{analytics.topProduct.quantity} sold</p>
          </div>
          <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "rgba(139,79,109,0.15)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "#6b6361" }}>Revenue from Top Product</p>
            <p className="text-2xl font-bold" style={{ color: "#2a2220" }}>ETB {analytics.topProduct.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "rgba(139,79,109,0.15)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "#6b6361" }}>Product Diversity</p>
            <p className="text-2xl font-bold" style={{ color: "#2a2220" }}>{analytics.productsSold.length} products</p>
          </div>
        </div>
      )}
    </div>
  );
}
