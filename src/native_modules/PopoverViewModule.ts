import { NativeModules } from 'react-native';


interface RNIPopoverViewModule {
  setVisibility(node: number, visibility: boolean): void;
  getVisibility(node: number): Promise<boolean>;
};

const MODULE_NAME = "PopoverModule";

export const RNIPopoverViewModule: RNIPopoverViewModule =
  NativeModules[MODULE_NAME];