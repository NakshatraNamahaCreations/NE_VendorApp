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
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {apiUrl} from '../../api-services/api-constants';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {shareTickets} from '../../utilities/pdfUtils';
import {shareInvoice} from '../../utilities/GenerateInvoice';
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
  // const {restData} = eventData;
  // console.log('eventData', eventData);

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

  // console.log('vendor', vendor._id);

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
  const [bookingStatus, setBookingStatus] = useState(false);

  // const [paymentSummary, setPaymentSummary] = useState({
  //   totalAmount: 0,
  //   CommissionInPerc: 0,
  //   taxInPerc: 0,
  //   grandTotal: 0,
  // });
  const [isLoading, setIsLoading] = useState('');
  const [isUnLadedeLoading, setIsUnLodedeLoading] = useState('');
  const [isSetupLoading, setIsSetupLoading] = useState('');
  const [otpValue, setOtpValue] = useState('');
  // let text = eventData?.order_status || event.order_status;
  // let updatedText = text?.replace(/Order/i, 'Event');
  const [openCalculator, setOpenCalculator] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  console.log('events in EventDetails.jsx', event);
  // console.log('vendor in EventDetails.jsx', vendor);

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

  console.log('setupImages', setupImages);

  const findDeliveryStatus = hasBooking.find(
    ele => ele.order_status === 'Order Delivered',
  );
  // console.log('findDeliveryStatus', findDeliveryStatus);

  // const calculatePayout = () => {
  //   const orderAmount = hasBooking.reduce(
  //     (acc, value) => acc + value.totalPrice,
  //     0,
  //   );

  //   const commissionPercentage = Number(
  //     hasBooking?.[0]?.commissionPercentage || 22,
  //   );
  //   const commissionTax = Number(hasBooking?.[0]?.commissionTax || 18);

  //   const commissionAmount = orderAmount * (commissionPercentage / 100);

  //   // console.log('commissionPercentage:', commissionPercentage);
  //   // console.log('commissionTax:', commissionTax);
  //   // console.log('orderAmount:', orderAmount);

  //   const taxAmount = commissionAmount * (commissionTax / 100);
  //   const finalPayout = orderAmount - commissionAmount - taxAmount;

  //   return {
  //     orderAmount: `₹${orderAmount?.toFixed(2)}`,
  //     commissionAmount: `₹${commissionPercentage?.toFixed(2)}`,
  //     commissionTax: `₹${commissionTax?.toFixed(2)}`,
  //     totalDeduction: `₹${finalPayout?.toFixed(2)}`,
  //   };
  // };

  // console.log('commissionAmount', calculatePayout().commissionAmount);

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
    // console.log('orderAmount ', orderAmount);

    const commissionPercentage = Number(
      vendor.commission_percentage || hasData?.[0]?.commissionPercentage,
    );
    const commissionTaxPercentage = Number(
      vendor.commission_tax || hasData?.[0]?.commissionTax,
    );

    // console.log('commissionPercentage:', commissionPercentage);
    // console.log('commissionTax:', commissionTaxPercentage);
    // console.log('orderAmount:', orderAmount);

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
    // console.log('payoutValues', payoutValues);

    setIsOpenSummary(!isOpenSummary);
    setViewSummaryOpen(payoutValues);
  };

  // useEffect(() => {
  //   const payoutValues = calculatePayout();
  //   if (payoutValues) {
  //     setViewSummaryOpen(payoutValues);
  //   }
  // }, [event, vendor]);

  const paymentSummary = {
    totalAmount: `${calculatePayout()?.orderAmount}`,
    CommissionInPerc: `${calculatePayout()?.commissionAmount}`,
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
          delivered_date: moment().format('YYYY-MM-DD HH:mm:ss'),
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
      value: razorPay?.toFixed(2),
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

  //   const generatePDF = async event => {
  //     const htmlContent = `<html lang="en">
  // <head>
  //   <meta charset="UTF-8" />
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //   <title>Delivery Challan</title>
  //   <style>
  //     body {
  //       font-family: "Montserrat", sans-serif;
  //       margin: 0;
  //       padding: 0;
  //       background-color: white;
  //       color: #333;
  //       box-sizing: border-box;
  //     }

  //     .container {
  //       padding: 15px;
  //     }

  //     .header {
  //       text-align: center;
  //       font-size: 22px;
  //       font-weight: bold;
  //       margin: 10px 0;
  //     }

  //     .event-date {
  //       display: flex;
  //       justify-content: center;
  //       gap: 10px;
  //       color: gray;
  //       font-size: 14px;
  //       margin-bottom: 15px;
  //     }

  //     .details-section .row {
  //     display: grid;
  //     grid-template-columns: 150px auto; /* Fixed width for the first column */
  //     align-items: center;
  //     margin-bottom: 10px;
  //   }

  //   .details-section .row span {
  //     font-size: 14px;
  //     color: #333;
  //   }

  //   .details-section .label {
  //     font-weight: bold;
  //     white-space: nowrap; /* Prevents text wrapping in the label column */
  //   }

  //   .details-section .value {
  //     overflow-wrap: break-word; /* Allows long content to wrap within the value column */
  //     word-wrap: break-word;
  //     word-break: break-word;
  //   }

  //     .event-invitation,
  //     .event-gatepass {
  //       width: 100px;
  //       height: auto;
  //       border: 1px solid #ddd;
  //       border-radius: 5px;
  //     }

  //     .items-table {
  //       margin-top: 20px;
  //       width: 100%;
  //       border-collapse: collapse;
  //       background-color: #fff;
  //     }

  //     .items-table th,
  //     .items-table td {
  //       border: 1px solid #ddd;
  //       padding: 10px;
  //       text-align: left;
  //       font-size: 14px;
  //     }

  //     .items-table th {
  //       background-color: #f4f4f4;
  //       font-weight: bold;
  //     }

  //     .items-table td img {
  //       max-width: 50px;
  //       height: auto;
  //       border-radius: 5px;
  //     }
  //   </style>
  // </head>
  // <body>
  //   <div class="container">
  //     <!-- Event Header -->
  //     <div class="header">${event.event_name || 'Event Name'}</div>
  //     <div class="event-date">
  //       <span>${
  //         event.event_start_date
  //           ? moment(event.event_start_date).format('ll')
  //           : 'Start Date'
  //       }</span>
  //       <span>${event.event_start_time || 'Start Time'}</span>
  //     </div>

  //     <!-- Event Details Section -->
  //     <div class="details-section">
  //   <div class="row">
  //     <span class="label"><strong>Booked by:</strong></span>
  //     <span class="value">${event.user_name || 'N/A'}</span>
  //   </div>
  //   <div class="row">
  //     <span class="label"><strong>Receiver:</strong></span>
  //     <span class="value">${event.receiver_name || 'N/A'}, +91 ${
  //       event.receiver_mobilenumber || 'N/A'
  //     }</span>
  //   </div>
  //   <div class="row">
  //     <span class="label"><strong>Event Timing:</strong></span>
  //     <span class="value">${event.event_start_time || 'N/A'} - ${
  //       event.event_end_time || 'N/A'
  //     }</span>
  //   </div>
  //   <div class="row">
  //     <span class="label"><strong>Event Date:</strong></span>
  //     <span class="value"> From ${moment(event.event_start_date).format(
  //       'll',
  //     )} To ${moment(event.event_end_date).format('ll')}</span>
  //   </div>
  //   <div class="row">
  //     <span class="label"><strong>Venue Name:</strong></span>
  //     <span class="value">${event.venue_name || 'N/A'}</span>
  //   </div>
  //   <div class="row">
  //     <span class="label"><strong>Location:</strong></span>
  //     <span class="value">  <a href="#" onclick="navigateLocation()" style="color: #007bff; text-decoration: underline;">
  //       ${event.event_location || 'N/A'}
  //     </a></span>
  //   </div>
  //   <div class="row">
  //     <span class="label"><strong>Venue Open Time:</strong></span>
  //     <span class="value">${event.venue_open_time || 'N/A'}</span>
  //   </div>
  //   <div class="row">
  //     <span class="label"><strong>Event Days:</strong></span>
  //     <span class="value">${event.number_of_days || 1} day(s)</span>
  //   </div>
  //   <div class="row">
  //     <span class="label"><strong>Invitation:</strong></span>
  //     <span class="value">
  //      <img class="event-invitation" src="${apiUrl.IMAGEURL}${
  //       event.upload_invitation
  //     }" alt="Item 1" />
  //     </span>
  //   </div>
  //    <div class="row">
  //     <span class="label"><strong>Gate Entry Pass:</strong></span>
  //     <span class="value">
  //      <img class="event-invitation" src="${apiUrl.IMAGEURL}${
  //       event.upload_gatepass
  //     }" alt="Item 1" />
  //     </span>
  //   </div>
  // </div>

  //     <!-- Items Table -->
  //     <table class="items-table">
  //       <thead>
  //         <tr>
  //           <th>Image</th>
  //           <th>Description</th>
  //           <th>Qty</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         ${
  //           Array.isArray(productData) && productData.length > 0
  //             ? productData
  //                 .map(
  //                   ele => `
  //               <tr>
  //                 <td><img src="${apiUrl.IMAGEURL}${
  //                     ele.imageUrl || 'placeholder.jpg'
  //                   }" alt="Product" /></td>
  //                 <td>${ele.productName || 'N/A'}</td>
  //                 <td>${ele.quantity || 0}</td>
  //               </tr>`,
  //                 )
  //                 .join('')
  //             : `
  //           <tr>
  //             <td colspan="3" style="text-align: center;">No Products Available</td>
  //           </tr>`
  //         }
  //       </tbody>
  //     </table>
  //     <div>
  //      <p class="label">
  //      This is auto generated delivery challan, to be considered only for immediate reference.
  //      </p>
  //     </div>
  //   </div>
  // </body>
  // </html>
  //   `;

  //     try {
  //       const options = {
  //         html: htmlContent,
  //         fileName: 'delivery_challan',
  //         directory: 'Documents',
  //       };

  //       const file = await RNHTMLtoPDF.convert(options);
  //       console.log('PDF created at:', file.filePath);

  //       return file.filePath;
  //     } catch (error) {
  //       console.error('Error generating PDF:', error);
  //       throw error;
  //     }
  //   };

  //   const sharePDF = async filePath => {
  //     const shareOptions = {
  //       title: 'Share Event Details',
  //       url: `file://${filePath}`,
  //       message: 'Check out the event details!',
  //     };
  //     try {
  //       await Share.open(shareOptions);
  //     } catch (error) {
  //       console.error('Error sharing PDF:', error);
  //     }
  //   };

  //   const shareTickets = async event => {
  //     try {
  //       const filePath = await generatePDF(event);
  //       await sharePDF(filePath);
  //     } catch (error) {
  //       console.error('Error sharing tickets:', error);
  //     }
  //   };

  // if (pageLoad) {
  //   return (
  //     <View
  //       style={{
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         flex: 1,
  //       }}>
  //       <ActivityIndicator size="large" color="#7460e4" />
  //     </View>
  //   );
  // }

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

  const captureImage = async ({onSetUri, onSetName}) => {
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

  const uploadImage = async ({imageUri, imageName, imageType, onLoading}) => {
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
          headers: {'Content-Type': 'multipart/form-data'},
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

  const generateRandomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000); // Ensures a 5-digit number
  };

  const generateRandomStringWithNumber = () => {
    return generateRandomString(3) + generateRandomNumber(); // Example: "ABC12345"
  };
  const invoiceNumber = generateRandomStringWithNumber();

  useEffect(() => {
    const eventStartDate = moment(event.event_start_date, 'YYYY-MM-DD');
    const eventEndDate = moment(event.event_end_date, 'YYYY-MM-DD');
    const today = moment();

    if (
      today.isSame(eventStartDate, 'day') ||
      today.isBefore(eventEndDate, 'day') ||
      today.isAfter(eventEndDate, 'day')
    ) {
      setBookingStatus(true);
    } else {
      setBookingStatus(false);
    }
  }, [event]);

  const handlingEventStatus = () => {
    const eventStartDate = moment(event.event_start_date, 'YYYY-MM-DD');
    const eventEndDate = moment(event.event_end_date, 'YYYY-MM-DD');
    const today = moment();

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
          <TouchableOpacity
            style={{
              marginTop: 5,
            }}
            onPress={() =>
              shareInvoice(
                event,
                event.product_data,
                vendor,
                paymentSummary,
                invoiceNumber,
              )
            }
            // onPress={isLoading ? null : eventSetup}
          >
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                color: '#1a1aff',
                fontSize: 10,
                textDecorationColor: '#1a1aff',
                textDecorationStyle: 'dashed',
                textDecorationLine: 'underline',
              }}>
              Generate Invoice
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
            marginTop: 10,
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
            marginTop: 10,
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
  };

  // console.log('handlingEventStatus', handlingEventStatus());

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
        <TouchableOpacity
          onPress={() => shareTickets(event, event.product_data)}
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
            #{event._id?.slice(-6)}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Montserrat-Medium',
              color: 'black',
              flex: 0.5,
            }}>
            {moment(event.event_start_date).format('ll')} -{' '}
            {moment(event.event_end_date).format('ll')}
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
              {bookingStatus ? null : (
                <View style={{width: '45%'}}>
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
              {/* make it ivr for receiver number */}
              {/* <View style={{flexDirection: 'row', marginTop: 5}}>
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
              </View> */}
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
                  {moment(event.event_start_date).format('ll')} -{' '}
                  {moment(event.event_end_date).format('ll')}
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
                  Event Setup Time
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                    flex: 0.5,
                  }}>
                  {event.setup_start_time} to {event.setup_end_time}
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

              {/* <View style={{flexDirection: 'row', marginTop: 5}}>
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
              </View> */}

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
            <View
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
            <View style={{marginTop: 10}}>
              {/* {bookingType === 'Product' ? (
                <> */}
              {selectedData?.map(item => (
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
                        textAlign: 'center',
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
              {/* </>
              ) : (
                <>
                  {eventData.service_data?.map(item => (
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
                            textAlign: 'center',
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
                </>
              )} */}
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
          <View style={{marginTop: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                      shadowOffset: {width: 0, height: 2},
                      shadowRadius: 5,
                      elevation: 4,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Montserrat-SemiBold',
                        marginBottom: 10,
                        color: 'black',
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
                      {alreadyUploaded && imageFromServer?.image_url ? (
                        <Image
                          source={{uri: imageFromServer.image_url}}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 10,
                          }}
                          resizeMode="cover"
                        />
                      ) : item.uri ? (
                        <Image
                          source={{uri: item.uri}}
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
          </View>
        </View>

        <View style={{marginBottom: 20}}>{handlingEventStatus()}</View>
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
            style={{marginHorizontal: 70, marginVertical: 20}}>
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
export default EventDetails;
