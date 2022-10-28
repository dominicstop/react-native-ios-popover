import type { ViewProps } from "react-native";
import type { RNIPopoverViewProps } from "../../native_components/RNIPopoverView";


export type PopoverViewProps = ViewProps & Partial<Pick<RNIPopoverViewProps,
  | 'permittedArrowDirections'
  | 'popoverSize'
  | 'popoverShouldDismiss'
  | 'popoverCanOverlapSourceViewRect'
  | 'internalCleanupMode'
  // events
  | 'onPopoverDidHide'
  | 'onPopoverWillShow'
  | 'onPopoverWillHide'
  | 'onPopoverDidShow'
  | 'onPopoverDidHideViaTap'
  | 'onPopoverWillHideViaTap'
  | 'onPopoverDidAttemptToDismiss'

>> & {
  popoverBackgroundColor?: string;
  lazyPopover?: boolean;
  renderPopoverContent: () => React.ReactElement;
};

export type PopoverViewState = {
  mountPopover: boolean;
};