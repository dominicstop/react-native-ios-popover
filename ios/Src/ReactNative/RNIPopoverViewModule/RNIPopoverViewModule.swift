//
//  RCTPopoverViewModule.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 12/7/20.
//

import Foundation

@objc(RNIPopoverViewModule)
class RNIPopoverViewModule: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false;
  };
  
  @objc func setVisibility(
    _ node    : NSNumber,
    visibility: Bool,
    resolve   : @escaping RCTPromiseResolveBlock,
    reject    : @escaping RCTPromiseRejectBlock
  ) {
    
    DispatchQueue.main.async {
      guard let bridge = RNIPopoverViewManager.sharedBridge,
            let view   = bridge.uiManager?.view(forReactTag: node),
            let popoverView = view as? RNIPopoverView
      else {
        let errorMessage = (
            "RNIPopoverViewModule: setVisibility(\(visibility))"
          + " - guard check failed"
          + " - could not get `popoverView` instance"
        );
        
        // code, message, error
        reject("LIB_ERROR", errorMessage, nil);
        return;
      };
      
      popoverView.setVisibility(visibility) { success, message in
        #if DEBUG
        print("RNIPopoverViewModule, setVisibility: \(visibility)");
        #endif
        
        if success {
          resolve([:]);
          
        } else {
          let errorMessage = (
            "RNIPopoverViewModule: setVisibility(\(visibility))"
            + " - failed: \(message ?? "N/A")"
          );
          
          // code, message, error
          reject("LIB_ERROR", errorMessage, nil);
        };
      };
    };
  };
  
  @objc func getVisibility(
    _ node : NSNumber,
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ) {
    
    DispatchQueue.main.async {
      guard let bridge = RNIPopoverViewManager.sharedBridge,
            let view   = bridge.uiManager?.view(forReactTag: node),
            let popoverView = view as? RNIPopoverView
      else {
        let errorMessage = (
            "RNIPopoverViewModule: getVisibility()"
          + " - guard check failed"
          + " - could not get `popoverView` instance"
        );
        
        // code, message, error
        reject("LIB_ERROR", errorMessage, nil);
        return;
      };
      
      #if DEBUG
      print("RNIPopoverViewModule, getVisibility: \(popoverView.isPopoverVisible)");
      #endif
      
      resolve(popoverView.isPopoverVisible);
    };
  };
};
