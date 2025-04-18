import React, { useEffect, useRef, useState } from 'react';

const AdBanner = ({ adKey, width, height, delay = 0 }) => {
  const adContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = adContainerRef.current;
    if (!container) return;

    const loadAd = () => {
      const uniqueId = `ad_${Math.random().toString(36).substr(2, 9)}`;
      window[`atOptions_${uniqueId}`] = {
        key: adKey,
        format: 'iframe',
        height: height,
        width: width,
        params: {},
      };

      const configScript = document.createElement('script');
      configScript.text = `window.atOptions = window['atOptions_${uniqueId}'];`;

      const adScript = document.createElement('script');
      adScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      adScript.async = true;

      container.innerHTML = '';
      container.appendChild(configScript);
      container.appendChild(adScript);

      return () => {
        container.innerHTML = '';
        delete window[`atOptions_${uniqueId}`];
      };
    };

    const timer = setTimeout(loadAd, delay);
    return () => clearTimeout(timer);
  }, [adKey, width, height, delay]);

  return (
    <div
      ref={adContainerRef}
      style={{ minHeight: `${height}px`, width: `${width}px`, margin: '0 auto' }}
    />
  );
};

export default AdBanner;