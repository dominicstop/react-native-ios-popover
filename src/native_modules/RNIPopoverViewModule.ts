import { NativeModules } from 'react-native';
import type { RNIJSComponentWillUnmountNotifiable } from 'react-native-ios-utilities';



interface RNIPopoverViewModule extends RNIJSComponentWillUnmountNotifiable {
  setVisibility(node: number, visibility: boolean): Promise<void>;

  getVisibility(node: number): Promise<boolean>;
};

const MODULE_NAME = "RNIPopoverViewModule";

export const RNIPopoverViewModule: RNIPopoverViewModule =
  NativeModules[MODULE_NAME];