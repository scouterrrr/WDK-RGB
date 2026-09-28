import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Download, Check, QrCode as QrIcon } from 'lucide-react';

interface RealQRCodeProps {
  value: string;
  size?: number;
  label?: string;
  sublabel?: string;
  onCopy?: () => void;
}

export function RealQRCode({
  value,
  size = 220,
  label,
  sublabel,
  onCopy
}: RealQRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    QRCode.toDataURL(value, {
      width: size * 2, // 2x retina sharpness
      margin: 1.5,
      color: {
        dark: '#0A0E17',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('QR code generation failed:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `wdk_rgb_qr_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center p-5 bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-xl text-center max-w-sm mx-auto">
      {label && (
        <h4 className="text-sm font-bold text-white tracking-tight mb-1 flex items-center gap-1.5">
          <QrIcon className="w-4 h-4 text-[#26A17B]" />
          {label}
        </h4>
      )}
      {sublabel && (
        <p className="text-xs text-[#94A3B8] mb-4 max-w-xs">{sublabel}</p>
      )}

      {/* Scannable Real QR Frame */}
      <div className="p-3 bg-white rounded-xl shadow-md border-2 border-[#26A17B]/40 relative group transition-transform hover:scale-[1.02]">
        {loading ? (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center bg-slate-100 rounded-lg"
          >
            <div className="w-8 h-8 border-3 border-[#26A17B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <img
            src={dataUrl}
            alt="Scannable Tether WDK QR Code"
            style={{ width: size, height: size }}
            className="rounded-lg block select-none"
          />
        )}

        <div className="absolute inset-0 bg-[#0A0E17]/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#26A17B] hover:bg-[#208b69] text-white text-xs font-bold flex items-center gap-1 shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-white text-[#0A0E17] text-xs font-bold flex items-center gap-1 shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      {/* Value Display */}
      <div className="mt-4 w-full">
        <div className="bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 flex items-center justify-between gap-2 text-left">
          <code className="text-xs font-mono text-[#34D399] break-all line-clamp-2 select-all leading-relaxed">
            {value}
          </code>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-[#1E293B] text-[#94A3B8] hover:text-white transition-colors shrink-0 cursor-pointer"
            title="Copy Text"
          >
            {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5 w-full">
        <button
          onClick={handleCopy}
          className="flex-1 py-2.5 rounded-xl bg-[#26A17B] hover:bg-[#208b69] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied to Clipboard' : 'Copy Invoice / Address'}
        </button>
        <button
          onClick={handleDownload}
          className="py-2.5 px-3 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-[#26A17B] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#334155] cursor-pointer"
          title="Download PNG"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
