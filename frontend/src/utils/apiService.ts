
// API service for communicating with FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Generic function to fetch data from the API
 */
export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.detail || 'An error occurred while fetching data' };
    }

    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    return { error: 'Network error' };
  }
}

/**
 * Fetch portfolio data from the API
 */
export const fetchPortfolioData = async () => {
  return fetchFromApi('/portfolio');
};

/**
 * Submit API keys to the backend
 */
export const submitApiKeys = async (exchangeData: any) => {
  return fetchFromApi('/connect-exchange', {
    method: 'POST',
    body: JSON.stringify(exchangeData),
  });
};

/**
 * Fetch analytics data 
 */
export const fetchAnalytics = async (timeframe: string = '7d') => {
  return fetchFromApi(`/analytics?timeframe=${timeframe}`);
};
