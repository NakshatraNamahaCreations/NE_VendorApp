import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Share from 'react-native-share';
import {apiUrl} from '../../api-services/api-constants';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {shareTickets} from '../../utilities/pdfUtils';
import {shareInvoice} from '../../utilities/GenerateInvoice';
import Modal from 'react-native-modal';
import Calculator from '../../utilities/Calculator';
import {formatAmount} from '../../utilities/formatAmount';

const ScheduledDetails = () => {
  const deviceWidth = Dimensions.get('window').width;
  const captureMoodBoard = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  const event = route.params.events;
  const productData = Array.isArray(event.service_data)
    ? event.service_data
    : [];
  const [profileData, setProfileData] = useState({});
  const vendor = route.params.vendorData;
  const [isOpenSummary, setIsOpenSummary] = useState(false);
  const [viewSummaryOpen, setViewSummaryOpen] = useState({});
  const [openCalculator, setOpenCalculator] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [inputAmount, setInputAmount] = useState('0');
  // const [loadedImageUri, setLoadImageUri] = useState('');
  // const [unLoadedImageName, setUnLoadedImageName] = useState('');
  // const [unLoadedImageUri, setUnLoadImageUri] = useState('');
  // const [eventSetupImageName, setImageSetupImageName] = useState('');
  // const [eventSetupImageUri, setEventSetupImageUri] = useState('');
  // const [paymentSummary, setPaymentSummary] = useState({
  //   totalAmount: 0,
  //   CommissionInPerc: 0,
  //   taxInPerc: 0,
  //   grandTotal: 0,
  // });
  const [isLoading, setIsLoading] = useState('');
  const [isUnLadedeLoading, setIsUnLodedeLoading] = useState('');
  const [isSetupLoading, setIsSetupLoading] = useState('');
  // let text = eventData?.order_status || event.order_status;
  // let updatedText = text?.replace(/Order/i, 'Event');

  console.log('events in EventDetails.jsx', event.service_data);
  // console.log('vendor in EventDetails.jsx', vendor);

  const calculatePayout = () => {
    const orderAmount = event.service_data.reduce(
      (acc, value) => acc + value.totalPrice,
      0,
    );
    const commissionPercentage =
      orderAmount * (vendor.commission_percentage / 100);
    const commissionTax = commissionPercentage * (vendor.commission_tax / 100);
    const totalDeduction = orderAmount - (commissionPercentage + commissionTax);
    // setPaymentSummary({
    //   totalAmount: `₹${orderAmount.toFixed(2)}`,
    //   CommissionInPerc: `₹${commissionPercentage.toFixed(2)}`,
    //   taxInPerc: `₹${commissionTax.toFixed(2)}`,
    //   grandTotal: `₹${totalDeduction.toFixed(2)}`,
    // });
    return {
      orderAmount: `₹${formatAmount(orderAmount, 2)}`,
      commissionAmount: `₹${formatAmount(commissionPercentage, 2)}`,
      commissionTax: `₹${formatAmount(commissionTax, 2)}`,
      totalDeduction: `₹${formatAmount(totalDeduction, 2)}`,
    };
  };

  console.log('calculatePayout', calculatePayout().commissionAmount);

  const handleSummaryOpen = () => {
    const payoutValues = calculatePayout(event?.service_data);
    setIsOpenSummary(!isOpenSummary);
    setViewSummaryOpen(payoutValues);
  };

  // useEffect(() => {
  //   const payoutValues = calculatePayout();
  //   if (payoutValues) {
  //     setViewSummaryOpen(payoutValues);
  //   }
  // }, [event, vendor]);

  const fetchData = async () => {
    try {
      const payoutConfigRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_CONFIG}`,
      );
      if (payoutConfigRes.status === 200) {
        const profile = payoutConfigRes.data.profile;
        setProfileData(profile);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // below code is for calculating the payout
  const razorPay =
    (parseInt(inputAmount) * profileData?.razorpay_percentage) / 100;

  const userPayableAmount = parseInt(inputAmount) + parseInt(razorPay);

  const balance = parseInt(inputAmount);

  const commissionAmount =
    (parseInt(inputAmount) * (vendor?.commission_percentage || 0)) / 100;

  const commissionTaxAmount =
    (parseInt(commissionAmount) * (vendor?.commission_tax || 0)) / 100;

  const netTotal = parseInt(commissionAmount) + parseInt(commissionTaxAmount);

  const payableToSeller = parseInt(inputAmount) - parseInt(netTotal);

  const tableContent = [
    {
      head: `Razorpay Fee @${
        profileData?.razorpay_percentage ? profileData?.razorpay_percentage : 0
      }%`,
      value: razorPay.toFixed(2),
      color: '#f3545d',
      fontFamily: 'Montserrat-Medium',
    },
    {
      head: 'Payable Amount',
      value: userPayableAmount.toFixed(2),
      color: 'black',
      fontFamily: 'Montserrat-Medium',
    },
    {
      head: 'Balance ₹ (NITHYAEVENT Receipt)',
      value: balance.toFixed(2),
      color: 'black',
      fontFamily: 'Montserrat-Medium',
    },
    {
      head: 'Commission %',
      value: vendor?.commission_percentage?.toFixed(2) || 0.0,
      color: 'black',
      fontFamily: 'Montserrat-Medium',
    },
    {
      head: 'Commission ₹ (NITHYAEVENT Deductions)',
      value: commissionAmount.toFixed(2),
      color: 'black',
      fontFamily: 'Montserrat-Medium',
    },
    {
      head: 'Commission GST %',
      value: vendor?.commission_tax?.toFixed(2) || 0.0,
      color: 'black',
      fontFamily: 'Montserrat-Medium',
    },
    {
      head: 'Commission GST ₹',
      value: commissionTaxAmount.toFixed(2),
      color: 'black',
      fontFamily: 'Montserrat-Medium',
    },
    {
      head: 'Net Total ₹',
      value: netTotal.toFixed(2),
      color: 'black',
      fontFamily: 'Montserrat-SemiBold',
    },
    {
      head: 'Payable to Seller',
      value: payableToSeller.toFixed(2),
      color: 'black',
      fontFamily: 'Montserrat-SemiBold',
    },
  ];

  const paymentSummary = {
    totalAmount: `${calculatePayout()?.orderAmount}`,
    CommissionInPerc: `${calculatePayout().commissionAmount}`,
    taxInPerc: `${calculatePayout()?.commissionTax}`,
    grandTotal: `${calculatePayout()?.totalDeduction}`,
  };

  // console.log('paymentSummary', paymentSummary);

  function openLink() {
    if (!event.location_lat || !event.location_long) {
      console.error('Latitude or longitude is missing.');
      return;
    }
    const lat = event.location_lat['$numberDecimal'];
    const lng = event.location_long['$numberDecimal'];
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch(err => console.error('Error opening map:', err));
  }

  const getOnlyThisBooking = async () => {
    setPageLoad(true);
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ORDER_BY_ORDER_ID}${event?._id}`,
      );
      if (res.status === 200) {
        setEventData(res.data.orderId);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setPageLoad(false);
    }
  };

  useEffect(() => {
    getOnlyThisBooking();
  }, [event?._id]);

  const resizeImage = async imageUri => {
    const resizedImage = await ImageResizer.createResizedImage(
      imageUri,
      800,
      600,
      'JPEG',
      80,
      0,
    );
    return resizedImage.uri;
  };

  const handlingEventStatus = () => {
    const eventStartDate = moment(event.event_start_date, 'YYYY-MM-DD');
    const eventEndDate = moment(event.event_end_date, 'YYYY-MM-DD');
    const today = moment();

    if (event.order_status === 'Order Cancelled') {
      return (
        <View>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              color: '#ff0000',
            }}>
            Event Cancelled
          </Text>
        </View>
      );
    }

    if (event.order_status === 'Order Cancelled') {
      return (
        <View>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              color: '#ff0000',
            }}>
            Event Rescheduled
          </Text>
        </View>
      );
    }
    if (today.isSame(eventStartDate, 'day')) {
      return (
        <View>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              color: '#e91e63',
            }}>
            Event Started
          </Text>
        </View>
      );
    }

    if (today.isSame(eventEndDate, 'day')) {
      return (
        <View>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              color: '#e91e63',
            }}>
            Event has ended!
          </Text>
        </View>
      );
    }

    if (today.isAfter(eventEndDate, 'day')) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
              color: '#e91e63',
            }}>
            Event Completed{' '}
          </Text>
          {vendor?.profession && vendor?.profession === 'Vendor & Seller' && (
            <TouchableOpacity
              style={{
                marginTop: 5,
              }}
              onPress={() =>
                shareInvoice(event, event.service_data, vendor, paymentSummary)
              }>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  color: '#1a1aff',
                  fontSize: 10,
                  textDecorationColor: '#1a1aff',
                  textDecorationStyle: 'dashed',
                  textDecorationLine: 'underline',
                }}>
                {' '}
                Generate Invoice
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View>
        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            fontFamily: 'Montserrat-SemiBold',
            color: '#0a580d',
          }}>
          Event Not Started
        </Text>
      </View>
    );
  };

  // console.log('handlingEventStatus', handlingEventStatus());

  return (
    <View style={{backgroundColor: 'white', height: '100%', flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
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
        {vendor?.profession && vendor?.profession === 'Vendor & Seller' && (
          <TouchableOpacity
            onPress={() => shareTickets(event, event.service_data)}
            style={{
              marginRight: 15,
              marginTop: 15,
            }}>
            {/* <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                color: 'white',
                fontSize: 15,
                textAlign: 'center',
              }}> */}
            <Ionicons
              style={{
                backgroundColor: '#e91e63',
                width: 40,
                height: 40,
                textAlign: 'center',
                paddingTop: 10,
                borderRadius: 50,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              name="share-social-sharp"
              color="white"
              size={19}
            />
            {/* </Text> */}
          </TouchableOpacity>
        )}
      </View>
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
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Montserrat-Bold',
              color: 'black',
              marginVertical: 5,
            }}>
            #{event._id.slice(-6)}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Montserrat-Medium',
              color: 'black',
              flex: 0.5,
            }}>
            {event.event_start_date} - {event.event_end_date}
          </Text>
          {/* <View style={{flexDirection: 'row', marginTop: 5}}> */}
          {/* <Text
              style={{
                fontSize: 15,
                fontFamily: 'Montserrat-Bold',
                color: '#e91e63',
              }}> */}
          {/* { */}
          {/* // event.order_status === 'Order Cancelled'
                  //   ? 'Event Cancelled'
                  //   : event.order_status === 'Order Rescheduled'
                  //   ? 'Event Rescheduled'
                  //   :
                //   event.order_status
                // } */}
          {/* {updatedText} */}
          {/* {handlingEventStatus()}
            </Text> */}
          {/* <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  color: '#424242',
                  marginLeft: 13,
                }}>
                <Fontisto name="clock" color="black" size={13} />{' '}
                {event.event_start_time}
              </Text> */}
          {/* </View> */}
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
                  backgroundColor: '#7460e4',
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
                  Event Date
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  {event.event_start_date} - {event.event_end_date}
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
                  //       uri: `${apiUrl.IMAGEURL}${event.upload_invitation}`,
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
            {event.service_data.map(item => (
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
                      uri: item.imageUrl,
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
            ))} */}

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
            )}
          </View>
          {/* <View style={{flexDirection: 'row', flex: 1, marginTop: 10}}>
            <View style={{flex: 0.33}}>
              <View style={style.boxStyle}>
                <TouchableOpacity onPress={uploadLoadedImage}>
                  {loadedImageUri ? (
                    <Image
                      source={{uri: loadedImageUri}}
                      style={style.boxImage}
                    />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        style={{textAlign: 'center'}}
                        name="plus"
                        color="#767676"
                        size={20}
                      />
                      <Text style={style.boxText}>Loaded Items Image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={isLoading ? null : addLoadedImage}>
                <Text style={style.btnText}>
                  {isLoading ? 'Uploading...' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.33}}>
              <View style={style.boxStyle}>
                <TouchableOpacity onPress={uploadUnloadedImage}>
                  {unLoadedImageUri ? (
                    <Image
                      source={{uri: unLoadedImageUri}}
                      style={style.boxImage}
                    />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        style={{textAlign: 'center'}}
                        name="plus"
                        color="#767676"
                        size={20}
                      />
                      <Text style={style.boxText}>Unloaded Items Image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={isUnLadedeLoading ? null : addUnLoadedImage}>
                <Text style={style.btnText}>
                  {isUnLadedeLoading ? 'Uploading...' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.33}}>
              <View style={style.boxStyle}>
                <TouchableOpacity onPress={uploadEventImage}>
                  {eventSetupImageUri ? (
                    <Image
                      source={{uri: eventSetupImageUri}}
                      style={style.boxImage}
                    />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        style={{textAlign: 'center'}}
                        name="plus"
                        color="#767676"
                        size={20}
                      />
                      <Text style={style.boxText}>Event Setup Image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={isSetupLoading ? null : eventSetup}>
                <Text style={style.btnText}>
                  {isSetupLoading ? 'Uploading...' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </View>

        <View style={{marginBottom: 20}}>{handlingEventStatus()}</View>
        <View style={{marginBottom: 20, marginHorizontal: 100}}>
          <TouchableOpacity
            style={{
              marginTop: 5,
            }}
            onPress={() => setOpenCalculator(true)}>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
                fontFamily: 'Montserrat-SemiBold',
                color: 'black',
              }}>
              <Entypo name="calculator" size={20} color="black" /> Open
              Calculator
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{marginHorizontal: 20, marginVertical: 10}}>
          {event.order_status === 'Order Cancelled' ||
          event.order_status === 'Order Delivered' ? null : (
            <TouchableOpacity
              onPress={loading ? null : handleDeliveryOrders}
              style={{
                borderColor: '#7460e4',
                paddingVertical: 13,
                paddingHorizontal: 20,
                borderRadius: 20,
                marginTop: 10,
                borderWidth: 1,
              }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  color: '#7460e4',
                  fontSize: 15,
                  textAlign: 'center',
                }}>
                {loading ? (
                  <ActivityIndicator size="small" color="#7460e4" />
                ) : (
                  'Delivery Items'
                )}
              </Text>
            </TouchableOpacity>
          )}
        </View> */}
      </ScrollView>
      <Modal
        animationIn="slideInUp"
        isVisible={openCalculator}
        deviceWidth={deviceWidth}
        style={{
          margin: 0,
          position: 'absolute',
          width: '100%',
          top: 40,
          backgroundColor: 'white',
          shadowColor: '#000',
          // bottom: 2,
          padding: 10,
          borderRadius: 10,
        }}
        transparent={true}>
        <View style={{marginBottom: 10}}>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 16,
              color: 'black',
              textAlign: 'center',
            }}>
            Calculator
          </Text>
        </View>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="0"
          keyboardType="numeric"
          value={inputAmount}
          onChangeText={val => setInputAmount(val)}
          style={{
            borderWidth: 1,
            borderColor: '#d5d5d5',
            color: 'black',
            fontSize: 14,
            borderRadius: 10,
            paddingLeft: 15,
            backgroundColor: 'white',
            marginBottom: 10,
            fontFamily: 'Montserrat-Medium',
            // letterSpacing: 1,
          }}
        />
        <Calculator
          tableContent={tableContent}
          setOpenCalculator={setOpenCalculator}
        />
      </Modal>
    </View>
  );
};

const style = StyleSheet.create({
  boxStyle: {
    // backgroundColor: '#7460e4',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c1c1c1',
    borderStyle: 'dashed',
    margin: 1,
  },
  boxText: {
    fontFamily: 'Montserrat-Medium',
    color: '#767676',
    fontSize: 13,
    textAlign: 'center',
  },
  btnText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#7460e4',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
  boxImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
});
export default ScheduledDetails;
