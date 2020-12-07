//
//  RCTPopoverViewModule.m
//  IosPopoverExample
//
//  Created by Dominic Go on 12/7/20.
//

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_REMAP_MODULE(PopoverModule, RCTPopoverViewModule, NSObject)

RCT_EXTERN_METHOD(setVisibility: (nonnull NSNumber *)node
                  visibility   : (nonnull BOOL     *)visibility
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject)

@end
