import React from 'react';
import { StyleSheet, findNodeHandle, View, processColor } from 'react-native';

import { RNIPopoverView } from '../../native_components/RNIPopoverView';
import { RNIPopoverViewModule } from '../../native_modules/RNIPopoverViewModule';

import type { PopoverViewProps, PopoverViewState } from './PopoverViewTypes';
import type { OnPopoverDidHideEvent } from '../../types/PopoverViewEvents';

import * as Helpers from '../../functions/helpers';

import { IS_PLATFORM_IOS } from '../../constants/LibEnv';
import { ErrorUtilities, NativeError, RNIWrapperView } from 'react-native-ios-utilities';
import { RNIPopoverErrorCodes } from '../../constants/RNIPopoverErrorCodes';


const NATIVE_ID_KEYS = {
  popoverWrapperView: 'popoverContentView',
};

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
  setVisibility = async (
    visibility: boolean,
    options: {
      suppressVisibilityError: boolean
    } = {
      suppressVisibilityError: true
    }
  ) => {
    const { lazyPopover } = this.getProps();
    if(!IS_PLATFORM_IOS) return;

    try {
      if(visibility){
        await Promise.all([
          Helpers.setStateAsync(this, { mountPopover: true }),
          // temp bugfix: wait for popover to mount
          lazyPopover && Helpers.timeout(50)
        ]);
      };

      await RNIPopoverViewModule.setVisibility(
        findNodeHandle(this.nativeRef)!,
        visibility
      );

    } catch(error: unknown){
      if(ErrorUtilities.isNativeError(error)){
        const nativeError = error as NativeError;

        const isVisibilityError = (
          nativeError.code === RNIPopoverErrorCodes.popoverAlreadyHidden ||
          nativeError.code === RNIPopoverErrorCodes.popoverAlreadyVisible
        );

        if(isVisibilityError && options.suppressVisibilityError){
          // no-op - don't show "popover already visible/hidden"-related errors

        } else {
          console.warn(`Code: ${error.code} - Message: ${error.message}`);
          throw error;
        };

      } else if((error as any) instanceof Error){
        throw error;

      } else {
        throw error
      };
    };
  };

  /** toggle the popover visibility */
  toggleVisibility = async () => {
    if(!IS_PLATFORM_IOS) return;

    const visibility = await this.getVisibility();
    await this.setVisibility(!visibility);
  };

  getVisibility = async () => {
    if(!IS_PLATFORM_IOS) return;

    return await RNIPopoverViewModule.getVisibility(
      findNodeHandle(this.nativeRef)!
    );
  };

  //#endregion

  // #region - Event Handlers
  // ------------------------

  _handleOnPopoverDidHide: OnPopoverDidHideEvent = (event) => {
    this.props.onPopoverDidHide?.(event);
    event.stopPropagation();

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
        popoverBackgroundColor={
          processColor(props.popoverBackgroundColor)
        }
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
        {(mountPopover || !props.lazyPopover) as any && (
          <RNIWrapperView
            style={styles.popoverContentWrapper}
            nativeID={NATIVE_ID_KEYS.popoverWrapperView}
            isDummyView={true}
            shouldAutoDetachSubviews={true}
            shouldCreateTouchHandlerForSubviews={true}
            shouldNotifyComponentWillUnmount={true}
            shouldAutoCleanupOnJSUnmount={true}
            shouldAutoSetSizeOnLayout={true}
          >
            {props.renderPopoverContent?.()}
          </RNIWrapperView>
        )}
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
  popoverContentWrapper: {
    position: 'absolute',
    color: 'transparent',
  },
});