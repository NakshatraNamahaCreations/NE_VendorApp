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
import Entypo from 'react-native-vector-icons/Entypo';
import Share from 'react-native-share';
import {apiUrl} from '../../api-services/api-constants';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const EventDetails = () => {
  const captureMoodBoard = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  const event = route.params.events;
  const productData = Array.isArray(event.product_data)
    ? event.product_data
    : [];
  const vendor = route.params.vendorData;
  const [isOpenSummary, setIsOpenSummary] = useState(false);
  const [viewSummaryOpen, setViewSummaryOpen] = useState({});

  //   console.log('events in EventDetails.jsx', event);
  //   console.log('vendor in EventDetails.jsx', vendor);

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
  //   console.log('calculatePayout', calculatePayout());

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

  const generatePDF = async event => {
    const htmlContent = `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Delivery Challan</title>
    <style>
      body {
        font-family: "Montserrat", sans-serif;
        margin: 0;
        padding: 0;
        background-color: white;
        color: #333;
        box-sizing: border-box;
      }

      .container {
        padding: 15px;
      }

      .header {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        margin: 10px 0;
      }

      .event-date {
        display: flex;
        justify-content: center;
        gap: 10px;
        color: gray;
        font-size: 14px;
        margin-bottom: 15px;
      }

      .get-direction {
        display: block;
        text-align: center;
        margin: 15px auto;
        background-color: #ff4040;
        color: #fff;
        padding: 10px 15px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        width: 90%;
        max-width: 300px;
      }

      .details-section {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #fff;
      }

      .details-section .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .details-section .row span {
        font-size: 14px;
        color: #333;
      }

      .download-links {
            display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      } 
        .event-invitation{
       width: 100px;height:100px
        }
        .event-gatepass{width: 100px;height:40px
        }
     .table {
        width: 100%; background-color: #fff;  margin-top: 20px;
      }
           .table td img {
        max-width: 50px;
        height: 50px;
        border-radius: 5px;
      }
 .table th,
      .table td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
        font-size: 14px;
      }


      .items-table {
        margin-top: 20px;
        width: 100%;
        background-color: #fff;
      }

      .items-table th,
      .items-table td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
        font-size: 14px;
      }

      .items-table th {
        background-color: #f4f4f4;
        font-weight: bold;
      }

      .items-table td img {
        max-width: 50px;
        height: auto;
        border-radius: 5px;
      }

      .share-button {
        display: block;
        text-align: center;
        background-color: #ff4040;
        color: #fff;
        padding: 10px 15px;
        margin: 20px auto 0;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        width: 90%;
        max-width: 300px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">${event.event_name}</div>
      <div class="event-date">
        <span>${moment(event.event_start_date).format('ll')}</span>
        <span>${event.event_start_time}</span>
      </div>
      <!-- <a href="#" class="get-direction">Get Direction</a> -->

      <div class="details-section">
        <div class="row">
          <span><strong>Booked by:</strong> ${event.user_name}</span>
          <span><strong>Receiver:</strong> ${event.receiver_name}, +91 ${
      event.receiver_mobilenumber
    }</span>
        </div>
        <div class="row">
          <span><strong>Event Timing:</strong> ${event.event_start_time} - ${
      event.event_end_time
    }</span>
          <span><strong>Venue Name:</strong> ${event.venue_name}</span>
        </div>
        <div class="row">
          <span><strong>Venue:</strong> Ibis party hall</span>
          <span
            ><strong>Location:</strong>${event.event_location} </span
          >
        </div>
        <div class="row">
          <span><strong>Venue Open Time:</strong>${event.venue_open_time}</span>
          <span><strong>Event Days:</strong> ${event.number_of_days} day</span>
        </div>
        <div class="row">
          <span><strong>Invitation</strong></span>
       <span>  <img class="event-invitation" src="${apiUrl.IMAGEURL}${
      event.upload_invitation
    }" alt="Item 1" /> </span>
        </div>
         <div class="row">
          <span><strong>Gate Entry Pass</strong></span>
      <span>  <img class="event-gatepass" src="${apiUrl.IMAGEURL}${
      event.upload_gatepass
    }" alt="Item 1" /></span>
    </div>
      </div>  
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Description</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
        ${productData
          .map(
            ele =>
              `
            <tr>
            <td><img src="${apiUrl.IMAGEURL}${ele.imageUrl}" alt="Item 1" /></td>
            <td>
              ${ele.productName}
            </td>
            <td>${ele.quantity}</td>
          </tr>`,
          )
          .join('')}          
        </tbody>
      </table>

      <!-- <a href="#" class="share-button">Share</a> -->
    </div>
  </body>
</html>`;

    try {
      const options = {
        html: htmlContent,
        fileName: 'EventDetails',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      console.log('PDF created at:', file.filePath);

      return file.filePath;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const sharePDF = async filePath => {
    const shareOptions = {
      title: 'Share Event Details',
      url: `file://${filePath}`,
      message: 'Check out the event details!',
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing PDF:', error);
    }
  };

  const shareTickets = async event => {
    try {
      const filePath = await generatePDF(event);
      await sharePDF(filePath);
    } catch (error) {
      console.error('Error sharing tickets:', error);
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
              {event.event_start_time}
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
            )}
          </View>
        </View>
      </ScrollView>

      <View style={{marginHorizontal: 20, marginVertical: 10}}>
        <TouchableOpacity
          onPress={() => shareTickets(event)}
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
