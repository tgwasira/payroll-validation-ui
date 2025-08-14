import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Load both JSON files for the locale
  const [libraryMessages, appMessages] = await Promise.all([
    import(`@/react-ui-library/messages/${locale}.json`).then((m) => m.default),
    import(`../../messages/${locale}.json`).then((m) => m.default),
  ]);

  // Merge them (later files overwrite earlier keys)
  const mergedMessages = { ...libraryMessages, ...appMessages };

  return {
    locale,
    messages: mergedMessages,
  };
});
