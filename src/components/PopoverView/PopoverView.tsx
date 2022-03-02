import React from 'react';
import { StyleSheet, findNodeHandle, processColor, View, Platform } from 'react-native';

import { RNIPopoverView } from '../../native_components/RNIPopoverView';
import { RNIPopoverViewModule } from '../../native_modules/PopoverViewModule';

import type { PopoverViewProps, PopoverViewState } from './PopoverViewTypes';
import type { OnPopoverDidHideEvent } from '../../types/PopoverViewEvents';

import * as Helpers from '../../functions/helpers';
import { IS_PLATFORM_IOS } from 'src/constants/LibEnv';


export class PopoverView extends 
  React.PureComponent<PopoverViewProps, PopoverViewState> {

  nativeRef!: React.Component;
  
  constructor(props: PopoverViewProps){
    super(props);
    
    this.state = {
      /** controls whether the popover content is mounted */
      mountPopover: false,
    };
  };

  componentWillUnmount(){
    this.setVisibility(false);
  };

  private getProps = () => {
    const {
      popoverBackgroundColor,
      permittedArrowDirections,
      popoverSize,
      popoverShouldDismiss,
      popoverCanOverlapSourceViewRect,
      lazyPopover,
      renderPopoverContent,
      onPopoverDidHide,
      onPopoverWillShow,
      onPopoverWillHide,
      onPopoverDidShow,
      onPopoverDidHideViaTap,
      onPopoverWillHideViaTap,
      onPopoverDidAttemptToDismiss,
      ...viewProps
    } = this.props;

    return {
      // A. Provide default values to props...
      lazyPopover: lazyPopover ?? true,
      popoverShouldDismiss: popoverShouldDismiss ?? true ,

      // B. Pass down props...
      popoverBackgroundColor,
      permittedArrowDirections,
      popoverSize,
      popoverCanOverlapSourceViewRect,
      renderPopoverContent,
      onPopoverDidHide,
      onPopoverWillShow,
      onPopoverWillHide,
      onPopoverDidShow,
      onPopoverDidHideViaTap,
      onPopoverWillHideViaTap,
      onPopoverDidAttemptToDismiss,
      
      // C. Move all the default view-related
      //    props here...
      viewProps
    };
  };

  // #region - Public Methods
  // ------------------------

  /** show or hide the popover */
  setVisibility = async (visibility: boolean) => {
    const { lazyPopover } = this.getProps();

    try {
      if(visibility){
        await Promise.all([
          Helpers.setStateAsync(this, {mountPopover: true}),
          // temp bugfix: wait for popover to mount
          lazyPopover && Helpers.timeout(50)
        ]);
      };

      await RNIPopoverViewModule.setVisibility(
        findNodeHandle(this.nativeRef)!,
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
    return await RNIPopoverViewModule.getVisibility(
      findNodeHandle(this.nativeRef)!
    );
  };

  //#endregion

  // #region - Event Handlers
  // ------------------------

  _handleOnPopoverDidHide: OnPopoverDidHideEvent = (event) => {
    this.props.onPopoverDidHide?.(event);
    Helpers.setStateAsync(this, {mountPopover: false});
  };

  //#endregion

  render(){
    const props = this.getProps();
    const { mountPopover } = this.state;

    return IS_PLATFORM_IOS ? (
      <RNIPopoverView
        ref={r => { this.nativeRef = r! }}
        {...props.viewProps}
        // props
        popoverBackgroundColor={props.popoverBackgroundColor}
        permittedArrowDirections={props.permittedArrowDirections}
        popoverSize={props.popoverSize}
        popoverShouldDismiss={props.popoverShouldDismiss}
        popoverCanOverlapSourceViewRect={props.popoverCanOverlapSourceViewRect}
        // events
        onPopoverWillShow={props.onPopoverWillShow}
        onPopoverWillHide={props.onPopoverWillHide}
        onPopoverDidShow={props.onPopoverDidShow}
        onPopoverDidHide={this._handleOnPopoverDidHide}
        onPopoverDidHideViaTap={props.onPopoverDidHideViaTap}
        onPopoverWillHideViaTap={props.onPopoverWillHideViaTap}
        onPopoverDidAttemptToDismiss={props.onPopoverDidAttemptToDismiss}
      >
        <View style={styles.popoverContainer}>
          {(mountPopover || !props.lazyPopover) && (
            props.renderPopoverContent?.()
          )}
        </View>
        {this.props.children}
      </RNIPopoverView>
    ) : (
      <View {...props.viewProps}>
        {this.props.children}
      </View>
    );
  };
};

const styles = StyleSheet.create({
  popoverContainer: {
    position: 'absolute',
    color: 'transparent',
  },
});