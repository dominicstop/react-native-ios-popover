import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';
import { Button } from './Button';
import { ExampleItemPopoverView } from './ExampleItemPopoverView';


export default function PopoverViewExample02(props) {
  const popoverRef = useRef();

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample02'}
      subtitle={'Prop Example: `permittedArrowDirections`'}
      desc={'A example `PopoverView` with the `permittedArrowDirections` set to "left"'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        permittedArrowDirections={["left"]}
        renderPopoverContent={() => (
          <View style={{padding: 20}}>
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
