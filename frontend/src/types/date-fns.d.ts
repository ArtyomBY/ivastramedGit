declare module 'date-fns/locale' {
  const ru: Locale;
  export { ru };
}

declare module 'date-fns/locale/ru' {
  import { Locale } from 'date-fns';
  const locale: Locale;
  export default locale;
}
