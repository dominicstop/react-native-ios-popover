import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { CardButton } from '../components/CardButton';
import { ExampleItemCard } from '../components/ExampleItemCard';

import type { SharedExampleProps } from './SharedExampleTypes';


export default function PopoverViewExample08(props: SharedExampleProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemCard
      style={props.style}
      title={'PopoverViewExample08'}
      subtitle={'Toggle Popover'}
      description={[
        'A example `PopoverView` for the `toggleVisibility` function'
      ]}
    >
      <PopoverView
        ref={popoverRef}
        popoverShouldDismiss={false}
        renderPopoverContent={() => (
          <View style={styles.popoverContentContainer}>
            <Text style={styles.popoverText}>
              {'Popover Content'}
            </Text>
          </View>
        )}
      >
        <CardButton
          buttonText={'⭐️ Toggle Popover'}
          onPress={() => {
            popoverRef.current?.toggleVisibility();
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
