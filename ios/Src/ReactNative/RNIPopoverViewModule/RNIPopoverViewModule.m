//
//  RCTPopoverViewModule.m
//  IosPopoverExample
//
//  Created by Dominic Go on 12/7/20.
//

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNIPopoverViewModule, NSObject)

RCT_EXTERN_METHOD(setVisibility: (nonnull NSNumber *)node
                  visibility   : (nonnull BOOL     *)visibility
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);


RCT_EXTERN_METHOD(getVisibility: (nonnull NSNumber *)node
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

@end
