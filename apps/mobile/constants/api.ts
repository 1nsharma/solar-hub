import Constants from 'expo-constants';
import { Platform } from 'react-native';

const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;

// Logic to extract host IP for physical devices running Expo Go
const getHostIp = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }
  return null;
};

const hostIp = getHostIp();
const DEFAULT_API_URL = Platform.OS === 'android' 
  ? (hostIp ? `http://${hostIp}:5001` : 'http://10.0.2.2:5001') 
  : (hostIp ? `http://${hostIp}:5001` : 'http://localhost:5001');

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || extraApiUrl || DEFAULT_API_URL;

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

