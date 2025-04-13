import axios from 'axios';

const translateText = async (text, targetLang = 'hi') => {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await axios.get(url);

    const translated = response.data[0][0][0];
    console.log(`Translated: ${translated}`);
    return translated;
  } catch (error) {
    console.error('Translation error:', error.message);
    return text;
  }
};

export default translateText;
