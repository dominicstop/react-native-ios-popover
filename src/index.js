import React from 'react';
import { StyleSheet, Platform, requireNativeComponent, UIManager, Text, View, TouchableOpacity, findNodeHandle, processColor } from 'react-native';
import Proptypes from 'prop-types';

const componentName   = "RCTPopoverView";
const NativeCommands  = UIManager[componentName]?.Commands;
const NativeComponent = requireNativeComponent(componentName);

const NATIVE_COMMAND_KEYS = {
  'setVisibility': 'setVisibility',
};

export class PopoverView extends React.PureComponent {
  static proptypes = {
    popoverSize             : Proptypes.string,
    popoverBackgroundColor  : Proptypes.string,
    permittedArrowDirections: Proptypes.arrayOf(Proptypes.string),
    popoverCanOverlapSourceViewRect: Proptypes.bool,
    // events --------------------------
    onPopoverWillShow  : Proptypes.func,
    onPopoverWillHide  : Proptypes.func,
    onPopoverDidShow   : Proptypes.func,
    onPopoverDidHide   : Proptypes.func,
    onPopoverWillCreate: Proptypes.func,
  };

  setVisibility = (visibility) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.nativeRef),
      NativeCommands?.[NATIVE_COMMAND_KEYS.setVisibility],
      [visibility]
    );
  };

  //#region - Event Handlers

  _handleOnPopoverWillShow = () => {
    this.props.onPopoverWillShow?.();
  };

  _handleOnPopoverWillHide = () => {
    this.props.onPopoverWillHide?.();
  };

  _handleOnPopoverDidShow = () => {
    this.props.onPopoverDidShow?.();
  };

  _handleOnPopoverDidHide = () => {
    this.props.onPopoverDidHide?.();
  };

  //#endregion

  render(){
    const props = this.props;

    const nativeProps = {
      // Values ----------------------------------------
      popoverSize                    : props.popoverSize,
      permittedArrowDirections       : props.permittedArrowDirections,
      popoverCanOverlapSourceViewRect: props.canOverlapSourceViewRect,
      popoverBackgroundColor         : processColor(props.popoverBackgroundColor),
      // Events -------------------------------------------
      onPopoverWillShow  : this._handleOnPopoverWillShow  ,
      onPopoverWillHide  : this._handleOnPopoverWillHide  ,
      onPopoverDidShow   : this._handleOnPopoverDidShow   ,
      onPopoverDidHide   : this._handleOnPopoverDidHide   ,
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