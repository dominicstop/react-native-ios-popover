//
//  UIPopoverArrowDirection+Helpers.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 12/6/20.
//

import Foundation

extension UIPopoverArrowDirection {
  /// create `UIPopoverArrowDirection` value from string
  init?(string: String){
    switch string {
      case "up"     : self = .up;
      case "down"   : self = .down;
      case "left"   : self = .left;
      case "right"  : self = .right;
      case "any"    : self = .any;
      case "unknown": self = .any;
      
      default: return nil;
    };
  };
  
  /// create `UIPopoverArrowDirection` value from string
  init?(string: String?){
    guard let string = string else { return nil };
    self.init(string: string)
  };
  
  /// create `UIPopoverArrowDirection` value from string array
  init?(stringValues: [String]){
    self.init(
      stringValues.compactMap {
        Self.init(string: $0)
      }
    );
  };
};
