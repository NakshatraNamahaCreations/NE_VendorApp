import {ScrollView, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';

const TermsNConditionNew = () => {
  const [termsNCondition, setTermsNCondition] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_TERMS}`);
      if (res.status === 200) {
        setTermsNCondition(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch terms and conditions:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stripHtml = html => {
    return html
      ?.replace(/<\/?p>/g, '\n')
      ?.replace(/<br\s*\/?>/g, '\n')
      ?.replace(/&nbsp;/g, ' ')
      ?.replace(/<(?!\/?(strong|b|em|i)\b)[^>]*>/g, '')
      ?.trim();
  };

  const renderStyledText = (html, styles) => {
    const parts = [];
    let text = html;
    let match;
    let lastIndex = 0;

    const tagRegex = /<(strong|b|em|i)>(.*?)<\/\1>/gs;

    while ((match = tagRegex.exec(text)) !== null) {
      const [fullMatch, tag, content] = match;
      const startIndex = match.index;
      const endIndex = tagRegex.lastIndex;

      if (startIndex > lastIndex) {
        parts.push({text: stripHtml(text.substring(lastIndex, startIndex))});
      }

      let style = {};
      if (tag === 'strong' || tag === 'b') {
        style = styles.bold;
      } else if (tag === 'em' || tag === 'i') {
        style = styles.italic;
      }

      parts.push({text: content, style});
      lastIndex = endIndex;
    }

    if (lastIndex < text.length) {
      parts.push({text: stripHtml(text.substring(lastIndex))});
    }

    return parts.map((part, index) => (
      <Text key={index} style={[styles.paragraph, part.style]}>
        {part.text}
      </Text>
    ));
  };

  return (
    <ScrollView style={{paddingHorizontal: 10}}>
      {termsNCondition?.termsContent &&
        renderStyledText(termsNCondition.termsContent, styles)}
    </ScrollView>
  );
};

export default TermsNConditionNew;

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 8,
    color: '#555',
    fontFamily: 'Montserrat-Medium',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});
