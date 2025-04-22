import Link from 'next/link';

/**
 * Custom 404 Not Found page
 * 
 * This provides a better user experience for non-existent routes
 * and follows Next.js 15 best practices by using a server component.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-xl p-8 bg-slate-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="mb-4">The page you're looking for doesn't exist.</p>
        <Link 
          href="/" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
