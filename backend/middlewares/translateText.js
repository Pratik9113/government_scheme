


const translate = require("google-translate-api-x");

const translateText = async(text, targetLang = "hi") => {
    try {
        let res = await translate(text, { to: targetLang });
        console.log(`Translated: ${res.text}`);
        return res.text;
    } catch (error) {
        console.error(`Translation error: ${error}`);
        return text;
    }
}


module.exports = translateText;
