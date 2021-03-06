//
//  RCTPopoverView.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 11/27/20.
//

import UIKit;

typealias Completion = ((_ success: Bool, _ message: String?) -> ());

class RCTPopoverView: UIView {
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  weak var bridge: RCTBridge!;
  private var touchHandler: RCTTouchHandler!;
  
  /// the content to show in the popover
  var reactPopoverView: UIView?;
  
  /// the view controller that holds/manages the popover content
  private var _popoverController: RCTPopoverViewControlller?;
  /// returns the current popover vc instance (or init. it first if it's nil)
  var popoverController: RCTPopoverViewControlller {
    // get popover vc, or init it first if its nil
    let popoverVC = self._popoverController ?? {
      let vc = RCTPopoverViewControlller();
      
      // setup popover vc
      vc.reactPopoverView = self.reactPopoverView;
      vc.popoverSize = self._popoverSize;
      vc.modalPresentationStyle = .popover;
      
      vc.boundsDidChangeBlock = { [weak self] (newBounds: CGRect) in
        self?.popoverViewNotifyForBoundsChange(newBounds);
      };
      
      self._popoverController = vc;
      return vc;
    }();
    
    // setup popover presentation controller
    if let presentation = popoverVC.popoverPresentationController {
      presentation.delegate   = self;
      presentation.sourceView = self;
      presentation.sourceRect = self.bounds;
      
      presentation.backgroundColor = self._popoverBackgroundColor;
      presentation.permittedArrowDirections = self._permittedArrowDirections;
      presentation.canOverlapSourceViewRect = self.popoverCanOverlapSourceViewRect;
    };
    
    return popoverVC;
  };
  
  // shorthand to get the popover vc's presentation controller
  var popoverPresentation: UIPopoverPresentationController? {
    return  self._popoverController?.popoverPresentationController;
  };
  
  /// flag that indicates whether the popover is presented or not
  var isPopoverVisible: Bool {
    guard let popoverVC = self._popoverController
    else { return false };
    
    // the view's window property is non-nil if a view is currently visible
    return popoverVC.viewIfLoaded?.window != nil;
  };
  
  // -----------------------------
  // MARK: RN Exported Event Props
  // -----------------------------
  
  @objc var onPopoverWillShow: RCTBubblingEventBlock?;
  @objc var onPopoverWillHide: RCTBubblingEventBlock?;
  
  @objc var onPopoverDidShow: RCTBubblingEventBlock?;
  @objc var onPopoverDidHide: RCTBubblingEventBlock?;
  
  @objc var onPopoverWillHideViaTap: RCTBubblingEventBlock?;
  @objc var onPopoverDidHideViaTap : RCTBubblingEventBlock?;
  
  @objc var onPopoverDidAttemptToDismiss: RCTBubblingEventBlock?;
  
  // -----------------------
  // MARK: RN Exported Props
  // -----------------------
  
  // private/internal prop
  private var _customPopoverSize: RCTPopoverSize = .CUSTOM(width: 0, height: 0);
  @objc var customPopoverSize: NSDictionary? {
    didSet {
      guard let dictionary = self.customPopoverSize
      else { return };
      
      self._customPopoverSize = .CUSTOM(
        width : dictionary["width" ] as? CGFloat ?? 0,
        height: dictionary["height"] as? CGFloat ?? 0
      );
    }
  };
  
  private var _popoverSize: RCTPopoverSize = .INHERIT;
  @objc var popoverSize: NSString? {
    didSet {
      guard let string = self.popoverSize as String?,
            let popoverSize = (string == "CUSTOM")
              ? self._customPopoverSize
              : RCTPopoverSize(string: string)
      else { return };
      
      self._popoverSize = popoverSize;
      
      if let popoverVC = self._popoverController {
        popoverVC.popoverSize = popoverSize;
      };
    }
  };
  
  private var _popoverBackgroundColor: UIColor = .clear;
  @objc var popoverBackgroundColor: NSNumber? {
    didSet {
      guard let number = self.popoverBackgroundColor,
            let color  = RCTConvert.uiColor(number)
      else { return };
      
      self._popoverBackgroundColor = color;
    }
  };
  
