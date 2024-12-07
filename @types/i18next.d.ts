// /@types/i18next.d.ts
// import the original type declarations
// i18n の設定
import "i18next";
// import all namespaces (for the default language, only)
import jaJson from "../locales/ja.json";
import enJson from "../locales/en.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "ja";
    // custom resources type
    resources: {
      ja: typeof jaJson;
      en: typeof enJson;
    };
  }
}
