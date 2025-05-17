import { FiFilter, FiDownload } from "react-icons/fi";

interface CallLog {
  id: string;
  partnerId: string;
  partnerName: string;
  duration: string;
  startTime: string;
  endTime: string;
  status: string;
  earnings: string;
}

const CallLogRow = ({ log }: { log: CallLog }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.id}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-600 font-medium">{log?.partnerName?.charAt?.(0) || ''}</span>
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">{log.partnerName}</div>
          <div className="text-sm text-gray-500">ID: {log.partnerId}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.duration}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div>{log.startTime}</div>
      <div className="text-xs text-gray-400">to {log.endTime}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        log.status === "Completed" ? "bg-green-100 text-green-800" : 
        log.status === "Missed" ? "bg-red-100 text-red-800" : 
        "bg-yellow-100 text-yellow-800"
      }`}>
        {log.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.earnings}</td>
  </tr>
);

export default function CallsPage() {
  const callLogs: CallLog[] = [
    {
      id: "CALL-001",
      partnerId: "PTR-123",
      partnerName: "Priya Singh",
      duration: "18:45",
      startTime: "2024-03-20 14:30",
      endTime: "2024-03-20 14:49",
      status: "Completed",
      earnings: "₹450",
    },
    {
      id: "CALL-002",
      partnerId: "PTR-124",
      partnerName: "Rahul Kumar",
      duration: "12:20",
      startTime: "2024-03-20 15:00",
      endTime: "2024-03-20 15:12",
      status: "Completed",
      earnings: "₹310",
    },
    {
      id: "CALL-003",
      partnerId: "PTR-125",
      partnerName: "Anita Patel",
      duration: "00:00",
      startTime: "2024-03-20 15:30",
      endTime: "2024-03-20 15:30",
      status: "Missed",
      earnings: "₹0",
    },
    {
      id: "CALL-004",
      partnerId: "PTR-126",
      partnerName: "Vikram Sharma",
      duration: "25:15",
      startTime: "2024-03-20 16:00",
      endTime: "2024-03-20 16:25",
      status: "Completed",
      earnings: "₹630",
    },
    {
      id: "CALL-005",
      partnerId: "PTR-127",
      partnerName: "Neha Gupta",
      duration: "05:40",
      startTime: "2024-03-20 16:45",
      endTime: "2024-03-20 16:51",
      status: "Terminated",
      earnings: "₹140",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call History</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage all call records</p>
        </div>
        <div className="flex space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <FiFilter className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
            <FiDownload className="mr-2 -ml-1 h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Call ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {callLogs.map((log) => (
                <CallLogRow key={log.id} log={log} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 