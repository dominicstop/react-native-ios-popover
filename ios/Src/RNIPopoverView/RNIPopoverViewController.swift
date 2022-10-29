//
//  RCTPopoverViewControlller.swift
//  IosPopoverExample
//
//  Created by Dominic Go on 12/3/20.
//

import UIKit;
import react_native_ios_utilities

public class RNIPopoverViewController: UIViewController {
  
  
  var popoverWrapperView: RNIWrapperView?;
  
  var popoverView: UIView? {
    self.popoverWrapperView?.reactViews.first
  };
  
  var popoverSize: RNIPopoverSize = .INHERIT {
    didSet {
      self.setPopoverSize();
    }
  };
  
  public override func loadView() {
    super.loadView();
    
    if let popoverView  = self.popoverView {
      if #available(iOS 11.0, *) {
        self.view.addSubview(popoverView);
        
        popoverView.translatesAutoresizingMaskIntoConstraints = false;
        let safeArea = view.safeAreaLayoutGuide;
        
        NSLayoutConstraint.activate([
          // pin content to parent edges w/o the arrow
          popoverView.topAnchor     .constraint(equalTo: safeArea.topAnchor     ),
          popoverView.bottomAnchor  .constraint(equalTo: safeArea.bottomAnchor  ),
          popoverView.leadingAnchor .constraint(equalTo: safeArea.leadingAnchor ),
          popoverView.trailingAnchor.constraint(equalTo: safeArea.trailingAnchor),
        ]);
        
      } else {
        self.view = popoverView;
      };
    };
  };
  
  public override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
    self.setPopoverSize();
  };
  
  /// get popover size
  private func getPopoverSize() -> CGSize? {
    guard let frame = self.popoverView?.frame else { return nil };
    
    return CGSize(
      // set min. size
      width : max(frame.size.width , 40),
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
        self.popoverWrapperView?
          .notifyForBoundsChangeForContent(size: self.view.bounds.size);
        
        self.popoverWrapperView?
          .notifyForBoundsChangeForWrapper(size: self.view.bounds.size);
        
      case .CUSTOM(let width, let height):
        let nextSize = CGSize(width: width, height: height);
        self.preferredContentSize = nextSize;
        self.popoverWrapperView?.notifyForBoundsChangeForContent(size: nextSize);
        self.popoverWrapperView?.notifyForBoundsChangeForWrapper(size: nextSize);
    };
  };
};
