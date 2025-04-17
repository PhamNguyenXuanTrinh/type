import React, { useEffect, useRef } from 'react';

const AdBanner = ({ adKey = '675a0f02ceb9a410c455c361ce701aeb', width = 468, height = 60 }) => {
  const adContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = adContainerRef.current;
    if (!container) return;

    // Tạo script cấu hình
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      window.atOptions = {
        'key': '${adKey}',
        'format': 'iframe',
        'height': ${height},
        'width': ${width},
        'params': {}
      };
    `;

    // Tạo script quảng cáo
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
    adScript.async = true;

    container.innerHTML = ''; // Clear previous content
    container.appendChild(configScript);
    container.appendChild(adScript);

    return () => {
      container.innerHTML = ''; // Clean up on unmount
    };
  }, [adKey, width, height]);

  return (
    <div
      ref={adContainerRef}
      className="ad-banner"
      style={{ minHeight: `${height}px`, width: `${width}px`, margin: '0 auto' }}
    />
  );
};

export default AdBanner;
