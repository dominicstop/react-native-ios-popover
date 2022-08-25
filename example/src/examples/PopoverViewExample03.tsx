import * as React from 'react';

import { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { Button } from '../components/Button';
import { ExampleItemCard } from '../components/ExampleItemCard';

import type { SharedExampleProps } from './SharedExampleTypes';


export default function PopoverViewExample03(props: SharedExampleProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemCard
      style={props.style}
      title={'PopoverViewExample03'}
      subtitle={'popoverSize: "STRETCH"'}
      description={[
        'A example `PopoverView` with the `popoverSize` prop set to "STRETCH"'
      ]}
    >
      <PopoverView
        ref={popoverRef}
        popoverSize={{type: 'STRETCH'}}
        popoverCanOverlapSourceViewRect={false}
        permittedArrowDirections={["up", "down"]}
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
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  popoverText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
