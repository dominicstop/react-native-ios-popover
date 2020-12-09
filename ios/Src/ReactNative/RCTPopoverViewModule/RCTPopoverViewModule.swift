//
//  RCTPopoverViewModule.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 12/7/20.
//

import Foundation

@objc(RCTPopoverViewModule)
class RCTPopoverViewModule: NSObject {
  
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
      guard let bridge = RCTPopoverViewManager.sharedBridge,
            let view   = bridge.uiManager?.view(forReactTag: node),
            let popoverView = view as? RCTPopoverView
      else {
        let errorMessage = (
            "RCTPopoverViewModule: setVisibility(\(visibility))"
          + " - guard check failed"
          + " - could not get `popoverView` instance"
        );
        
        // code, message, error
        reject("LIB_ERROR", errorMessage, nil);
        return;
      };
      
      popoverView.setVisibility(visibility) { success, message in
        #if DEBUG
        print("RCTPopoverViewModule, setVisibility: \(visibility)");
        #endif
        
        if success {
          resolve([:]);
          
        } else {
          let errorMessage = (
            "RCTPopoverViewModule: setVisibility(\(visibility))"
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
      guard let bridge = RCTPopoverViewManager.sharedBridge,
            let view   = bridge.uiManager?.view(forReactTag: node),
            let popoverView = view as? RCTPopoverView
      else {
        let errorMessage = (
            "RCTPopoverViewModule: getVisibility()"
          + " - guard check failed"
          + " - could not get `popoverView` instance"
        );
        
        // code, message, error
        reject("LIB_ERROR", errorMessage, nil);
        return;
      };
      
      #if DEBUG
      print("RCTPopoverViewModule, getVisibility: \(popoverView.isPopoverVisible)");
      #endif
      
      resolve(popoverView.isPopoverVisible);
    };
  };
};
