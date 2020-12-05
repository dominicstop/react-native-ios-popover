import React from 'react';
import { StyleSheet, Platform, requireNativeComponent, UIManager, Text, View, TouchableOpacity, findNodeHandle } from 'react-native';

const componentName   = "RCTPopoverView";
const NativeCommands  = UIManager[componentName]?.Commands;
const NativeComponent = requireNativeComponent(componentName);

const NATIVE_COMMAND_KEYS = {
  'setVisibility': 'setVisibility',
};

export class PopoverView extends React.PureComponent {

  setVisibility = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.nativeRef),
      NativeCommands?.[NATIVE_COMMAND_KEYS.setVisibility],
      null
    );
  };

  render(){
    const props = this.props;

    return(
      <NativeComponent ref={r => this.nativeRef = r}>
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