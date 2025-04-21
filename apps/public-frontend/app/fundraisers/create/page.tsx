import DashboardNav from '../../dashboard/dashboard-nav';
import FundraiserForm from './fundraiser-form';

export default function CreateFundraiserPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create Fundraiser</h1>
          <p className="mt-1 text-sm text-gray-500">
            Start a new fundraising campaign for your team or organization.
          </p>
        </div>
        
        <div className="mt-6">
          <FundraiserForm />
        </div>
      </main>
    </div>
  );
}
