//
//  RNIContainerViewControllerEventsDelegate.swift
//  react-native-ios-popover
//
//  Created by Dominic Go on 3/11/22.
//

import Foundation


protocol RNIContainerViewControllerEventsDelegate: AnyObject {

  func onViewControllerWillDisappear(
    sender: RNIContextMenuViewController,
    parentVC: UIViewController,
    isBeingPopped: Bool
  );
  
  func onViewControllerDidDisappear(
    sender: RNIContextMenuViewController,
    parentVC: UIViewController,
    isBeingPopped: Bool
  );
};

// make protocol conformance optional by adding a default impl. that is empty
// w/o using `@objc`'s `optional` keyword.
extension RNIContainerViewControllerEventsDelegate {
  
  func onViewControllerWillDisappear(
    sender: RNIContextMenuViewController,
    parentVC: UIViewController?,
    isBeingPopped: Bool
  ) {
    /** no-op */
  };
  
  func onViewControllerDidDisappear(
    sender: RNIContextMenuViewController,
    parentVC: UIViewController?,
    isBeingPopped: Bool
  ) {
    /** no-op */
  };
};
