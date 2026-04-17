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
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import THEMECOLOR from '../../utilities/color';
import {Dropdown} from 'react-native-element-dropdown';
import {
  categoryGenSet,
  categoryLightings,
  categorySound,
  categoryVideo,
} from '../../data/global-data';
import axios from 'axios';
import Video from 'react-native-video';
import {Button} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiUrl} from '../../api-services/api-constants';
// import Video from 'react-native-video';
import mime from 'mime';
import ImageResizer from 'react-native-image-resizer';
import {compressImage} from '../../utilities/compressImage';
// import { compressVideo } from '../../utilities/compressVideo';

export default function EditProduct() {
  const deviceTheme = useColorScheme();
  const navigation = useNavigation();
  const route = useRoute();
  const productsOnProps = route.params.productItems;
  // console.log('productsOnProps in Edit product page:', productsOnProps);
  // console.log('ProductType', ProductType);
  const existingImages = route.params?.productItems?.product_image || [];
  const existingVideoUrl = route.params?.productItems?.product_video || '';

  const [galleryImages, setGalleryImages] = useState(existingImages);
  const [galleryVideos, setGalleryVideos] = useState(
    existingVideoUrl ? [{ uri: existingVideoUrl, remote: true }] : [],
  );
  const [productName, setProductName] = useState(
    productsOnProps?.product_name || '',
  );
  const [productPrice, setProductPrice] = useState(
    productsOnProps?.product_price.toString() || '0',
  );
  const [mrpRate, setMrpRate] = useState(
    productsOnProps?.mrp_rate.toString() || '0',
  );
  const [selectedCategory, setSelectedCategory] = useState(
    productsOnProps?.product_category || '',
  );
  const [productBrand, setProductBrand] = useState(
    productsOnProps?.brand || '',
  );
  const [stockInHand, setStockInHand] = useState(
    productsOnProps?.stock_in_hand.toString() || '0',
  );
  const [modelName, setModelName] = useState(productsOnProps?.model_name || '');
  const [materialType, setMaterialType] = useState(
    productsOnProps?.material_type || '',
  );
  const [productDimension, setProductDimension] = useState(
    productsOnProps?.product_dimension || '',
  );
  const [productWeight, setProductWeight] = useState(
    productsOnProps?.product_weight || '',
  );
  const [coutryOfOrgin, setCoutryOfOrgin] = useState(
    productsOnProps?.country_of_orgin || '',
  );
  const [manufactureName, setManufactureName] = useState(
    productsOnProps?.manufacturer_name || '',
  );
  const [productDescription, setProductDescription] = useState(
    productsOnProps?.product_description || '',
  );
  const [color, setColor] = useState(productsOnProps?.product_color || '');
  const [warranty, setWarranty] = useState(productsOnProps?.warranty || '');
  const [isResponse, setIsResponse] = useState(false);

  const categories = [
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
      type: 'shamiana',
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

  const handleSelectItemChange = (index, label) => {
    const updatedItems = [...addItems];
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
        selectionLimit: 6,
        includeBase64: false,
      },
      async response => {
        if (response.didCancel || response.errorCode) return;

        if (response.assets) {
          const newImages = [];

          for (const asset of response.assets) {
            let uri = asset.uri;

            // ✅ Clean double prefix
            if (uri.startsWith('file://file://')) {
              uri = uri.replace('file://file://', 'file://');
            }

            // ✅ Compress only local images
            if (!uri.startsWith('http')) {
              uri = await compressImage(uri);
            }

            newImages.push(uri);
          }

          if (galleryImages.length + newImages.length > 6) {
            Alert.alert('Only 6 images allowed');
            return;
          }

          setGalleryImages(prev => [...prev, ...newImages]);
        }
      },
    );
  };

  const MAX_VIDEO_SIZE_MB = 50; // Set your max limit in MB
  const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

  const openVideoPicker = () => {
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
        } else if (response.assets && response.assets.length > 0) {
          const video = response.assets[0];
          if (video.fileSize && video.fileSize > MAX_VIDEO_SIZE_BYTES) {
            Alert.alert(
              'File Too Large',
              `Please select a video smaller than ${MAX_VIDEO_SIZE_MB} MB`,
            );
            return;
          }
          setGalleryVideos([
            {
              uri: video.uri,
              fileSize: video.fileSize,
              type: video.type || 'video/mp4',
              fileName: video.fileName,
              remote: false,
            },
          ]);
        }
      },
    );
  };

  const removeImage = index => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
  };

  const removeVideo = index => {
    setGalleryVideos(prevVideos => prevVideos.filter((_, i) => i !== index));
  };

  const calculateDiscount =
    mrpRate && productPrice ? ((mrpRate - productPrice) / mrpRate) * 100 : 0;
  const discountValue = Math.round(calculateDiscount);

  // working and without image/video compress

  const editProduct = async () => {
    if (isResponse) return;

    if (!productName?.trim()) {
      Alert.alert('Error', 'Product Name is required');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Category is required');
      return;
    }
    if (!productBrand?.trim()) {
      Alert.alert('Error', 'Brand is required');
      return;
    }
    const priceNum = Number(productPrice);
    const mrpNum = Number(mrpRate);
    if (!priceNum || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid selling price');
      return;
    }
    if (!mrpNum || mrpNum <= 0) {
      Alert.alert('Error', 'Please enter a valid MRP');
      return;
    }
    if (mrpNum < priceNum) {
      Alert.alert('Error', 'MRP must be greater than or equal to selling price');
      return;
    }
    if (Number(stockInHand) < 0 || Number.isNaN(Number(stockInHand))) {
      Alert.alert('Error', 'Please enter valid stock in hand');
      return;
    }
    if (galleryImages.length === 0) {
      Alert.alert('Error', 'Please add at least one product image');
      return;
    }

    const firstVideo = galleryVideos[0];
    if (
      firstVideo &&
      firstVideo.fileSize &&
      firstVideo.fileSize > MAX_VIDEO_SIZE_BYTES
    ) {
      Alert.alert(
        'File Too Large',
        `Please select a video smaller than ${MAX_VIDEO_SIZE_MB} MB`,
      );
      return;
    }

    const endpoint = `${apiUrl.BASEURL}${apiUrl.EDIT_PRODUCT}${productsOnProps._id}`;
    setIsResponse(true);

    try {
      const formData = new FormData();
      // ✅ Add normal text fields
      const fields = {
        product_name: productName,
        product_price: productPrice,
        discount: discountValue,
        mrp_rate: mrpRate,
        product_category: selectedCategory,
        brand: productBrand,
        stock_in_hand: stockInHand,
        model_name: modelName,
        material_type: materialType,
        product_dimension: productDimension,
        product_weight: productWeight,
        country_of_orgin: coutryOfOrgin,
        warranty: warranty,
        manufacturer_name: manufactureName,
        product_color: color,
        product_description: productDescription,
      };

      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString());
        }
      });

      // ✅ IMAGES (old + new)
      galleryImages.forEach((img, index) => {
        if (img.startsWith('http')) {
          // ✅ Already stored image (S3)
          formData.append('existingImages[]', img);
        } else {
          // ✅ Newly picked image
          formData.append('images', {
            uri: img,
            type: mime.getType(img) || 'image/jpeg',
            name: img.split('/').pop() || `image_${index}.jpg`,
          });
        }
      });

      if (firstVideo && firstVideo.uri) {
        if (firstVideo.remote || firstVideo.uri.startsWith('http')) {
          formData.append('existingVideo', firstVideo.uri);
        } else {
          formData.append('video', {
            uri: firstVideo.uri,
            type: firstVideo.type || 'video/mp4',
            name:
              firstVideo.fileName ||
              firstVideo.uri.split('/').pop() ||
              'video.mp4',
          });
        }
      }

      console.log('📦 FORM DATA:');
      formData._parts.forEach(p => console.log(p));

      const response = await axios.post(endpoint, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000,
      });

      Alert.alert('Success', 'Product updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log('❌ Edit Product Error:', error);
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setIsResponse(false);
    }
  };

  return (
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
            color: 'black',
            fontSize: 15,
            marginLeft: 10,
          }}>
          EDIT PRODUCTS
        </Text>
      </View>

      <ScrollView style={{padding: 15}}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 13,
              marginBottom: 4,
              color: 'black',
              fontFamily: 'Montserrat-Medium',
            }}>
            Upload product image
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

        <View style={{flexDirection: 'row', marginBottom: 4, marginTop: 10}}>
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
                <Image
                  source={{uri}}
                  style={{
                    resizeMode: 'cover',
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                  }}
                />
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
                  onPress={() => removeImage(index)}>
                  <AntDesign name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 13,
              marginBottom: 4,
              color: 'black',
              fontFamily: 'Montserrat-Medium',
            }}>
            Upload product Video
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 4, marginTop: 10}}>
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
            onPress={openVideoPicker}>
            <AntDesign name="plus" size={20} color="#313131" />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 10,
            }}>
            {galleryVideos.map((videoItem, index) => (
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
                  source={{uri: videoItem.uri || videoItem}}
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
        </View>
        <View style={{marginVertical: 5}}>
          <Text style={styles.productLable}>Category</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              borderRadius: 10,
            }}>
            <Picker
              selectedValue={selectedCategory}
              style={{color: 'black'}}
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
                  }}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View>
          <Text style={styles.productLable}>Product Name</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Enter product name"
            style={styles.productInput}
            value={productName}
            onChangeText={pname => setProductName(pname)}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.6}}>
            <Text style={styles.productLable}>MRP Rate</Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="MRP"
              keyboardType="numeric"
              value={mrpRate}
              onChangeText={pprice => setMrpRate(pprice)}
              style={styles.productInput}
            />
          </View>
          <View style={{flex: 0.6, marginHorizontal: 2}}>
            <Text style={styles.productLable}>Product Price</Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Price/day"
              keyboardType="numeric"
              value={productPrice}
              onChangeText={pprice => setProductPrice(pprice)}
              style={styles.productInput}
            />
          </View>
          <View style={{flex: 0.6}}>
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
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.6, marginRight: 2}}>
            <Text style={styles.productLable}>Brand</Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Enter brand"
              value={productBrand}
              onChangeText={pprice => setProductBrand(pprice)}
              style={styles.productInput}
            />
          </View>
          <View style={{flex: 0.6, marginLeft: 2}}>
            <Text style={styles.productLable}>Quantity</Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Stock in hand"
              keyboardType="numeric"
              value={stockInHand}
              onChangeText={pprice => setStockInHand(pprice)}
              style={styles.productInput}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.6, marginRight: 2}}>
            <Text style={styles.productLable}>Model Name</Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Model name"
              value={modelName}
              onChangeText={pprice => setModelName(pprice)}
              style={styles.productInput}
            />
          </View>
          <View style={{flex: 0.6, marginLeft: 2}}>
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

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.6, marginRight: 2}}>
            <Text style={styles.productLable}>Product Dimensions</Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="e.g. 7D x 7W x 7H cm"
              value={productDimension}
              onChangeText={pprice => setProductDimension(pprice)}
              style={styles.productInput}
            />
          </View>
          <View style={{flex: 0.6, marginLeft: 2}}>
            <Text style={styles.productLable}>Product Weight</Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="e.g. 200 grams"
              value={productWeight}
              onChangeText={pprice => setProductWeight(pprice)}
              style={styles.productInput}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.6, marginRight: 2}}>
            <Text style={styles.productLable}>Country Of Orgin</Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Country of orgin"
              value={coutryOfOrgin}
              onChangeText={pprice => setCoutryOfOrgin(pprice)}
              style={styles.productInput}
            />
          </View>
          <View style={{flex: 0.6, marginLeft: 2}}>
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
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.6, marginRight: 2}}>
            <Text style={styles.productLable}>Color</Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Product color"
              value={color}
              onChangeText={pprice => setColor(pprice)}
              style={styles.productInput}
            />
          </View>
          <View style={{flex: 0.6, marginLeft: 2}}>
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
          <Text style={styles.productLable}>
            Description{' '}
            <Text
              style={{
                color: '#f44336',
                fontSize: 10,
                fontFamily: 'Montserrat-Medium',
              }}>
              (180 characters)
            </Text>{' '}
          </Text>
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.Specifications}>Add Specifications</Text>
          <TouchableOpacity onPress={addSpecifications}>
            <AntDesign name="pluscircleo" color="black" size={20} />
          </TouchableOpacity>
        </View>
        {selectedCategory === 'Sound' ? (
          <>
            {addItems.map((ele, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                <View style={{flex: 0.6, marginRight: 2}}>
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
                <View style={{flex: 0.5, marginLeft: 2}}>
                  <TextInput
                    placeholderTextColor="#757575"
                    placeholder="e.g. Wired or wireless"
                    style={styles.productInput}
                    value={ele.ItemSpecification}
                    onChangeText={text =>
                      handleSpecificationChange(index, text)
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => deleteRow(index)}
                  style={{flex: 0.1, marginTop: 17, marginLeft: 5}}>
                  <AntDesign name="delete" color="#e91e63" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : selectedCategory === 'Lighting' ? (
          <>
            {addItems.map((ele, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                <View style={{flex: 0.6, marginRight: 2}}>
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
                  />
                </View>
                <View style={{flex: 0.5, marginLeft: 2}}>
                  <TextInput
                    placeholderTextColor="#757575"
                    placeholder="e.g. Wired or wireless"
                    style={styles.productInput}
                    value={ele.ItemSpecification}
                    onChangeText={text =>
                      handleSpecificationChange(index, text)
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => deleteRow(index)}
                  style={{flex: 0.1, marginTop: 17, marginLeft: 5}}>
                  <AntDesign name="delete" color="#e91e63" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : selectedCategory === 'Video' ? (
          <>
            {addItems.map((ele, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                <View style={{flex: 0.6, marginRight: 2}}>
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
                  />
                </View>
                <View style={{flex: 0.5, marginLeft: 2}}>
                  <TextInput
                    placeholderTextColor="#757575"
                    placeholder="e.g. Wired or wireless"
                    style={styles.productInput}
                    value={ele.ItemSpecification}
                    onChangeText={text =>
                      handleSpecificationChange(index, text)
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => deleteRow(index)}
                  style={{flex: 0.1, marginTop: 17, marginLeft: 5}}>
                  <AntDesign name="delete" color="#e91e63" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : selectedCategory === 'Fabrication' ? (
          <>
            {addItems.map((ele, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                <View style={{flex: 0.6, marginRight: 2}}>
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
                <View style={{flex: 0.5, marginLeft: 2}}>
                  <TextInput
                    placeholderTextColor="#757575"
                    placeholder="e.g. Wired or wireless"
                    style={styles.productInput}
                    value={ele.ItemSpecification}
                    onChangeText={text =>
                      handleSpecificationChange(index, text)
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => deleteRow(index)}
                  style={{flex: 0.1, marginTop: 17, marginLeft: 5}}>
                  <AntDesign name="delete" color="#e91e63" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : selectedCategory === 'Genset' ? (
          <>
            {addItems.map((ele, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                <View style={{flex: 0.6, marginRight: 2}}>
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
                  />
                </View>
                <View style={{flex: 0.5, marginLeft: 2}}>
                  <TextInput
                    placeholderTextColor="#757575"
                    placeholder="e.g. Wired or wireless"
                    style={styles.productInput}
                    value={ele.ItemSpecification}
                    onChangeText={text =>
                      handleSpecificationChange(index, text)
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => deleteRow(index)}
                  style={{flex: 0.1, marginTop: 17, marginLeft: 5}}>
                  <AntDesign name="delete" color="#e91e63" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : selectedCategory === 'shamiana' ? (
          <>
            {addItems.map((ele, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                <View style={{flex: 0.6, marginRight: 2}}>
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
                <View style={{flex: 0.5, marginLeft: 2}}>
                  <TextInput
                    placeholderTextColor="#757575"
                    placeholder="e.g. Wired or wireless"
                    style={styles.productInput}
                    value={ele.ItemSpecification}
                    onChangeText={text =>
                      handleSpecificationChange(index, text)
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => deleteRow(index)}
                  style={{flex: 0.1, marginTop: 17, marginLeft: 5}}>
                  <AntDesign name="delete" color="#e91e63" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : null}

        <View style={{marginVertical: 5, marginTop: 20, marginBottom: 40}}>
          <TouchableOpacity
            disabled={isResponse}
            activeOpacity={0.8}
            onPress={editProduct}
            style={{
              backgroundColor: isResponse ? '#b6b6b6' : THEMECOLOR.mainColor,
              marginHorizontal: 70,
              borderRadius: 10,
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isResponse ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                style={{
                  color: THEMECOLOR.textColor,
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                }}>
                Update Product
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  div: {
    fontFamily: 'Montserrat-Medium',
    color: 'purple',
    fontSize: 20,
  },
  li: {
    fontFamily: 'Montserrat-Medium',
  },

  /*******************************/

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
    fontFamily: 'Montserrat-Regular',
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
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
  pickerItemPlaceholder: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  pickerItem: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },

  //==============Dropdown====================

  dropdown: {
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
