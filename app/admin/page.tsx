import { FiUsers, FiPhone, FiDollarSign, FiTrendingUp } from "react-icons/fi";

const StatCard = ({ icon: Icon, title, value, change }: { icon: any; title: string; value: string; change: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-green-500 text-sm mt-1">{change}</p>
      </div>
      <div className="bg-purple-100 p-3 rounded-lg">
        <Icon className="text-purple-600 text-xl" />
      </div>
    </div>
  </div>
);

const PartnerRow = ({ name, status, earnings, calls, rating }: { name: string; status: string; earnings: string; calls: number; rating: number }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-10 w-10 flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-medium">{name?.charAt?.(0) || ''}</span>
          </div>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{name}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earnings}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calls}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rating}/5</td>
  </tr>
);

export default function AdminDashboard() {
  const stats = [
    { icon: FiUsers, title: "Total Partners", value: "1,234", change: "+12% from last month" },
    { icon: FiPhone, title: "Total Calls", value: "45.2K", change: "+8% from last month" },
    { icon: FiDollarSign, title: "Revenue", value: "₹8.2L", change: "+15% from last month" },
    { icon: FiTrendingUp, title: "Avg. Call Duration", value: "18:30", change: "+5% from last month" },
  ];

  // const partners = [
  //   { name: "Priya Singh", status: "Active", earnings: "₹45,000", calls: 320, rating: 4.8 },
  //   { name: "Rahul Kumar", status: "Active", earnings: "₹38,500", calls: 280, rating: 4.6 },
  //   { name: "Anita Patel", status: "Inactive", earnings: "₹12,000", calls: 95, rating: 4.2 },
  //   { name: "Vikram Sharma", status: "Active", earnings: "₹52,000", calls: 410, rating: 4.9 },
  //   { name: "Neha Gupta", status: "Active", earnings: "₹41,200", calls: 305, rating: 4.7 },
  // ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Partners</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calls
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            {/* <tbody className="bg-white divide-y divide-gray-200">
              {partners.map((partner, index) => (
                <PartnerRow key={index} {...partner} />
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
    </div>
  );
} 