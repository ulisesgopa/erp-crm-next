import "server-only";

const dictionaries = {
  es: () => import("./locales/es.json").then((module) => module.default),
  en: () => import("./locales/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: "es" | "en" ) =>
  dictionaries[locale]();
