import * as React from 'react';

import { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';
import { CardButton } from '../components/Card/CardButton';
import { ExampleItemCard } from '../components/ExampleItemCard';

import type { SharedExampleProps } from './SharedExampleTypes';


export default function PopoverViewExample04(props: SharedExampleProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemCard
      style={props.style}
      title={'PopoverViewExample04'}
      subtitle={'BG Color'}
      description={[
        'A example `PopoverView` with the `popoverBackgroundColor` prop set to "pink"'
      ]}
    >
      <PopoverView
        ref={popoverRef}
        popoverBackgroundColor={'pink'}
        renderPopoverContent={() => (
          <View style={styles.popoverContentContainer}>
            <Text style={styles.popoverText}>
              {'Popover Content'}
            </Text>
          </View>
        )}
      >
        <CardButton onPress={() => {
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
