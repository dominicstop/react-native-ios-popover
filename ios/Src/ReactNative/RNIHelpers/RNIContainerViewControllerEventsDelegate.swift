//
//  RNIContainerViewControllerEventsDelegate.swift
//  react-native-ios-popover
//
//  Created by Dominic Go on 3/11/22.
//

import Foundation


protocol RNIContainerViewControllerEventsDelegate: AnyObject {

  func onViewControllerWillDisappear(
    sender: RNIContainerViewControllerEventsDelegate
  );
  
  func onViewControllerDidDisappear(
    sender: RNIContainerViewControllerEventsDelegate
  );
  
};
