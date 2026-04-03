// Environment configuration
export const env = {
  // API URLs
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn',
  
  // Domain URLs
  domainUrl: process.env.NEXT_PUBLIC_DOMAIN_URL || process.env.DOMAIN_URL || 'http://localhost:3000',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Helper function to get API endpoint
export const getApiEndpoint = (endpoint: string) => {
  return `${env.apiBaseUrl}${endpoint}`;
};

// Helper function to get domain URL
export const getDomainUrl = (path?: string) => {
  return path ? `${env.domainUrl}${path}` : env.domainUrl;
};
