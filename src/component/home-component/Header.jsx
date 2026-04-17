import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import THEMECOLOR from '../../utilities/color';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Badge} from 'react-native-paper';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';

export default function Header({vendor, refreshKey}) {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const vendorData = vendor;
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_NOTIFICATION}${vendorData._id}`,
      );
      setNotifications(response.data?.reverse());
    } catch (error) {
      console.log('Error fetching notifications:', error);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, [vendorData?._id, refreshKey]);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, []),
  );

  const notificationCount = useMemo(() => {
    return notifications.filter(item => item.status === 'unread').length;
  }, [notifications]);

  // console.log('vendorData', vendor);

  const goToNotification = () => {
    navigation.navigate('Notification', {
      vendor: vendor,
    });
  };

  const navigateToSearch = () => {
    navigation.navigate('Search');
  };
  // console.log('vendor in header page>>', vendor);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
      {/* // <LinearGradient
    //   colors={['#20c5ad', '#b2d76566']}
    //   style={{flexDirection: 'row', alignItems: 'center'}}> */}
      <View style={{flex: 0.7}}>
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            // marginBottom: 10,
            fontFamily: 'Montserrat-Bold',
            // textShadowColor: 'gray',
            // textShadowOffset: {width: 2, height: 0},
            // textShadowRadius: 2,
          }}>
          Hello {vendor?.vendor_name}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: THEMECOLOR.mainColor,
            fontFamily: 'Montserrat-SemiBold',
          }}>
          Welcome to nithyaevent
        </Text>
      </View>
      <View
        style={{
          flex: 0.3,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        {/* <TouchableOpacity onPress={navigateToSearch}>
          <AntDesign
            name="search1"
            color="black"
            size={20}
            style={{
              backgroundColor: '#f9f9f9',
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
        </TouchableOpacity> */}
        {/* {vendorData?.profession === 'Vendor & Seller' ? ( */}
        <TouchableOpacity onPress={goToNotification}>
          <View
            style={{
              position: 'absolute',
              right: 0,
              zIndex: 1,
              top: 0,
            }}>
            <Badge theme={{colors: {primary: 'green'}}}>
              {notificationCount}
            </Badge>
          </View>
          <FontAwesome
            name="bell-o"
            color="black"
            size={20}
            style={{
              backgroundColor: '#f9f9f9',
              width: 40,
              height: 40,
              textAlign: 'center',
              paddingTop: 10,
              borderRadius: 50,
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
        {/* ) : (
          <TouchableOpacity>
            <View
              style={{
                position: 'absolute',
                right: 0,
                zIndex: 1,
                top: 0,
              }}>
              <Badge theme={{colors: {primary: 'green'}}}>
                {notificationCount}
              </Badge>
            </View>
            <FontAwesome
              name="bell-o"
              color="black"
              size={20}
              style={{
                backgroundColor: '#f9f9f9',
                width: 40,
                height: 40,
                textAlign: 'center',
                paddingTop: 10,
                borderRadius: 50,
                marginLeft: 15,
              }}
            />
          </TouchableOpacity>
        )} */}
      </View>
      {/* // </LinearGradient> */}
    </View>
  );
}
