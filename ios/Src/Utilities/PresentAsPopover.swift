//
//  PresentAsPopover.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 12/3/20.
//

import UIKit;

/// Helper/Utility for configuring a view controller to be presented as a popover modal.
/// # Example Usage
/// ```
/// let popoverController = PresentAsPopover.configure(for: vc);
/// popoverController.sourceView = self.view;
/// popoverController.sourceRect = self.view.bounds;
/// popoverController.permittedArrowDirections = [.up, .down];
/// ```
/// # Notes
/// For some weird reason, everytime a view controller is programmatically preseted as a popever, its
/// always presented as a page sheet modal instead (iOS 13/14 and Xcode 12).
///
/// But if i extract the logic here, it worrks as expected. The code  is the exact same, the ony diff. is that the
/// logic is extracted to use a singleton, (i.e. a  `sharedInstance`) to handle the
/// `UIPopoverPresentationControllerDelegate` delegate.
///
class PresentAsPopover: NSObject {
  
  private static let sharedInstance = PresentAsPopover();

    
  static func configure(for controller: UIViewController) -> UIPopoverPresentationController {

    
    let presentationController = controller.popoverPresentationController!;

    return presentationController
  };
};
