import * as React from 'react';
import { useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';
import { Button } from './Button';
import { ExampleItemPopoverView } from './ExampleItemPopoverView';


export default function PopoverViewExample01(props) {
  const popoverRef = useRef();
  const onPressButton = useCallback(() => {
    popoverRef.current.setVisibility(true);
  });

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample01'}
      subtitle={'Bare Min. Example'}
      desc={'Basic `PopoverView` example'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        renderPopoverContent={() => (
          <View style={{padding: 20}}>
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
