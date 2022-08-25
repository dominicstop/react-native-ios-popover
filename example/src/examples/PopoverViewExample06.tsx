import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text, ViewProps, Alert } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { Button } from './../components/Button';
import { ExampleItemCard } from '../components/ExampleItemCard';


export default function PopoverViewExample06(props: ViewProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemCard
      title={'PopoverViewExample06'}
      subtitle={'Events Example'}
      desc={'A simple `PopoverView` example for the popover did show/hide events'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        onPopoverDidHide={() => Alert.alert('event', 'onPopoverDidHide')}
        onPopoverDidShow={() => Alert.alert('event', 'onPopoverDidShow')}
        renderPopoverContent={() => (
          <View style={styles.popoverContentContainer}>
            <Text style={styles.popoverText}>
              {'Popover Content'}
            </Text>
          </View>
        )}
      >
        <Button onPress={() => {
          popoverRef.current?.setVisibility(true);
        }}/>
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
  },
});
