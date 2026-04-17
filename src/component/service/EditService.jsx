import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';
import THEMECOLOR from '../../utilities/color';

export default function EditService() {
  const navigation = useNavigation();
  const route = useRoute();
  const {serviceDetails, vendorId} = route.params;
  // console.log('serviceDetails', serviceDetails);
  const existingImages = serviceDetails?.additional_images || [];
  const [galleryImages, setGalleryImages] = useState(existingImages);
  const [newImages, setNewImages] = useState([]);
  const [serviceCategoryList, setServiceCategoryList] = useState([]);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState(
    serviceDetails.service_subcategory || '',
  );
  const [findServiceCategory, setFindServiceCategory] = useState([]);
  const [loader, setLoader] = useState(false);
  const [vendorData, setVendorData] = useState({});
  const [serviceList, setServiceList] = useState({
    service_name: serviceDetails.service_name || '',
    service_price: serviceDetails.price || '',
    service_description: serviceDetails.service_description || '',
  });
  const [isResponse, setIsResponse] = useState(false);

  const handleFieldChange = (field, value) => {
    setServiceList(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const getVendorData = async () => {
    setLoader(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PROFILE}${vendorId}`,
      );
      if (res.status === 200) {
        setVendorData(res.data);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getVendorData();
  }, [vendorId]);

  const fetchServiceCategoryData = async () => {
    try {
      const serviceCategoryRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ALL_SUB_SERVICE}`,
      );
      if (serviceCategoryRes.status === 200) {
        setServiceCategoryList(serviceCategoryRes.data.data);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    fetchServiceCategoryData();
  }, []);

  useEffect(() => {
    if (vendorData?.profession) {
      const filteredCategories = serviceCategoryList.filter(
        item => item.service_name === vendorData?.profession,
      );
      setFindServiceCategory(filteredCategories);
    }
  }, [vendorData?.profession, serviceCategoryList]);

  const openLibrary = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 6,
        includeBase64: false,
      },
      response => {
        if (response.assets) {
          const selected = response.assets.map(asset => asset.uri);
          const total = galleryImages.length + selected.length;
          if (total > 6) {
            Alert.alert('You can only have up to 6 images');
          } else {
            setGalleryImages([...galleryImages, ...selected]);
            setNewImages([...newImages, ...selected]); // <--- Track only new
          }
        }
      },
    );
  };

  const removeImage = index => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
  };

  const editService = async () => {
    try {
      setIsResponse(true);
      const formData = new FormData();
      formData.append('service_name', serviceList.service_name);
      formData.append('price', serviceList.service_price);
      formData.append('service_description', serviceList.service_description);
      formData.append('service_subcategory', selectedServiceCategory);

      newImages.forEach((uri, index) => {
        formData.append('images', {
          uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const remainingOldImages = galleryImages.filter(
        uri => !newImages.includes(uri),
      );
      formData.append('existing_images', JSON.stringify(remainingOldImages));
      // newImages.forEach((uri, index) => {
      //   formData.append('images', {
      //     uri,
      //     name: `image_${index}.jpg`,
      //     type: 'image/jpeg',
      //   });
      // });

      const config = {
        url: `${apiUrl.EDIT_SERVICE}${serviceDetails._id}`,
        method: 'put',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData,
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          Alert.alert(response.data.message || 'Service Updated Successfully');
          setIsResponse(true);
          console.log('Response:', response);
          navigation.goBack();
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        if (error.response) {
          console.error('Response data>>>:', error.response.data);
          Alert.alert(
            'Error',
            error.response.data.message || 'Error while adding product',
          );
        } else if (error.request) {
          console.error('Request data<<<<:', error.request);
          Alert.alert('Error', 'No response received from server');
        }
      } else {
        console.error('Unknown error...:', error);
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setIsResponse(false);
    }
  };
  return (
    <>
      {loader ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#4caf50" />
        </View>
      ) : (
        <>
          <View
            style={{
              backgroundColor: 'white',
              elevation: 4,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5,
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{marginLeft: 10}}>
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
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                // letterSpacing: 1,
                color: 'black',
                fontSize: 15,
                marginLeft: 10,
                // textAlign: 'left',
              }}>
              EDIT SERVICE
            </Text>
          </View>
          <ScrollView style={{padding: 15}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 13,
                  marginBottom: 4,
                  color: 'black',
                  // letterSpacing: 1,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Upload your Service/Product image
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginBottom: 4,
                  color: '#f44336',
                  // letterSpacing: 1,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {' '}
                (max 6 image)
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', marginBottom: 4, marginTop: 10}}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#dddddd',
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={openLibrary}>
                <AntDesign name="plus" size={20} color="#313131" />
              </TouchableOpacity>
              <ScrollView
                horizontal
                style={{marginLeft: 10, flex: 1}}
                contentContainerStyle={{alignItems: 'center'}}>
                {galleryImages.map((uri, index) => (
                  <View
                    key={index}
                    style={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      marginLeft: 10,
                    }}>
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        zIndex: 1,
                      }}
                      onPress={() => removeImage(index)}>
                      <AntDesign name="closecircle" size={20} color="black" />
                    </TouchableOpacity>
                    <Image
                      key={index}
                      source={{uri}}
                      style={{
                        resizeMode: 'cover',
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                      }}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={{marginTop: 15}}>
              <Text style={styles.productLable}>Select Service/Product</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#d5d5d5',
                  borderRadius: 10,
                  marginBottom: 10,
                  paddingHorizontal: 5,
                }}>
                <Picker
                  style={{color: 'black'}}
                  selectedValue={selectedServiceCategory}
                  onValueChange={cteItem =>
                    setSelectedServiceCategory(cteItem)
                  }>
                  <Picker.Item
                    label="Select Category"
                    value=""
                    style={{
                      fontSize: 13,
                      fontFamily: 'Montserrat-Medium',
                      color: '#757575',
                    }}
                  />
                  {findServiceCategory.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.sub_service_name}
                      value={item.sub_service_name}
                      style={{
                        fontSize: 13,
                        fontFamily: 'Montserrat-Medium',
                      }}
                    />
                  ))}
                </Picker>
              </View>
              <View style={{}}>
                <Text style={styles.productLable}>
                  Name of the Service/Product
                </Text>
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="Enter Service/Product Name"
                  value={serviceList.service_name}
                  onChangeText={text => handleFieldChange('service_name', text)}
                  style={styles.productInput}
                />
              </View>
              <View style={{}}>
                <Text style={styles.productLable}>Price</Text>
                {/* React Native’s TextInput expects a string, it won’t display number correctly */}
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="Enter Price"
                  value={String(serviceList.service_price)}
                  keyboardType="numeric"
                  onChangeText={text => {
                    const sanitized = text.replace(/[^0-9]/g, '');
                    handleFieldChange('service_price', sanitized);
                  }}
                  style={styles.productInput}
                />
              </View>
              <View style={{}}>
                <Text style={styles.productLable}>Description</Text>
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="Enter Description"
                  multiline
                  textAlignVertical="top"
                  value={serviceList.service_description}
                  onChangeText={text =>
                    handleFieldChange('service_description', text)
                  }
                  style={{
                    borderWidth: 1,
                    borderColor: '#d5d5d5',
                    color: 'black',
                    fontSize: 13,
                    borderRadius: 10,
                    paddingLeft: 15,
                    marginBottom: 10,
                    height: 100,
                    fontFamily: 'Montserrat-Medium',
                  }}
                />
              </View>
              <View
                style={{marginVertical: 5, marginTop: 20, marginBottom: 40}}>
                <TouchableOpacity
                  loading={isResponse}
                  mode="contained"
                  onPress={!isResponse ? editService : undefined}
                  disabled={isResponse}
                  style={{
                    backgroundColor: THEMECOLOR.mainColor,
                    marginHorizontal: 70,
                    borderRadius: 10,
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Montserrat-SemiBold',
                      textAlign: 'center',
                    }}>
                    {isResponse ? 'Updating...' : 'Update Service'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  productLable: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 5,
  },
  productInput: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    color: 'black',
    fontSize: 13,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontFamily: 'Montserrat-Medium',
  },
});
