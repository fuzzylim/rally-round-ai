import SignupForm from './signup-form';
import Link from 'next/link';
import Image from 'next/image';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image 
              src="/heart-blue-pink.svg" 
              alt="" 
              width={32} 
              height={32} 
              className="h-8 w-8" 
            />
            <h1 className="text-3xl font-extrabold text-gradient tracking-tight">RallyRound</h1>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">Create a new account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-300 hover:text-white underline transition-colors duration-300">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 px-6 py-8 shadow-md rounded-lg">
          <SignupForm />
          <SocialLoginButtons className="mt-6" title="Or sign up with" />
        </div>
        
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>
            By signing up, you agree to our{' '}
            <Link href="/terms" className="font-medium text-blue-300 hover:text-white underline transition-colors duration-300">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="font-medium text-blue-300 hover:text-white underline transition-colors duration-300">
              Privacy Policy
            </Link>
          </p>
          <div className="mt-4">
            <Link href="/" className="font-medium text-blue-300 hover:text-white underline transition-colors duration-300">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
