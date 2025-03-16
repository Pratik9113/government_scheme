import React, { useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const LanguageSelector = ({ setLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { i18n } = useTranslation();

    const languages = [
        { code: "en", lang: "English" },
        { code: "hi", lang: "Hindi" },
        { code: "mr", lang: "Marathi" },
        { code: "bn", lang: "Bengali" },
        { code: "ta", lang: "Tamil" },
        { code: "te", lang: "Telugu" },
        { code: "kn", lang: "Kannada" },
        { code: "gu", lang: "Gujarati" },
        { code: "pa", lang: "Punjabi" },
        { code: "ml", lang: "Malayalam" },
        { code: "ur", lang: "Urdu" },
        { code: "as", lang: "Assamese" },
        { code: "ne", lang: "Nepali" },
    ];

    const changeLanguage = (code) => {
        setLanguage(code);
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-4 right-4">
            <button
                className="p-3 rounded-full shadow-lg bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaGlobe size={20} />
            </button>
            {isOpen && (
                <div className="absolute bottom-12 right-0 w-40 bg-white shadow-md rounded-lg p-2 flex flex-col space-y-2">
                    {languages.map((lng) => (
                        <button
                            key={lng.code}
                            className="w-full text-left hover:bg-gray-200 p-2 block"
                            onClick={() => changeLanguage(lng.code)}
                        >
                            {lng.lang}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
