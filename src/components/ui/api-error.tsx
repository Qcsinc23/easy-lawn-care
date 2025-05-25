'use client';

import React from 'react';
import { AlertCircle, Server, Database, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

/**
 * Error type definitions for API errors
 */
export interface ApiErrorProps {
  title?: string;
  message?: string;
  error?: Error | string | null;
  retry?: () => void;
  className?: string;
}

/**
 * ApiError component for displaying user-friendly error messages
 * 
 * Used to display error messages when API calls fail, with options to retry
 * or navigate to other pages. Provides clear, actionable messaging with
 * appropriate icons based on error type.
 */
export function ApiError({
  title = 'Something went wrong',
  message = 'We encountered an error while loading data. Please try again later.',
  error = null,
  retry,
  className = '',
}: ApiErrorProps) {
  // Attempt to detect the type of error for better messaging
  const errorMessage = error instanceof Error ? error.message : 
    typeof error === 'string' ? error : null;
  
  // Determine if this looks like a configuration error
  const isConfigError = errorMessage && 
    (errorMessage.includes('configuration') || 
     errorMessage.includes('env') || 
     errorMessage.includes('DATABASE_URL'));
  
  // Determine if this looks like a database error
  const isDatabaseError = errorMessage && 
    (errorMessage.includes('database') || 
     errorMessage.includes('connection') || 
     errorMessage.includes('prisma'));
  
  // Set appropriate icon based on error type
  const ErrorIcon = isConfigError ? Server : 
                    isDatabaseError ? Database : 
                    AlertCircle;
  
  return (
    <div className={`bg-red-50 border border-red-100 rounded-lg p-4 md:p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <ErrorIcon className="h-6 w-6 text-red-500 mr-3" />
        <h3 className="text-lg font-semibold text-red-700">
          {title}
        </h3>
      </div>
      
      <p className="text-red-600 mb-4">
        {message}
      </p>
      
      <div className="flex flex-wrap gap-3">
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 h-9 px-4 py-2"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </button>
        )}
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white border border-red-200 hover:bg-red-50 text-red-700 h-9 px-4 py-2"
        >
          Return Home
        </Link>
        
        {process.env.NODE_ENV === 'development' && errorMessage && (
          <div className="w-full mt-4 p-3 bg-gray-800 text-gray-200 rounded text-xs font-mono overflow-x-auto">
            <p className="mb-1 text-gray-400">Error Details (Development Only):</p>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Server configuration error variant
 */
export function ServerConfigurationError({ retry, className }: Pick<ApiErrorProps, 'retry' | 'className'>) {
  return (
    <ApiError
      title="Server Configuration Error"
      message="The server is missing required configuration. This is likely a temporary issue that the administrator is working to resolve."
      error="Server environment configuration issue"
      retry={retry}
      className={className}
    />
  );
}

/**
 * Database connection error variant
 */
export function DatabaseConnectionError({ retry, className }: Pick<ApiErrorProps, 'retry' | 'className'>) {
  return (
    <ApiError
      title="Database Connection Error"
      message="We're having trouble connecting to our database. Please try again later or contact support if the problem persists."
      error="Database connection issue"
      retry={retry}
      className={className}
    />
  );
}