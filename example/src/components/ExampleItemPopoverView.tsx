import * as React from 'react';
import { StyleSheet, View, Text, ViewProps } from 'react-native';

import * as Colors from '../constants/Colors';


export type ExampleItemPopoverViewBaseProps = {
  title?: string;
  subtitle?: string;
  desc?: string;
  index?: number;
};

export type ExampleItemPopoverViewProps = 
  ViewProps & ExampleItemPopoverViewBaseProps; 

export class ExampleItemPopoverView 
  extends React.Component<ExampleItemPopoverViewProps> {

  render(){
    const { children, ...props } = this.props;

    return(
      <View
        style={[styles.rootContainer, props.style]}
        {...props}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.textTitleIndex}>
            {`${props.index ?? 0}. `}
          </Text>
          <Text style={styles.textTitle}>
            {props.title ?? 'N/A'}
            {props.subtitle && (
              <Text style={styles.textSubtitle}>
                {` (${props.subtitle})`}
              </Text>
            )}
          </Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.textDescription}>
            <Text style={styles.textDescriptionLabel}>
              {'Description: '}
            </Text>
            {props.desc ?? "N/A"}
          </Text>
        </View>
        {children}
      </View>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    borderRadius: 10,
    margin: 20,
    overflow: 'hidden',
    backgroundColor: Colors.BLUE[50]
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: Colors.BLUE[500]
  },
  textTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
    marginLeft: 2,
  },
  textTitleIndex: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
  },
  textSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '300',
  },
  subtitleContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textDescription: {
    fontWeight: '300',
    color: 'rgba(0,0,0,0.75)'
  },
  textDescriptionLabel: {
    color: Colors.BLUE[1100],
    fontWeight: 'bold',
  },
});