  private var _permittedArrowDirections: UIPopoverArrowDirection = .any;
  @objc var permittedArrowDirections: [NSString]? {
    didSet {
      guard let items = self.permittedArrowDirections as [String]?,
            let arrowDirections = UIPopoverArrowDirection(stringValues: items)
      else { return };
      
      self._permittedArrowDirections = arrowDirections;
      
      if let popoverVC         = self._popoverController,
         let popoverController = popoverVC.popoverPresentationController {
        
        popoverController.permittedArrowDirections = arrowDirections;
        if #available(iOS 11.0, *) {
          popoverVC.viewSafeAreaInsetsDidChange();
        };
      };
    }
  };
  
  @objc var popoverCanOverlapSourceViewRect: Bool = false {
    willSet {
      if let presentation = self.popoverPresentation {
        presentation.canOverlapSourceViewRect = newValue;
      };
    }
  };
  
  // controls whether the popover should dismiss when bg is tapped
  @objc var popoverShouldDismiss: Bool = true;

  // ----------------
  // MARK: Initialize
  // ----------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
    self.touchHandler = RCTTouchHandler(bridge: bridge);
    
    #if DEBUG
    NotificationCenter.default.addObserver(self,
      selector: #selector(self.onCTBridgeWillReload),
      name: NSNotification.Name(rawValue: "RCTBridgeWillReloadNotification"),
      object: nil
    );
    #endif
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
      self.touchHandler.attach(to: subview);
    };
  };
  
  override func removeReactSubview(_ subview: UIView!) {
    super.removeReactSubview(subview);
    
    if self.reactPopoverView == subview {
      // popover contents has been unmounted
      self.touchHandler.detach(from: subview);
      self.reactPopoverView = nil;
    };
  };
};

// ------------------------
// MARK:- Private Functions
// ------------------------

fileprivate extension RCTPopoverView {
  func popoverViewNotifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactPopoverView
    else { return };
        
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
  
  #if DEBUG
  // called when the RN app is reloaded
  @objc func onCTBridgeWillReload(){
    // dismiss modal
    self.setVisibility(false);
  };
  #endif
};

// ----------------------------------------
// MARK:- Functions for View Manager/Module
// ----------------------------------------

extension RCTPopoverView {
  /// show or hide the popover
  func setVisibility(_ visibility: Bool, completion: Completion? = nil) {
    guard self.isPopoverVisible != visibility,
          // get the closest view controller
          let parentVC = self.reactViewController()
    else {
      // `setVisibility` failed...
      completion?(false, "Popover already \(visibility ? "visible" : "hidden")");
      return;
    };
    
    if visibility {
      // send event to RN
      self.onPopoverWillShow?([:]);
      
      // show popover
      parentVC.present(self.popoverController, animated: true){
        // `setVisibility` success...
        completion?(true, nil);
        
        // send event to RN
        self.onPopoverDidShow?([:]);
      };
      
    } else {
      // send event to RN
      self.onPopoverWillHide?([:]);
      
      // hide popover
      self.popoverController.dismiss(animated: true){
        // `setVisibility` success...
        completion?(true, nil);
        
        // send event to RN
        self.onPopoverDidHide?([:]);
      };
    };
  };
};

// ----------------------------------------------
// MARK:- UIPopoverPresentationControllerDelegate
// ----------------------------------------------

extension RCTPopoverView: UIPopoverPresentationControllerDelegate {
  
  func adaptivePresentationStyle(for controller: UIPresentationController) -> UIModalPresentationStyle {
    // force to use popover on iPhone
    return .none;
  };
  
  // popover will dismiss via tap
  func presentationControllerWillDismiss(_ presentationController: UIPresentationController) {
    #if DEBUG
    print("RCTPopoverView, UIPopoverPresentationControllerDelegate - willDismiss");
    #endif
    
    // send events to RN
    self.onPopoverWillHide?([:]);
    self.onPopoverWillHideViaTap?([:]);
  };
  
  // popover did dismiss via tap
  func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
    #if DEBUG
    print("RCTPopoverView, UIPopoverPresentationControllerDelegate - didDismiss");
    #endif
    
    // send events to RN
    self.onPopoverDidHide?([:]);
    self.onPopoverDidHideViaTap?([:]);
  };
  
  // popover should dismiss via tap
  func presentationControllerShouldDismiss(_ presentationController: UIPresentationController) -> Bool {
    #if DEBUG
    print("RCTPopoverView, UIPopoverPresentationControllerDelegate - shouldDismiss");
    #endif
    
    if !self.popoverShouldDismiss {
      // send event to RN
      self.onPopoverDidAttemptToDismiss?([:]);
    };
    
    return self.popoverShouldDismiss;
  };
};
