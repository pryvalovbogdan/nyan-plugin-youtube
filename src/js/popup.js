import { CatGridModule } from './popup/CatGridModule.js';
import { CustomCatControlsModule } from './popup/CustomCatControlsModule.js';
import { GifUploaderModule } from './popup/GifUploaderModule.js';
import { HeartAnimationModule } from './popup/HeartAnimationModule.js';
import { LanguageModule } from './popup/LanguageModule.js';
import { ThemeModule } from './popup/ThemeModule.js';

document.addEventListener('DOMContentLoaded', () => {
  if (__SAFARI__) {
    // App Store guideline 3.1.1 forbids external donation links; the Chrome
    // Web Store rate-us link also doesn't apply to the Safari build.
    document.getElementById('donateBtn')?.remove();
    document.getElementById('rateUsBtn')?.remove();
  }

  [
    new CatGridModule(),
    new ThemeModule(),
    new LanguageModule(),
    new GifUploaderModule(),
    new CustomCatControlsModule(),
    new HeartAnimationModule(),
  ].forEach(m => m.init());
});
