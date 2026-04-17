import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import THEMECOLOR from '../../utilities/color';

const Stepper = ({currentStep}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        {/* Product Details */}
        <View style={[styles.step, currentStep >= 0 && styles.activeStep]}>
          <Icon name="check" size={14} color="white" />
        </View>
        <View style={[styles.line, currentStep >= 1 && styles.activeLine]} />

        {/* Availability */}
        <View style={[styles.step, currentStep >= 1 && styles.activeStep]}>
          {currentStep >= 1 ? (
            <Icon name="check" size={14} color="white" />
          ) : null}
        </View>
        {/* <View style={[styles.line, currentStep >= 2 && styles.activeLine]} /> */}

        {/* Success */}
        {/* <View style={[styles.step, currentStep >= 2 && styles.activeStep]}>
          {currentStep >= 2 ? (
            <Icon name="check" size={14} color="white" />
          ) : null}
        </View> */}
      </View>

      {/* Step Labels */}
      <View style={styles.labelContainer}>
        <Text style={[styles.label, currentStep >= 0 && styles.activeLabel]}>
          Product List
        </Text>
        <Text style={[styles.label, currentStep >= 1 && styles.activeLabel]}>
          Block Date
        </Text>
        {/* <Text style={[styles.label, currentStep >= 2 && styles.activeLabel]}>
          Success
        </Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#F5B7F3',
    // padding: 10,
    // borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEMECOLOR.mainColor,
  },
  activeStep: {
    backgroundColor: THEMECOLOR.mainColor,
  },
  line: {
    width: '80%',
    height: 2,
    backgroundColor: '#D3D3D3',
  },
  activeLine: {
    backgroundColor: THEMECOLOR.mainColor,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  activeLabel: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
});

export default Stepper;
