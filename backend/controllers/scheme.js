// import translateText from "../middlewares/translateText.js";
// import SchemaModel from "../models/SchemeModels.js";

// const cache = new Map(); 

// const getSchemeController = async (req, res) => {
//     try {
//         const data = await SchemaModel.find().limit(1);
//         const {lang} = req.query || "hi";
//         const {searchQuery} = req.query || "";
//         console.log("targetLanguage", lang);

//         const textsToTranslate = new Set();
//         data.forEach(scheme => {
//             ["description", "state", "steps", "title"].forEach(key => {
//                 if (scheme[key] && typeof scheme[key] === "string" && !cache.has(scheme[key])) {
//                     textsToTranslate.add(scheme[key]);
//                 }
//             });
//             if (Array.isArray(scheme.tags)) {
//                 scheme.tags.forEach(tag => {
//                     if (!cache.has(tag)) {
//                         textsToTranslate.add(tag);
//                     }
//                 });
//             }
//         });

//         const textArray = Array.from(textsToTranslate);
//         if (textArray.length > 0) {
//             const translatedArray = await Promise.all(textArray.map(text => translateText(text, lang)));
            
//             textArray.forEach((originalText, index) => {
//                 cache.set(originalText, translatedArray[index]);
//             });
//         }

//         const translatedData = data.map(scheme => {
//             const translatedScheme = { ...scheme._doc };
//             ["description", "state", "steps", "title"].forEach(key => {
//                 if (scheme[key] && typeof scheme[key] === "string") {
//                     translatedScheme[key] = cache.get(scheme[key]);
//                 }
//             });

//             if (Array.isArray(scheme.tags)) {
//                 translatedScheme.tags = scheme.tags.map(tag => cache.get(tag));
//             }

//             return translatedScheme;
//         });

//         res.status(200).json({ success: true, data: translatedData });

//     } catch (error) {
//         console.error("Error in getSchemeController:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

// export {getSchemeController};


import translateText from "../middlewares/translateText.js";
import SchemaModel from "../models/SchemeModels.js";

const getSchemeController = async (req, res) => {
    try {
        const data = await SchemaModel.find().limit(1);
        const { lang } = req.query || "hi";
        const { searchQuery } = req.query || "";

        console.log("targetLanguage", lang);

        const translatedData = await Promise.all(data.map(async (scheme) => {
            const translatedScheme = { ...scheme._doc };

            for (const key of ["description", "state", "steps", "title"]) {
                if (scheme[key] && typeof scheme[key] === "string") {
                    translatedScheme[key] = await translateText(scheme[key], lang);
                }
            }

            if (Array.isArray(scheme.tags)) {
                translatedScheme.tags = await Promise.all(
                    scheme.tags.map(async (tag) => await translateText(tag, lang))
                );
            }

            return translatedScheme;
        }));

        res.status(200).json({ success: true, data: translatedData });

    } catch (error) {
        console.error("Error in getSchemeController:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { getSchemeController };
