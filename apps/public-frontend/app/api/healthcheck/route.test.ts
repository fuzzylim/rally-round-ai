import { GET } from './route';
import { createSupabaseClient } from '@rallyround/auth';
import { NextResponse } from 'next/server';

// Mock dependencies
jest.mock('@rallyround/auth', () => ({
  createSupabaseClient: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, options) => ({ 
      body, 
      ...options 
    })),
  },
}));

describe('Health Check API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 when all services are healthy', async () => {
    // Mock Supabase client
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      count: jest.fn(),
    };
    mockSupabase.from.mockReturnValue(mockSupabase);
    mockSupabase.select.mockReturnValue({ error: null });
    
    (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

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
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      count: jest.fn(),
    };
    mockSupabase.from.mockReturnValue(mockSupabase);
    mockSupabase.select.mockReturnValue({ error: new Error('Database error') });
    
    (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);

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
    (createSupabaseClient as jest.Mock).mockImplementation(() => {
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
