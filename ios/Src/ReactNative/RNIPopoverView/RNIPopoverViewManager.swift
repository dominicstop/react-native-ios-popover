//
//  RCTPopoverViewManager.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 11/27/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

@objc(RNIPopoverViewManager)
class RNIPopoverViewManager: RCTViewManager {
  
  static var sharedBridge: RCTBridge? {
    didSet {
      #if DEBUG
      print("RCTPopoverView, sharedBridge: didSet");
      NotificationCenter.default.addObserver(RNIPopoverViewManager.self,
        selector: #selector(Self.resetSharedBridge),
        name: NSNotification.Name(rawValue: "RCTBridgeWillReloadNotification"),
        object: nil
      );
      #endif
    }
  };
  
  /// invalidate RCTBridge instance
  @objc static func resetSharedBridge() {
    #if DEBUG
    print("RCTPopoverView: resetSharedBridge...");
    #endif
    Self.sharedBridge = nil;
  };
    
  override static func requiresMainQueueSetup() -> Bool {
    return true;
  };
  
  override func view() -> UIView! {
    if Self.sharedBridge == nil {
      Self.sharedBridge = self.bridge;
    };
    
    return RNIPopoverView(bridge: self.bridge);
  };
  
  @objc func setVisibility(_ node: NSNumber, visibility: Bool){
    DispatchQueue.main.async {
      guard let view = self.bridge.uiManager.view(forReactTag: node),
            let popoverView = view as? RNIPopoverView
      else { return };
      
      popoverView.setVisibility(visibility);
    };
  };
};
