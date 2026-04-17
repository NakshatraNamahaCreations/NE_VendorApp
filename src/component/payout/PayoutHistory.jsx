import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import useBackHandler from '../../utilities/useBackHandler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {apiUrl} from '../../api-services/api-constants';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import THEMECOLOR from '../../utilities/color';

export default function PayoutHistory() {
  useBackHandler();
  const route = useRoute();
  const vendorData = route.params?.vendor;
  const [earningsData, setEarningsData] = useState([]);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [processedAmount, setProcessedAmount] = useState(0);
  const [initiatedAmount, setInitiatedAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVendorEarning = async () => {
    setLoading(true);
    try {
      const orderRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_BY_VENDORID}${vendorData?._id}`,
      );
      if (orderRes.status === 200) {
        setEarningsData(orderRes.data.data);
        setProcessedAmount(orderRes.data.processedAmount);
        setInitiatedAmount(orderRes.data.initiatedAmount);
      }
    } catch (error) {
      console.log('Failed to fetch vendor revenue history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorEarning();
  }, [vendorData?._id]);

  const getPayouts = async () => {
    try {
      setLoading(true);
      const payoutRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_AMOUNT}${vendorData?._id}`,
      );
      if (payoutRes.status === 200) {
        setPayoutAmount(payoutRes.data.data);
      }
    } catch (error) {
      console.log('Failed to fetch payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayouts();
  }, [vendorData?._id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchVendorEarning(), getPayouts()]).finally(() => {
      setRefreshing(false);
    });
  }, [vendorData?._id]);

  // {
  //   loading && (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //       }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '100%',
      }}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={THEMECOLOR.mainColor} />
        </View>
      ) : earningsData && earningsData?.length > 0 ? (
        <>
          <View
            style={{
              backgroundColor: '#f9fafe',
              paddingTop: 15,
              paddingBottom: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 0.5, paddingLeft: 20}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  Total Earnings
                </Text>
                <Text
                  style={{
                    fontSize: 25,
                    color: 'black',
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  ₹ {payoutAmount}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  paddingRight: 10,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#0d6efd',
                    fontFamily: 'Montserrat-Medium',
                    marginVertical: 3,
                  }}>
                  Initialized
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  <Ionicons name="checkmark" color="#0d6efd" size={15} /> ₹{' '}
                  {initiatedAmount}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#198754',
                    marginVertical: 3,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  Processed
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  <Ionicons name="checkmark-done" color="#198754" size={15} /> ₹{' '}
                  {processedAmount}
                </Text>
              </View>
            </View>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{marginVertical: 10}}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  paddingHorizontal: 15,
                }}>
                Recent Transaction
              </Text>
              <View
                style={{
                  marginTop: 10,
                  borderBottomColor: '#eef1fb',
                  borderBottomWidth: 1,
                }}
              />
              <View style={{marginTop: 10}}>
                {earningsData.map((amt, index) => (
                  <View
                    key={index + 1}
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      marginBottom: 10,
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View
                      style={{
                        flex: 0.1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Ionicons
                        style={{
                          backgroundColor: '#b3c5f7',
                          padding: 10,
                          borderRadius: 10,
                        }}
                        name="logo-electron"
                        color="white"
                        size={15}
                      />
                    </View>
                    <View style={{flex: 0.5, paddingLeft: 15}}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'black',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        {amt.event_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#8c8d97',
                          fontFamily: 'Montserrat-Medium',
                          marginTop: 5,
                        }}>
                        {amt.created_date}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.4,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        paddingRight: 15,
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'black',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        ₹ {amt.payout_amount}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: 'Montserrat-SemiBold',
                          marginTop: 5,
                          color:
                            amt.payout_status === 'Initialized'
                              ? '#0d6efd'
                              : amt.payout_status === 'Processed'
                              ? '#198754'
                              : '#ffc107',
                          backgroundColor:
                            amt.payout_status === 'Initialized'
                              ? '#0d6efd4a'
                              : amt.payout_status === 'Processed'
                              ? '#19875440'
                              : '#ffc1073b',
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                          borderRadius: 5,
                        }}>
                        {amt.payout_status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </>
      ) : (
        <Text
          style={{
            fontSize: 17,
            color: '#9d9d9d73',
            fontFamily: 'Montserrat-SemiBold',
            textAlign: 'center',
          }}>
          No records to display
        </Text>
      )}
    </View>
  );
}
