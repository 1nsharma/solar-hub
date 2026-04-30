import Constants from 'expo-constants';
import { Platform } from 'react-native';

const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;

// For Android Emulators, 10.0.2.2 points to the host machine's localhost
const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || extraApiUrl || DEFAULT_API_URL;

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}
