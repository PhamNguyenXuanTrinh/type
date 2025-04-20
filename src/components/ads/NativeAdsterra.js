import React, { useEffect, useState } from "react";

const NativeAdsterra = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//pl26420120.profitableratecpm.com/482dfa1ff19a36ca9b0297c47f80d6d7/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    document.getElementById("ad-container")?.appendChild(script);

    const timer = setTimeout(() => setVisible(true), 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: "1000", textAlign: "center", margin: "20px 0" }}>
      <div id="ad-container" style={{ display: visible ? "block" : "none" }}>
        <div id="container-482dfa1ff19a36ca9b0297c47f80d6d7"></div>
      </div>
    </div>
  );
};

export default NativeAdsterra;
