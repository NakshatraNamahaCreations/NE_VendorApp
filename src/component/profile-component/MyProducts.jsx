import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
import { apiUrl } from '../../api-services/api-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import THEMECOLOR from '../../utilities/color';
import useBackHandler from '../../utilities/useBackHandler';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function MyProducts() {
  useBackHandler();
  const route = useRoute();
  const navigation = useNavigation();
  const vendorId = route.params.vendorId;

  console.log('vendorId in my my product listing page', vendorId);

  const [vendorProduct, setVendorProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [producStatus, setProducStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const producStatusList = ['All', 'Under Review', 'Approved', 'Disapproved'];

  const fetchData = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PRODUCT}${vendorId}`,
      );
      if (res.status === 200) {
        setVendorProduct(res.data.products);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  // filter only for product status
  // const filterData = () => {
  //   if (producStatus === 'All') {
  //     return vendorProduct;
  //   } else {
  //     return vendorProduct.filter(
  //       item => item.approval_status === producStatus,
  //     );
  //   }
  // };
  const filterData = () => {
    let filtered = vendorProduct;

    // Apply status filter
    if (producStatus !== 'All') {
      filtered = filtered.filter(item => item.approval_status === producStatus);
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const filterProductStatus = filterData();
  console.log('filterProductStatus', filterProductStatus.length);

  const renderProductItem = ({ item, index }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 8,
      }}
      onPress={() => navigation.navigate('ProductDetails', { item })}>
      <View style={{ flex: 0.25 }}>
        <Image
          source={{ uri: item.product_image[0] }}
          style={{
            height: 80,
            resizeMode: 'cover',
            borderRadius: 10,
            marginRight: 10,
          }}
        />
      </View>
      <View style={{ flex: 0.75 }}>
        <Text
          style={{
            fontSize: 14,
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            marginBottom: 5,
          }}>
          {item.product_name}
        </Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Text
            style={{
              fontSize: 13,
              flex: 1,
              color: 'black',
              fontFamily: 'Montserrat-SemiBold',
            }}>
            ₹{item.product_price}/day
          </Text>
          {/* uncommand later */}
          {item.approval_status === 'Disapproved' && (
            <TouchableOpacity
              style={{
                backgroundColor: '#DB2777',
                borderRadius: 5,
                paddingHorizontal: 15,
                paddingVertical: 8,
              }}
              onPress={() =>
                navigation.navigate('EditProduct', {
                  productItems: item,
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
        <ActivityIndicator size="small" color={THEMECOLOR.mainColor} />
      </View>
    );
  }
  // console.log('producStatusList', producStatusList);

  return (
    <View style={{ padding: 10 }}>
      {/* Filter Tabs */}

      <View style={{ marginVertical: 10 }}>
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
        style={{ marginBottom: 15 }}>
        {producStatusList.map((status, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setProducStatus(status)}
            style={{ marginHorizontal: 10 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Montserrat-SemiBold',
                color: producStatus === status ? THEMECOLOR.mainColor : '#000',
                borderBottomWidth: producStatus === status ? 2 : 0,
                borderBottomColor: THEMECOLOR.mainColor,
                paddingBottom: 4,
              }}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filterProductStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderProductItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={<View style={{ marginBottom: 120 }} />}
      // ListEmptyComponent={
      //   <View
      //     style={{alignItems: 'center', marginTop: 150,}}>
      //     <FontAwesome5 name="box-open" size={50} color="#ccc" />
      //     <Text
      //       style={{
      //         fontSize: 16,
      //         color: '#ccc',
      //         fontFamily: 'Montserrat-SemiBold',
      //         textAlign: 'center',
      //         marginTop: 10,
      //       }}>
      //       You haven't added any products
      //     </Text>
      //   </View>
      // }
      />
    </View>
  );
}

{
  /* <div class="col right-col">
<div style="font-size: 15px; font-weight: bold">
  Invoice Number: 09
</div>
<div style="font-size: 15px; font-weight: bold">11-Dec-24</div>
 <div style="font-size: 15px; font-weight: bold">Event Name: ${
   event.event_name || 'Event Name'
 }</div>
  <div style="font-size: 15px; font-weight: bold">Event Date: ${moment(
    event.event_start_date,
  ).format('ll')} To ${moment(event.event_end_date).format(
'll',
)}</div>
</div> */
}
