//
//  RCTPopoverView.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 11/27/20.
//

import UIKit;
import react_native_ios_utilities;


typealias Completion = ((_ success: Bool, _ message: String?) -> ());

class RNIPopoverView: UIView {
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  private(set) weak var bridge: RCTBridge!;
  private(set) var touchHandler: RCTTouchHandler!;
  
  /// The view controller that corresponds to this view...
  /// This vs is used to listen for navigation-related events
  private(set) weak var viewController: RNINavigationEventsReportingViewController?;
  
  /// the content to show in the popover
  private(set) var reactPopoverView: UIView?;
  
  /// the view controller that holds/manages the popover content
  private(set) var _popoverController: RNIPopoverViewController?;
  
  // ------------------------
  // MARK: Properties - Flags
  // ------------------------
  
  /// Whether or not the current view was successfully added as child VC
  private(set) var didAttachToParentVC = false;
  
  /// Whether or not `cleanup` method was called
  private(set) var didTriggerCleanup = false;
  
  // --------------------------------------
  // MARK: Properties - Computed Properties
  // --------------------------------------
  
  var didInitializePopoverVC: Bool {
    self._popoverController != nil
  };
  
  /// returns the current popover vc instance (or init. it first if it's nil)
  var popoverController: RNIPopoverViewController {
    if !self.didInitializePopoverVC {
      self.setupInitializePopoverController();
    };
    
    return self._popoverController!;
  };
  
  // shorthand to get the popover vc's presentation controller
  var popoverPresentation: UIPopoverPresentationController? {
    return self.popoverController.popoverPresentationController;
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
  
  private var _popoverSize: RNIPopoverSize = .INHERIT;
  @objc var popoverSize: NSDictionary? {
    willSet {
      guard let dict = newValue,
            let size = RNIPopoverSize(dict: dict)
      else { return };
      
      self._popoverSize = size;
      self.popoverController.popoverSize = size;
    }
  };
  
  private var _popoverBackgroundColor: UIColor = .clear;
  @objc var popoverBackgroundColor: NSNumber? {
    didSet {
      guard let number = self.popoverBackgroundColor,
            let color  = RCTConvert.uiColor(number)
      else { return };
      
      self._popoverBackgroundColor = color;
      
      if self.isPopoverVisible,
         let popoverPresentationController =
            self._popoverController?.popoverPresentationController {
        
        // popover is visible, update background color
        popoverPresentationController.backgroundColor = color;
      };
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
  
  // controls whether the popover should dismiss when the bg is tapped
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
      // remove previous popover
      self.removeOldPopoverIfAny();
      
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

fileprivate extension RNIPopoverView {
  func setupAttachToParentVCIfAny(){
    guard !self.didAttachToParentVC,
          
          // find the nearest parent view controller
          let parentVC = RNIUtilities
            .getParent(responder: self, type: UIViewController.self)
    else { return };
    
    self.didAttachToParentVC = true;
    
    let childVC = RNINavigationEventsReportingViewController();
    childVC.view = self;
    childVC.delegate = self;
    childVC.parentVC = parentVC;
    
    self.viewController = childVC;
    
    parentVC.addChild(childVC);
    childVC.didMove(toParent: parentVC);
  };
  
  func setupInitializePopoverController(){
    let popoverVC = RNIPopoverViewController();
    
    // setup popover vc
    popoverVC.reactPopoverView = self.reactPopoverView;
    popoverVC.popoverSize = self._popoverSize;
    popoverVC.modalPresentationStyle = .popover;
    
    // TODO - Refactor: Rewrite
    popoverVC.boundsDidChangeBlock = { [weak self] (newBounds: CGRect) in
      self?.popoverViewNotifyForBoundsChange(newBounds);
    };
    
    self._popoverController = popoverVC;
  };
  
  func configurePopoverController(){
    guard let presentation = self.popoverController.popoverPresentationController
    else { return };
    
    // setup popover presentation controller
    presentation.delegate   = self;
    presentation.sourceView = self;
    presentation.sourceRect = self.bounds;
    
    presentation.backgroundColor = self._popoverBackgroundColor;
    presentation.permittedArrowDirections = self._permittedArrowDirections;
    presentation.canOverlapSourceViewRect = self.popoverCanOverlapSourceViewRect;
  };
  
  // TODO: Refactor: Remove/Move
  func removeOldPopoverIfAny(){
    guard let prevPopoverView = self.reactPopoverView
    else { return };
    
    RNIUtilities.recursivelyRemoveFromViewRegistry(
      bridge: self.bridge,
      reactView: prevPopoverView
    );
    
    self.touchHandler.detach(from: prevPopoverView);
    self.reactPopoverView = nil;
    
    // remove preview popover vc
    self._popoverController = nil;
  };
  
  // TODO: Refactor: Remove/Move
  func popoverViewNotifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactPopoverView
    else { return };
        
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
  
  #if DEBUG
  // TODO: Refactor: Move/Relocate
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

extension RNIPopoverView {
  /// show or hide the popover
  func setVisibility(_ visibility: Bool, completion: Completion? = nil) {
    let didChangeVisibility = self.isPopoverVisible != visibility;
    
    if !didChangeVisibility {
      // `setVisibility` failed...
      completion?(false, "Popover already \(visibility ? "visible" : "hidden")");
      return;
    };
    
    // get the closest view controller
    guard let parentVC = self.reactViewController() else {
      // `setVisibility` failed...
      completion?(false, "Could not find a view controller to attach to");
      return;
    };
    
    // update popover presentation config based on props
    self.configurePopoverController();
    
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

extension RNIPopoverView: UIPopoverPresentationControllerDelegate {
  
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

// -------------------------------------
// MARK:- RNINavigationEventsNotifiable
// -------------------------------------

extension RNIPopoverView: RNINavigationEventsNotifiable {
  func notifyViewControllerDidPop(sender: RNINavigationEventsReportingViewController) {
    self.cleanup();
  };
};

// -----------------------------------q------------
// MARK:- RNIContainerViewControllerEventsDelegate
// -----------------------------------------------

extension RNIPopoverView: RNICleanable {
  
  func cleanup(){
    guard !self.didTriggerCleanup else { return };
    self.didTriggerCleanup = true;
    
    if self.isPopoverVisible {
      self.setVisibility(false, completion: nil);
    };
    
    self._popoverController = nil;
    
    if let popoverView = self.reactPopoverView {
      RNIUtilities.recursivelyRemoveFromViewRegistry(
        bridge   : self.bridge,
        reactView: popoverView
      );
    };
  };
};
