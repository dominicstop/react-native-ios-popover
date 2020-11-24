import { NativeModules } from 'react-native';

type IosPopoverType = {
  multiply(a: number, b: number): Promise<number>;
};

const { IosPopover } = NativeModules;

export default IosPopover as IosPopoverType;
