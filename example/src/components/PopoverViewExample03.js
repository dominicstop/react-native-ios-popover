import * as React from 'react';
import { useCallback, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';
import { Button } from './Button';
import { ExampleItemPopoverView } from './ExampleItemPopoverView';


export default function PopoverViewExample03(props) {
  const popoverRef = useRef();
  const onPressButton = useCallback(() => {
    popoverRef.current.setVisibility(true);
  });

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample03'}
      subtitle={'Stretch'}
      desc={'A example `PopoverView` with the `popoverSize` props set to "STRETCH"'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        popoverSize={'STRETCH'}
        permittedArrowDirections={["down"]}
        renderPopoverContent={() => (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.popoverText}>
              {'Popover Content'}
            </Text>
          </View>
        )}
      >
        <Button onPress={onPressButton}/>
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
