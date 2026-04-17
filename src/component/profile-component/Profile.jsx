import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from '../../api-services/api-constants';
import axios from 'axios';
import THEMECOLOR from '../../utilities/color';
import samplevendor from '../../../assets/UserProfile.png';
import useBackHandler from '../../utilities/useBackHandler';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUserContext } from '../../utilities/UserContext';

export default function Profile({ vendorData }) {
  useBackHandler();
  console.log('vendorData in profile page', vendorData._id);
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const { userDataFromContext } = useUserContext();

  console.log('vendorProfile in profile', vendorProfile);

  const removeItemValue = async () => {
    setModalVisible(false);
    try {
      await AsyncStorage.clear();
      // console.log('User removed from AsyncStorage');
      ToastAndroid.showWithGravity(
        'Logout Successful',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      // Alert.alert('Logout successful');
      // navigation.navigate('Login');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (exception) {
      console.error('Failed to remove the user from AsyncStorage', exception);
    }
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setSelectedImage(uri);
      }
    });
  };

  const getVendorData = async () => {
    setIsLoading(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PROFILE}${vendorData._id}`,
      );
      if (res.status === 200) {
        setVendorProfile(res.data);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVendorData();
  }, [vendorData._id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_PROFILE}`);
      if (res.status === 200) {
        const profile = res.data.profile;
        setProfileData(profile);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const updateUser = async () => {
  //   setIsLoading(true);
  //   try {
  //     const formData = new FormData();
  //     if (selectedImage) {
  //       formData.append('shop_image_or_logo', {
  //         uri: selectedImage,
  //         type: 'image/jpeg',
  //         name: 'profile.jpg',
  //       });
  //     }
  //     const response = await axios.put(
  //       `${apiUrl.BASEURL}${apiUrl.UPDATE_VENDOR_PROFILE}${vendorData._id}`,
  //       formData,
  //       { headers: { 'Content-Type': 'multipart/form-data' } },
  //     );

  //     if (response.status === 200) {
  //       const updatedUser = response.data.data;
  //       console.log('updatedUser', updatedUser);
  //       setIsLoading(false);
  //       ToastAndroid.showWithGravity(
  //         'Profile updated successfully',
  //         ToastAndroid.SHORT,
  //         ToastAndroid.CENTER,
  //       );
  //       Alert.alert('Success', 'Profile Picture updated Successfully');
  //       setSelectedImage(null);
  //       getVendorData();
  //       setShowEditModal(false);
  //     }
  //   } catch (error) {
  //     console.error('Error updating user:', error);
  //     Alert.alert('Update Failed', 'An error occurred while updating');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <View style={{ backgroundColor: '#740781' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            backgroundColor: '#740781',
            paddingHorizontal: 10,
            paddingVertical: 25,
            height: 130,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 18,
                flex: 0.6,
              }}>
              My Account
              {/* {vendorData._id} */}
            </Text>
            {/* not working */}
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() =>
                navigation.navigate('Notification', {
                  vendor: vendorData,
                })
              }>
              <Feather name="bell" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            alignItems: 'center',
            margin: 10,
            padding: 20,
            borderRadius: 10,
            // marginTop: -60,
            position: 'absolute',
            top: 70,
            zIndex: 1,
            elevation: 2,
          }}>
          <View style={{ flex: 0.2 }}>
            {userDataFromContext?.shop_image_or_logo ? (
              <Image
                source={{
                  uri: userDataFromContext?.shop_image_or_logo,
                }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  alignSelf: 'auto',
                }}
              />
            ) : (
              <Image
                source={require('../../../assets/UserProfile.png')}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  alignSelf: 'auto',
                }}
              />
            )}
          </View>
          <View style={{ flex: 0.5, marginLeft: 5 }}>
            <Text
              style={{
                fontSize: 12,
                color: THEMECOLOR.mainColor,
                fontFamily: 'Montserrat-SemiBold',
                marginVertical: 2,
              }}>
              {vendorData.profession}
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 15,
              }}>
              {vendorData.vendor_name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
                fontFamily: 'Montserrat-Medium',
                marginVertical: 3,
              }}>
              +91-{vendorData.mobile_number}
            </Text>
            <Text
              style={{
                color: '#404040',
                fontFamily: 'Montserrat-Medium',
                fontSize: 11,
              }}>
              {vendorData.email}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfile", {
              vendorId: vendorData?._id,
              serviceType: vendorData?.profession
            })}
            style={{ flex: 0.3, justifyContent: 'flex-end' }}>
            <Text
              style={{
                fontSize: 11,
                color: '#545454',
                fontFamily: 'Montserrat-Medium',
                textAlign: 'center',
                backgroundColor: "#740781",
                color: 'white',
                borderRadius: 5,
                paddingVertical: 3,
                paddingHorizontal: 3,
              }}>
              <Feather name="edit" color="white" /> Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: '#f2f2f2', marginTop: 50 }}>
          <View style={{ marginTop: 33 }}>
            {vendorData?.profession &&
              vendorData?.profession === 'Vendor & Seller' && (
                <Pressable
                  style={styles.layoutBox}
                  onPress={() =>
                    navigation.navigate('My Products', {
                      vendorId: vendorData._id,
                    })
                  }>
                  <Text style={styles.profileLable}>
                    <Feather name="box" size={15} color="#C026D3" /> My products
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.subText}>
                      View & Edit product listings
                    </Text>
                    <Entypo name="chevron-thin-right" size={15} color="black" />
                  </View>
                </Pressable>
              )}
            {vendorData?.profession &&
              vendorData?.profession !== 'Vendor & Seller' && (
                <Pressable
                  style={styles.layoutBox}
                  onPress={() =>
                    navigation.navigate('Service List', {
                      vendorId: vendorData._id,
                    })
                  }>
                  <Text style={styles.profileLable}>
                    <Feather name="box" size={15} color="#C026D3" /> My Services
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.subText}>
                      View & Edit service listings
                    </Text>
                    <Entypo name="chevron-thin-right" size={15} color="black" />
                  </View>
                </Pressable>
              )}
            {vendorData?.profession &&
              vendorData?.profession === 'Vendor & Seller' ? (
              <Pressable
                style={styles.layoutBox}
                onPress={() =>
                  navigation.navigate('Technician List', {
                    vendorId: vendorData._id,
                  })
                }>
                <Text style={styles.profileLable}>
                  <FontAwesome5 name="users-cog" size={15} color="#C026D3" />{' '}
                  Technician List
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.subText}>View & Edit Technician's</Text>
                  <Entypo name="chevron-thin-right" size={15} color="black" />
                </View>
              </Pressable>
            ) :
              <Pressable
                style={styles.layoutBox}
                onPress={() =>
                  navigation.navigate('Addons List', {
                    vendor: vendorData,
                  })
                }>
                <Text style={styles.profileLable}>
                  <FontAwesome5 name="users-cog" size={15} color="#C026D3" />{' '}
                  Add-on's List
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.subText}>View & Edit Add-on's</Text>
                  <Entypo name="chevron-thin-right" size={15} color="black" />
                </View>
              </Pressable>}

            <Pressable
              style={styles.layoutBox}
              // onPress={() => navigation.navigate('PayoutHistory')}
              onPress={() =>
                navigation.navigate('PayoutHistory', {
                  vendor: vendorData,
                })
              }>
              <Text style={styles.profileLable}>
                <MaterialIcons name="payment" size={15} color="#C026D3" /> My
                Earnings
              </Text>
              <View style={styles.subRow}>
                <Text style={styles.subText}>
                  View your earnings and payments
                </Text>
                <Entypo name="chevron-thin-right" size={15} color="black" />
              </View>
            </Pressable>
            <Pressable
              style={styles.layoutBox}
              onPress={() => navigation.navigate('Aboutus')}>
              <Text style={styles.profileLable}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={15}
                  color="#C026D3"
                />{' '}
                About us
              </Text>
              <View style={styles.subRow}>
                <Text style={styles.subText}>About us</Text>
                <Entypo name="chevron-thin-right" size={15} color="black" />
              </View>
            </Pressable>

            <Pressable
              style={styles.layoutBox}
              onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={styles.profileLable}>
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={15}
                  color="#C026D3"
                />{' '}
                Privacy policy
              </Text>
              <View style={styles.subRow}>
                <Text style={styles.subText}>Read privacy policy</Text>
                <Entypo name="chevron-thin-right" size={15} color="black" />
              </View>
            </Pressable>

            <Pressable
              style={styles.layoutBox}
              onPress={() => navigation.navigate('TermsCondition')}>
              <Text style={styles.profileLable}>
                <MaterialCommunityIcons
                  name="note-text-outline"
                  size={15}
                  color="#C026D3"
                />{' '}
                Terms & Conditions
              </Text>
              <View style={styles.subRow}>
                <Text style={styles.subText}>Read terms & conditions</Text>
                <Entypo name="chevron-thin-right" size={15} color="black" />
              </View>
            </Pressable>

            <Pressable
              style={styles.layoutBox}
              onPress={() =>
                navigation.navigate('HelpCenter', {
                  profileData: profileData,
                })
              }>
              <Text style={styles.profileLable}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={15}
                  color="#C026D3"
                />{' '}
                Help Center
              </Text>
              <View style={styles.subRow}>
                <Text style={styles.subText}>
                  Get support and assistance anytime
                </Text>
                <Entypo name="chevron-thin-right" size={15} color="black" />
              </View>
            </Pressable>

            <Pressable
              style={styles.layoutBox}
              onPress={() => navigation.navigate('FAQ')}>
              <Text style={styles.profileLable}>
                <MaterialCommunityIcons
                  name="message-outline"
                  size={15}
                  color="#C026D3"
                />{' '}
                FAQ
              </Text>
              <View style={styles.subRow}>
                <Text style={styles.subText}>Frequently asked questions</Text>
                <Entypo name="chevron-thin-right" size={15} color="black" />
              </View>
            </Pressable>

            <Pressable
              style={styles.layoutBox}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.profileLable}>
                <Octicons name="sign-in" size={25} color="#C026D3" /> Logout
              </Text>
              <View style={styles.subRow}></View>
            </Pressable>
          </View>
        </View>
        {/* <View style={{backgroundColor: 'white'}}>
          <Text
            style={{
              fontFamily: 'Montserrat-Medium',
              color: '#bfbfbf',
              fontSize: 13,
              textAlign: 'center',
            }}>
            {profileData.footer_text}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Montserrat-SemiBold',
              letterSpacing: 1,
              color: '#bfbfbf',
            }}>
            NITHYAEVENT
          </Text>
        </View> */}
      </ScrollView>
      {/* EDIT PROFILE */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={{ marginVertical: 15 }}>
              {/* <Text style={styles.modalText}>Profile Image</Text> */}
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  borderWidth: 1,
                  borderColor: '#d4d4d4',
                  padding: 10,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: 80, height: 80 }}
                  />
                ) : (
                  <Feather name="upload-cloud" size={30} color="#999" />
                )}
                <Text
                  style={{
                    marginTop: 10,
                    color: '#777',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  {selectedImage ? 'Change Image' : 'Upload Image'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={[styles.closeButton, { backgroundColor: '#8b8b8b' }]}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={isLoading ? null : updateUser}
                style={[
                  styles.closeButton,
                  { backgroundColor: THEMECOLOR.mainColor },
                ]}>
                <Text style={styles.closeButtonText}>
                  {isLoading ? 'Updating...' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={modalVisible}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              // margin: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Montserrat-SemiBold',
                color: 'black',
                marginTop: 10,
                marginBottom: 10,
              }}>
              Confirm Logout
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Montserrat-Medium',
                color: 'black',
                marginBottom: 20,
              }}>
              Are you sure want to Logout?
            </Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <TouchableOpacity
                style={{
                  marginHorizontal: 5,
                  marginVertical: 10,
                }}
                onPress={() => setModalVisible(false)}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    backgroundColor: '#f0f0f0',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginHorizontal: 5,
                  marginVertical: 10,
                  backgroundColor: THEMECOLOR.mainColor,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 5,
                }}
                onPress={removeItemValue}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'white',
                  }}>
                  Yes! Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  layoutBox: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    elevation: 2,
  },
  profileLable: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
    // marginBottom: 3,
  },
  subText: {
    fontSize: 13,
    color: '#545454',
    fontFamily: 'Montserrat-Regular',
    marginVertical: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: 'black',
    marginBottom: 10,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 25,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  subRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
