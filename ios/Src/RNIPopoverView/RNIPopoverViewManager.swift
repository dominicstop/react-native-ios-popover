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
  
  override static func requiresMainQueueSetup() -> Bool {
    return true;
  };
  
  override func view() -> UIView! {
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
