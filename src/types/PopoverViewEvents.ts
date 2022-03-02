import type { NativeSyntheticEvent } from "react-native";

// Event Object Types
// ------------------

export type OnPopoverDidHideEventObject = NativeSyntheticEvent<{
}>;

export type OnPopoverWillShowEventObject = NativeSyntheticEvent<{
}>;

export type OnPopoverWillHideEventObject = NativeSyntheticEvent<{
}>;

export type OnPopoverDidShowEventObject = NativeSyntheticEvent<{
}>;

export type OnPopoverDidHideViaTapEventObject = NativeSyntheticEvent<{
}>;

export type OnPopoverWillHideViaTapEventObject = NativeSyntheticEvent<{
}>;

export type OnPopoverDidAttemptToDismissEventObject = NativeSyntheticEvent<{
}>;

// Event Handler Types
// -------------------

export type OnPopoverDidHideEvent = (
  event: OnPopoverDidHideEventObject
) => void;

export type OnPopoverWillShowEvent = (
  event: OnPopoverWillShowEventObject
) => void;

export type OnPopoverWillHideEvent = (
  event: OnPopoverWillHideEventObject
) => void;

export type OnPopoverDidShowEvent = (
  event: OnPopoverDidShowEventObject
) => void;

export type OnPopoverDidHideViaTapEvent = (
  event: OnPopoverDidHideViaTapEventObject
) => void;

export type OnPopoverWillHideViaTapEvent = (
  event: OnPopoverWillHideViaTapEventObject
) => void;

export type OnPopoverDidAttemptToDismissEvent = (
  event: OnPopoverDidAttemptToDismissEventObject
) => void;
