//
//  RCTPopoverView.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 11/27/20.
//

import UIKit;
import react_native_ios_utilities;


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
  private(set) var popoverWrapperView: RNIWrapperView?;
  
  /// the view controller that holds/manages the popover content
  private(set) var popoverController: RNIPopoverViewController?;
  
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
    self.popoverController != nil
  };
  
  // shorthand to get the popover vc's presentation controller
  var popoverPresentation: UIPopoverPresentationController? {
    return self.popoverController?.popoverPresentationController;
  };
  
  /// flag that indicates whether the popover is presented or not
  var isPopoverVisible: Bool {
    guard let popoverVC = self.popoverController
    else { return false };
    
    // the view's window property is non-nil if a view is currently visible
    return popoverVC.viewIfLoaded?.window != nil;
  };
  
  /// This is where the popover should be presented.
  var targetViewController: UIViewController? {
    self.viewController ?? self.reactViewController()
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
      self.popoverController?.popoverSize = size;
    }
  };
  
  private var _popoverBackgroundColor: UIColor = .clear;
  @objc var popoverBackgroundColor: NSNumber? {
    willSet {
      guard let colorRaw = newValue,
            let colorParsed = RCTConvert.uiColor(colorRaw)
      else { return };
      
      self._popoverBackgroundColor = colorParsed;
      
      if self.isPopoverVisible,
         let presentationController = self.popoverPresentation {
        
        // popover is visible, update background color
        presentationController.backgroundColor = colorParsed;
      };
    }
  };
  
  private var _permittedArrowDirections: UIPopoverArrowDirection = .any;
  @objc var permittedArrowDirections: [NSString]? {
    willSet {
      guard let valuesRaw = newValue as [String]?,
            let valuesParsed = UIPopoverArrowDirection(stringValues: valuesRaw)
      else { return };
      
      self._permittedArrowDirections = valuesParsed;
      self.popoverPresentation?.permittedArrowDirections = valuesParsed;
      
      if #available(iOS 11.0, *) {
        self.popoverController?.viewSafeAreaInsetsDidChange();
      };
    }
  };
  
  @objc var popoverCanOverlapSourceViewRect: Bool = false {
    willSet {
      self.popoverPresentation?.canOverlapSourceViewRect = newValue;
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
  
  // ----------------------
  // MARK: - View Lifecycle
  // ----------------------
  
  public override func didMoveToWindow() {
      
    let isMovingToNilWindow = self.window == nil;
    
    let isBeingRemoved = !self.didAttachToParentVC &&  isMovingToNilWindow;
    let isMovingToVC   = !self.didAttachToParentVC && !isMovingToNilWindow;
    
    if isBeingRemoved {
      // A. moving to nil window, and not attached to parent vc,
      // possible end of lifecycle for this view...
      //
      // trigger manual cleanup
      self.cleanup();
      
    } else if isMovingToVC {
      // B. Moving to a non-nil window, and is not attached to a parent yet...
      //
      // The VC paired to this view (or it's predecessor view) is possibly
      // being attached as a child VC to another view controller e.g.
      // `UINavigationController`...
      //
      // begin setup - attach this view as a child vc to the nearest vc
      self.setupAttachToParentVCIfAny();
    };
  };
  
  // ------------------
  // MARK: RN Lifecycle
  // ------------------
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    if atIndex == 0,
       let wrapperView = subview as? RNIWrapperView {
      
      // remove previous popover, if any
      self.popoverWrapperView?.cleanup();
      self.popoverWrapperView = wrapperView;
      
      wrapperView.isMovingToParent = true;
      wrapperView.removeFromSuperview();
      
      self.setupInitializePopoverController();
      self.configurePopoverController();
      wrapperView.isMovingToParent = false;
    };
  };
  
  override func removeReactSubview(_ subview: UIView!) {
    super.removeReactSubview(subview);
  };
  
  #if DEBUG
  // called when the RN app is reloaded
  @objc func onCTBridgeWillReload(){
    self.cleanup();
  };
  #endif
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
    if let previousPopover = self.popoverController {
      previousPopover.detachFromParentVC();
    };
    
    let popoverVC = RNIPopoverViewController();
    
    // setup popover vc
    popoverVC.popoverWrapperView = self.popoverWrapperView;
    popoverVC.popoverSize = self._popoverSize;
    popoverVC.modalPresentationStyle = .popover;
    
    self.popoverController = popoverVC;
  };
  
  func configurePopoverController(){
    guard let presentation = self.popoverController?.popoverPresentationController
    else { return };
    
    // setup popover presentation controller
    presentation.delegate   = self;
    presentation.sourceView = self;
    presentation.sourceRect = self.bounds;
    
    presentation.backgroundColor = self._popoverBackgroundColor;
    presentation.permittedArrowDirections = self._permittedArrowDirections;
    presentation.canOverlapSourceViewRect = self.popoverCanOverlapSourceViewRect;
  };
};

// ----------------------------------------
// MARK:- Functions for View Manager/Module
// ----------------------------------------

extension RNIPopoverView {
  
  /// show or hide the popover
  func setVisibility(
    _ visibility: Bool,
    completion: ((_ success: Bool, _ error: RNIPopoverError?) -> ())? = nil
  ) {
    let didChangeVisibility = self.isPopoverVisible != visibility;
    
    if !didChangeVisibility {
      let visibilityString = visibility ? "visible" : "hidden";
      
      // Error - No change in visibility
      completion?(false, RNIPopoverError(
        code: (visibility
          ? .popoverAlreadyVisible
          : .popoverAlreadyHidden
        ),
        message: "Popover already \(visibilityString)"
      ));
      return;
    };
    
    // get the closest view controller
    guard let targetVC = self.reactViewController() else {
      completion?(false, RNIPopoverError(
        code: .libraryError,
        message: "Could not find a parent view controller to attach to"
      ));
      return;
    };
    
    guard let popoverVC = self.popoverController else {
      completion?(false, RNIPopoverError(
        code: .libraryError,
        message: "Popover view controller is not initialized yet"
      ));
      return;
    };
    
    if visibility {
      // A. Show popover...
      // update popover presentation config based on props
      self.configurePopoverController();
      
      // send event to RN
      self.onPopoverWillShow?([:]);
      
      // begin showing popover...
      targetVC.present(popoverVC, animated: true){
        // transition finished, popover shown.
        completion?(true, nil);
        
        // send event to RN
        self.onPopoverDidShow?([:]);
      };
      
    } else {
      // B. Hide popover...
      // send event to RN
      self.onPopoverWillHide?([:]);
      
      // begin hiding popover...
      popoverVC.dismiss(animated: true){
        // transition finished, popover hidden.
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
    
    if let popoverVC = self.popoverController {
      popoverVC.detachFromParentVC();
      self.popoverController = nil;
    };
    
    if let vc = self.viewController {
      vc.detachFromParentVC();
      self.viewController = nil;
    };
    
    if let popoverWrapperView = self.popoverWrapperView {
      popoverWrapperView.cleanup();
    };
    
    self.removeFromSuperview();
  };
};
