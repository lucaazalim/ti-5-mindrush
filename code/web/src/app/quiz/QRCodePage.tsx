"use client";

import { useEffect, useState } from "react";
// @ts-ignore
import QRCode from "qrcode";

export default function QRCodeGenerator({ text }: { text: string }) {
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    useEffect(() => {
        async function generateQR() {
            try {
                const url = await QRCode.toDataURL(text);
                setQrCodeUrl(url);
            } catch (err) {
                console.error("Erro ao gerar QR Code:", err);
            }
        }
        generateQR();
    }, [text]);

    return (
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">QR Code</h2>
            {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40" /> : <p>Gerando...</p>}
        </div>
    );
}