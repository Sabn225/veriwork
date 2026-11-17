'use client';
import { useEffect, useRef } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { HERO_VIDEO } from '../lib/siteConfig';

const PLAY_ICON = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>;

// The video path lives in lib/siteConfig.js. Leave `src` empty there to show the placeholder.
// With a `src` the video starts by itself, muted, loops forever and shows no controls.
export default function HeroVideo() {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const { src, poster } = HERO_VIDEO;

  // React can drop the `muted` attribute on hydration, and browsers then block autoplay.
  // Set it by hand and start playback explicitly.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const started = v.play();
    if (started && typeof started.catch === 'function') started.catch(() => {});
  }, [src]);

  if (!src) {
    // Placeholder: not a button, because there is nothing to play yet
    return (
      <div className="video-frame is-placeholder">
        <div className="video-play" role="img" aria-label={t('video.soon')}>
          <span className="video-play-icon">{PLAY_ICON}</span>
        </div>
        <span className="video-caption" aria-hidden="true">{t('video.soon')}</span>
      </div>
    );
  }

  return (
    <div className="video-frame">
      <video
        ref={videoRef}
        src={src}
        poster={poster || undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
