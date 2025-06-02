"use client";

import { useState } from "react";

const LanguageCurrencySelector = () => {
  const [selectedTab, setSelectedTab] = useState("language");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [autoTranslate, setAutoTranslate] = useState(true);

  const languages = ["English", "Tamil", "Sinhala"];
  const currencies = ["USD", "LKR", "EUR", "INR"];

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 p-2 text-center ${
            selectedTab === "language" ? "border-b-2 border-[#FBBA00] font-semibold" : "text-gray-500"
          }`}
          onClick={() => setSelectedTab("language")}
        >
          Language
        </button>
        <button
          className={`flex-1 p-2 text-center ${
            selectedTab === "currency" ? "border-b-2 border-[#FBBA00] font-semibold" : "text-gray-500"
          }`}
          onClick={() => setSelectedTab("currency")}
        >
          Currency
        </button>
      </div>

      {/* Language Selection */}
      {selectedTab === "language" && (
        <div className="mt-4">
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
            <span className="text-sm">Translation</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoTranslate}
                onChange={() => setAutoTranslate(!autoTranslate)}
              />
              <div className="w-10 h-5 bg-gray-300 peer-checked:bg-[#FBBA00] rounded-full transition relative">
                <div
                  className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${
                    autoTranslate ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>

          <h3 className="text-lg font-semibold mt-4">Choose a language</h3>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`p-2 border rounded-lg text-center ${
                  selectedLanguage === lang ? "border-[#FBBA00] text-[#FBBA00] font-semibold" : "border-gray-300"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Currency Selection */}
      {selectedTab === "currency" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Choose a currency</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {currencies.map((currency) => (
              <button
                key={currency}
                onClick={() => setSelectedCurrency(currency)}
                className={`p-2 border rounded-lg text-center ${
                  selectedCurrency === currency ? "border-[#FBBA00] text-[#FBBA00] font-semibold" : "border-gray-300"
                }`}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageCurrencySelector;
