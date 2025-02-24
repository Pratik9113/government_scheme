import React, { useState } from "react";
import i18next from "i18next";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const languages = [
        { code: "en", lang: "English" },
        { code: "fr", lang: "French" },
        { code: "hi", lang: "Hindi" },
    ];

    const changeLanguage = (code) => {
        i18next.changeLanguage(code);
        setIsOpen(false);
    };

    const {i18n} = useTranslation();

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
