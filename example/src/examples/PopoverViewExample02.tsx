import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text, ViewProps } from 'react-native';

import { PopoverArrowDirections, PopoverView } from 'react-native-ios-popover';

import { Button } from '../components/Button';
import { ExampleItemPopoverView } from '../components/ExampleItemPopoverView';


const DIRECTIONS_MAP: [string, PopoverArrowDirections[]][] = [
  ["up"       , ['up'   ]],
  ["left"     , ['left' ]],
  ["down"     , ['down' ]],
  ["right"    , ['right']],
  ["any"      , ['any'  ]],
  ["[] or nil", [       ]]
];

export default function PopoverViewExample02(props: ViewProps) {
  const popoverRef = useRef<PopoverView>(null);

  const [index, setIndex] = React.useState(0);
  const [label, arrowDirection] = DIRECTIONS_MAP[index % 6];

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
          setIndex(i => i + 1);
        }}
        renderPopoverContent={() => (
          <View style={styles.popoverContentContainer}>
            <Text style={styles.popoverText}>
              {`${label} Arrow`}
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
