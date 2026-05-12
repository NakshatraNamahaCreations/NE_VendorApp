import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  FlatList,
  TextInput,
} from 'react-native';
import {apiUrl} from '../../api-services/api-constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import THEMECOLOR from '../../utilities/color';
import useBackHandler from '../../utilities/useBackHandler';
import { formatAmount } from '../../utilities/formatAmount';

export default function MyProducts() {
  const route = useRoute();
  const vendorId = route.params.vendorId;
  const navigation = useNavigation();
  useBackHandler();

  console.log('vendorId in my my product listing page', vendorId);

  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sericeStatus, setServiceStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sericeStatusList = ['All', 'Under Review', 'Approved', 'Disapproved'];

  const fetchService = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ALL_SERVICES_BY_VENDOR_ID}${vendorId}`,
      );
      if (res.status === 200) {
        setServiceList(res.data.service);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('serviceList in service list screen', serviceList);

  useEffect(() => {
    fetchService();
  }, [vendorId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchService();
    setRefreshing(false);
  };

  const filterData = () => {
    let filtered = serviceList;

    if (sericeStatus !== 'All') {
      filtered = filtered.filter(item => item.approval_status === sericeStatus);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item =>
        item.service_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const filterServiceStatus = filterData();

  const renderServiceItem = ({item, index}) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 8,
      }}
      onPress={() => navigation.navigate('ServiceDetails', {item: item})}>
      <View style={{flex: 0.25}}>
        <Image
          source={{
            uri:
              item?.additional_images?.length > 0
                ? item.additional_images[0]
                : 'https://t3.ftcdn.net/jpg/05/79/68/24/360_F_579682465_CBq4AWAFmFT1otwioF5X327rCjkVICyH.jpg',
          }}
          style={{
            height: 80,
            resizeMode: 'cover',
            borderRadius: 10,
            marginRight: 10,
          }}
        />
      </View>
      <View style={{flex: 0.75}}>
        <Text
          style={{
            fontSize: 14,
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            marginBottom: 5,
          }}>
          {item.service_name}
        </Text>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
          <Text
            style={{
              fontSize: 13,
              flex: 1,
              color: 'black',
              fontFamily: 'Montserrat-SemiBold',
            }}>
            ₹{formatAmount(item.price)}/day
          </Text>
          {item.approval_status === 'Disapproved' && (
            <TouchableOpacity
              style={{
                backgroundColor: '#DB2777',
                borderRadius: 5,
                paddingHorizontal: 15,
                paddingVertical: 8,
              }}
              onPress={() =>
                navigation.navigate('Edit Service', {
                  serviceDetails: item,
                  vendorId: vendorId,
                })
              }>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontFamily: 'Montserrat-Medium',
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Montserrat-SemiBold',
            color:
              item.approval_status === 'Disapproved'
                ? '#e91e63'
                : item.approval_status === 'Approved'
                ? 'green'
                : 'orange',
          }}>
          {item.approval_status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <ActivityIndicator size="large" color={THEMECOLOR.mainColor} />
      </View>
    );
  }

  return (
    <View style={{padding: 10}}>
      <View style={{marginVertical: 10}}>
        <TextInput
          style={{
            height: 45,
            borderColor: '#dfdfdf',
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: 10,
            fontFamily: 'Montserrat-Medium',
            fontSize: 14,
            color: '#333',
            backgroundColor: 'white',
          }}
          placeholder="Search Products"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 15}}>
        {sericeStatusList.map((status, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setServiceStatus(status)}
            style={{marginHorizontal: 10}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Montserrat-SemiBold',
                color: sericeStatus === status ? THEMECOLOR.mainColor : '#000',
                borderBottomWidth: sericeStatus === status ? 2 : 0,
                borderBottomColor: THEMECOLOR.mainColor,
                paddingBottom: 4,
              }}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filterServiceStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderServiceItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={<View style={{marginBottom: 120}} />}
      />
    </View>
  );
}
