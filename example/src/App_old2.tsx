import * as React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import PopoverViewExample01 from './components/PopoverViewExample01';
import PopoverViewExample02 from './components/PopoverViewExample02';
import PopoverViewExample03 from './components/PopoverViewExample03';
import PopoverViewExample04 from './components/PopoverViewExample04';
import PopoverViewExample05 from './components/PopoverViewExample05';
import PopoverViewExample06 from './components/PopoverViewExample06';
import PopoverViewExample07 from './components/PopoverViewExample07';
import PopoverViewExample08 from './components/PopoverViewExample08';


type RootStackParamList = {
  Home: undefined;
  Test: undefined;
};

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


const HomeScreen = (props: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Test');
          }}
        >
          <Text>
            Push
          </Text>
        </TouchableOpacity>

        {examples.map((element, index) => 
          React.createElement(element, { 
            key  : `example-item-${index}`,
            // @ts-ignore
            index: (index + 1),
            // pass down props
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const TestScreen = (props: NativeStackScreenProps<RootStackParamList, 'Test'>) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.push('Home');
        }}
      >
        <Text>
          {'Test Screen'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingBottom: 30,
  },
});
