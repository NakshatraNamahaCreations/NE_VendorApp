import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const Calculator = ({tableContent, setOpenCalculator}) => {
  return (
    <View>
      <View
        style={{
          marginVertical: 10,
          borderColor: '#d5d5d5',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 10,
        }}>
        {tableContent.map((ele, index) => (
          <View
            style={{
              borderColor: '#f4f4f4',
              flexDirection: 'row',
              marginBottom: 5,
              padding: 5,
              alignItems: 'center',
            }}
            key={index}>
            <View
              style={{
                width: 'auto',
                padding: '8px',
                flex: 0.5,
              }}>
              <Text
                style={{
                  color: ele.color,
                  fontSize: 14,
                  textAlign: 'left',
                  fontFamily: ele.fontFamily,
                }}>
                {ele.head}
              </Text>
            </View>
            <View
              style={{
                // borderLeft: '1px solid #f4f4f4',
                padding: '8px',
                width: '200px',
                flex: 0.5,
              }}>
              <Text
                style={{
                  textAlign: 'right',
                  color: ele.color,
                  fontSize: 14,
                  fontFamily: ele.fontFamily,
                }}>
                {ele.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity
          onPress={() => setOpenCalculator(false)}
          style={{
            backgroundColor: '#d5d5d5',
            // borderColor: '#767676',
            // borderWidth: 1,
            paddingHorizontal: 15,
            paddingVertical: 6,
            borderRadius: 5,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Calculator;
