# TODO (react-native-ios-popover)



- [x] Implement `react-native-ios-utilites`
	* Move shared code to a separate library, and make it a peer dependency.

<br>

- [x] Refactor: Example - Extract `Homescreen` to its own file.
- [x] Implement: Example - Add debug controls
- [x] Implement: Example - Add env. constant to toggle navigation usage.
- [x] Refactor: Replace `RNIContainerViewController` usage with `RNINavigationEventsReporting`.





- [x] `react-native-utilities@1.0.0` doesn't trigger the build error. `react-native-ios-utilities@1.0.0-1 ` and above causes a build error.
	* Might be related to making the classes/protocols public?




- [ ] Refactor: Use `RNIWrapperView`
- [ ] Implement: Lazy popover prop.
- [ ] Refactor: iOS Native - Re-write props — Use `willSet` instead of `didSet`
- [ ] Test: Check for memory leaks.
- [ ] Implement: Add Context — `isPopoverVisible`.
- [ ] Implement: `refreshPopoverVisibilityStatus`.

<br>

- [x] (Commit: `99d3a18`) Refactor: Re-write `setVisibility` error handling.
- [x] (Commit: `a355a4c`) Implement:  `setVisibility` — Add option to ignore "popover already visible/hidden"-related errors.







## Old/Abandoned

- [ ] `UIPopoverPresentationController` — Impl. `passThroughViews` prop 
- [ ] `UIPopoverPresentationController` — Impl. `popoverLayoutMargins` prop 
- [ ] `UIPopoverPresentationController` — Impl. `getArrowDirection` function 

- [ ] Impl. `sourceView` — Custom anchor for the popover. Pass in a react tag.
- [ ] Impl. constant that exports the popover's arrow size from `UIPopoverBackgroundView`


- [x] Test on RN `0.63.4`
