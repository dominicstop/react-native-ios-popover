import * as React from 'react';

import { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { CardButton } from '../components/Card/CardButton';
import { ExampleItemCard } from '../components/ExampleItemCard';

import type { SharedExampleProps } from './SharedExampleTypes';

import * as Colors from '../constants/Colors';


export default function PopoverViewExample05(props: SharedExampleProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemCard
      style={props.style}
      title={'PopoverViewExample05'}
      subtitle={'setVisibility'}
      description={[
        'A example `PopoverView` for programmatically hiding the popover via the `setVisibility` function.'
      ]}
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
        <CardButton
          title={'⭐️ Toggle Popover'}
          onPress={() => {
            popoverRef.current?.toggleVisibility()
          }}
        />
      </PopoverView>
    </ExampleItemCard>
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
