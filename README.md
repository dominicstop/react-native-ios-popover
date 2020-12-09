# react-native-ios-popover

A react native wrapper component to use the native iOS popover by wrapping a react native view inside a `UIViewController` and presenting it.

## 1. Installation

```sh
# install via npm
npm install react-native-ios-popover

# or install via yarn
yarn add react-native-ios-popover
```

<br>

### 1.1 Installation Notes
If you encounter any errors/bugs while using this library, or want a particular feature implemented, please create an issue!

#### 1.1.1 Xcode Build Error (Swift)
This library is written in Swift. If you are having trouble building your app after installing this library, try adding an empty swift file:
1. Open up your `ios/project.xcworkspace` project
2. On the project navigator panel (located on the right side of Xcode), right click on your project group (or another folder/group i.e the blue or yellow icons) and select the "*New File...*" option
3. In the popup sheet, select "Swift" as the template and then click the "*Next*" button
4. A "*Save As*" popup sheet should appear and then click "*Create*" (you can rename the file first if you want to)
5. If Xcode asks you to create a "*Objective-C Bridging Header*" choose *"Create Objective-C Bridging Header"*

<br>

#### 1.1.2 Cocoapods Static Libraries Error
If you encounter the following error when running `pod install`:

```
[!] The following Swift pods cannot yet be integrated as static libraries:

The Swift pod `react-native-ios-popover` depends upon `React-Core`, which does not define modules. To opt into those targets generating module maps (which is necessary to import them from Swift when building as static libraries), you may set `use_modular_headers!` globally in your Podfile, or specify `:modular_headers => true` for particular dependencies.
```

<br>

Then try following these steps:
1. Open up your project's `ios/podfile` configuration
2. Under `target 'ProjectName' do` block, find the `'React-Core'` pod, and append the following snippet to the end of the line: `, :modular_headers => true`
3. It should now look something similar to this: `pod 'React-Core', :path => '../node_modules/react-native/', :modular_headers => true`
4. Try running `pod install` again.

<br>

## 2. Usage

Please check out the examples section or the examples directory for more on how to use it.

```jsx
import { PopoverView } from "react-native-ios-popover";

function PopoverViewExample() {
  const popoverRef = useRef();

  return (
    <PopoverView
      ref={popoverRef}
      renderPopoverContent={() => (
        <View style={{padding: 20}}>
          <Text>
            {'Popover Content'}
          </Text>
        </View>
      )}
    >
      <TouchableOpacity onPress={() => {
        popoverRef.current.toggleVisibility();
      }}>
        <Text>
          {'Toggle Popover Visibility'}
        </Text>
      </TouchableOpacity>
    </PopoverView>
  );
};
```

### 2.2 `PopoverView` Section Links
Here is an overview of all the documentation and examples for the `PopoverView` component.

| Description | Section Link |
|-------------|--------------|
|             |              |

<br>

## 3. Documentation
### 3.1 Modules/Components
#### `PopoverView` Props

| Prop Name                         | Type                                                         | Description                                                  |
| --------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `renderPopoverContent`            | **Required**: `Function` -> `Element`                        | The elements to show in the popover. Accepts a function that returns a valid react element. |
| `popoverSize`                     | **Optional**: `String` or  `Object: {width: number, height: number}` <br>**Default**: `INHERIT` | Controls the size the of the popover.<br><br>Can either be a `String` value ( i.e. a  `PopoverSize` enum item e.g. `INHERIT`, `STRETCH`) or a `Size` object (i.e. an object with a `height` and/or `width` property). |
| `popoverBackgroundColor`          | **Optional**: `String`                                       | Sets the background color of the popover.                    |
| `permittedArrowDirections`        | **Optional**: `[String]`<br/>**Default**: `["any"]`          | Sets the arrow directions that you allow for the popover. <br><br>Accept an array of 1 or more string values, i.e. an array of `ArrowDirections` enum items (e.g. `up`, `down`, etc.) |
| `lazyPopover`                     | **Optional**: `Bool`<br/>**Default**: `true`                 | Controls whether or not the popover content is always mounted. |
| `popoverShouldDismiss`            | **Optional**: `Bool`<br/>**Default**: `true`                 | Controls whether or not a tap outside the popover will dismiss it. |
| `popoverCanOverlapSourceViewRect` | **Optional**: `Bool`<br/>**Default**: `false`                | Controls  whether the popover can overlap its source view.   |
<br>

##### `PopoverView` Events

| Event Name                     | Description |
|--------------------------------|-------------|
| `onPopoverDidShow`             |             |
| `onPopoverDidHide`             |             |
| `onPopoverWillShow`            |             |
| `onPopoverWillHide`            |             |
| `onPopoverDidHideViaTap`       |             |
| `onPopoverWillHideViaTap`      |             |
| `onPopoverDidAttemptToDismiss` |             |

<br>

##### `PopoverView` Functions

<br>

| Function Name                         | Description |
|---------------------------------------|-------------|
| **async** `setVisibility(boolean)`    |             |
| **async** `toggleVisibility()`        |             |
| **async** `getVisibility()` -> `Bool` |             |
<br>

### 3.2 Enum Values
#### 3.2.1 `PopoverSize` Enum

| Value | Description |
|-------|-------------|
|       |             |

<br>

#### 3.2.2 `ArrowDirections` Enum

| Value | Description |
|-------|-------------|
|       |             |
<br>

## 4 Examples
### 4.1 `PopoverView` Examples
#### 4.1.1 `PopoverView` Example #1

<br>

```jsx

```

<br><br>

#### 4.1.2 `PopoverView` Example #2

<br>

```jsx

```

<br><br>

#### 4.1.3 `PopoverView` Example #3

<br>

```jsx

```

<br><br>

#### 4.1.4 `PopoverView` Example #4

<br>

```jsx

```

<br><br>

#### 4.1.5 `PopoverView` Example #5

<br>

```jsx

```

<br><br>

#### 4.1.6 `PopoverView` Example #6

<br>

```jsx

```

<br><br>

#### 4.1.7 `PopoverView` Example #7

<br>

```jsx

```

<br><br>

#### 4.1.8 `PopoverView` Example #8

<br>

```jsx

```

<br><br>

## License
MIT

<br>

## Links
* I'm [@DominicGo](https://twitter.com/GoDominic) on twitter if you have any questions ✨
* Other libraries: [￼react-native-ios-modal￼](https://github.com/dominicstop/react-native-ios-modal), [react-native-ios-context-menu](https://github.com/dominicstop/react-native-ios-context-menu)
* This library was generated/made using [@react-native-community/bob](https://github.com/callstack/react-native-builder-bob)