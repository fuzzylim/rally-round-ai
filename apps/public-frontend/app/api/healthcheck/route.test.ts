import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from './route';
import { createSupabaseClient } from '@rallyround/auth';
import { NextResponse } from 'next/server';

// Mock dependencies
vi.mock('@rallyround/auth', () => ({
  createSupabaseClient: vi.fn(),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn().mockImplementation((body, options) => ({ 
      body, 
      ...options 
    })),
  },
}));

describe('Health Check API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 when all services are healthy', async () => {
    // Mock Supabase client
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      count: vi.fn(),
    };
    mockSupabase.from.mockReturnValue(mockSupabase);
    mockSupabase.select.mockReturnValue({ error: null });
    
    (createSupabaseClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    // Call the handler
    const response = await GET();

    // Verify response
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        services: {
          api: { status: 'ok' },
          database: { status: 'ok' },
        },
      }),
      { status: 200 }
    );
  });

  it('should return 503 when database is unhealthy', async () => {
    // Mock Supabase client with error
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      count: vi.fn(),
    };
    mockSupabase.from.mockReturnValue(mockSupabase);
    mockSupabase.select.mockReturnValue({ error: new Error('Database error') });
    
    (createSupabaseClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    // Call the handler
    const response = await GET();

    // Verify response
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        services: {
          api: { status: 'ok' },
          database: { status: 'error' },
        },
      }),
      { status: 503 }
    );
  });

  it('should return 500 when an unexpected error occurs', async () => {
    // Mock Supabase client that throws
    (createSupabaseClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    // Call the handler
    const response = await GET();

    // Verify response
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        error: 'Health check failed',
      }),
      { status: 500 }
    );
  });
});
