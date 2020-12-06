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
  
  var popoverSize: RCTPopoverSize = .INHERIT {
    didSet {
      self.setPopoverSize();
    }
  };
  
  override func loadView() {
    super.loadView();

    if let reactPopoverView = self.reactPopoverView {
      self.view = reactPopoverView;
    };
  };
  
  override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
    
    self.setPopoverSize();
  };
  
  /// get popover size
  private func getPopoverSize() -> CGSize? {
    guard let frame = self.reactPopoverView?.subviews.first?.frame
    else { return nil };
    
    return CGSize(
      width : max(frame.size.width , 25),
      height: max(frame.size.height, 40)
    );
  };
  
  private func setPopoverSize(){
    switch self.popoverSize {
      case .INHERIT:
        guard let popoverSize = self.getPopoverSize() else { return };
        self.preferredContentSize = popoverSize;
        
      case .STRETCH:
        self.preferredContentSize = CGSize(width: 0, height: 0);
        self.boundsDidChangeBlock?(self.view.bounds);
    };
  };
};
