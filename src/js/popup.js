import { CatGridModule } from './popup/CatGridModule.js';
import { CustomCatControlsModule } from './popup/CustomCatControlsModule.js';
import { GifUploaderModule } from './popup/GifUploaderModule.js';
import { HeartAnimationModule } from './popup/HeartAnimationModule.js';
import { LanguageModule } from './popup/LanguageModule.js';
import { ThemeModule } from './popup/ThemeModule.js';

document.addEventListener('DOMContentLoaded', () => {
  [
    new CatGridModule(),
    new ThemeModule(),
    new LanguageModule(),
    new GifUploaderModule(),
    new CustomCatControlsModule(),
    new HeartAnimationModule(),
  ].forEach(m => m.init());
});
