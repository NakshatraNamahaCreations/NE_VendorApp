import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import THEMECOLOR from './color';
import Stepper from '../component/product/Stepper';

const HorizontalCalendar = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Generate the next 15 days
  // const dates = Array.from({length: 15}, (_, i) =>
  //   moment().add(i, 'days').format('YYYY-MM-DD'),
  // );

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Horizontal Date Picker */}
      {/* <FlatList
        data={dates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({item}) => {
          const isSelected = item === selectedDate;
          return (
            <TouchableOpacity
              style={[styles.dateItem, isSelected && styles.selectedDate]}
              onPress={() => setSelectedDate(item)}>
              <Text
                style={[
                  styles.dateText,
                  isSelected && styles.selectedDateText,
                ]}>
                {moment(item).format('DD')}
              </Text>
              <Text
                style={[styles.dayText, isSelected && styles.selectedDayText]}>
                {moment(item).format('ddd')}
              </Text>
            </TouchableOpacity>
          );
        }}
      /> */}

      <Stepper currentStep={currentStep} />
      {currentStep === 0 ? (
        <CalendarPicker
          startFromMonday={true}
          allowRangeSelection={true}
          minDate={new Date()}
          todayBackgroundColor="transparent"
          selectedDayColor={THEMECOLOR.mainColor}
          selectedDayTextColor="#fff"
          todayTextStyle={{color: 'black'}}
          onDateChange={(date, isStart) => {
            if (isStart) {
              setStartDate(moment(date).format('YYYY-MM-DD'));
              setEndDate(null);
            } else {
              setEndDate(moment(date).format('YYYY-MM-DD'));
            }
          }}
          textStyle={{
            fontFamily: 'Montserrat-Medium',
            color: '#333',
            fontSize: 13,
          }}
        />
      ) : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, currentStep === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentStep === 0}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, currentStep === 2 && styles.disabledButton]}
          onPress={handleNext}
          disabled={currentStep === 2}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  dateItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f2f2f2',
  },
  selectedDate: {
    backgroundColor: THEMECOLOR.mainColor,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDayText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: THEMECOLOR.mainColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
});

export default HorizontalCalendar;
