import SignupForm from './signup-form';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">RallyRound</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Create a new account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="bg-white px-6 py-8 shadow rounded-lg">
          <SignupForm />
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By signing up, you agree to our{' '}
            <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
          <div className="mt-4">
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
