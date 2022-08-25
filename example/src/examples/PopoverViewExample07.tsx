import * as React from 'react';
import { useState, useRef } from 'react';
import { StyleSheet, View, Text, Switch, ViewProps, Alert } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { Button } from './../components/Button';
import { ExampleItemCard } from '../components/ExampleItemCard';


export default function PopoverViewExample07(props: ViewProps) {
  const popoverRef = useRef<PopoverView>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <ExampleItemCard
      title={'PopoverViewExample07'}
      subtitle={'onPopoverDidAttemptToDismiss'}
      desc={'A example `PopoverView` that has a switch that toggles the `popoverShouldDismiss` prop'}
      {...props}
    >
      <PopoverView
        ref={popoverRef}
        popoverShouldDismiss={isEnabled}
        onPopoverDidAttemptToDismiss={() => 
          Alert.alert('event', 'onPopoverDidAttemptToDismiss')
        }
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
          popoverRef.current?.setVisibility(true);
        }}/>
      </PopoverView>
    </ExampleItemCard>
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
