//
//  RCTPopoverTypes.swift
//  IosPopoverExample
//
//
//  Created by Dominic Go on 12/6/20.

import Foundation

enum RCTPopoverSize {
  case INHERIT;
  case STRETCH;
  case CUSTOM(width: CGFloat, height: CGFloat);
  
  static let stringMap: [String: RCTPopoverSize] = [
    "INHERIT": .INHERIT,
    "STRETCH": .STRETCH,
  ];
  
  init?(string: String){
    guard let match = Self.stringMap[string.uppercased()]
    else { return nil };
    
    self = match;
  };
};
