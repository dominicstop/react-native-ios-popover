//
//  RCTPopoverViewManager.m
//  IosPopoverExample
//
//  Created by Dominic Go on 11/27/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>
 

@interface RCT_EXTERN_MODULE(RCTPopoverViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(popoverSize, NSString);
RCT_EXPORT_VIEW_PROPERTY(popoverBackgroundColor, NSNumber);

// ---------------------------
// MARK: View Manager Commands
// ---------------------------

RCT_EXTERN_METHOD(setVisibility:(nonnull NSNumber *)node);

@end
