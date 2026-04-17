import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  useColorScheme,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, { useState } from 'react';
// import ToggleSwitch from 'toggle-switch-react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import THEMECOLOR from '../../utilities/color';
import { Dropdown } from 'react-native-element-dropdown';
import {
  categoryGenSet,
  categoryLightings,
  categorySound,
  categoryVideo,
} from '../../data/global-data';
import axios from 'axios';
import Video from 'react-native-video';
import { Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from '../../api-services/api-constants';
import useBackHandler from '../../utilities/useBackHandler';
// import Stepper from './Stepper';
// import Video from 'react-native-video';
// import HTMLView from 'react-native-htmlview';
// import WebView from 'react-native-webview';
// import RNFetchBlob from 'rn-fetch-blob';
export default function AddProduct({ ProductType, vendorData }) {
  const deviceTheme = useColorScheme();
  useBackHandler();
  const theme = useTheme();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  // const vendor = JSON.parse(AsyncStorage.getItem('vendor'));
  // console.log('vendorData in add product page:', vendorData);
  // console.log('ProductType', ProductType);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);
  // const [galleryVideos, setGalleryVideos] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [mrpRate, setMrpRate] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [stockInHand, setStockInHand] = useState('');
  const [modelName, setModelName] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [productDimension, setProductDimension] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [coutryOfOrgin, setCoutryOfOrgin] = useState('');
  const [manufactureName, setManufactureName] = useState('');
  const [color, setColor] = useState('');
  const [warranty, setWarranty] = useState('');
  const [isResponse, setIsResponse] = useState(false);

  // const [on, setOff] = useState(false);
  // const [whatsIncluded, setWhatsIncluded] = useState('');
  // console.log('selectedCategory', selectedCategory);
  // const editorRef = React.createRef();
  //   console.log('whatsIncluded', <HTMLView value={whatsIncluded} />);
  // const renderedHtml = whatsIncluded;
  const categories = [
    // {
    //   type: 'Select',
    // },
    {
      type: 'Sound',
    },
    {
      type: 'Lighting',
    },
    {
      type: 'Video',
    },
    {
      type: 'Fabrication',
    },
    {
      type: 'Genset',
    },
    {
      type: 'Shamiana',
    },
  ];

  const [addItems, setAddItems] = useState([
    {
      selectItem: '',
      ItemSpecification: '',
    },
  ]);

  const addSpecifications = () => {
    const newBoard = {
      selectItem: '',
      ItemSpecification: '',
    };
    setAddItems(prevBoards => [...prevBoards, newBoard]);
  };

  // console.log('addItems', addItems);

  const handleSelectItemChange = (index, label) => {
    const updatedItems = [...addItems];
    // console.log('updatedItems', updatedItems);
    updatedItems[index].selectItem = label;
    setAddItems(updatedItems);
  };

  const handleSpecificationChange = (index, value) => {
    const updatedItems = [...addItems];
    updatedItems[index].ItemSpecification = value;
    setAddItems(updatedItems);
  };

  const deleteRow = index => {
    setAddItems(addItems.filter((_, i) => i !== index));
  };

  const openLibrary = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 6, // Set selection limit to 3
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else if (response.assets) {
          if (response.assets.length > 6) {
            Alert.alert('You can only select 6 images');
          } else {
            const selectedImages = response.assets.map(asset => asset.uri);
            console.log('selectedImages', response.assets.length);
            setGalleryImages(selectedImages);
          }
        }
      },
    );
  };

  const MAX_VIDEO_SIZE_MB = 50; // Set your max limit in MB
  const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

  const uploadVideo = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'video',
        selectionLimit: 1,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else if (response.assets) {
          const selectedVideos = response.assets.filter(
            asset => asset.type === 'video/mp4'
          );

          if (selectedVideos.length > 1) {
            Alert.alert('You can only select up to 1 video');
            return;
          }

          if (selectedVideos.length === 1) {
            const video = selectedVideos[0];
            if (video.fileSize && video.fileSize > MAX_VIDEO_SIZE_BYTES) {
              Alert.alert(
                'File Too Large',
                `Please select a video smaller than ${MAX_VIDEO_SIZE_MB} MB`
              );
              return;
            }
            setGalleryVideos([video.uri]);
            console.log('Selected video URI:', video.uri);
          }
        }
      }
    );
  };

  const removeImage = index => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
  };

  const removeVideo = index => {
    setGalleryVideos(prevVideos => prevVideos.filter((_, i) => i !== index));
  };

  console.log('galleryVideos', galleryVideos);

  const asterisk = () => <Text style={{ color: '#f44336' }}>*</Text>;
  // console.log('addItems', addItems);
  const calculateDiscount =
    mrpRate && productPrice ? ((mrpRate - productPrice) / mrpRate) * 100 : 0;
  const discountValue = Math.round(calculateDiscount);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const addProduct = async () => {
    if (galleryImages.length === 0) {
      Alert.alert('Error', 'Add at least one product image');
      return;
    }
    if (galleryImages.length !== 6) {
      Alert.alert('Error', 'Minimum 6 is required');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Product category is required');
      return;
    }
    if (!productName) {
      Alert.alert('Error', 'Product name is required');
      return;
    }
    if (!productPrice) {
      Alert.alert('Error', 'Product price is required');
      return;
    }
    if (!mrpRate) {
      Alert.alert('Error', 'MRP rate is required');
      return;
    }
    if (!productBrand) {
      Alert.alert('Error', 'Brand Name is required');
      return;
    }
    if (!stockInHand) {
      Alert.alert('Error', 'Stock in hand is required');
      return;
    }
    if (!modelName) {
      Alert.alert('Error', 'Model name is required');
      return;
    }
    if (!productDimension) {
      Alert.alert('Error', 'Product dimension is required');
      return;
    }
    if (!productWeight) {
      Alert.alert('Error', 'Product weight is required');
      return;
    }

    try {
      setIsResponse(true);
      const formData = new FormData();
      formData.append('vendor_id', vendorData._id);
      formData.append('vendor_name', vendorData.vendor_name);
      formData.append(
        'commission_percentage',
        vendorData.commission_percentage,
      );
      formData.append('product_description', productDescription);
      formData.append('commission_tax', vendorData.commission_tax);
      formData.append('product_type', ProductType);
      formData.append('product_name', productName);
      formData.append('product_price', productPrice);
      formData.append('discount', discountValue);
      formData.append('mrp_rate', mrpRate);
      formData.append('product_category', selectedCategory);
      formData.append('brand', productBrand);
      formData.append('stock_in_hand', stockInHand);
      formData.append('model_name', modelName);
      formData.append('material_type', materialType);
      formData.append('product_dimension', productDimension);
      formData.append('product_weight', productWeight);
      formData.append('country_of_orgin', coutryOfOrgin);
      formData.append('manufacturer_name', manufactureName);
      formData.append('product_color', color);
      formData.append('warranty', warranty);
      formData.append('shop_name', vendorData.shop_name);
      formData.append(
        'Specifications',
        JSON.stringify(
          addItems.map(item => ({
            name: item.selectItem,
            value: item.ItemSpecification,
          })),
        ),
      );

      galleryImages.forEach((uri, index) => {
        formData.append('images', {
          uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      if (
        Array.isArray(galleryVideos) &&
        galleryVideos.length > 0 &&
        galleryVideos[0]
      ) {
        formData.append('video', {
          uri: galleryVideos[0],
          name: 'video.mp4',
          type: 'video/mp4',
        });
      }
      const config = {
        url: apiUrl.ADD_PRODUCT,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData,
      };
      await axios(config)
        .then(function (response) {
          if (response.status === 200) {
            ToastAndroid.showWithGravity(
              response.data.message || 'Product Added Successfully',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            setIsResponse(true);
            setGalleryImages([]);
            setGalleryVideos([]);
            setProductName('');
            setMrpRate('');
            setProductPrice('');
            setProductWeight('');
            setProductDimension('');
            setSelectedCategory('');
            setProductBrand('');
            setStockInHand('');
            setModelName('');
            setMaterialType('');
            setCoutryOfOrgin('');
            setManufactureName('');
            setColor('');
            setWarranty('');
            setAddItems([{ selectItem: '', ItemSpecification: '' }]);
            navigation.navigate('AvailabilityProduct', {
              vendor: vendorData._id,
            });
          } else {
            Alert.alert('Error', 'Error while adding product');
          }
        })
        .catch(error => {
          console.error('Axios error:', error.message);
          Alert.alert('Error', error.message || 'Error while adding product');
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
    <ScrollView style={{ padding: 15 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <Stepper currentStep={currentStep} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, currentStep === 0 && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={currentStep === 0}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, currentStep === 2 && styles.disabledButton]}
            onPress={handleNext}
            disabled={currentStep === 2}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text
          style={{
            fontSize: 13,
            marginBottom: 4,
            color: 'black',
            fontFamily: 'Montserrat-Medium',
          }}>
          Upload product image {asterisk()}
        </Text>
        <Text
          style={{
            fontSize: 12,
            marginBottom: 4,
            color: '#f44336',
            fontFamily: 'Montserrat-Medium',
          }}>
          {' '}
          (max 6 image)
        </Text>
      </View>
      <Text
        style={{
          fontSize: 11,
          marginBottom: 4,
          color: '#f44336',
          // letterSpacing: 1,
          fontFamily: 'Montserrat-Medium',
        }}>
        * Upload image with white background
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: 4, marginTop: 10 }}>
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
          style={{ marginLeft: 10, flex: 1 }}
          contentContainerStyle={{ alignItems: 'center' }}>
          {galleryImages?.map((uri, index) => (
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
                source={{ uri }}
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
      {/* <View style={styles.rowSection}>
        <Text style={styles.productLable}>
          Add product Video URL {asterisk()}
        </Text>
      </View>
      <TextInput
        placeholderTextColor="#757575"
        placeholder="Video URL"
        value={galleryVideos}
        keyboardType="url"
        onChangeText={url => setGalleryVideos(url)}
        style={styles.productInput}
      /> */}
      {/* <View style={styles.rowSection}> */}
      <Text style={styles.productLable}>Add product Video {asterisk()}</Text>
      {/* </View> */}
      <View style={{ flexDirection: 'row', marginBottom: 4, marginTop: 5 }}>
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
          onPress={uploadVideo}>
          <AntDesign name="plus" size={20} color="#313131" />
        </TouchableOpacity>


        {Array.isArray(galleryVideos) &&

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 10
          }}>
            {galleryVideos.map((videoUri, index) => (
              <View
                key={index}
                style={{
                  left: 25,
                  position: 'relative',
                  width: 100,
                  height: 100,
                  marginTop: -8,
                  borderRadius: 10,
                  overflow: 'hidden',
                  elevation: 3,
                  backgroundColor: '#000',
                }}>
                {/* Video Preview */}
                <Video
                  source={{ uri: videoUri }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                  controls={false}
                  paused={true}
                />

                {/* Play Icon Overlay (optional for better UX) */}
                <View
                  style={{
                    position: 'absolute',
                    top: '35%',
                    left: '35%',
                    zIndex: 1,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: 50,
                    padding: 6,
                  }}>
                  <AntDesign name="play" size={20} color="#fff" />
                </View>

                {/* Close Button Overlay */}
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    borderRadius: 12,
                    padding: 2,
                    zIndex: 10,
                  }}
                  onPress={() => removeVideo(index)}>
                  <AntDesign name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        }
      </View>
      <View style={styles.rowSection}>
        <Text style={styles.productLable}>Category {asterisk()}</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#d5d5d5',
            borderRadius: 10,
          }}>
          <Picker
            selectedValue={selectedCategory}
            style={{ color: 'black' }}
            onValueChange={cteItem => setSelectedCategory(cteItem)}>
            <Picker.Item
              label="Select category"
              value=""
              style={{
                color: deviceTheme === 'dark' ? 'white' : 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-Regular',
              }}
            />
            {categories.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.type}
                value={item.type}
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Regular',
                  color: deviceTheme === 'dark' ? 'white' : 'black',
                  // letterSpacing: 1,
                }}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.rowSection}>
        <Text style={styles.productLable}>Product Name {asterisk()}</Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter product name"
          style={styles.productInput}
          value={productName}
          onChangeText={pname => setProductName(pname)}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {/* <View style={{flex: 0.6}}>
          <Text style={styles.productLable}>Product Price {asterisk()}</Text>
          {ProductType === 'sell' ? (
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Price"
              keyboardType="numeric"
              value={productPrice}
              onChangeText={pprice => setProductPrice(pprice)}
              style={styles.productInput}
            />
          ) : ProductType === 'rental' ? (
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Price/day"
              keyboardType="numeric"
              value={productPrice}
              onChangeText={pprice => setProductPrice(pprice)}
              style={styles.productInput}
            />
          ) : null}
        </View> */}
        <View style={{ flex: 0.6 }}>
          <Text style={styles.productLable}>MRP Rate {asterisk()}</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="MRP"
            keyboardType="numeric"
            value={mrpRate}
            onChangeText={text => {
              const sanitized = text.replace(/[^0-9]/g, '');
              setMrpRate(sanitized);
            }}
            // onChangeText={pprice => setMrpRate(pprice)}
            style={styles.productInput}
          />
        </View>
        <View style={{ flex: 0.6, marginHorizontal: 2 }}>
          <Text style={styles.productLable}>Product Price {asterisk()}</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Price/day"
            keyboardType="numeric"
            value={productPrice}
            onChangeText={text => {
              const sanitized = text.replace(/[^0-9]/g, '');
              setProductPrice(sanitized);
            }}
            // onChangeText={pprice => setProductPrice(pprice)}
            style={styles.productInput}
          />
        </View>
        <View style={{ flex: 0.6 }}>
          <Text style={styles.productLable}>Discount(%)</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="%"
            keyboardType="numeric"
            value={`${discountValue}`} // Display the calculated discount value as a string
            style={styles.productInput}
            editable={false}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 0.6, marginRight: 2 }}>
          <Text style={styles.productLable}>Brand {asterisk()}</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Enter brand"
            // keyboardType="numeric"
            value={productBrand}
            onChangeText={pprice => setProductBrand(pprice)}
            style={styles.productInput}
          />
        </View>
        <View style={{ flex: 0.6, marginLeft: 2 }}>
          <Text style={styles.productLable}>Quantity {asterisk()}</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Stock in hand"
            keyboardType="numeric"
            value={stockInHand}
            onChangeText={text => {
              const sanitized = text.replace(/[^0-9]/g, ''); // removes non-digit characters
              setStockInHand(sanitized);
            }}
            // onChangeText={pprice => setStockInHand(pprice)}
            style={styles.productInput}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 0.6, marginRight: 2 }}>
          <Text style={styles.productLable}>Model Name {asterisk()}</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Model name"
            value={modelName}
            onChangeText={pprice => setModelName(pprice)}
            style={styles.productInput}
          />
        </View>
        <View style={{ flex: 0.6, marginLeft: 2 }}>
          <Text style={styles.productLable}>Material Type</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Material type"
            value={materialType}
            onChangeText={pprice => setMaterialType(pprice)}
            style={styles.productInput}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 0.6, marginRight: 2 }}>
          <Text style={styles.productLable}>
            Product Dimensions {asterisk()}
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="e.g. 7D x 7W x 7H cm"
            value={productDimension}
            onChangeText={pprice => setProductDimension(pprice)}
            style={styles.productInput}
          />
        </View>
        <View style={{ flex: 0.6, marginLeft: 2 }}>
          <Text style={styles.productLable}>Product Weight {asterisk()}</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="e.g. 200 grams"
            value={productWeight}
            onChangeText={pprice => setProductWeight(pprice)}
            style={styles.productInput}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 0.6, marginRight: 2 }}>
          <Text style={styles.productLable}>Country Of Orgin</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Country of orgin"
            value={coutryOfOrgin}
            onChangeText={pprice => setCoutryOfOrgin(pprice)}
            style={styles.productInput}
          />
        </View>
        <View style={{ flex: 0.6, marginLeft: 2 }}>
          <Text style={styles.productLable}>Manufacturer</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Manufacture"
            value={manufactureName}
            onChangeText={pprice => setManufactureName(pprice)}
            style={styles.productInput}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 0.6, marginRight: 2 }}>
          <Text style={styles.productLable}>Color</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Product color"
            value={color}
            onChangeText={pprice => setColor(pprice)}
            style={styles.productInput}
          />
        </View>
        <View style={{ flex: 0.6, marginLeft: 2 }}>
          <Text style={styles.productLable}>Warranty</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Enter warranty"
            value={warranty}
            onChangeText={pprice => setWarranty(pprice)}
            style={styles.productInput}
          />
        </View>
      </View>
      <View>
        <Text style={styles.productLable}>Description <Text style={{ color: '#f44336', fontSize: 10, fontFamily: 'Montserrat-Medium', }}>
          (180 characters)</Text> </Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Description"
          textAlignVertical="top"
          multiline
          numberOfLines={4}
          maxLength={180}
          value={productDescription}
          onChangeText={desc => setProductDescription(desc)}
          style={styles.productInput}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.Specifications}>Add Specifications</Text>
        <TouchableOpacity onPress={addSpecifications}>
          <AntDesign name="pluscircleo" color="black" size={20} />
        </TouchableOpacity>
      </View>
      {selectedCategory === 'Sound' ? (
        <>
          {addItems.map((ele, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.6, marginRight: 2 }}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={categorySound}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select a feature"
                  searchPlaceholder="Search..."
                  value={ele.selectItem}
                  itemTextStyle={styles.itemTextStyle}
                  onChange={item => handleSelectItemChange(index, item.value)}
                />
              </View>
              <View style={{ flex: 0.5, marginLeft: 2 }}>
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="e.g. Wired or wireless"
                  style={styles.productInput}
                  value={ele.ItemSpecification}
                  onChangeText={text => handleSpecificationChange(index, text)}
                />
              </View>
              <TouchableOpacity
                onPress={() => deleteRow(index)}
                style={{ flex: 0.1, marginTop: 17, marginLeft: 5 }}>
                <AntDesign name="delete" color="#e91e63" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : selectedCategory === 'Lighting' ? (
        <>
          {addItems.map((ele, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.6, marginRight: 2 }}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={categoryLightings}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select a feature"
                  searchPlaceholder="Search..."
                  value={ele.selectItem}
                  itemTextStyle={styles.itemTextStyle}
                  onChange={item => handleSelectItemChange(index, item.value)}
                // renderLeftIcon={() => (
                //   <AntDesign
                //     style={styles.icon}
                //     color="black"
                //     name="Safety"
                //     size={20}
                //   />
                // )}
                />
              </View>
              <View style={{ flex: 0.5, marginLeft: 2 }}>
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="e.g. Wired or wireless"
                  style={styles.productInput}
                  value={ele.ItemSpecification}
                  onChangeText={text => handleSpecificationChange(index, text)}
                />
              </View>
              <TouchableOpacity
                onPress={() => deleteRow(index)}
                style={{ flex: 0.1, marginTop: 17, marginLeft: 5 }}>
                <AntDesign name="delete" color="#e91e63" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : selectedCategory === 'Video' ? (
        <>
          {addItems.map((ele, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.6, marginRight: 2 }}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={categoryVideo}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select a feature"
                  searchPlaceholder="Search..."
                  value={ele.selectItem}
                  itemTextStyle={styles.itemTextStyle}
                  onChange={item => handleSelectItemChange(index, item.value)}
                // renderLeftIcon={() => (
                //   <AntDesign
                //     style={styles.icon}
                //     color="black"
                //     name="Safety"
                //     size={20}
                //   />
                // )}
                />
              </View>
              <View style={{ flex: 0.5, marginLeft: 2 }}>
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="e.g. Wired or wireless"
                  style={styles.productInput}
                  value={ele.ItemSpecification}
                  onChangeText={text => handleSpecificationChange(index, text)}
                />
              </View>
              <TouchableOpacity
                onPress={() => deleteRow(index)}
                style={{ flex: 0.1, marginTop: 17, marginLeft: 5 }}>
                <AntDesign name="delete" color="#e91e63" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : selectedCategory === 'Fabrication' ? (
        <>
          {addItems.map((ele, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.6, marginRight: 2 }}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={categorySound}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select a feature"
                  searchPlaceholder="Search..."
                  value={ele.selectItem}
                  itemTextStyle={styles.itemTextStyle}
                  onChange={item => handleSelectItemChange(index, item.value)}
                // renderLeftIcon={() => (
                //   <AntDesign
                //     style={styles.icon}
                //     color="black"
                //     name="Safety"
                //     size={20}
                //   />
                // )}
                />
              </View>
              <View style={{ flex: 0.5, marginLeft: 2 }}>
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="e.g. Wired or wireless"
                  style={styles.productInput}
                  value={ele.ItemSpecification}
                  onChangeText={text => handleSpecificationChange(index, text)}
                />
              </View>
              <TouchableOpacity
                onPress={() => deleteRow(index)}
                style={{ flex: 0.1, marginTop: 17, marginLeft: 5 }}>
                <AntDesign name="delete" color="#e91e63" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : selectedCategory === 'Genset' ? (
        <>
          {addItems.map((ele, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.6, marginRight: 2 }}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={categoryGenSet}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select a feature"
                  searchPlaceholder="Search..."
                  value={ele.selectItem}
                  itemTextStyle={styles.itemTextStyle}
                  onChange={item => handleSelectItemChange(index, item.value)}
                // renderLeftIcon={() => (
                //   <AntDesign
                //     style={styles.icon}
                //     color="black"
                //     name="Safety"
                //     size={20}
                //   />
                // )}
                />
              </View>
              <View style={{ flex: 0.5, marginLeft: 2 }}>
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="e.g. Wired or wireless"
                  style={styles.productInput}
                  value={ele.ItemSpecification}
                  onChangeText={text => handleSpecificationChange(index, text)}
                />
              </View>
              <TouchableOpacity
                onPress={() => deleteRow(index)}
                style={{ flex: 0.1, marginTop: 17, marginLeft: 5 }}>
                <AntDesign name="delete" color="#e91e63" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : selectedCategory === 'shamiana' ? (
        <>
          {addItems.map((ele, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.6, marginRight: 2 }}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={categorySound}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select a feature"
                  searchPlaceholder="Search..."
                  value={ele.selectItem}
                  itemTextStyle={styles.itemTextStyle}
                  onChange={item => handleSelectItemChange(index, item.value)}
                // renderLeftIcon={() => (
                //   <AntDesign
                //     style={styles.icon}
                //     color="black"
                //     name="Safety"
                //     size={20}
                //   />
                // )}
                />
              </View>
              <View style={{ flex: 0.5, marginLeft: 2 }}>
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="e.g. Wired or wireless"
                  style={styles.productInput}
                  value={ele.ItemSpecification}
                  onChangeText={text => handleSpecificationChange(index, text)}
                />
              </View>
              <TouchableOpacity
                onPress={() => deleteRow(index)}
                style={{ flex: 0.1, marginTop: 17, marginLeft: 5 }}>
                <AntDesign name="delete" color="#e91e63" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : null}

      {/* <View style={{marginVertical: 5}}>
        <Text style={styles.productLable}>Product description</Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter product description"
          multiline={true}
          numberOfLines={4}
          maxLength={200}
          value={productDescription}
          onChangeText={pdescr => setProductDescription(pdescr)}
          style={[styles.productInput, {textAlignVertical: 'top'}]}
        />
      </View> */}
      {/* <View style={{marginVertical: 5}}>
        <Text style={styles.productLable}>What's includes</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#d5d5d5',
            borderRadius: 10,
            // letterSpacing: 1,
            padding: 10,
          }}>
          <RichEditor
            ref={editorRef}
            onChange={text => setWhatsIncluded(text)}
            placeholder={'Enter included items'}
          />
          <RichToolbar
            editor={editorRef}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertBulletsList,
            ]}
          />
        </View>
          <Text>command later </Text>
        <View style={styles.previewContainer}>
          <HTMLView value={whatsIncluded} style={[styles.div, styles.li]} />
        </View>
      </View> */}
      <View style={{ marginVertical: 5, marginTop: 20, marginBottom: 40 }}>
        {/* <TouchableOpacity
          style={{
            backgroundColor: THEMECOLOR.mainColor,
            padding: 15,
            borderRadius: 15,
            marginHorizontal: 50,
          }}
          onPress={addProduct}>
          <Text
            style={{
              color: THEMECOLOR.textColor,
              textAlign: 'center',
              fontSize: 13,
              // letterSpacing: 1,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Add Product
          </Text>
        </TouchableOpacity> */}
        <Button
          // icon="camera"
          loading={isResponse ? true : false}
          // disabled={isResponse === true ? false : true}
          mode="contained"
          onPress={isResponse ? null : addProduct}
          textColor={THEMECOLOR.textColor}
          style={{
            // fontSize: 13,
            backgroundColor: THEMECOLOR.mainColor,
            marginHorizontal: 70,
            // color: THEMECOLOR.textColor,
          }}>
          Next
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /* styles for html tags */
  div: {
    fontFamily: 'Montserrat-Medium',
    color: 'purple',
    fontSize: 20,
  },
  li: {
    fontFamily: 'Montserrat-Medium',
  },

  /*******************************/
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  rowSection: {
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#A020F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  productLable: {
    fontSize: 13,
    color: 'black',
    // letterSpacing: 1,
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
    fontFamily: 'Montserrat-Regular',
    // letterSpacing: 1,
    // paddingVertical: 15,
  },
  Specifications: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    borderRadius: 10,
    overflow: 'hidden', // Ensures the picker stays within bounds
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
  pickerItemPlaceholder: {
    // color: '#757575',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    // letterSpacing: 1,
  },
  pickerItem: {
    // color: deviceTheme === 'dark' ? 'white' : 'black',
    // color: 'black',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    // letterSpacing: 1,
  },

  //==============Dropdown====================

  dropdown: {
    // margin: 16,
    paddingHorizontal: 15,
    height: 50,
    borderColor: '#d5d5d5',
    borderWidth: 1,
    borderRadius: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 13,
    color: '#757575',
    fontFamily: 'Montserrat-Regular',
  },
  selectedTextStyle: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Montserrat-Regular',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 13,
    color: 'black',
    fontFamily: 'Montserrat-Regular',
  },
  itemTextStyle: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Montserrat-Regular',
  },
});
