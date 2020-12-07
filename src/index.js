import React from 'react';
import { StyleSheet, Platform, requireNativeComponent, UIManager, Text, View, TouchableOpacity, findNodeHandle, processColor } from 'react-native';

const componentName   = "RCTPopoverView";
const NativeCommands  = UIManager[componentName]?.Commands;
const NativeComponent = requireNativeComponent(componentName);

const NATIVE_COMMAND_KEYS = {
  'setVisibility': 'setVisibility',
};

export class PopoverView extends React.PureComponent {

  setVisibility = (visibility) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.nativeRef),
      NativeCommands?.[NATIVE_COMMAND_KEYS.setVisibility],
      [visibility]
    );
  };

  render(){
    const props = this.props;

    const nativeProps = {
      popoverSize: props.popoverSize,
      popoverBackgroundColor: processColor(props.popoverBackgroundColor),
      permittedArrowDirections: props.permittedArrowDirections,
    };

    return(
      <NativeComponent
        ref={r => this.nativeRef = r}
        {...nativeProps}
      >
        <View style={styles.popoverContainer}>
          {props.renderPopoverContent?.()}
        </View>
        {this.props.children}
      </NativeComponent>
    );
  };
};

const styles = StyleSheet.create({
  popoverContainer: {
    position: 'absolute',
    color: 'transparent',
  },
});