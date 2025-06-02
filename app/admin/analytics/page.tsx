"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data - in a real app, this would come from your API
const bookingData = [
  { name: "Jan", bookings: 65 },
  { name: "Feb", bookings: 59 },
  { name: "Mar", bookings: 80 },
  { name: "Apr", bookings: 81 },
  { name: "May", bookings: 56 },
  { name: "Jun", bookings: 55 },
  { name: "Jul", bookings: 40 },
]

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
]

const categoryData = [
  { name: "Adventure", value: 400 },
  { name: "Cultural", value: 300 },
  { name: "Food", value: 300 },
  { name: "Nature", value: 200 },
  { name: "Urban", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d")

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="border rounded p-2">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">1,234</p>
          <p className="text-sm text-green-500">+12% from last period</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">$45,678</p>
          <p className="text-sm text-green-500">+8% from last period</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Active Users</h3>
          <p className="text-3xl font-bold">567</p>
          <p className="text-sm text-green-500">+5% from last period</p>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="pt-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Booking Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="revenue" className="pt-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Revenue Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="pt-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Bookings by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
