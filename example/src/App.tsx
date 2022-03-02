import * as React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import PopoverViewExample01 from './components/PopoverViewExample01';
import PopoverViewExample02 from './components/PopoverViewExample02';
import PopoverViewExample03 from './components/PopoverViewExample03';
import PopoverViewExample04 from './components/PopoverViewExample04';
import PopoverViewExample05 from './components/PopoverViewExample05';
import PopoverViewExample06 from './components/PopoverViewExample06';
import PopoverViewExample07 from './components/PopoverViewExample07';
import PopoverViewExample08 from './components/PopoverViewExample08';


const examples = [
  PopoverViewExample01,
  PopoverViewExample02,
  PopoverViewExample03,
  PopoverViewExample04,
  PopoverViewExample05,
  PopoverViewExample06,
  PopoverViewExample07,
  PopoverViewExample08,
];

export default function App() {
  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {examples.map((element, index) => 
          React.createElement(element, { 
            key  : `example-item-${index}`,
            index: (index + 1),
            // pass down props
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingBottom: 30,
  },
});
