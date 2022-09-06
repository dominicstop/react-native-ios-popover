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


- [ ] 
- [ ] Implement: Lazy popover prop.
- [ ] Test: Check for memory leaks.
- [ ] Implement: Add Context — `isPopoverVisible`.
- [ ] Implement: `refreshPopoverVisibilityStatus`.
- [ ] Refactor: Make classes public.
- [ ] Example: Add example for dynamic sized  popover, i.e. grow/shrink.

<br>

- [x] (Commit: `99d3a18`) Refactor: Re-write `setVisibility` error handling.
- [x] (Commit: `a355a4c`) Implement:  `setVisibility` — Add option to ignore "popover already visible/hidden"-related errors.
- [x] (Commit: `2385908`) Refactor: `RNIPopoverViewModule.getVisibility` error handling.
- [x] (Commit: `d42d0d1`) Refactor: iOS Native - Re-write props — Use `willSet` instead of `didSet`.
- [x] (Commit: `44c3c54`) Refactor: Use `RNIWrapperView`







## Old/Abandoned

- [ ] `UIPopoverPresentationController` — Impl. `passThroughViews` prop 
- [ ] `UIPopoverPresentationController` — Impl. `popoverLayoutMargins` prop 
- [ ] `UIPopoverPresentationController` — Impl. `getArrowDirection` function 

- [ ] Impl. `sourceView` — Custom anchor for the popover. Pass in a react tag.
- [ ] Impl. constant that exports the popover's arrow size from `UIPopoverBackgroundView`


- [x] Test on RN `0.63.4`
