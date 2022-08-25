import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewProps, Alert } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { Button } from './../components/Button';
import { ExampleItemPopoverView } from './../components/ExampleItemPopoverView';

import * as Colors from '../constants/Colors';


export default function PopoverViewExample05(props: ViewProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample05'}
      subtitle={'setVisibility'}
      desc={'A example `PopoverView` for programmatically hiding the popover via the `setVisibility` function.'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        onPopoverDidHideViaTap={() => {
          Alert.alert('onPopoverDidHideViaTap');
        }}
        renderPopoverContent={() => (
          <View style={styles.popoverContentContainer}>
            <TouchableOpacity 
              style={styles.buttonContainer}
              activeOpacity={0.85}
              onPress={() => {
                popoverRef.current?.setVisibility(false);
              }}
            >
              <Text style={styles.popoverText}>
                {'Dismiss Popover'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <Button
          buttonText={'⭐️ Toggle Popover'}
          onPress={() => {
            popoverRef.current?.toggleVisibility()
          }}
        />
      </PopoverView>
    </ExampleItemPopoverView>
  );
};

const styles = StyleSheet.create({
  popoverContentContainer: {
    padding: 20
  },
  popoverText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  buttonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.BLUE.A400,
    borderRadius: 10,
  },
});
