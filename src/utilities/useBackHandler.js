// hooks/useBackHandler.js
import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const useBackHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior if no back action possible
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [navigation]);
};

export default useBackHandler;
