import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';
import { Button } from './Button';
import { ExampleItemPopoverView } from './ExampleItemPopoverView';


export default function PopoverViewExample02(props) {
  const popoverRef = useRef();

  const [index, setIndex] = React.useState(0);

  const [label, arrowDirection] = [
    ["up"       , ['up'   ]],
    ["left"     , ['left' ]],
    ["down"     , ['down' ]],
    ["right"    , ['right']],
    ["any"      , ['any'  ]],
    ["[] or nil", [       ]]
  ][index % 6];

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample02'}
      subtitle={'Prop Example: `permittedArrowDirections`'}
      desc={'A example `PopoverView` with the `permittedArrowDirections` set to "left"'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        permittedArrowDirections={arrowDirection}
        onPopoverDidHide={() => {
          setIndex(index => index + 1);
        }}
        renderPopoverContent={() => (
          <View style={{padding: 20}}>
            <Text style={styles.popoverText}>
              {`${label} Arrow`}
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
