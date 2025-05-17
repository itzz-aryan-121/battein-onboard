import { FiSave } from "react-icons/fi";

const SettingSection = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <div className="border-b border-gray-200 pb-8">
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
    {children}
  </div>
);

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your platform settings and configurations</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-8 space-y-8">
          <SettingSection
            title="Platform Settings"
            description="Configure general platform settings and behavior"
          >
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="platform-name" className="block text-sm font-medium text-gray-700">
                  Platform Name
                </label>
                <input
                  type="text"
                  id="platform-name"
                  defaultValue="Baatein"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="support-email" className="block text-sm font-medium text-gray-700">
                  Support Email
                </label>
                <input
                  type="email"
                  id="support-email"
                  defaultValue="support@baatein.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
            </div>
          </SettingSection>

          <SettingSection
            title="Call Settings"
            description="Configure call-related settings and parameters"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="min-call-duration" className="block text-sm font-medium text-gray-700">
                  Minimum Call Duration (minutes)
                </label>
                <input
                  type="number"
                  id="min-call-duration"
                  defaultValue={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="max-call-duration" className="block text-sm font-medium text-gray-700">
                  Maximum Call Duration (minutes)
                </label>
                <input
                  type="number"
                  id="max-call-duration"
                  defaultValue={60}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="base-rate" className="block text-sm font-medium text-gray-700">
                  Base Rate (₹/minute)
                </label>
                <input
                  type="number"
                  id="base-rate"
                  defaultValue={25}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="commission-rate" className="block text-sm font-medium text-gray-700">
                  Platform Commission (%)
                </label>
                <input
                  type="number"
                  id="commission-rate"
                  defaultValue={20}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
            </div>
          </SettingSection>

          <SettingSection
            title="Partner Settings"
            description="Configure partner-related settings and requirements"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="min-age" className="block text-sm font-medium text-gray-700">
                  Minimum Partner Age
                </label>
                <input
                  type="number"
                  id="min-age"
                  defaultValue={18}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Required Documents</label>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="id-proof"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="id-proof" className="font-medium text-gray-700">
                        Government ID Proof
                      </label>
                      <p className="text-gray-500">Aadhar Card, PAN Card, or Voter ID</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="address-proof"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="address-proof" className="font-medium text-gray-700">
                        Address Proof
                      </label>
                      <p className="text-gray-500">Utility Bill or Rental Agreement</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="bank-details"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="bank-details" className="font-medium text-gray-700">
                        Bank Account Details
                      </label>
                      <p className="text-gray-500">Bank Statement or Cancelled Cheque</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SettingSection>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <FiSave className="mr-2 -ml-1 h-5 w-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 