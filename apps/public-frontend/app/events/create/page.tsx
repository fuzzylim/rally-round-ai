import EventForm from './event-form';

export const metadata = {
  title: 'Quick Event Setup | RallyRound',
  description: 'Spend 2 minutes here, hours with your mates',
};

export default function CreateEventPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Quick Event Setup</h1>
        <p className="mt-2 text-slate-400">
          Two-minute organisation, hours of real-life fun. Set up your meet-up below.
        </p>
      </div>
      
      <div className="mt-6">
        <EventForm />
      </div>
    </div>
  );
}
