//
//  RCTPopoverView.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 11/27/20.
//

import UIKit;

class RCTPopoverView: UIView {
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  weak var bridge: RCTBridge!;
  
  /// the content to show in the popover
  var reactPopoverView: UIView?;
  /// flag that indicates whether the popover is presented or not
  var isPopoverVisible = false;
  
  /// the view controller that holds/manages the popover content
  var _popoverController: RCTPopoverViewControlller?;
  /// returns the current popover vc instance (or init. it first if it's nil)
  var popoverController: RCTPopoverViewControlller {
    // get popover vc, or init it first if its nil
    let popoverVC = self._popoverController ?? {
      let vc = RCTPopoverViewControlller();
      
      // setup popover vc
      vc.reactPopoverView = self.reactPopoverView;
      vc.modalPresentationStyle = .popover;
      vc.boundsDidChangeBlock = { [weak self] (newBounds: CGRect) in
        self?.popoverViewNotifyForBoundsChange(newBounds);
      };
      
      self._popoverController = vc;
      return vc;
    }();
    
    // setup popover presentation controller
    if let popoverController = popoverVC.popoverPresentationController {
      popoverController.delegate   = self;
      popoverController.sourceView = self;
      popoverController.sourceRect = self.bounds;
      popoverController.permittedArrowDirections = [.down];
    };
    
    return popoverVC;
  };
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  // ------------------
  // MARK: RN Lifecycle
  // ------------------
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    if atIndex == 0 {
      subview.removeFromSuperview();
      self.reactPopoverView = subview;
    };
  };
};

// -----------------------
// Mark: Private Functions
// -----------------------

fileprivate extension RCTPopoverView {
  func popoverViewNotifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactPopoverView
    else { return };
        
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
};

// ---------------------------------------
// Mark: Functions for View Manager/Module
// ---------------------------------------

extension RCTPopoverView {
  /// show or hide the popover
  func setVisibility(_ visibility: Bool) {
    guard self.isPopoverVisible != visibility,
          // get the closest view controller
          let parentVC  = self.reactViewController()
    else { return };
    
    if visibility {
      // update popover visibility
      self.isPopoverVisible = true;
      // show popover
      parentVC.present(self.popoverController, animated: true, completion: nil);
      
    } else {
      self.popoverController.dismiss(animated: true){
        // update popover visibility
        self.isPopoverVisible = false;
      };
    };
  };
};

// ---------------------------------------------
// Mark: UIPopoverPresentationControllerDelegate
// ---------------------------------------------

extension RCTPopoverView: UIPopoverPresentationControllerDelegate {
  
  func adaptivePresentationStyle(for controller: UIPresentationController) -> UIModalPresentationStyle {
    // force to use popover on iPhone
    return .none;
  };
  
  func popoverPresentationControllerDidDismissPopover(_ popoverPresentationController: UIPopoverPresentationController) {
    self.isPopoverVisible = false;
  };
};
