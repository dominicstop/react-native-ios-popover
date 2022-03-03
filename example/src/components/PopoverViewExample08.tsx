import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text, ViewProps } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';
import { Button } from './Button';
import { ExampleItemPopoverView } from './ExampleItemPopoverView';


export default function PopoverViewExample08(props: ViewProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample08'}
      subtitle={'Toggle Popover'}
      desc={'A example `PopoverView` for the `toggleVisibility` function'}
      {...props}
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
        <Button
          buttonText={'⭐️ Toggle Popover'}
          onPress={() => {
            popoverRef.current?.toggleVisibility();
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
  },
});
