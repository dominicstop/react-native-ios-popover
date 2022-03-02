import { Platform } from 'react-native';

// @ts-ignore
export const IOS_VERSION = parseInt(Platform.Version, 10);

export const IS_PLATFORM_IOS = (Platform.OS === 'ios');