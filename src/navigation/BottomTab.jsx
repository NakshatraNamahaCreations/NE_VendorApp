import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import THEMECOLOR from '../utilities/color';
import Home from '../component/home-component/Home';
import MyCart from '../component/cart/MyCart';
import OrderHistory from '../component/order/OrderHistory';
import AddProduct from '../component/product/ProductType';
import Profile from '../component/profile-component/Profile';
import {TouchableOpacity} from 'react-native';
import ProductType from '../component/product/ProductType';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Schedules from '../component/service/Schedules';
import AddService from '../component/service/AddService';
import Service from '../component/service/Service';
import BookingList from '../component/user-bookings/BookingList';
import AvailableProducts from '../component/product/AvailableProducts';
import AvailableService from '../component/service/AvailableService';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const cart = useSelector(state => state.cart);

  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const getVendorData = async () => {
      try {
        const vendorData = await AsyncStorage.getItem('vendor');
        setVendor(vendorData ? JSON.parse(vendorData) : null);
      } catch (error) {
        console.error('Failed to load vendor data', error);
      }
    };

    getVendorData();
  }, []);
  // console.log('vendor in bottom tab', vendor);

  const CustomTabBarButton = ({children, onPress, accessibilityState}) => {
    const isSelected = accessibilityState.selected;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isSelected ? '#C026D3' : 'transparent',
          borderRadius: 0, // Adjust the border radius as needed
        }}>
        {children}
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: THEMECOLOR.mainColor,
        headerTintColor: THEMECOLOR.mainColor,
        tabBarActiveBackgroundColor: '#F5D0FE',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />
      {vendor?.profession && vendor?.profession === 'Vendor & Seller' ? (
        <Tab.Screen
          name="Booking List"
          // component={OrderHistory}
          options={{
            tabBarLabel: 'Bookings',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="calendar-month"
                color={color}
                size={size}
              />
            ),
          }}>
          {() => <BookingList vendorData={vendor} />}
        </Tab.Screen>
      ) : (
        <Tab.Screen
          name="Schedule"
          // component={ProductType}
          options={{
            tabBarLabel: 'Bookings',
            headerShown: false,
            // title: 'Schedule',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="calendar-month"
                color={color}
                size={size}
              />
            ),
          }}>
          {() => <Schedules vendorData={vendor} />}
        </Tab.Screen>
      )}
      {vendor?.profession && vendor?.profession === 'Vendor & Seller' ? (
        <Tab.Screen
          name="Add"
          options={{
            tabBarLabel: 'Add Product',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <AntDesign name="pluscircle" color={color} size={size} />
            ),
          }}>
          {() => <ProductType vendorData={vendor} />}
        </Tab.Screen>
      ) : (
        <Tab.Screen
          name="AddService"
          options={{
            tabBarLabel: 'Add Service',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <AntDesign name="pluscircle" color={color} size={size} />
            ),
          }}>
          {() => <AddService vendorData={vendor} />}
        </Tab.Screen>
      )}
      {vendor?.profession && vendor?.profession === 'Vendor & Seller' ? (
        <Tab.Screen
          name="AvailabilityProduct"
          options={{
            tabBarLabel: 'Availability',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="event-available" color={color} size={size} />
            ),
          }}>
          {() => <AvailableProducts vendorData={vendor._id} />}
        </Tab.Screen>
      ) : (
        <Tab.Screen
          name="ServiceAvailability"
          options={{
            tabBarLabel: 'Availability',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="event-available" color={color} size={size} />
            ),
          }}>
          {() => <AvailableService vendorData={vendor} />}
        </Tab.Screen>
      )}
      {/* <Tab.Screen
        name="Cart"
        options={{
          tabBarLabel: 'Cart',
          headerShown: false,
          tabBarBadge: cart.length,
          tabBarIcon: ({color, size}) => (
            <Feather name="shopping-cart" color={color} size={size} />
          ),
        }}>
        {() => <MyCart vendorData={vendor} />}
      </Tab.Screen> */}
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <AntDesign name="user" color={color} size={size} />
          ),
        }}>
        {() => <Profile vendorData={vendor} />}
      </Tab.Screen>
      {/* <Tab.Screen
        name="Add"
        options={{
          tabBarLabel: 'Add Product',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <AntDesign name="pluscircle" color={color} size={size} />
          ),
        }}>
        {() => <ProductType vendorData={vendor} />}
      </Tab.Screen> */}
    </Tab.Navigator>
  );
}
