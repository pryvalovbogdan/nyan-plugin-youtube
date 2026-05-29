export const TRANSLATIONS = {
  en: {
    title: 'Kitty selector',
    support: 'Support',
    bannerText: 'Now you can choose your own <strong>Custom Nyan Cat</strong> theme! 🐱✨',
    bannerBtn: 'Select Cat',
    bannerClose: 'Dismiss',
    labelHeight: 'Height',
    labelTop: 'Top',
  },
  es: {
    title: 'Selector de gatito',
    support: 'Apoyar',
    bannerText: '¡Elige tu propio tema <strong>Nyan Cat</strong> para la barra de progreso! 🐱✨',
    bannerBtn: 'Elegir gato',
    bannerClose: 'Cerrar',
    labelHeight: 'Altura',
    labelTop: 'Arriba',
  },
  pt: {
    title: 'Seletor de gatinho',
    support: 'Apoiar',
    bannerText: 'Agora você pode escolher seu tema <strong>Nyan Cat</strong> favorito! 🐱✨',
    bannerBtn: 'Escolher gato',
    bannerClose: 'Fechar',
    labelHeight: 'Altura',
    labelTop: 'Topo',
  },
  vi: {
    title: 'Chọn mèo',
    support: 'Ủng hộ',
    bannerText: 'Bạn có thể chọn chủ đề <strong>Nyan Cat</strong> cho thanh tiến trình! 🐱✨',
    bannerBtn: 'Chọn mèo',
    bannerClose: 'Đóng',
    labelHeight: 'Chiều cao',
    labelTop: 'Trên',
  },
  id: {
    title: 'Pilih kucing',
    support: 'Dukung',
    bannerText: 'Sekarang kamu bisa memilih tema <strong>Nyan Cat</strong> favoritmu! 🐱✨',
    bannerBtn: 'Pilih kucing',
    bannerClose: 'Tutup',
    labelHeight: 'Tinggi',
    labelTop: 'Atas',
  },
  fr: {
    title: 'Sélecteur de chaton',
    support: 'Soutenir',
    bannerText: 'Choisissez votre thème <strong>Nyan Cat</strong> pour la barre de progression! 🐱✨',
    bannerBtn: 'Choisir un chat',
    bannerClose: 'Fermer',
    labelHeight: 'Hauteur',
    labelTop: 'Haut',
  },
  tl: {
    title: 'Pumili ng pusa',
    support: 'Suportahan',
    bannerText: 'Pumili na ng sariling <strong>Nyan Cat</strong> tema para sa progress bar! 🐱✨',
    bannerBtn: 'Pumili ng pusa',
    bannerClose: 'Isara',
    labelHeight: 'Taas',
    labelTop: 'Itaas',
  },
  tr: {
    title: 'Kedi seçici',
    support: 'Destek ol',
    bannerText: 'Artık kendi <strong>Nyan Cat</strong> temanı seçebilirsin! 🐱✨',
    bannerBtn: 'Kedi seç',
    bannerClose: 'Kapat',
    labelHeight: 'Yükseklik',
    labelTop: 'Üst',
  },
  pl: {
    title: 'Wybór kotka',
    support: 'Wesprzyj',
    bannerText: 'Wybierz własny motyw <strong>Nyan Cat</strong> dla paska postępu! 🐱✨',
    bannerBtn: 'Wybierz kota',
    bannerClose: 'Zamknij',
    labelHeight: 'Wysokość',
    labelTop: 'Góra',
  },
  de: {
    title: 'Kätzchen-Auswahl',
    support: 'Unterstützen',
    bannerText: 'Wähle dein <strong>Nyan Cat</strong>-Thema für den Fortschrittsbalken! 🐱✨',
    bannerBtn: 'Katze wählen',
    bannerClose: 'Schließen',
    labelHeight: 'Höhe',
    labelTop: 'Oben',
  },
  uk: {
    title: 'Вибір котика',
    support: 'Підтримати',
    bannerText: 'Тепер ти можеш обрати власну тему <strong>Nyan Cat</strong> для прогрес-бару! 🐱✨',
    bannerBtn: 'Обрати кота',
    bannerClose: 'Закрити',
    labelHeight: 'Висота',
    labelTop: 'Зверху',
  },
};

export const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  fr: 'Français',
  tl: 'Filipino',
  tr: 'Türkçe',
  pl: 'Polski',
  de: 'Deutsch',
  uk: 'Українська',
};

export function getTranslation(lang) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

export function detectBrowserLanguage() {
  const base = (navigator.language || 'en').split('-')[0];

  return TRANSLATIONS[base] ? base : 'en';
}
