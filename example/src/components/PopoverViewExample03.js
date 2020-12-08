import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';
import { Button } from './Button';
import { ExampleItemPopoverView } from './ExampleItemPopoverView';


export default function PopoverViewExample03(props) {
  const popoverRef = useRef();

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample03'}
      subtitle={'popoverSize: "STRETCH"'}
      desc={'A example `PopoverView` with the `popoverSize` prop set to "STRETCH"'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        popoverSize={'STRETCH'}
        popoverCanOverlapSourceViewRect={false}
        permittedArrowDirections={["up", "down"]}
        renderPopoverContent={() => (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.popoverText}>
              {'Popover Content'}
            </Text>
          </View>
        )}
      >
        <Button onPress={() => {
          popoverRef.current.setVisibility(true);
        }}/>
      </PopoverView>
    </ExampleItemPopoverView>
  );
};

const styles = StyleSheet.create({
  popoverText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
