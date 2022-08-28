//
//  RNIPopoverError.swift
//  react-native-ios-popover
//
//  Created by Dominic Go on 3/11/22.
//

import Foundation;
import react_native_ios_utilities;

enum RNIPopoverErrorCode:
  String, Codable, CaseIterable, RNIGenericErrorDefaultable {
  
  // default errors
  case runtimeError,
       libraryError,
       reactError,
       unknownError,
       invalidArgument,
       outOfBounds,
       invalidReactTag,
       nilValue;
};


class RNIPopoverGenericError: RNIBaseError<RNIGenericErrorCodes> {
  
  init(
    code: RNIGenericErrorCodes,
    message: String? = nil,
    debug: String? = nil
  ) {
    super.init(
      code: code,
      domain: "react-native-ios-popover",
      message: message,
      debug: debug
    );
  };
};
