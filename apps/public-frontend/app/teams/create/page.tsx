import DashboardNav from '../../dashboard/dashboard-nav';
import TeamForm from './team-form';

export default function CreateTeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create Team</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new team to manage members, organize events, and raise funds.
          </p>
        </div>
        
        <div className="mt-6">
          <TeamForm />
        </div>
      </main>
    </div>
  );
}
