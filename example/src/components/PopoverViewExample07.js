import * as React from 'react';
import { useState, useRef } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';
import { Button } from './Button';
import { ExampleItemPopoverView } from './ExampleItemPopoverView';


export default function PopoverViewExample07(props) {
  const popoverRef = useRef();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <ExampleItemPopoverView
      title={'PopoverViewExample07'}
      subtitle={'onPopoverDidAttemptToDismiss'}
      desc={'A example `PopoverView` that has a switch that toggles the `onPopoverDidAttemptToDismiss` prop'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        popoverShouldDismiss={isEnabled}
        onPopoverDidAttemptToDismiss={() => alert('onPopoverDidAttemptToDismiss')}
        renderPopoverContent={() => (
          <View style={styles.popoverContainer}>
            <Text style={styles.popoverText}>
              {'popoverShouldDismiss'}
            </Text>
            <Switch
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
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
    fontSize: 14,
    marginRight: 20,
  },
  popoverContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
