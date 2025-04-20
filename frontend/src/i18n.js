// import i18n from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import { initReactI18next } from 'react-i18next';
// i18n
//     .use(LanguageDetector)
// .use(initReactI18next).init({
//     debug:true,
//     fallbackLng:'hi',
//     returnObject:true,
//     resources:{
//         en:{
//             translation :{
//                 greeting : "Hello World"

//             },
//         },fr:{
//             translation :{
//                 greeting : "Bonjour le monde"
//             },
//         }, hi:{
//             translation :{
//                 greeting : "नमस्ते दुनिया"
//             },
//         }
//     }
// })



import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'hi',
    returnObjects: true,
    resources: {
      en: {
        translation: {
          panelTitle: "Farmer Panel",
          productSubmission: "Product Submission",
          manageProducts: "Manage Products",
          balanceSheet: "Balance Sheet",
          cropPrediction: "Crop Prediction",
          registerProduct: "Register Your Product",
          grainType: "Grain Type",
          cropType: "Crop Type",
          pricePerKg: "Price Per Kg",
          availableQuantity: "Available Quantity",
          productDescription: "Product Description",
          submit: "Submit",
          chatbot: "Chatbot"
        },
      },
      hi: {
        translation: {
          panelTitle: "किसान पैनल",
          productSubmission: "उत्पाद सबमिशन",
          manageProducts: "उत्पाद प्रबंधन",
          balanceSheet: "बैलेंस शीट",
          cropPrediction: "फसल पूर्वानुमान",
          registerProduct: "अपना उत्पाद दर्ज करें",
          grainType: "अनाज का प्रकार",
          cropType: "फसल का प्रकार",
          pricePerKg: "प्रति किलो कीमत",
          availableQuantity: "उपलब्ध मात्रा",
          productDescription: "उत्पाद का विवरण",
          submit: "जमा करें",
          chatbot: "चैटबॉट"
        },
      },
      mr: {
        translation: {
          panelTitle: "शेतकरी पॅनल",
          productSubmission: "उत्पादन सादर करा",
          manageProducts: "उत्पादन व्यवस्थापन",
          balanceSheet: "ताळेबंद",
          cropPrediction: "पिकाचे भाकीत",
          registerProduct: "तुमचे उत्पादन नोंदवा",
          grainType: "धान्य प्रकार",
          cropType: "पिकाचा प्रकार",
          pricePerKg: "प्रति किलो किंमत",
          availableQuantity: "उपलब्ध प्रमाण",
          productDescription: "उत्पादनाचे वर्णन",
          submit: "सबमिट करा",
          chatbot: "चॅटबॉट"
        },
      },
      bn: {
        translation: {
          panelTitle: "কৃষক প্যানেল",
          productSubmission: "পণ্য জমা দিন",
          manageProducts: "পণ্য পরিচালনা করুন",
          balanceSheet: "ব্যালেন্স শীট",
          cropPrediction: "ফসল পূর্বাভাস",
          registerProduct: "আপনার পণ্য নিবন্ধন করুন",
          grainType: "শস্যের ধরন",
          cropType: "ফসলের ধরন",
          pricePerKg: "প্রতি কেজি দাম",
          availableQuantity: "উপলব্ধ পরিমাণ",
          productDescription: "পণ্যের বিবরণ",
          submit: "জমা দিন",
          chatbot: "চ্যাটবট"
        }
      },
      
      ta: {
        translation: {
          panelTitle: "விவசாயி குழு",
          productSubmission: "தயாரிப்பு சமர்ப்பிப்பு",
          manageProducts: "தயாரிப்புகளை நிர்வகிக்கவும்",
          balanceSheet: "சமநிலைப் பட்டியல்",
          cropPrediction: "பயிர் முன்னறிவிப்பு",
          registerProduct: "உங்கள் தயாரிப்பை பதிவு செய்யவும்",
          grainType: "தானிய வகை",
          cropType: "பயிர் வகை",
          pricePerKg: "கிலோவுக்கு விலை",
          availableQuantity: "கிடைக்கும் அளவு",
          productDescription: "தயாரிப்பு விவரம்",
          submit: "சமர்ப்பிக்கவும்",
          chatbot: "அரட்டைத் தானியங்கி"
        }
      },
      
      te: {
        translation: {
          panelTitle: "రైతు ప్యానెల్",
          productSubmission: "ఉత్పత్తి సమర్పణ",
          manageProducts: "ఉత్పత్తులను నిర్వహించండి",
          balanceSheet: "బ్యాలెన్స్ షీట్",
          cropPrediction: "పంట అంచనా",
          registerProduct: "మీ ఉత్పత్తిని నమోదు చేయండి",
          grainType: "ధాన్యం రకం",
          cropType: "పంట రకం",
          pricePerKg: "కిలోకు ధర",
          availableQuantity: "లభ్యమయ్యే పరిమాణం",
          productDescription: "ఉత్పత్తి వివరణ",
          submit: "సమర్పించండి",
          chatbot: "చాట్‌బాట్"
        }
      },
      
      kn: {
        translation: {
          panelTitle: "ಕೃಷಿಕ ಪ್ಯಾನೆಲ್",
          productSubmission: "ಉತ್ಪನ್ನ ಸಲ್ಲಿಕೆ",
          manageProducts: "ಉತ್ಪನ್ನಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
          balanceSheet: "ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್",
          cropPrediction: "ಬೆಳೆ ಭವಿಷ್ಯವಾಣಿ",
          registerProduct: "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ನೋಂದಾಯಿಸಿ",
          grainType: "ಧಾನ್ಯ ಪ್ರಕಾರ",
          cropType: "ಬೆಳೆ ಪ್ರಕಾರ",
          pricePerKg: "ಪ್ರತಿ ಕೆಜಿಗೆ ಬೆಲೆ",
          availableQuantity: "ಲಭ್ಯ ಪ್ರಮಾಣ",
          productDescription: "ಉತ್ಪನ್ನ ವಿವರಣೆ",
          submit: "ಸಲ್ಲಿಸು",
          chatbot: "ಚಾಟ್‌ಬಾಟ್"
        }
      },
      
      gu: {
        translation: {
          panelTitle: "ખેડૂત પેનલ",
          productSubmission: "ઉત્પાદન સબમિશન",
          manageProducts: "ઉત્પાદનોનું સંચાલન કરો",
          balanceSheet: "બેલેન્સ શીટ",
          cropPrediction: "પાકની આગાહી",
          registerProduct: "તમારા ઉત્પાદનને નોંધાવો",
          grainType: "અનાજનો પ્રકાર",
          cropType: "પાકનો પ્રકાર",
          pricePerKg: "દર કિલો દીઠ ભાવ",
          availableQuantity: "ઉપલબ્ધ જથ્થો",
          productDescription: "ઉત્પાદન વર્ણન",
          submit: "સબમિટ કરો",
          chatbot: "ચેટબોટ"
        }
      },
      
      pa: {
        translation: {
          panelTitle: "ਕਿਸਾਨ ਪੈਨਲ",
          productSubmission: "ਉਤਪਾਦ ਜਮ੍ਹਾਂ ਕਰਨਾ",
          manageProducts: "ਉਤਪਾਦਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ",
          balanceSheet: "ਬੈਲੈਂਸ ਸ਼ੀਟ",
          cropPrediction: "ਫ਼ਸਲ ਦੀ ਭਵਿੱਖਬਾਣੀ",
          registerProduct: "ਆਪਣੇ ਉਤਪਾਦ ਨੂੰ ਰਜਿਸਟਰ ਕਰੋ",
          grainType: "ਅਨਾਜ ਦੀ ਕਿਸਮ",
          cropType: "ਫ਼ਸਲ ਦੀ ਕਿਸਮ",
          pricePerKg: "ਕੀਮਤ ਪ੍ਰਤੀ ਕਿ.ਗ੍ਰਾ.",
          availableQuantity: "ਉਪਲਬਧ ਮਾਤਰਾ",
          productDescription: "ਉਤਪਾਦ ਦਾ ਵੇਰਵਾ",
          submit: "ਜਮ੍ਹਾਂ ਕਰੋ",
          chatbot: "ਚੈਟਬੋਟ"
        }
      },
      
      ml: {
        translation: {
          panelTitle: "കർഷക പാനൽ",
          productSubmission: "ഉൽപ്പന്ന സമർപ്പണം",
          manageProducts: "ഉൽപ്പന്നങ്ങൾ നിയന്ത്രിക്കുക",
          balanceSheet: "ബാലൻസ് ഷീറ്റ്",
          cropPrediction: "വിള പ്രവചനം",
          registerProduct: "നിങ്ങളുടെ ഉൽപ്പന്നം രജിസ്റ്റർ ചെയ്യുക",
          grainType: "ധാന്യത്തിന്റെ തരം",
          cropType: "വിളയുടെ തരം",
          pricePerKg: "കിലോയ്ക്ക് വില",
          availableQuantity: "ലഭ്യമായ അളവ്",
          productDescription: "ഉൽപ്പന്ന വിവരണം",
          submit: "സമർപ്പിക്കുക",
          chatbot: "ചാറ്റ്ബോട്ട്"
        }
      },
      
      ur: {
        translation: {
          panelTitle: "کسان پینل",
          productSubmission: "مصنوعات جمع کروائیں",
          manageProducts: "مصنوعات کا انتظام کریں",
          balanceSheet: "بیلنس شیٹ",
          cropPrediction: "فصل کی پیشن گوئی",
          registerProduct: "اپنی مصنوعات رجسٹر کریں",
          grainType: "اناج کی قسم",
          cropType: "فصل کی قسم",
          pricePerKg: "قیمت فی کلو",
          availableQuantity: "دستیاب مقدار",
          productDescription: "مصنوعات کی تفصیل",
          submit: "جمع کرائیں",
          chatbot: "چیٹ بوٹ"
        }
      },
      
      as: {
        translation: {
          panelTitle: "কৃষক পেনেল",
          productSubmission: "উৎপাদ জমা কৰক",
          manageProducts: "উৎপাদসমূহ পৰিচালনা কৰক",
          balanceSheet: "বেলেন্স শ্বীট",
          cropPrediction: "শস্য পূৰ্বানুমান",
          registerProduct: "আপোনাৰ উৎপাদন পঞ্জীয়ন কৰক",
          grainType: "ধানৰ প্ৰকাৰ",
          cropType: "শস্যৰ প্ৰকাৰ",
          pricePerKg: "কেজি প্ৰতি মূল্য",
          availableQuantity: "উপলব্ধ পৰিমাণ",
          productDescription: "উৎপাদনৰ বিৱৰণ",
          submit: "জমা কৰক",
          chatbot: "চাটবট"
        }
      },
      
      ne: {
        translation: {
          panelTitle: "किसान प्यानल",
          productSubmission: "उत्पादन पेश गर्नुहोस्",
          manageProducts: "उत्पादन व्यवस्थापन गर्नुहोस्",
          balanceSheet: "ब्यालेन्स शीट",
          cropPrediction: "बाली पूर्वानुमान",
          registerProduct: "तपाईंको उत्पादन दर्ता गर्नुहोस्",
          grainType: "अन्न प्रकार",
          cropType: "बालीको प्रकार",
          pricePerKg: "प्रति के.जि. मूल्य",
          availableQuantity: "उपलब्ध परिमाण",
          productDescription: "उत्पादन विवरण",
          submit: "पेश गर्नुहोस्",
          chatbot: "च्याटबोट"
        }
    }      
    }
  });
