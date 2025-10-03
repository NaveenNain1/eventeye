import React, { useState, useEffect } from "react";
import QRCode from "qrcode";

// Usage:
// 1) npm install qrcode
// 2) Save as src/components/QRImage.jsx
// 3) <QRImage text="https://example.com" />

export default function QRImage({ text = "Hello, world!", size = 256 }) {
  const [qrSrc, setQrSrc] = useState("");

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, { width: size, margin: 1 }, (err, url) => {
        if (!err) setQrSrc(url);
      });
    }
  }, [text, size]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {qrSrc ? (
        <img src={qrSrc} 
        style={{
            padding:2,
            backgroundColor:'white'
        }}
        alt="Generated QR" width={size} height={size} className="rounded shadow" />
      ) : (
        <p>Generating QR...</p>
      )}
    </div>
  );
}
