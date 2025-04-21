import AdminLoginForm from './login-form';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">RallyRound</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>
        
        <div className="bg-white px-6 py-8 shadow rounded-lg">
          <AdminLoginForm />
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            This area is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
