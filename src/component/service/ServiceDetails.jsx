import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import THEMECOLOR from '../../utilities/color';
import useBackHandler from '../../utilities/useBackHandler';
import { formatAmount } from '../../utilities/formatAmount';

export default function ServiceDetails() {
  useBackHandler();
  const route = useRoute();
  const navigation = useNavigation();
  const service = route.params.item;
  console.log('service', service);

  return (
    <View>
      {/* <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
          alignItems: 'center',
          backgroundColor: 'white',
          elevation: 4,
          paddingBottom: 10,
          borderBottomColor: '#e5e5e5',
          borderBottomWidth: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            color="black"
            size={19}
            style={{
              backgroundColor: '#f5f5f5',
              width: 40,
              height: 40,
              textAlign: 'center',
              paddingTop: 10,
              borderRadius: 50,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </TouchableOpacity>
      </View> */}
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            marginTop: 25,
            flexWrap: 'wrap',
          }}>
          {service.additional_images.map((image, index) => (
            <View
              key={index}
              style={{
                width: '33.33%',
                paddingHorizontal: 5,
              }}>
              <View
                style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 10,
                  marginBottom: 10,
                  padding: 5,
                }}>
                <Image
                  source={{uri: image}}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                    alignSelf: 'center',
                  }}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={{paddingHorizontal: 10}}>
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
              marginBottom: 10,
              fontSize: 18,
            }}>
            {service.service_name}
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: '#e91e63',
              marginBottom: 10,
              fontSize: 13,
            }}>
            ₹{formatAmount(service.price)}/day
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2e2e2e',
              marginBottom: 10,
              fontSize: 14,
            }}>
            Description:
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: '#2e2e2e',
              marginBottom: 10,
              fontSize: 13,
            }}>
            {service.service_description}
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2e2e2e',
              marginBottom: 10,
              fontSize: 14,
            }}>
            Service Status:
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color:
                service.approval_status === 'Under Review'
                  ? 'orange'
                  : service.approval_status === 'Approved'
                  ? 'green'
                  : '#e91e63',
              marginBottom: 10,
              fontSize: 13,
            }}>
            {service.approval_status}
          </Text>
          {service.approval_status === 'Disapproved' && (
            <>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  color: '#2e2e2e',
                  marginBottom: 10,
                  fontSize: 14,
                }}>
                Reason for Disaapprove
              </Text>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#2e2e2e',
                  marginBottom: 10,
                  fontSize: 13,
                }}>
                {service.reason_for_disapprove}
              </Text>
            </>
          )}
          {/* {service.additional_services.length > 0 && (
            <>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  color: '#2e2e2e',
                  marginBottom: 10,
                  fontSize: 14,
                }}>
                Additional Details
              </Text>
              {service.additional_services.map(ele => (
                <View
                  key={ele._id}
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#2e2e2e',
                      marginBottom: 10,
                      fontSize: 13,
                      flex: 0.4,
                    }}>
                    {ele.name}
                  </Text>
                  <Text
                    style={{
                      flex: 0.2,
                      fontFamily: 'Montserrat-Medium',
                      color: '#2e2e2e',
                      textAlign: 'right',
                    }}>
                    :
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      color: '#2e2e2e',
                      marginBottom: 10,
                      fontSize: 13,
                      flex: 0.4,
                      marginLeft: 40,
                      textAlign: 'center',
                    }}>
                    {ele.value}
                  </Text>
                </View>
              ))}
            </>
          )} */}
        </View>
      </ScrollView>
    </View>
  );
}
