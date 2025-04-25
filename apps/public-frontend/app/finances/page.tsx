import Link from 'next/link';
import { Button } from '@rallyround/ui';

export const metadata = {
  title: 'Club Finances | RallyRound',
  description: 'Sort your club money matters quickly and spend more time together',
};

// Simulated finance data - in a real app, this would be fetched from Supabase
const financeItems = [
  {
    id: '1',
    title: 'Monthly Membership Fees',
    amount: '$450.00',
    date: '2025-04-15',
    type: 'Income',
    status: 'Completed',
    club: 'Inner City Book Club'
  },
  {
    id: '2',
    title: 'Venue Booking Deposit',
    amount: '$200.00',
    date: '2025-04-22',
    type: 'Expense',
    status: 'Pending',
    club: 'Inner City Book Club'
  },
  {
    id: '3',
    title: 'Camping Gear Purchase',
    amount: '$375.50',
    date: '2025-04-10',
    type: 'Expense',
    status: 'Completed',
    club: 'Urban Bushwalkers'
  },
];

export default function FinancesPage() {
  return (
    <div className="bg-slate-950">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Club Finances</h1>
            <p className="mt-2 text-slate-400">
              Sort the money stuff in minutes, not hours. More time with mates, less time with spreadsheets.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/finances/new-transaction">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                New Transaction
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Financial Snapshot - Get Back to Real Life */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-lg p-5 shadow-md">
            <h3 className="text-lg font-medium text-white">Cash on Hand</h3>
            <p className="mt-1 text-3xl font-semibold text-gradient">$1,875.50</p>
            <div className="mt-2 text-sm text-slate-400">
              Updated: 25 April 2025
            </div>
          </div>
          
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-lg p-5 shadow-md">
            <h3 className="text-lg font-medium text-white">Money In</h3>
            <p className="mt-1 text-3xl font-semibold text-blue-400">$750.00</p>
            <div className="mt-2 text-sm text-slate-400">
              <span className="text-green-400">↑ 12%</span> better than last month
            </div>
          </div>
          
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-lg p-5 shadow-md">
            <h3 className="text-lg font-medium text-white">Money Out</h3>
            <p className="mt-1 text-3xl font-semibold text-indigo-400">$575.50</p>
            <div className="mt-2 text-sm text-slate-400">
              <span className="text-red-400">↑ 5%</span> more than last month
            </div>
          </div>
        </div>

        {/* At-a-Glance Progress */}
        <div className="mt-8 bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-lg p-5 shadow-md">
          <h3 className="text-lg font-medium text-white">Quick Budget Check</h3>
          <p className="text-sm text-slate-400 mt-1 mb-3">See where you stand and get back to what matters</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-white">Meet-up Budget</span>
                <span className="text-sm font-medium text-white">65%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-white">Camping Gear Fund</span>
                <span className="text-sm font-medium text-white">40%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white">Latest Money Moves</h2>
          <p className="text-sm text-slate-400 mt-1">Quick review, then back to enjoying your club activities</p>
          <div className="mt-4 bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {financeItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white">{item.title}</div>
                            <div className="text-sm text-slate-400">{item.club}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${item.type === 'Income' ? 'text-green-400' : 'text-red-400'}`}>
                          {item.type === 'Income' ? '+' : '-'}{item.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'Income' 
                          ? 'bg-green-900/50 text-green-200' 
                          : 'bg-red-900/50 text-red-200'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Completed' 
                          ? 'bg-blue-900/50 text-blue-200'
                          : 'bg-yellow-900/50 text-yellow-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
