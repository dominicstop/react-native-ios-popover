import * as React from 'react';
import { StyleSheet, SafeAreaView, FlatList, ListRenderItem } from 'react-native';

import type { SharedExampleProps } from '../examples/SharedExampleTypes';

import { PopoverViewExample01 } from '../examples/PopoverViewExample01';
import { PopoverViewExample02 } from '../examples/PopoverViewExample02';
import { PopoverViewExample03 } from '../examples/PopoverViewExample03';
import { PopoverViewExample04 } from '../examples/PopoverViewExample04';
import { PopoverViewExample05 } from '../examples/PopoverViewExample05';
import { PopoverViewExample06 } from '../examples/PopoverViewExample06';
import { PopoverViewExample07 } from '../examples/PopoverViewExample07';
import { PopoverViewExample08 } from '../examples/PopoverViewExample08';

import { DebugControls } from '../examples/DebugControls';
import { SHARED_ENV } from '../constants/SharedEnv';

type ExampleListItem = {
  id: number;
  component: React.FC<SharedExampleProps>;
};

const EXAMPLE_COMPONENTS = [
  SHARED_ENV.enableReactNavigation && DebugControls,
  PopoverViewExample01,
  PopoverViewExample02,
  PopoverViewExample03,
  PopoverViewExample04,
  PopoverViewExample05,
  PopoverViewExample06,
  PopoverViewExample07,
  PopoverViewExample08,
];

// @ts-ignore
const EXAMPLE_ITEMS: ExampleListItem[] = (EXAMPLE_COMPONENTS
  .filter(item => !!item)
  .map((item, index) => ({
    id: index + 1,
    component: item
  }))
);

export function HomeScreen() {
  const renderItem: ListRenderItem<ExampleListItem>  = ({ item })  => (
    React.createElement(item.component, {
      index: item.id,
      style: styles.exampleListItem
    })
  );

  return (
    <SafeAreaView>
      <FlatList
        contentContainerStyle={styles.scrollContentContainer}
        data={EXAMPLE_ITEMS}
        renderItem={renderItem}
        keyExtractor={(item) => `item-${item.id}`}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    paddingTop: 20,
  },
  exampleListItem: {
    marginBottom: 15,
  },
});