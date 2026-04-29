import Constants from 'expo-constants';

const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || extraApiUrl || 'http://localhost:5000';

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}
