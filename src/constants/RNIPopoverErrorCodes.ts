import { RNIBaseErrorCodes, RNIBaseErrorCode } from "react-native-ios-utilities";
import type { RNIPopoverErrorCode } from "src/types/RNIPopoverError";


export const RNIPopoverErrorCodes: {
  [key in RNIPopoverErrorCode]: key;
} = {
  ...RNIBaseErrorCodes as {
    [key in RNIBaseErrorCode]: key
  },
  popoverAlreadyHidden: 'popoverAlreadyHidden',
  popoverAlreadyVisible: 'popoverAlreadyVisible'
};