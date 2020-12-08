import * as React from 'react';
import { useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { Button } from './Button';
import { ExampleItemPopoverView } from './ExampleItemPopoverView';

import * as Colors from '../constants/Colors';

export default function PopoverViewExample05(props) {
  const popoverRef = useRef();

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample05'}
      subtitle={'setVisibility'}
      desc={'A example `PopoverView` for programmatically hiding the popover via the `setVisibility` function.'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        popoverShouldDismiss={false}
        onPopoverDidAttemptToDismiss={() => {
          alert('onPopoverDidAttemptToDismiss');
        }}
        renderPopoverContent={() => (
          <View style={{padding: 20}}>
            <TouchableOpacity 
              style={styles.buttonContainer}
              activeOpacity={0.85}
              onPress={() => {
                popoverRef.current.setVisibility(false);
              }}
            >
              <Text style={styles.popoverText}>
                {'Dismiss Popover'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <Button onPress={() => {
          popoverRef.current.setVisibility(true)
        }}/>
      </PopoverView>
    </ExampleItemPopoverView>
  );
};

const styles = StyleSheet.create({
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
