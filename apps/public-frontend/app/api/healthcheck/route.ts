import { createSupabaseClient } from '@rallyround/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Health check endpoint to verify the application and its dependencies are running correctly
 * GET /api/healthcheck
 */
export async function GET() {
  try {
    // Check database connection via Supabase
    const supabase = createSupabaseClient();
    const { error: dbError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    // Create response object with status of each service
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: { status: 'ok' },
        database: { status: dbError ? 'error' : 'ok' },
      },
      version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
    };

    // If any service is down, return 503 Service Unavailable
    const isHealthy = Object.values(healthStatus.services).every(
      (service) => service.status === 'ok'
    );

    return NextResponse.json(
      healthStatus,
      { status: isHealthy ? 200 : 503 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
