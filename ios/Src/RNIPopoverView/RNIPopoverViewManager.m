//
//  RCTPopoverViewManager.m
//  IosPopoverExample
//
//  Created by Dominic Go on 11/27/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>
 

@interface RCT_EXTERN_MODULE(RNIPopoverViewManager, RCTViewManager)

// ---------------------------
// MARK: Export Props - Events
// ---------------------------

RCT_EXPORT_VIEW_PROPERTY(onPopoverWillShow, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPopoverWillHide, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onPopoverDidShow, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPopoverDidHide, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onPopoverWillHideViaTap, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPopoverDidHideViaTap , RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onPopoverDidAttemptToDismiss, RCTBubblingEventBlock);

// ---------------------------
// MARK: Export Props - Values
// ---------------------------

RCT_EXPORT_VIEW_PROPERTY(popoverSize, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(permittedArrowDirections, NSArray);
RCT_EXPORT_VIEW_PROPERTY(popoverBackgroundColor, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(internalCleanupMode, NSString);

RCT_EXPORT_VIEW_PROPERTY(popoverShouldDismiss, BOOL);
RCT_EXPORT_VIEW_PROPERTY(popoverCanOverlapSourceViewRect, BOOL);

@end
