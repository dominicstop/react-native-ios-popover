//
//  RCTPopoverViewControlller.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 12/3/20.
//

import UIKit;

class RCTPopoverViewControlller: UIViewController {
  
  /// the  content to show in the popover
  var reactPopoverView: UIView?;
  /// called whenever the popover view's bound changes
  var boundsDidChangeBlock: ((CGRect) -> Void)?;
  
  override func loadView() {
    super.loadView();

    if let reactPopoverView = self.reactPopoverView {
      self.view.addSubview(reactPopoverView);
    };
  };
  
  override func viewWillLayoutSubviews() {
    self.boundsDidChangeBlock?(self.view.bounds);
    self.preferredContentSize = CGSize(width: 0, height: 0);
  };
};
