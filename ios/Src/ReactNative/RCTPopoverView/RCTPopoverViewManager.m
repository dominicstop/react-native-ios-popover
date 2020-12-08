//
//  RCTPopoverViewManager.m
//  IosPopoverExample
//
//  Created by Dominic Go on 11/27/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>
 

@interface RCT_EXTERN_MODULE(RCTPopoverViewManager, RCTViewManager)

// ---------------------------
// MARK: Export Props - Events
// ---------------------------

RCT_EXPORT_VIEW_PROPERTY(onPopoverWillShow, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPopoverWillHide, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onPopoverDidShow, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPopoverDidHide, RCTBubblingEventBlock);

// ---------------------------
// MARK: Export Props - Values
// ---------------------------

RCT_EXPORT_VIEW_PROPERTY(popoverSize, NSString);
RCT_EXPORT_VIEW_PROPERTY(permittedArrowDirections, NSArray);
RCT_EXPORT_VIEW_PROPERTY(popoverBackgroundColor, NSNumber);

// --------------------------
// MARK: Export Props - Flags
// --------------------------

RCT_EXPORT_VIEW_PROPERTY(popoverShouldDismiss, BOOL);
RCT_EXPORT_VIEW_PROPERTY(popoverCanOverlapSourceViewRect, BOOL);


// ---------------------------
// MARK: View Manager Commands
// ---------------------------

RCT_EXTERN_METHOD(setVisibility: (nonnull NSNumber *)node
                  visibility   : (nonnull BOOL     *)visibility);

@end
