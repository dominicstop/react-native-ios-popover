import type { RNIBaseError, RNIBaseErrorCode } from 'react-native-ios-utilities';


export type RNIPopoverErrorCode = RNIBaseErrorCode
  | 'popoverAlreadyVisible'
  | 'popoverAlreadyHidden';


export type RNIPopoverError = RNIBaseError<RNIPopoverErrorCode>;