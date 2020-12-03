//
//  RCTPopoverViewManager.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 11/27/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

@objc(RCTPopoverViewManager)
class RCTPopoverViewManager: RCTViewManager {
    
  override static func requiresMainQueueSetup() -> Bool {
    return true;
  };
  
  override func view() -> UIView! {
    return RCTPopoverView(bridge: self.bridge);
  };
  
  @objc func setVisibility(_ node: NSNumber){
    DispatchQueue.main.async {
      guard let view = self.bridge.uiManager.view(forReactTag: node),
            let popoverView = view as? RCTPopoverView
      else { return };
      
      popoverView.setVisibility(true);
    };
  };
};
