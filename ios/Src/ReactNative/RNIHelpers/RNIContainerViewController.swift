//
//  RNIContextMenuViewController.swift
//  react-native-ios-context-menu
//
//  Created by Dominic Go on 2/1/22.
//

import UIKit;


// TODO: move to sep. library (e.g. `react-native-ios-utilities`)
class RNIContextMenuViewController: UIViewController {
  
  var didAttachToParentVC = false;
  
  weak var parentVC: UIViewController?;
  weak var eventsDelegate: RNIContainerViewControllerEventsDelegate?;
  
  // MARK: - Init
  // ------------
  
  init(view: UIView) {
    super.init(nibName: nil, bundle: nil);
    self.view = view;
  };
  
  // loaded from a storyboard
  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder);
  };
  
  // MARK: - Lifecycle
  // -----------------
  
  override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated);
    
    guard let navVC = self.navigationController,
          let parentVC = self.parentVC
    else { return };
    
    // if parent VC still exist in the stack, then it hasn't been popped yet
    let isPopping = !navVC.viewControllers.contains(parentVC);
    
    if isPopping {
        
    };
  }

  // MARK: - Public Methods
  // ----------------------

  func attachToParentVC() throws {
    guard !self.didAttachToParentVC,
          // find the nearest parent view controller
          let parentVC = RNIUtilities
            .getParent(responder: self, type: UIViewController.self)
    else {
      throw RNIPopoverGenericError(code: .nilError, message: <#T##String?#>, debug: <#T##String?#>)
    };
    
    self.didAttachToParentVC = true;
    
    let childVC = RNIContextMenuViewController(contextMenuView: self);
    childVC.parentVC = parentVC;
    
    self.contextMenuViewController = childVC;

    parentVC.addChild(childVC);
    childVC.didMove(toParent: parentVC);
  };
};
