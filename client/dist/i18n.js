"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const react_i18next_1 = require("react-i18next");
//Тут загружає translations (переклади мабуть) тут інші модулі можуть перекладати. Він викорстовує переклад використовуючи http-requests. ОТже я можу завантажити його з віддаленого сервера.
const i18next_http_backend_1 = __importDefault(require("i18next-http-backend"));
//Цей модуль визначає мову для нас
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            'Welcome to React': 'Welcome to React and react-i18next',
        },
    },
};
/* i18n
    .use(Backend)
    .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    }); */
i18next_1.default
    .use(i18next_http_backend_1.default)
    .use(i18next_browser_languagedetector_1.default)
    .use(react_i18next_1.initReactI18next)
    .init({
    fallbackLng: 'en',
    //debug: true - покаже всі console.log() - що приходять з i18next - а false - рпиховає
    debug: false,
    detection: {
        order: ['queryString', 'cookie'],
        cache: ['cookie'],
    },
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
    defaultNS: 'translation',
});
exports.default = i18next_1.default;
