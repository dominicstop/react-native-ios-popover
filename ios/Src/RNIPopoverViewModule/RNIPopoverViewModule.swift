//
//  RCTPopoverViewModule.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 12/7/20.
//

import Foundation

@objc(RNIPopoverViewModule)
class RNIPopoverViewModule: NSObject {
  
  @objc var bridge: RCTBridge!;
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false;
  };
  
  private func getInstance(
    _ node: NSNumber,
    _ errorPrefix: String,
    _ reject: @escaping RCTPromiseRejectBlock
  ) -> (bridge: RCTBridge, popoverView: RNIPopoverView)? {
      
    guard let bridge = self.bridge else {
      reject(
        RNIPopoverErrorCode.libraryError.rawValue,
        "\(errorPrefix) - guard check failed - bridge not initialized",
        nil
      );
      return nil;
    };
    
    guard let view = bridge.uiManager?.view(forReactTag: node),
          let popoverView = view as? RNIPopoverView
    else {
      reject(
        RNIPopoverErrorCode.invalidReactTag.rawValue,
        "\(errorPrefix) - guard check failed - could not get `popoverView` instance",
        nil
      );
      return nil;
    };
      
    return (bridge, popoverView);
  };
  
  @objc func setVisibility(
    _ node    : NSNumber,
    visibility: Bool,
    resolve   : @escaping RCTPromiseResolveBlock,
    reject    : @escaping RCTPromiseRejectBlock
  ) {
    
    DispatchQueue.main.async {
      let errorPrefix = "RNIPopoverViewModule: setVisibility(\(visibility))";
      
      guard let (_, popoverView) = self.getInstance(node, errorPrefix, reject)
      else { return };
      
      popoverView.setVisibility(visibility) { success, error in
        #if DEBUG
        print("RNIPopoverViewModule, setVisibility: \(visibility)");
        #endif
        
        if success {
          resolve([:]);
          
        } else {
          let errorCode = error?.code ?? .unknownError;
          let errorMessage = "\(errorPrefix) - failed: \(error?.message ?? "N/A")";
          
          // code, message, error
          reject(errorCode.rawValue, errorMessage, nil);
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
      let errorPrefix = "RNIPopoverViewModule: getVisibility()";
      
      guard let (_, popoverView) = self.getInstance(node, errorPrefix, reject)
      else { return };
      
      #if DEBUG
      print("RNIPopoverViewModule, getVisibility: \(popoverView.isPopoverVisible)");
      #endif
      
      resolve(popoverView.isPopoverVisible);
    };
  };
};
