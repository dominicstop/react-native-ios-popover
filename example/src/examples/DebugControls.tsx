import * as React from 'react';

import { useNavigation } from '@react-navigation/native';

import type { SharedExampleProps } from './SharedExampleTypes';

import { ExampleItemCard } from '../components/ExampleItemCard';
import { CardButton } from '../components/Card/CardButton';

import { SHARED_ENV } from '../constants/SharedEnv';


const SCREEN_KEYS = [
  'Home',
  'Test01'
];


export function DebugControls(props: SharedExampleProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigation = SHARED_ENV.enableReactNavigation && useNavigation();

  const ScreenItems = SCREEN_KEYS.map(key => (
    <CardButton
      title={`Push: ${key}`}
      subtitle={`Navigate to "${key}" screen...'`}
      onPress={() => {
        // @ts-ignore
        navigation.push(key);
      }}
    />
  ));

  return (
    <ExampleItemCard
      style={props.style}
      index={props.index}
      title={'Debug Controls'}
      subtitle={'For testing and stuff'}
    >
      {ScreenItems}
    </ExampleItemCard>
  );
};