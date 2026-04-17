import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiUrl} from '../../api-services/api-constants';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import THEMECOLOR from '../../utilities/color';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {RadioButton} from 'react-native-paper';
import AddOns from './AddOns';

export default function AddService({vendorData}) {
  const route = useRoute();
  const navigation = useNavigation();
  const [onFocus, setOnFocus] = useState('service');
  const [requiredField, setRequiredField] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isResponse, setIsResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceCategoryList, setServiceCategoryList] = useState([]);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('');
  const [findServiceCategory, setFindServiceCategory] = useState([]);
  const [serviceList, setServiceList] = useState({
    service_name: '',
    service_price: '',
    service_description: '',
  });

  useEffect(() => {
    fetchData();
  }, [vendorData]);

  // console.log('vendorData', vendorData);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_SERVICE_BY_SERVICENAME}/${vendorData.profession}`,
      );
      if (res.status === 200) {
        const service = res.data.service;
        setRequiredField(service);
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
    if (vendorData.profession) {
      const filteredCategories = serviceCategoryList.filter(
        item => item.service_name === vendorData.profession,
      );
      setFindServiceCategory(filteredCategories);
    }
  }, [vendorData.profession, serviceCategoryList]);

  const asterisk = () => <Text style={{color: '#f44336'}}>*</Text>;
  const extractTheRequirementFields = requiredField.requirement_fields || [];

  console.log(
    'extractTheRequirementFields',
    typeof extractTheRequirementFields,
  );

  const handleFieldChange = (field, value) => {
    setServiceList(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const openLibrary = () => {
    const remaining = 6 - galleryImages.length;
    if (remaining <= 0) {
      Alert.alert('Limit reached', 'You can only select up to 6 images.');
      return;
    }
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: remaining,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets) {
          const newUris = response.assets.map(asset => asset.uri);
          setGalleryImages(prev => {
            const merged = [...prev, ...newUris];
            if (merged.length > 6) {
              Alert.alert(
                'Limit reached',
                'Only the first 6 images will be kept.',
              );
              return merged.slice(0, 6);
            }
            return merged;
          });
        }
      },
    );
  };

  const removeImage = index => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
  };

  const addService = async () => {
    if (!serviceList.service_name) {
      Alert.alert('Error', 'Service Name is required');
      return;
    }
    if (!serviceList.service_price) {
      Alert.alert('Error', 'Price is required');
      return;
    }
    if (!serviceList.service_description) {
      Alert.alert('Error', 'Description is required');
      return;
    }
    if (galleryImages.length < 6) {
      Alert.alert(
        'Error',
        `Please upload 6 images. You have selected ${galleryImages.length}.`,
      );
      return;
    }
    try {
      setIsResponse(true);

      const formData = new FormData();
      formData.append('vendor_id', vendorData._id);
      formData.append('vendor_name', vendorData.vendor_name);
      formData.append('shop_name', vendorData.shop_name);
      formData.append('service_name', serviceList.service_name);
      formData.append('price', serviceList.service_price);
      formData.append('service_description', serviceList.service_description); // Corrected here
      formData.append('service_category', vendorData.profession);
      formData.append('service_subcategory', selectedServiceCategory);
      formData.append('additional_services', JSON.stringify(inputValues));

      galleryImages.forEach((uri, index) => {
        formData.append('images', {
          uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const config = {
        method: 'post',
        url: apiUrl.ADD_SERVICE,
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData,
      };

      const response = await axios(config);

      if (response.status === 200) {
        // Alert.alert(
        //   'Success',
        //   response.data.message || 'Services Added Successfully',
        // );
        ToastAndroid.showWithGravity(
          response.data.message || 'Services Added Successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setSelectedServiceCategory('');
        setServiceList({
          service_name: '',
          service_price: '',
          service_description: '',
        });
        setGalleryImages([]);
        setInputValues([]);
        navigation.navigate('ServiceAvailability', {
          vendor: vendorData._id,
        });
        // navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || error.message);
    } finally {
      setIsResponse(false);
    }
  };

  console.log('inputValues', inputValues);

  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      {/* <View
        style={{
          backgroundColor: 'white',
          paddingVertical: 13,
          paddingHorizontal: 10,
          flexDirection: 'row',
          elevation: 2,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{marginTop: 2}}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#111111" />
        </TouchableOpacity>
        <Text
          style={{fontSize: 18, fontFamily: 'Montserrat-Bold', color: 'black'}}>
          {' '}
          Add Service
        </Text>
      </View> */}

      <View style={{padding: 15, marginTop: 10}}>
        <ScrollView>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              // letterSpacing: 1,
              color: 'black',
              fontSize: 15,
              textAlign: 'left',
              marginBottom: 15,
            }}>
            ADD SERVICE
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 10,
            }}>
            <RadioButton
              value="service"
              status={onFocus === 'service' ? 'checked' : 'unchecked'}
              onPress={() => setOnFocus('service')}
            />
            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                // letterSpacing: 1,
                color: 'black',
                fontSize: 13,
                textAlign: 'left',
              }}>
              SERVICE
            </Text>
            <RadioButton
              value="addons"
              status={onFocus === 'addons' ? 'checked' : 'unchecked'}
              onPress={() => setOnFocus('addons')}
            />
            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                // letterSpacing: 1,
                color: 'black',
                fontSize: 13,
                textAlign: 'left',
              }}>
              ADD ONS
            </Text>
          </View>
          {onFocus === 'service' ? (
            <>
              {vendorData && vendorData?.additional_images?.length === 0 && (
                <>
                  <View style={{marginTop: 10}}>
                    <Text
                      style={{
                        fontSize: 14,
                        marginBottom: 4,
                        color: 'black',
                        // letterSpacing: 1,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {/* Upload {vendorData?.profession} / your service related image */}
                      Upload your Service/Product image {asterisk()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: 4,
                        color: '#f44336',
                        marginTop: 2,
                        // letterSpacing: 1,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {' '}
                      (max 6 image)
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
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
                            <AntDesign
                              name="closecircle"
                              size={20}
                              color="black"
                            />
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
                </>
              )}
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
                    Name of the Service/Product {asterisk()}
                  </Text>
                  <TextInput
                    placeholderTextColor="#757575"
                    placeholder="Enter Service/Product Name"
                    value={serviceList.service_name}
                    onChangeText={text =>
                      handleFieldChange('service_name', text)
                    }
                    style={styles.productInput}
                  />
                </View>
                <View style={{}}>
                  <Text style={styles.productLable}>Price {asterisk()}</Text>
                  <TextInput
                    placeholderTextColor="#757575"
                    placeholder="Enter Price"
                    value={serviceList.service_price}
                    keyboardType="numeric"
                    onChangeText={text => {
                      const sanitized = text.replace(/[^0-9]/g, ''); // removes non-digit characters
                      handleFieldChange('service_price', sanitized);
                    }}
                    // onChangeText={text => handleFieldChange('service_price', text)}
                    style={styles.productInput}
                  />
                </View>
                <View style={{}}>
                  <Text style={styles.productLable}>
                    Description {asterisk()}
                  </Text>
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
              </View>
              {/* {extractTheRequirementFields &&
            extractTheRequirementFields?.length !== 0 && (
              <View style={{marginTop: 15}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 10,
                  }}>
                  Additional Details
                </Text> */}
              {/* {extractTheRequirementFields.map((fields, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 14,
                        marginBottom: 5,
                        fontFamily: 'Montserrat-Medium',
                        flex: 0.5,
                      }}>
                      {fields.parameter}
                    </Text>

                    <TextInput
                      placeholderTextColor="#757575"
                      placeholder={`Enter ${fields.parameter}`}
                      value={
                        inputValues.find(item => item.name === fields.parameter)
                          ?.value || ''
                      }
                      onChangeText={val =>
                        handleInputChange(fields.parameter, val)
                      }
                      style={{
                        borderWidth: 1,
                        borderColor: '#d5d5d5',
                        color: 'black',
                        fontSize: 14,
                        flex: 0.5,
                        borderRadius: 10,
                        paddingLeft: 15,
                        backgroundColor: 'white',
                        marginBottom: 10,
                        fontFamily: 'Montserrat-Medium',
                      }}
                    /> */}

              {/* {(fields.field_type === 'Date' || fields.field_type === 'Time') && (
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  borderWidth: 1,
                  borderColor: '#d5d5d5',
                  borderRadius: 10,
                  padding: 13,
                }}
                onPress={() => handleDateChange(fields)}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                  }}>
                  {selectedValues[fields.parameter]
                    ? fields.field_type === 'Date'
                      ? formatDate(selectedValues[fields.parameter])
                      : formatTime(selectedValues[fields.parameter])
                    : fields.field_type === 'Date'
                    ? 'Select Date'
                    : 'Select Time'}
                </Text>
              </TouchableOpacity>
            )} */}
              {/* </View>
                ))} */}
              {/* </View>
            )} */}
              <View
                style={{
                  marginHorizontal: 70,
                  marginTop: 20,
                  marginBottom: 100,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isResponse}
                  style={{
                    backgroundColor: isResponse
                      ? '#b6b6b6'
                      : THEMECOLOR.mainColor,
                    paddingVertical: 10,
                    borderRadius: 10,
                    marginTop: 20,
                  }}
                  onPress={addService}>
                  {isResponse ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text
                      style={{
                        color: THEMECOLOR.textColor,
                        fontSize: 14,
                        textAlign: 'center',
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      Next
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <AddOns vendorData={vendorData} />
          )}
        </ScrollView>
      </View>

      {(loading || isResponse) && (
        <View style={styles.overlay}>
          <ActivityIndicator size={30} color="#111111" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  productLable: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
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
