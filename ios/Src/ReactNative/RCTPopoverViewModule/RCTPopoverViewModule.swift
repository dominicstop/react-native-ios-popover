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
            "RCTPopoverViewModule: setVisibility"
          + " - guard check failed"
          + " - could not get `popoverView` instance"
        );
        
        // code, message, error
        reject("LIB_ERROR", errorMessage, NSError());
        return;
      };
      
      popoverView.setVisibility(visibility) {
        resolve([:]);
        print("setVisibility");
      };
    };
  };
};
