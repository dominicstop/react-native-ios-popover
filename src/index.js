import React from 'react';
import { NativeModules, UIManager, StyleSheet, requireNativeComponent, findNodeHandle, processColor, View } from 'react-native';
import Proptypes from 'prop-types';

import * as Helpers from './functions/helpers';


const componentName   = "RCTPopoverView";
const NativeCommands  = UIManager[componentName]?.Commands;
const NativeComponent = requireNativeComponent(componentName);

const moduleName    = "PopoverModule";
const PopoverModule = NativeModules[moduleName];

const COMP_COMMAND_KEYS = {
  'setVisibility': 'setVisibility',
};

const MODULE_COMMAND_KEYS = {
  'setVisibility': 'setVisibility',
};

export class PopoverView extends React.PureComponent {
  static proptypes = {
    popoverSize             : Proptypes.string,
    popoverBackgroundColor  : Proptypes.string,
    permittedArrowDirections: Proptypes.arrayOf(Proptypes.string),
    // flags -------------------
    lazyPopover: Proptypes.bool,
    popoverShouldDismiss: Proptypes.bool,
    popoverCanOverlapSourceViewRect: Proptypes.bool,
    // events --------------------------
    onPopoverWillShow  : Proptypes.func,
    onPopoverWillHide  : Proptypes.func,
    onPopoverDidShow   : Proptypes.func,
    onPopoverDidHide   : Proptypes.func,
    onPopoverWillCreate: Proptypes.func,
  };

  static defaultProps = {
    lazyPopover: true,
    popoverShouldDismiss: true,
  };
  
  constructor(props){
    super(props);

    this.state = {
      mountPopover: false,
    };
  };

  setVisibility = async (visibility) => {
    const { lazyPopover } = this.props;

    if(visibility){
      await Promise.all([
        Helpers.setStateAsync(this, {mountPopover: true}),
        // temp bugfix: wait for popover to mount
        lazyPopover && Helpers.timeout(50)
      ]);
    };

    await PopoverModule[MODULE_COMMAND_KEYS.setVisibility](
      findNodeHandle(this.nativeRef),
      visibility
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
    Helpers.setStateAsync(this, {mountPopover: false});
  };

  //#endregion

  render(){
    const props = this.props;
    const { mountPopover } = this.state;

    const nativeProps = {
      // Values ----------------------------------
      popoverSize             : props.popoverSize,
      permittedArrowDirections: props.permittedArrowDirections,
      popoverBackgroundColor  : processColor(props.popoverBackgroundColor),
      // Flags ----------------------------------------
      popoverShouldDismiss: props.popoverShouldDismiss,
      popoverCanOverlapSourceViewRect: props.popoverCanOverlapSourceViewRect,
      // Events ---------------------------------------
      onPopoverWillShow: this._handleOnPopoverWillShow,
      onPopoverWillHide: this._handleOnPopoverWillHide,
      onPopoverDidShow : this._handleOnPopoverDidShow ,
      onPopoverDidHide : this._handleOnPopoverDidHide ,
    };

    return(
      <NativeComponent
        ref={r => this.nativeRef = r}
        {...nativeProps}
      >
        <View style={styles.popoverContainer}>
          {(mountPopover || !props.lazyPopover) && (
            props.renderPopoverContent?.()
          )}
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