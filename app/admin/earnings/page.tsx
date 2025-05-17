import { FiDollarSign, FiTrendingUp, FiUsers, FiClock } from "react-icons/fi";

const StatCard = ({ icon: Icon, title, value, change }: { icon: any; title: string; value: string; change: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className={`text-sm mt-1 ${change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{change}</p>
      </div>
      <div className="bg-purple-100 p-3 rounded-lg">
        <Icon className="text-purple-600 text-xl" />
      </div>
    </div>
  </div>
);

const EarningRow = ({ partner, calls, duration, earnings, commission }: { 
  partner: string;
  calls: number;
  duration: string;
  earnings: string;
  commission: string;
}) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-600 font-medium">{partner?.charAt?.(0) || ''}</span>
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">{partner}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calls}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{duration}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earnings}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission}</td>
  </tr>
);

export default function EarningsPage() {
  const stats = [
    { icon: FiDollarSign, title: "Total Revenue", value: "₹8.2L", change: "+15% from last month" },
    { icon: FiTrendingUp, title: "Average Earnings/Call", value: "₹250", change: "+8% from last month" },
    { icon: FiUsers, title: "Active Partners", value: "1,234", change: "+12% from last month" },
    { icon: FiClock, title: "Total Call Hours", value: "2,450", change: "+5% from last month" },
  ];

  const topEarners = [
    { partner: "Priya Singh", calls: 320, duration: "96h 15m", earnings: "₹45,000", commission: "₹9,000" },
    { partner: "Rahul Kumar", calls: 280, duration: "84h 30m", earnings: "₹38,500", commission: "₹7,700" },
    { partner: "Vikram Sharma", calls: 410, duration: "123h 45m", earnings: "₹52,000", commission: "₹10,400" },
    { partner: "Neha Gupta", calls: 305, duration: "91h 30m", earnings: "₹41,200", commission: "₹8,240" },
    { partner: "Anita Patel", calls: 95, duration: "28h 30m", earnings: "₹12,000", commission: "₹2,400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Financial statistics and partner earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            {/* Placeholder for revenue chart */}
            <p className="text-gray-400">Revenue Chart Coming Soon</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            {/* Placeholder for earnings trend chart */}
            <p className="text-gray-400">Earnings Trend Chart Coming Soon</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Earning Partners</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Calls
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Earnings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform Commission
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topEarners.map((earner, index) => (
                <EarningRow key={index} {...earner} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 