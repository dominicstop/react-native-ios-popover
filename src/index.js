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
  'getVisibility': 'getVisibility',
};

export class PopoverView extends React.PureComponent {
  static proptypes = {
    popoverSize: Proptypes.oneOf([
      Proptypes.object,
      Proptypes.string,
    ]),
    popoverBackgroundColor  : Proptypes.string,
    permittedArrowDirections: Proptypes.arrayOf(Proptypes.string),
    // flags -------------------
    lazyPopover: Proptypes.bool,
    popoverShouldDismiss: Proptypes.bool,
    popoverCanOverlapSourceViewRect: Proptypes.bool,
    // events ------------------------------
    onPopoverDidShow       : Proptypes.func,
    onPopoverDidHide       : Proptypes.func,
    onPopoverWillShow      : Proptypes.func,
    onPopoverWillHide      : Proptypes.func,
    onPopoverDidHideViaTap : Proptypes.func,
    onPopoverWillHideViaTap: Proptypes.func,
    onPopoverDidAttemptToDismiss: Proptypes.func,
  };

  static defaultProps = {
    lazyPopover: true,
    popoverShouldDismiss: true,
  };
  
  constructor(props){
    super(props);
    
    this.state = {
      /** controls whether the popover content is mounted */
      mountPopover: false,
    };
  };

  componentWillUnmount(){
    this.setVisibility(false);
  };

  //#region - Public Methods
  /** show or hide the popover */
  setVisibility = async (visibility) => {
    const { lazyPopover } = this.props;

    try {
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

    } catch(error){
      if(__DEV__){
        console.warn("PopoverView, setVisibility", error);
      };

      throw error;
    };
  };

  /** toggle the popover visibility */
  toggleVisibility = async () => {
    const visibility = await this.getVisibility();
    await this.setVisibility(!visibility);
  };

  getVisibility = async () => {
    return await PopoverModule[MODULE_COMMAND_KEYS.getVisibility](
      findNodeHandle(this.nativeRef)
    );
  };

  //#endregion
  //#region - Event Handlers

  _handleOnPopoverDidHide = () => {
    this.props.onPopoverDidHide?.();
    Helpers.setStateAsync(this, {mountPopover: false});
  };

  //#endregion

  render(){
    const props = this.props;
    const { mountPopover } = this.state;



    const nativeProps = {
      // Values -----------------------------------------------------------
      popoverBackgroundColor  : processColor(props.popoverBackgroundColor),
      permittedArrowDirections: props.permittedArrowDirections,
      // handle `popoverSize` prop...
      ...(Helpers.isObject(props.popoverSize)
        // `props.popoverSize` is width/height obj
        ? { popoverSize: 'CUSTOM', customPopoverSize: props.popoverSize }
        // `props.popoverSize` is string i.e. PopoverSize enum value
        : { popoverSize: props.popoverSize }
      ),
      // Flags ----------------------------------------
      popoverShouldDismiss: props.popoverShouldDismiss,
      popoverCanOverlapSourceViewRect: props.popoverCanOverlapSourceViewRect,
      // Events --------------------------------------------
      onPopoverDidHide       : this._handleOnPopoverDidHide,
      onPopoverWillShow      : props.onPopoverWillShow,
      onPopoverWillHide      : props.onPopoverWillHide,
      onPopoverDidShow       : props.onPopoverDidShow ,
      onPopoverDidHideViaTap : props.onPopoverDidHideViaTap,
      onPopoverWillHideViaTap: props.onPopoverWillHideViaTap,
      onPopoverDidAttemptToDismiss: props.onPopoverDidAttemptToDismiss,
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