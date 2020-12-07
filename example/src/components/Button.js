import * as React from 'react';
import { useCallback, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import * as Colors from '../constants/Colors';


export function Button(props){
  return(
    <TouchableOpacity
      style={styles.buttonContainer}
      activeOpacity={0.85}
      {...props}
    >
      <Text style={styles.buttonText}>
        {props.buttonText ?? "⭐️ Show Popover"}
      </Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  buttonContainer: {
    margin: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.BLUE.A400,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
});