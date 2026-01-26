"use client";

import QRCode from "react-qr-code";

type Props = {
  value: string; // accept any string payload
  className?: string;
};

export default function WalletQrCode({ value, className }: Props) {
  return (
    <div className={["bg-white p-2.5 mx-auto w-full rounded-xl", className].filter(Boolean).join(" ")}>
      <QRCode
        size={256}
        className="w-full max-w-full h-auto"
        value={value}
        viewBox="0 0 256 256"
      />
    </div>
  );
}
