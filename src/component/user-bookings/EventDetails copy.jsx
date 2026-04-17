import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';

const EventDetails = () => {
  const captureMoodBoard = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  const event = route.params.events;
  const vendor = route.params.vendorData;
  const [isOpenSummary, setIsOpenSummary] = useState(false);
  const [viewSummaryOpen, setViewSummaryOpen] = useState({});

  //   console.log('events in EventDetails.jsx', event);
  console.log('vendor in EventDetails.jsx', vendor);

  const calculatePayout = () => {
    const orderAmount = event.product_data.reduce(
      (acc, value) => acc + value.totalPrice,
      0,
    );
    const commissionPercentage =
      orderAmount * (vendor.commission_percentage / 100);
    const commissionTax = commissionPercentage * (vendor.commission_tax / 100);
    const totalDeduction = orderAmount - (commissionPercentage + commissionTax);

    return {
      orderAmount: `₹${orderAmount.toFixed(2)}`,
      commissionAmount: `₹${commissionPercentage.toFixed(2)}`,
      commissionTax: `₹${commissionTax.toFixed(2)}`,
      totalDeduction: `₹${totalDeduction.toFixed(2)}`,
    };
  };
  console.log('calculatePayout', calculatePayout());

  const handleSummaryOpen = () => {
    const payoutValues = calculatePayout(event?.product_data);
    setIsOpenSummary(!isOpenSummary);
    setViewSummaryOpen({
      ...payoutValues,
    });
  };

  function openLink() {
    const lat = event.location_lat.numberDecimal;
    const lng = event.location_long.numberDecimal;

    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch(err => console.error('Error opening map:', err));
  }

  const shareTickets = async () => {
    try {
      await Share.open();
    } catch (error) {
      console.log('Error sharing image:', error);
    }
  };

  return (
    <View style={{backgroundColor: 'white', height: '100%', flex: 1}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{marginLeft: 15, marginTop: 15}}>
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
      <ScrollView>
        <View style={{padding: 10}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Montserrat-Bold',
              color: 'black',
            }}>
            {event.event_name}
          </Text>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                color: '#424242',
              }}>
              <Fontisto name="calendar" color="black" size={13} />{' '}
              {moment(event.event_start_date).format('ll')}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                color: '#424242',
                marginLeft: 13,
              }}>
              <Fontisto name="clock" color="black" size={13} />{' '}
              {moment(event.event_start_date).format('ll')}
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                color: '#424242',
              }}>
              <FontAwesome6 name="location-dot" color="black" size={17} />{' '}
              {event.event_location}
            </Text>
            <View style={{marginTop: 10, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={openLink}
                style={{
                  backgroundColor: '#f11837',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-Medium',
                    color: 'white',
                  }}>
                  <FontAwesome6 name="location-arrow" color="white" size={17} />{' '}
                  Get Direction
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'black',
                }}>
                Event Details
              </Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  Booked by
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',

                    flex: 0.5,
                  }}>
                  {event.user_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  Receiver
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  {event.receiver_name}, +91 {event.receiver_mobilenumber}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  Event timing
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  {event.event_start_time} - {event.event_end_time}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  Venue name
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  {event.venue_name}
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  Venue open time
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  {event.venue_open_time}
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  Event days
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  {event.number_of_days}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  Event Invitation
                </Text>
                {event.upload_invitation === null ? (
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Montserrat-Medium',
                      color: 'black',
                      flex: 0.5,
                    }}>
                    NA
                  </Text>
                ) : (
                  <TouchableOpacity style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Montserrat-Medium',
                        color: '#1a01cc',
                      }}>
                      Download
                    </Text>
                  </TouchableOpacity>
                  //   <Image
                  //     source={{
                  //       uri: `${apiUrl.IMAGEURL}${apiUrl.event.upload_invitation}`,
                  //     }}
                  //     style={{width: 50, height: 50, borderRadius: 10, margin: 5}}
                  //   />
                )}
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  Gate entry pass
                </Text>
                {event.upload_gatepass === null ? (
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Montserrat-Medium',
                      color: 'black',
                      flex: 0.5,
                    }}>
                    NA
                  </Text>
                ) : (
                  <TouchableOpacity style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Montserrat-Medium',
                        color: '#1a01cc',
                      }}>
                      Download
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 5,
              }}>
              <View style={{flex: 0.15, alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    fontSize: 13,
                  }}>
                  Image
                </Text>
              </View>
              <View style={{flex: 0.7, alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    fontSize: 13,
                  }}>
                  Description
                </Text>
              </View>
              <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    fontSize: 13,
                  }}>
                  Qty
                </Text>
              </View>
            </View>
            {event.product_data.map(item => (
              <View
                key={item.orderId}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <View style={{flex: 0.15}}>
                  <Image
                    source={{
                      uri: `${apiUrl.IMAGEURL}${item.imageUrl}`,
                    }}
                    style={{width: 50, height: 50}}
                  />
                </View>
                <View style={{flex: 0.7, alignItems: 'right'}}>
                  <Text
                    // numberOfLines={1}
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      color: 'black',
                      fontSize: 13,
                    }}>
                    {item.productName}
                  </Text>
                </View>
                <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      color: 'black',
                      fontSize: 13,
                    }}>
                    X{item.quantity}
                  </Text>
                </View>
              </View>
            ))}
            <View
              style={{
                marginVertical: 10,
                marginLeft: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  color: '#2a2b2f',
                  fontSize: 17,
                }}>
                {calculatePayout().totalDeduction}
              </Text>
              <TouchableOpacity
                style={{marginLeft: 7}}
                onPress={handleSummaryOpen}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    color: '#9a9a9a',
                    fontSize: 12,
                  }}>
                  Details{''}
                  <Entypo name="chevron-small-down" color="#9a9a9a" size={14} />
                </Text>
              </TouchableOpacity>
            </View>
            {isOpenSummary && (
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  backgroundColor: '#e5e5e561',
                  marginBottom: 20,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    color: 'black',
                    fontSize: 15,
                  }}>
                  Payment Summary
                </Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      Order Amount
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      {viewSummaryOpen.orderAmount}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      Commission({vendor.commission_percentage}%)
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      {viewSummaryOpen.commissionAmount}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      Tax({vendor.commission_tax}%)
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      {viewSummaryOpen.commissionTax}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: 'black',
                      }}>
                      Payout Amount
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: 'black',
                      }}>
                      {viewSummaryOpen.totalDeduction}
                    </Text>
                  </View>
                </View>
              </View>
            )} */}
          </View>
        </View>
      </ScrollView>

      <View style={{marginHorizontal: 20, marginVertical: 10}}>
        <TouchableOpacity
          onPress={shareTickets}
          style={{
            backgroundColor: '#f11837',
            paddingVertical: 13,
            paddingHorizontal: 20,
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: 'white',
              fontSize: 15,
              textAlign: 'center',
            }}>
            <MaterialCommunityIcons name="share" color="white" size={20} />{' '}
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventDetails;
