import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { PopoverArrowDirections, PopoverView } from 'react-native-ios-popover';

import { CardButton } from '../components/Card/CardButton';
import { ExampleItemCard } from '../components/ExampleItemCard';

import type { SharedExampleProps } from './SharedExampleTypes';


const DIRECTIONS_MAP: [string, PopoverArrowDirections[]][] = [
  ["up"       , ['up'   ]],
  ["left"     , ['left' ]],
  ["down"     , ['down' ]],
  ["right"    , ['right']],
  ["any"      , ['any'  ]],
  ["[] or nil", [       ]]
];

export default function PopoverViewExample02(props: SharedExampleProps) {
  const popoverRef = useRef<PopoverView>(null);

  const [index, setIndex] = React.useState(0);
  const [label, arrowDirection] = DIRECTIONS_MAP[index % 6];

  return (
    <ExampleItemCard
      style={props.style}
      title={'PopoverViewExample02'}
      subtitle={'Prop Example: `permittedArrowDirections`'}
      description={[
        'A example `PopoverView` with the `permittedArrowDirections` set to "left"'
      ]}
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
