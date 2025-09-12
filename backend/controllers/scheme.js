import translateText from "../middlewares/translateText.js";
import SchemaModel from "../models/SchemeModels.js";

const getSchemeController = async (req, res) => {
    try {
        const data = await SchemaModel.find().limit(50);
        const lang = req.query.lang || "hi";
        const searchQuery = req.query.searchQuery || "";

        console.log("Target Language:", lang);

        if (lang === "en") {
            return res.status(200).json({ success: true, data });
        }

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
