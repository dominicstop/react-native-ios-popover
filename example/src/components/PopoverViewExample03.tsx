import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text, ViewProps } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';
import { Button } from './Button';
import { ExampleItemPopoverView } from './ExampleItemPopoverView';


export default function PopoverViewExample03(props: ViewProps) {
  const popoverRef = useRef<PopoverView>(null);

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample03'}
      subtitle={'popoverSize: "STRETCH"'}
      desc={'A example `PopoverView` with the `popoverSize` prop set to "STRETCH"'}
      {...props}
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
    </ExampleItemPopoverView>
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
