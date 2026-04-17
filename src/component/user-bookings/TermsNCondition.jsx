import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../api-services/api-constants';
import useBackHandler from '../../utilities/useBackHandler';
import THEMECOLOR from '../../utilities/color';

const TermsNCondition = () => {
  useBackHandler();
  const [termsNCondition, setTermsNCondition] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_TERMS}`);
      if (res.status === 200) {
        const tnc = res.data;
        setTermsNCondition(tnc);
      }
    } catch (error) {
      console.error('Failed to fetch terms and condition:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // function parseHtmlToParts(html) {
  //   if (!html) return [];

  //   // Replace <br> with newline so we keep line breaks
  //   let text = html.replace(/<br\s*\/?>/gi, '\n');

  //   // This regex matches <strong>, <b>, <em>, <i>
  //   const tagRegex = /<(strong|b|em|i)>(.*?)<\/\1>/gis;

  //   const parts = [];
  //   let lastIndex = 0;
  //   let match;

  //   while ((match = tagRegex.exec(text)) !== null) {
  //     const [fullMatch, tag, content] = match;
  //     const startIndex = match.index;
  //     const endIndex = tagRegex.lastIndex;

  //     if (startIndex > lastIndex) {
  //       // Plain text part before this tag
  //       parts.push({
  //         text: text.substring(lastIndex, startIndex),
  //       });
  //     }

  //     parts.push({
  //       text: content,
  //       tag,
  //     });

  //     lastIndex = endIndex;
  //   }

  //   // Remaining plain text
  //   if (lastIndex < text.length) {
  //     parts.push({
  //       text: text.substring(lastIndex),
  //     });
  //   }

  //   return parts;
  // }

  // const renderStyledParts = (parts, styles) => {
  //   return parts.map((part, index) => {
  //     let style = styles.paragraph;

  //     if (part.tag === 'strong' || part.tag === 'b') {
  //       style = [styles.paragraph, styles.bold];
  //     } else if (part.tag === 'em' || part.tag === 'i') {
  //       style = [styles.paragraph, styles.italic];
  //     }

  //     // Split on \n to render line breaks
  //     return part.text.split('\n').map((line, i) => (
  //       <Text key={`${index}-${i}`} style={style}>
  //         {line}
  //         {'\n'}
  //       </Text>
  //     ));
  //   });
  // };

  // const parts = parseHtmlToParts(termsNCondition?.termsContent);

  return (
    <>
      {loader ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            flex: 1,
          }}>
          <ActivityIndicator size="large" color={THEMECOLOR.mainColor} />
        </View>
      ) : (
        <ScrollView style={{ paddingHorizontal: 15 }}>
          {termsNCondition.map((ele, idx) => (
            <View key={idx}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#4f4f4f',
                  fontFamily: 'Montserrat-SemiBold',
                  marginVertical: ele.title ? 6 : 0,
                }}>
                {ele.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 24,
                  color: '#555',
                  fontFamily: 'Montserrat-Medium',
                }}>
                {ele.description}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
};

export default TermsNCondition;
