import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 120,
      margin: 1,
      color: {
        dark: '#CDD3E1',
        light: '#00000000', // transparent background
      },
      errorCorrectionLevel: 'M',
    });
  } catch {
    console.error('Failed to generate QR code');
    return '';
  }
}
