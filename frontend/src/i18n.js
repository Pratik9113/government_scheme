import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
i18n
    .use(LanguageDetector)
.use(initReactI18next).init({
    debug:true,
    fallbackLng:'en',
    returnObject:true,
    resources:{
        en:{
            translation :{
                greeting : "Hello World"

            },
        },fr:{
            translation :{
                greeting : "Bonjour le monde"
            },
        }, hi:{
            translation :{
                greeting : "नमस्ते दुनिया"
            },
        }
    }
})
