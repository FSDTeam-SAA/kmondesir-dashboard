"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, Users } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const statsData = [
  { name: "Jan", monthly: 800, annual: 600 },
  { name: "Feb", monthly: 900, annual: 700 },
  { name: "Mar", monthly: 1000, annual: 800 },
  { name: "Apr", monthly: 1100, annual: 900 },
  { name: "May", monthly: 1200, annual: 1000 },
  { name: "Jun", monthly: 1240, annual: 1100 },
  { name: "Jul", monthly: 1300, annual: 1200 },
  { name: "Aug", monthly: 1250, annual: 1150 },
  { name: "Sep", monthly: 1400, annual: 1300 },
  { name: "Oct", monthly: 1350, annual: 1250 },
  { name: "Nov", monthly: 1450, annual: 1350 },
  { name: "Dec", monthly: 1500, annual: 1400 },
]

const pieData = [
  { name: "Sahih al-Bukhari", value: 25, color: "#3B82F6" },
  { name: "Sahih al-Bukhari", value: 20, color: "#10B981" },
  { name: "Sahih al-Bukhari", value: 15, color: "#F59E0B" },
  { name: "Sahih al-Bukhari", value: 25, color: "#EF4444" },
  { name: "Sahih al-Bukhari", value: 15, color: "#8B5CF6" },
]

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back to your admin panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-[#334155] border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#C5A46D]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$51,250</div>
              <p className="text-xs text-[#C5A46D]">10% ↗ last 30 today</p>
            </CardContent>
          </Card>

          <Card className="bg-[#334155] border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Content</CardTitle>
              <FileText className="h-4 w-4 text-[#C5A46D]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">51,250</div>
              <p className="text-xs text-[#C5A46D]">10% ↗ last 30 today</p>
            </CardContent>
          </Card>

          <Card className="bg-[#334155] border-gray-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total User</CardTitle>
              <Users className="h-4 w-4 text-[#C5A46D]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">51,250</div>
              <p className="text-xs text-[#C5A46D]">10% ↗ last 30 today</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Statistics Chart */}
          <Card className="lg:col-span-2 bg-[#334155] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Statistic</CardTitle>
              <p className="text-gray-400 text-sm">Revenue subscription added</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#C5A46D]"></div>
                  <span className="text-gray-300">Monthly Plan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-gray-300">Annual Plan</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Line
                      type="monotone"
                      dataKey="monthly"
                      stroke="#C5A46D"
                      strokeWidth={2}
                      dot={{ fill: "#C5A46D", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="annual"
                      stroke="#6B7280"
                      strokeWidth={2}
                      dot={{ fill: "#6B7280", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-300">
                <div>● Monthly Plan : 1,240</div>
                <div>● Annual Plan : 1,240</div>
              </div>
            </CardContent>
          </Card>

          {/* Most Watching Chart */}
          <Card className="bg-[#334155] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Most watching</CardTitle>
              <p className="text-gray-400 text-sm">Most watching in the Genres</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold text-white">20.00%</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
