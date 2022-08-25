import * as React from 'react';
import { useState, useRef } from 'react';
import { StyleSheet, View, Text, Switch, Alert } from 'react-native';

import { PopoverView } from 'react-native-ios-popover';

import { CardButton } from '../components/Card/CardButton';
import { ExampleItemCard } from '../components/ExampleItemCard';

import type { SharedExampleProps } from './SharedExampleTypes';


export default function PopoverViewExample07(props: SharedExampleProps) {
  const popoverRef = useRef<PopoverView>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <ExampleItemCard
      style={props.style}
      title={'PopoverViewExample07'}
      subtitle={'onPopoverDidAttemptToDismiss'}
      description={[
        'A example `PopoverView` that has a switch that toggles the `popoverShouldDismiss` prop'
      ]}
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
        <CardButton 
          title={'⭐️ Toggle Popover'}
          onPress={() => {
            popoverRef.current?.setVisibility(true);
          }}
        />
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
