import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text, ViewProps } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { Button } from '../components/Button';
import { ExampleItemPopoverView } from '../components/ExampleItemPopoverView';


export default function PopoverViewExample01(props: ViewProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample01'}
      subtitle={'Min. Example'}
      desc={'A bare min. `PopoverView` example usage'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
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
  },
});
