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
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { apiUrl } from '../../api-services/api-constants';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { shareTickets } from '../../utilities/pdfUtils';
import Modal from 'react-native-modal';
import Calculator from '../../utilities/Calculator';
import useBackHandler from '../../utilities/useBackHandler';
import OTPTextInput from 'react-native-otp-textinput';
import THEMECOLOR from '../../utilities/color';

const EventDetails = () => {
  useBackHandler();
  const deviceWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const route = useRoute();
  const bookingType = route.params.bookingType;
  const eventData = route.params.events;
  const techData = route.params.techData;
  const hasBooking =
    bookingType === 'Product' ? eventData.product_data : eventData.service_data;
  const selectedData =
    bookingType === 'Product'
      ? Array.isArray(eventData.product_data)
        ? eventData.product_data
        : []
      : Array.isArray(eventData.service_data)
        ? eventData.service_data
        : [];
  const vendor = route.params.vendorData;

  const [profileData, setProfileData] = useState({});
  const [isOpenSummary, setIsOpenSummary] = useState(false);
  const [viewSummaryOpen, setViewSummaryOpen] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);
  const [event, setEvent] = useState([]);
  const [setupImages, setSetupImages] = useState([]);
  const [loadedImageName, setLoadedImageName] = useState('');
  const [loadedImageUri, setLoadImageUri] = useState('');
  const [unLoadedImageName, setUnLoadedImageName] = useState('');
  const [unLoadedImageUri, setUnLoadImageUri] = useState('');
  const [eventSetupImageName, setImageSetupImageName] = useState('');
  const [eventSetupImageUri, setEventSetupImageUri] = useState('');
  const [inputAmount, setInputAmount] = useState('0');
  const [isLoading, setIsLoading] = useState('');
  const [isUnLadedeLoading, setIsUnLodedeLoading] = useState('');
  const [isSetupLoading, setIsSetupLoading] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [openCalculator, setOpenCalculator] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);

  const eventEndDate = moment(event.event_end_date, 'DD-MM-YYYY');
  const today = moment();

  const isEventOver = today.isAfter(eventEndDate, 'day');
  const isOrderCancelled = eventData.order_status === 'Order Cancelled';

  console.log('eventData in event details params', eventData);
  console.log("...............................................")
  console.log('event in event details params', event);
  console.log("...............................................")
  console.log("techData", techData)


  const getOnlyThisBooking = async () => {
    setPageLoad(true);
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ORDER_BY_ORDER_ID}${eventData?._id}`,
      );
      if (res.status === 200) {
        setEvent(res.data.orderId);
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

  const fetchSetupImage = async () => {
    try {
      const baseURL = `${apiUrl.BASEURL}${apiUrl.GET_SETUP_IMAGES}${eventData._id}?vendor_id=${vendor._id}`;
      const res = await axios.get(baseURL);

      if (res.status === 200 && res.data.data) {
        setSetupImages(res.data.data);
      } else {
        setSetupImages([]);
      }
    } catch (error) {
      console.log('Error:', error);
      setSetupImages([]);
    }
  };

  useEffect(() => {
    fetchSetupImage();
  }, [eventData?._id]);


  const findDeliveryStatus = hasBooking.find(
    ele => ele.order_status === 'Order Delivered',
  );

  let hasData = [];

  if (bookingType === 'Service' && eventData?.service_data?.length) {
    console.log('Service');
    hasData = eventData.service_data;
  } else if (bookingType === 'Product' && eventData?.product_data?.length) {
    console.log('Product');
    hasData = eventData.product_data;
  } else {
    console.error('No valid data found for the given booking type');
  }

  const calculatePayout = () => {
    const orderAmount = hasData?.reduce(
      (acc, value) => acc + value.totalPrice,
      0,
    );
    const commissionPercentage = Number(
      vendor.commission_percentage || hasData?.[0]?.commissionPercentage,
    );
    const commissionTaxPercentage = Number(
      vendor.commission_tax || hasData?.[0]?.commissionTax,
    );

    const commissionAmount = orderAmount * (commissionPercentage / 100);
    const taxAmount = commissionAmount * (commissionTaxPercentage / 100);
    const finalPayout = orderAmount - commissionAmount - taxAmount;

    return {
      orderAmount: `₹${orderAmount?.toFixed(2)}`,
      commissionAmount: `₹${commissionAmount?.toFixed(2)}`,
      commissionTax: `₹${taxAmount?.toFixed(2)}`,
      totalDeduction: `₹${finalPayout?.toFixed(2)}`,
    };
  };

  const handleSummaryOpen = () => {
    const payoutValues = calculatePayout();

    setIsOpenSummary(!isOpenSummary);
    setViewSummaryOpen(payoutValues);
  };


  const taxValue = Number(viewSummaryOpen.commissionTax?.replace(/[^\d.-]/g, "")) || 0;
  const halfTax = taxValue / 2;

  // console.log("vendor>>>", vendor);
  // console.log("vendor commission_tax>>>", vendor.commission_tax / 2);
  // console.log("Ordered halfTax>>>", halfTax);

  const paymentSummary = {
    totalAmount: `${calculatePayout()?.orderAmount}`,
    CommissionInPerc: `${calculatePayout()?.commissionAmount}`,
    taxInPerc: `${calculatePayout()?.commissionTax}`,
    grandTotal: `${calculatePayout()?.totalDeduction}`,
  };

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

  const handleDeliveryOrders = async () => {
    const parsedOtp = parseInt(otpValue, 10);
    if (isNaN(parsedOtp)) {
      ToastAndroid.showWithGravity(
        'Please enter a valid 4-digit OTP.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.DELIVERY_ITEMS}${event._id}`,
        {
          otp: Number(otpValue),
          delivered_date: moment().format('DD-MM-YYYY HH:mm:ss'),
          productIds: selectedData.map(item => item.id),
          bookingType,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          'Items have been delivered successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setOpenOtpModal(false);
        navigation.goBack();
      }
    } catch (error) {
      console.log('Delivery error:', error);
      const message =
        error?.response?.data?.message || 'An unknown error occurred';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const payoutConfigRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_CONFIG}`,
      );
      if (payoutConfigRes.status === 200) {
        const profile = payoutConfigRes.data.data;
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
  const razorPay = 0
  // (parseInt(inputAmount) * profileData?.razorpay_percentage) / 100;

  const userPayableAmount = Number(inputAmount) + Number(razorPay);

  const balance = Number(inputAmount);

  const commissionAmount =
    (Number(inputAmount) * (vendor?.commission_percentage || 0)) / 100;

  const commissionTaxAmount =
    (Number(commissionAmount) * (vendor?.commission_tax || 0)) / 100;

  const netTotal = Number(commissionAmount) + Number(commissionTaxAmount);

  const payableToSeller = Number(inputAmount) - Number(netTotal);

  const tableContent = [
    // {
    //   head: `Razorpay Fee @${profileData?.razorpay_percentage ? profileData?.razorpay_percentage : 0
    //     }%`,
    //   value: razorPay?.toFixed(2),
    //   color: '#f3545d',
    //   fontFamily: 'Montserrat-Medium',
    // },
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
    // {
    //   head: `Commission (${vendor?.commission_percentage}%)`,
    //   value: vendor?.commission_percentage?.toFixed(2) || 0.0,
    //   color: 'black',
    //   fontFamily: 'Montserrat-Medium',
    // },
    {
      head: `Commission (${vendor?.commission_percentage}%) (NITHYAEVENT Deductions)`,
      value: commissionAmount.toFixed(2),
      color: 'black',
      fontFamily: 'Montserrat-Medium',
    },
    // {
    //   head: `Commission GST (${vendor?.commission_tax}%)`,
    //   value: vendor?.commission_tax?.toFixed(2) || 0.0,
    //   color: 'black',
    //   fontFamily: 'Montserrat-Medium',
    // },
    {
      head: `Commission GST (${vendor?.commission_tax}%)`,
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
      head: 'Net Total - Payable Amount',
      value: payableToSeller.toFixed(2),
      color: 'black',
      fontFamily: 'Montserrat-Medium',
    },
    {
      head: 'Payable to Seller',
      value: payableToSeller.toFixed(2),
      color: 'black',
      fontFamily: 'Montserrat-SemiBold',
    },
  ];

  const eventDetails = [
    {
      head: 'Event Name',
      value: event.event_name,
    },
    {
      head: 'Booked by',
      value: event.user_name,
    },
    {
      head: 'Receiver',
      value: `${event.receiver_name}, +91 ${event.receiver_mobilenumber}`,
    },
    {
      head: 'Event Date',
      value: `${event.event_start_date} - ${event.event_end_date}`,
    },
    {
      head: 'Rehearsal Date',
      value: event.rehearsal_date,
    },
    {
      head: 'Event timing',
      value: `${event.event_start_time} - ${event.event_end_time}`,
    },
    {
      head: 'Event Setup Date',
      value: `${event.setup_start_date} - ${event.setup_end_date}`,
    },
    {
      head: 'Event Setup Time',
      value: `${event.setup_start_time} - ${event.setup_end_time}`,
    },
    {
      head: 'Event Venue Name',
      value: event.venue_name,
    },
  ];


  const downloadFile = async type => {
    switch (type) {
      case 'invitation':
        if (event.upload_invitation) {
          Linking.openURL(event.upload_invitation);
        } else {
          console.log('No invitation file available');
        }
        break;
      case 'gate_pass':
        if (event.upload_gatepass) {
          Linking.openURL(event.upload_gatepass);
        } else {
          console.log('No gate pass file available');
        }
        break;
      default:
        break;
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to take pictures',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS permissions handled via plist
    }
  };

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

  const captureImage = async ({ onSetUri, onSetName }) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    const options = {
      mediaType: 'photo',
      cameraType: 'front',
      saveToPhotos: true,
    };

    try {
      const response = await ImagePicker.launchCamera(options);

      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const capturedImageUri = response.assets[0].uri;
        const fileNAME = response.assets[0].fileName;
        const resizedImageUri = await resizeImage(capturedImageUri);

        onSetUri(resizedImageUri);
        onSetName(fileNAME);
      } else {
        console.log('No image data found.');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const isUploaded = type => {
    return setupImages.some(item => item.image_type === type);
  };

  const uploadImage = async ({ imageUri, imageName, imageType, onLoading }) => {
    if (!imageUri) {
      Alert.alert('Please select an image from your gallery.');
      return;
    }

    onLoading(true);

    const formData = new FormData();
    formData.append('vendor_id', vendor._id);
    formData.append('vendor_name', vendor.vendor_name);
    formData.append('image_type', imageType);
    formData.append('image_url', {
      uri: imageUri,
      type: 'image/jpeg',
      name: imageName || 'image.jpg',
    });

    try {
      const response = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.ADD_DELIVERY_IMAGES}${event._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      if (response.status === 200) {
        Alert.alert('Image Uploaded');
        fetchSetupImage([]);
      }
    } catch (error) {
      console.log('Upload error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'An unknown error occurred',
      );
    } finally {
      onLoading(false);
    }
  };

  const generateRandomString = (length = 3) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };


  const invoiceNumber = String(
    vendor._id?.slice(-4) + eventData._id?.slice(-5),
  )?.toUpperCase();

  // const handlingEventStatus = () => {
  //   const eventStartDate = moment(event.event_start_date, 'YYYY-MM-DD');
  //   const eventEndDate = moment(event.event_end_date, 'YYYY-MM-DD');
  //   const today = moment();

  //   if (today.isSame(eventStartDate, 'day')) {
  //     return (
  //       <View>
  //         <Text
  //           style={{
  //             fontSize: 14,
  //             textAlign: 'center',
  //             fontFamily: 'Montserrat-SemiBold',
  //             color: '#e91e63',
  //           }}>
  //           Event Started
  //         </Text>
  //       </View>
  //     );
  //   }

  //   if (today.isSame(eventEndDate, 'day')) {
  //     return (
  //       <View>
  //         <Text
  //           style={{
  //             fontSize: 14,
  //             textAlign: 'center',
  //             fontFamily: 'Montserrat-SemiBold',
  //             color: '#e91e63',
  //           }}>
  //           Event has ended!
  //         </Text>
  //       </View>
  //     );
  //   }

  //   if (today.isAfter(eventEndDate, 'day')) {
  //     return (
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'space-between',
  //           // marginTop: 10,
  //         }}>
  //         <Text
  //           style={{
  //             fontSize: 15,
  //             fontFamily: 'Montserrat-SemiBold',
  //             color: '#e91e63',
  //           }}>
  //           Event Completed{' '}
  //         </Text>
  //         <TouchableOpacity
  //           onPress={() =>
  //             navigation.navigate('ViewInvoice', {
  //               event,
  //               vendor,
  //               selectedData,
  //               paymentSummary,
  //               invoiceNumber,
  //             })
  //           }
  //         >
  //           <Text
  //             style={{
  //               fontFamily: 'Montserrat-Bold',
  //               color: '#1a1aff',
  //               fontSize: 12,
  //               textDecorationColor: '#1a1aff',
  //               textDecorationStyle: 'dashed',
  //               textDecorationLine: 'underline',
  //             }}>
  //             Raise Invoice
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }
  //   if (eventData.order_status === 'Order Cancelled') {
  //     return (
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           // marginTop: 10,
  //         }}>
  //         <Text
  //           style={{
  //             fontSize: 15,
  //             fontFamily: 'Montserrat-SemiBold',
  //             color: '#e91e63',
  //           }}>
  //           Order Cancelled
  //         </Text>
  //       </View>
  //     );
  //   }
  //   if (findDeliveryStatus !== undefined) {
  //     return (
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           // marginTop: 10,
  //         }}>
  //         <Text
  //           style={{
  //             fontSize: 15,
  //             fontFamily: 'Montserrat-SemiBold',
  //             color: '#e91e63',
  //           }}>
  //           Item Delivered
  //         </Text>
  //       </View>
  //     );
  //   }
  //   return (
  //     <View>
  //       <Text
  //         style={{
  //           fontSize: 14,
  //           textAlign: 'center',
  //           fontFamily: 'Montserrat-SemiBold',
  //           color: '#0a580d',
  //         }}>
  //         Event Not Started
  //       </Text>
  //     </View>
  //   );
  // };

  // Parse event start and end datetime from date + time strings

  const handlingEventStatus = () => {
    const cleanTime = (timeStr) => timeStr?.replace(/\u202F|\u00A0/g, ' ').trim();
    // Parse start/end datetime
    const eventStartDateTime = moment(
      `${event.event_start_date} ${cleanTime(event.event_start_time)}`,
      "DD-MM-YYYY h:mm a"
    );
    const eventEndDateTime = moment(
      `${event.event_end_date} ${cleanTime(event.event_end_time)}`,
      "DD-MM-YYYY h:mm a"
    );
    // Moment "now" (local time)
    const now = moment();

    // Debug: log all moments and their formats
    console.log(
      'PARSE:',
      event.event_start_date, event.event_start_time,
      '->', eventStartDateTime.format(),
      'now:', now.format()
    );
    console.log(
      'End:',
      event.event_end_date, event.event_end_time,
      '->', eventEndDateTime.format()
    );

    // Check if moments are valid:
    if (!eventStartDateTime.isValid() || !eventEndDateTime.isValid()) {
      console.log('Start or End datetime is invalid!');
    }

    console.log("eventStartDateTime", eventStartDateTime)
    console.log("eventEndDateTime", eventEndDateTime)


    if (now.isBefore(eventStartDateTime)) {
      // Before event start
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
    } else if (now.isBetween(eventStartDateTime, eventEndDateTime, null, '[]')) {
      // During event time (inclusive)
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
    } else if (now.isAfter(eventEndDateTime)) {
      // After event end
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
              color: '#e91e63',
            }}>
            Event Completed{' '}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ViewInvoice', {
                event,
                vendor,
                selectedData,
                paymentSummary,
                invoiceNumber,
              })
            }>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                color: '#1a1aff',
                fontSize: 12,
                textDecorationColor: '#1a1aff',
                textDecorationStyle: 'dashed',
                textDecorationLine: 'underline',
              }}>
              Raise Invoice
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (eventData.order_status === 'Order Cancelled') {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            // marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
              color: '#e91e63',
            }}>
            Order Cancelled
          </Text>
        </View>
      );
    }
    if (findDeliveryStatus !== undefined) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            // marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
              color: '#e91e63',
            }}>
            Item Delivered
          </Text>
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
  }


  if (pageLoad) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <ActivityIndicator size="small" color={THEMECOLOR.mainColor} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: 'white', height: '100%', flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15, marginTop: 15 }}>
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
        <TouchableOpacity
          onPress={() => shareTickets(event, event.product_data)}
          style={{
            marginRight: 15,
            marginTop: 15,
          }}>
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
      </View>
      <ScrollView>
        <View style={{ padding: 10 }}>
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
            {event.order_id}
            {/* #{event._id?.slice(-6)?.toUpperCase()} */}
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

          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                color: '#424242',
              }}>
              <FontAwesome6 name="location-dot" color="black" size={17} />{' '}
              {event.event_location}
            </Text>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={openLink}
                style={{
                  width: '45%',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-Medium',
                    color: 'white',
                    backgroundColor: '#7460e4',
                    textAlign: 'center',
                    // paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}>
                  <FontAwesome6 name="location-arrow" color="white" size={17} />{' '}
                  Get Direction
                </Text>
              </TouchableOpacity>
              {!isOrderCancelled && !isEventOver && (
                <View style={{ width: '45%' }}>
                  {findDeliveryStatus !== undefined ? (
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-SemiBold',
                        color: 'green',
                        textAlign: 'right',
                      }}>
                      Item Delivered at {findDeliveryStatus.delivered_date}
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setOpenOtpModal(true)}
                      style={{}}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Montserrat-Medium',
                          color: 'white',
                          backgroundColor: 'green',
                          paddingVertical: 10,
                          borderRadius: 20,
                          textAlign: 'center',
                        }}>
                        <MaterialCommunityIcons
                          name="truck-delivery"
                          color="white"
                          size={17}
                        />{' '}
                        Delivery Items
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'black',
                }}>
                Event Details
              </Text>
              {eventDetails.map((ele, index) => (
                <View
                  key={index + 1}
                  style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Montserrat-Medium',
                      color: 'black',
                      flex: 0.5,
                    }}>
                    {ele.head}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Montserrat-Medium',
                      color: 'black',

                      flex: 0.5,
                    }}>
                    {ele.value}
                  </Text>
                </View>
              ))}


              <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
                  <TouchableOpacity
                    style={{ flex: 0.5 }}
                    onPress={() => downloadFile('invitation')}>
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
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
                  <TouchableOpacity
                    style={{ flex: 0.5 }}
                    onPress={() => downloadFile('gate_pass')}>
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 5,
              }}>
              <View style={{ flex: 0.15, alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    fontSize: 13,
                  }}>
                  Image
                </Text>
              </View>
              <View style={{ flex: 0.7, alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    fontSize: 13,
                  }}>
                  Description
                </Text>
              </View>
              <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
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
            <View style={{ marginTop: 10 }}>
              {/* {bookingType === 'Product' ? (
                <> */}
              {selectedData?.map((item, index) => (
                <View key={index + 1}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 5,
                    }}>
                    <View style={{ flex: 0.2 }}>
                      <Image
                        source={{
                          uri:
                            Array.isArray(item.imageUrl)
                              ? item.imageUrl[0]
                              : item.imageUrl || "https://via.placeholder.com/50",
                        }}
                        style={{ width: 50, height: 50 }}
                      />
                    </View>
                    <View style={{ flex: 0.6, alignItems: 'right' }}>
                      <Text
                        // numberOfLines={1}
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          color: 'black',
                          fontSize: 13,
                          textAlign: 'center',
                        }}>
                        {item.productName}
                      </Text>
                    </View>
                    <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
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
                  {item.addons?.length > 0 && (
                    <>
                      {item.addons?.map((addon, idx) => (
                        <View
                          key={idx + 1}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 5,
                          }}>
                          <View style={{ flex: 0.2 }}></View>
                          <View style={{ flex: 0.6, alignItems: 'right' }}>
                            <Text
                              style={{
                                fontFamily: 'Montserrat-Medium',
                                color: 'black',
                                fontSize: 13,
                                textAlign: 'center',
                              }}>
                              {addon.service_name}
                            </Text>
                          </View>
                          <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                            <Text
                              style={{
                                fontFamily: 'Montserrat-Medium',
                                color: 'black',
                                fontSize: 13,
                              }}>
                              X1
                            </Text>
                          </View>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              ))}
              {Array.isArray(techData) && techData.length > 0 && (
                <>
                  {techData?.map((item, index) => (
                    <View key={index + 1}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 5,
                        }}>
                        <View style={{ flex: 0.2 }}>
                          <Image
                            source={{
                              uri: "https://via.placeholder.com/50",
                            }}
                            style={{ width: 50, height: 50 }}
                          />
                        </View>
                        <View style={{ flex: 0.6, alignItems: 'right' }}>
                          <Text
                            // numberOfLines={1}
                            style={{
                              fontFamily: 'Montserrat-Medium',
                              color: 'black',
                              fontSize: 13,
                              textAlign: 'center',
                            }}>
                            {item?.service_name ?? "N/A"}
                          </Text>
                        </View>
                        <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
                          <Text
                            style={{
                              fontFamily: 'Montserrat-Medium',
                              color: 'black',
                              fontSize: 13,
                            }}>
                            X 1
                          </Text>
                        </View>
                      </View>

                    </View>
                  ))}
                </>
              )
              }
            </View>
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
                style={{ marginLeft: 7 }}
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
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      Order Amount
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      {viewSummaryOpen.orderAmount}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      Commission({vendor.commission_percentage}%)
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      {viewSummaryOpen.commissionAmount}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      Tax ({vendor.commission_tax}%)
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      {viewSummaryOpen.commissionTax?.replace(/[^\d.-]/g, "")}
                    </Text>
                  </View>
                </View>
                {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      CGST ({vendor.commission_tax / 2}%)
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      ₹{halfTax?.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      SGST ({vendor.commission_tax / 2}%)
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: 'black',
                      }}>
                      ₹{halfTax?.toFixed(2)}
                    </Text>
                  </View>
                </View> */}
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        color: 'black',
                      }}>
                      Payout Amount
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
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
          <View style={{ marginTop: 10 }}>
            <Text style={style.btnText}>
              Note: Transportation charges are extra, you can claim it from the customer
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            {!isOrderCancelled && !isEventOver && (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {[
                  {
                    label: 'Loaded Items Image',
                    uri: loadedImageUri,
                    imageType: 'Loaded',

                    onSelect: () =>
                      captureImage({
                        onSetUri: setLoadImageUri,
                        onSetName: setLoadedImageName,
                      }),
                    onUpload: () =>
                      uploadImage({
                        imageUri: loadedImageUri,
                        imageName: loadedImageName,
                        imageType: 'Loaded',
                        onLoading: setIsLoading,
                      }),
                    isLoading: isLoading,
                  },
                  {
                    label: 'Unloaded Items Image',
                    uri: unLoadedImageUri,
                    imageType: 'Unloaded',
                    onSelect: () =>
                      captureImage({
                        onSetUri: setUnLoadImageUri,
                        onSetName: setUnLoadedImageName,
                      }),
                    onUpload: () =>
                      uploadImage({
                        imageUri: unLoadedImageUri,
                        imageName: unLoadedImageName,
                        imageType: 'Unloaded',
                        onLoading: setIsUnLodedeLoading,
                      }),
                    isLoading: isUnLadedeLoading,
                  },
                  {
                    label: 'Event Setup Image',
                    uri: eventSetupImageUri,
                    imageType: 'Event Setup',
                    onSelect: () =>
                      captureImage({
                        onSetUri: setEventSetupImageUri,
                        onSetName: setImageSetupImageName,
                      }),
                    onUpload: () =>
                      uploadImage({
                        imageUri: eventSetupImageUri,
                        imageName: eventSetupImageName,
                        imageType: 'Event Setup',
                        onLoading: setIsSetupLoading,
                      }),
                    isLoading: isSetupLoading,
                  },
                ].map((item, index) => {
                  const alreadyUploaded = isUploaded(item.imageType);
                  const imageFromServer = setupImages.find(
                    img => img.image_type === item.imageType,
                  );

                  if (
                    (item.imageType === 'Unloaded' && !isUploaded('Loaded')) ||
                    (item.imageType === 'Event Setup' &&
                      !isUploaded('Unloaded'))
                  ) {
                    return null;
                  }

                  return (
                    <View
                      key={index}
                      style={{
                        width: '32%',
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 5,
                        elevation: 4,
                      }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: 'Montserrat-SemiBold',
                          marginBottom: 10,
                          color: 'black',
                          textAlign: 'center',
                        }}>
                        {item.label}
                      </Text>

                      <TouchableOpacity
                        onPress={!alreadyUploaded ? item.onSelect : null}
                        style={{
                          borderWidth: 1,
                          borderColor: '#d5d5d5',
                          borderRadius: 10,
                          height: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 10,
                          backgroundColor: '#f9f9f9',
                        }}>
                        {alreadyUploaded ? (
                          <Image
                            source={{ uri: imageFromServer.image_url }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 10,
                            }}
                            resizeMode="cover"
                          />
                        ) : item.uri ? (
                          <Image
                            source={{ uri: item.uri }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 10,
                            }}
                            resizeMode="cover"
                          />
                        ) : (
                          <>
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="#aaa"
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: 'Montserrat-Medium',
                                color: '#767676',
                              }}>
                              Select Image
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>

                      {!alreadyUploaded && (
                        <TouchableOpacity
                          onPress={item.isLoading ? null : item.onUpload}
                          style={{
                            backgroundColor: '#4caf50',
                            paddingVertical: 6,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontFamily: 'Montserrat-SemiBold',
                              fontSize: 13,
                            }}>
                            {item.isLoading ? 'Uploading...' : 'Upload'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        <View style={{ backgroundColor: "#ebebebff", elevation: 1, paddingHorizontal: 10, paddingVertical: 10 }}>{handlingEventStatus()}</View>

        <View style={{ marginBottom: 20, marginHorizontal: 100 }}>
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
      </ScrollView>
      {/* calculator modal */}
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
        <View style={{ marginBottom: 10 }}>
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
      {/* otp modal */}
      <Modal
        animationIn="slideInUp"
        isVisible={openOtpModal}
        deviceWidth={deviceWidth}
        style={{
          margin: 0,
          position: 'absolute',
          width: '100%',
          top: '30%',
          backgroundColor: 'white',
          shadowColor: '#000',
          padding: 10,
          borderRadius: 10,
        }}
        transparent={true}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            // marginBottom: 5,
            // position: 'absolute',
            top: -5,
            right: -5,
            // zIndex: 1,
          }}>
          <AntDesign
            onPress={() => setOpenOtpModal(false)}
            name="closecircle"
            color="black"
            size={23}
          />
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontSize: 17,
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
              textAlign: 'center',
              marginVertical: 10,
            }}>
            Verify OTP
          </Text>
          <OTPTextInput
            textInputStyle={{
              borderWidth: 1,
              borderBottomWidth: 1,
              borderRadius: 5,
              marginTop: 10,
            }}
            handleTextChange={te => setOtpValue(te)}
            inputCount={4}
            tintColor={THEMECOLOR.mainColor}
          />
          <TouchableOpacity
            onPress={loading ? null : handleDeliveryOrders}
            disabled={loading}
            style={{ marginHorizontal: 70, marginVertical: 20 }}>
            <Text
              style={{
                fontSize: 14,
                color: 'white',
                fontFamily: 'Montserrat-Medium',
                backgroundColor: THEMECOLOR.mainColor,
                borderRadius: 10,
                textAlign: 'center',
                paddingVertical: 10,
              }}>
              {loading ? 'Verifying' : 'Verify'}
            </Text>
          </TouchableOpacity>
        </View>
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
    color: 'red',
    fontSize: 13,
    textAlign: 'left',
    marginTop: 10,
  },
  boxImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
});
export default EventDetails;
