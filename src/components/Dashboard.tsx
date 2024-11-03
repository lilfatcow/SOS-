import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowRight } from 'lucide-react';

// Sample data for the cash flow chart
const cashFlowData = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}`.padStart(2, '0'),
  inflow: Math.floor(Math.random() * 100000),
  outflow: Math.floor(Math.random() * 80000),
}));

const transactions = [
  {
    name: "24/7 Productions",
    id: "240-23",
    status: "Overdue",
    dueDate: "Oct 11",
    amount: "$10,500.00"
  },
  {
    name: "SuperBloom House | Israa Saed & Aele Saed",
    id: "SBH10-24",
    status: "Overdue",
    dueDate: "Oct 1",
    amount: "$18,000.00"
  }
];

export default function Dashboard() {
  return (
    <div className="h-full w-full flex bg-[#F5F5F7]">
      <div className="w-[240px] flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full">
        <Header />
        
        <ScrollArea className="flex-1 px-8 py-6">
          <div className="max-w-[1200px] space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium">Overview</h1>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm">
                <span>Last 30 days</span>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border" />
                    Accounts Payable
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-medium">$28,500.00</p>
                <p className="text-sm text-muted-foreground">2 pending payments</p>
              </Card>

              <Card className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border" />
                    Accounts Receivable
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-medium">$56,000.00</p>
                <p className="text-sm text-muted-foreground">4 pending invoices</p>
              </Card>
            </div>

            {/* Cash Flow Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Cash Flow</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Inflow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Outflow</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowData}>
                    <XAxis 
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, '']}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="inflow"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                      name="Inflow"
                    />
                    <Line
                      type="monotone"
                      dataKey="outflow"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={false}
                      name="Outflow"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Recent Transactions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">Recent Transactions</h2>
                <ArrowRight className="h-4 w-4" />
              </div>

              <Card className="divide-y">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100" />
                      <div>
                        <p className="font-medium">{tx.name}</p>
                        <p className="text-sm text-muted-foreground">{tx.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-orange-500">{tx.status}</span>
                      <span className="text-sm text-muted-foreground">{tx.dueDate}</span>
                      <span className="font-medium">{tx.amount}</span>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}