import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { CardButton } from '../components/Card/CardButton';
import { ExampleItemCard } from '../components/ExampleItemCard';

import type { SharedExampleProps } from './SharedExampleTypes';


export default function PopoverViewExample06(props: SharedExampleProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemCard
      style={props.style}
      title={'PopoverViewExample06'}
      subtitle={'Events Example'}
      description={[
        'A simple `PopoverView` example for the popover did show/hide events'
      ]}
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
        <CardButton 
          title={'⭐️ Toggle Popover'}
          onPress={() => {
            popoverRef.current?.setVisibility(true);
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
  },
});
