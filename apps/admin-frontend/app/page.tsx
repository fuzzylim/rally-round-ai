import Link from 'next/link';
import { Button } from '@rallyround/ui';

export default function AdminDashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-5">
          <h1 className="text-2xl font-bold">RallyRound Admin</h1>
        </div>
        <nav className="mt-5">
          <ul className="space-y-2">
            <li>
              <Link href="/admin/dashboard" className="block px-5 py-3 bg-gray-900 text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/fundraisers" className="block px-5 py-3 hover:bg-gray-700 transition-colors">
                Fundraisers
              </Link>
            </li>
            <li>
              <Link href="/admin/competitions" className="block px-5 py-3 hover:bg-gray-700 transition-colors">
                Competitions
              </Link>
            </li>
            <li>
              <Link href="/admin/teams" className="block px-5 py-3 hover:bg-gray-700 transition-colors">
                Teams
              </Link>
            </li>
            <li>
              <Link href="/admin/members" className="block px-5 py-3 hover:bg-gray-700 transition-colors">
                Members
              </Link>
            </li>
            <li>
              <Link href="/admin/organizations" className="block px-5 py-3 hover:bg-gray-700 transition-colors">
                Organizations
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="block px-5 py-3 hover:bg-gray-700 transition-colors">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Admin User</p>
                <p className="text-sm font-medium">admin@rallyround.com</p>
              </div>
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Fundraisers</h3>
              <p className="text-3xl font-bold">23</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500 font-medium">↑ 7%</span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Funds Raised</h3>
              <p className="text-3xl font-bold">$45,892</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500 font-medium">↑ 12%</span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Teams</h3>
              <p className="text-3xl font-bold">156</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500 font-medium">↑ 3%</span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Members</h3>
              <p className="text-3xl font-bold">2,543</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500 font-medium">↑ 9%</span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Fundraisers</h3>
                <Button variant="link">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">Spring Tournament</td>
                      <td className="px-4 py-3 whitespace-nowrap">$10,000</td>
                      <td className="px-4 py-3 whitespace-nowrap">$8,234</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">New Equipment</td>
                      <td className="px-4 py-3 whitespace-nowrap">$5,000</td>
                      <td className="px-4 py-3 whitespace-nowrap">$4,890</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">Travel Fund</td>
                      <td className="px-4 py-3 whitespace-nowrap">$15,000</td>
                      <td className="px-4 py-3 whitespace-nowrap">$7,342</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">New Gym Floor</td>
                      <td className="px-4 py-3 whitespace-nowrap">$25,000</td>
                      <td className="px-4 py-3 whitespace-nowrap">$25,000</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">Coaching Program</td>
                      <td className="px-4 py-3 whitespace-nowrap">$8,000</td>
                      <td className="px-4 py-3 whitespace-nowrap">$0</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Draft</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Competitions</h3>
                <Button variant="link">View All</Button>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Regional Championship</h4>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      May 15-17, 2025
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">32 teams registered</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-sm text-gray-500">Location: Springfield Sports Center</div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Summer Invitational</h4>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      June 8-10, 2025
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">18 teams registered</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-sm text-gray-500">Location: Riverfront Courts</div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Youth Golf Tournament</h4>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      June 22, 2025
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">45 participants registered</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-sm text-gray-500">Location: Greenview Country Club</div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Cross Country Meet</h4>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      July 8, 2025
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">12 schools participating</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-sm text-gray-500">Location: Maple Ridge Park</div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
