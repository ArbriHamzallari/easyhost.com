import QRCode from "qrcode";

// baseUrl is passed in from the API route so the QR always encodes
// the actual origin the request came from (localhost in dev, real domain in prod).
function guestMenuUrl(propertySlug: string, baseUrl: string): string {
  return `${baseUrl}/m/${propertySlug}`;
}

export async function generateQrPng(
  propertySlug: string,
  baseUrl: string,
  _accentColor?: string
): Promise<Buffer> {
  void _accentColor;
  const url = guestMenuUrl(propertySlug, baseUrl);
  const buffer = await QRCode.toBuffer(url, {
    type: "png",
    width: 512,
    margin: 2,
    color: {
      dark: "#222222",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  });
  return buffer;
}

export async function generateQrSvg(
  propertySlug: string,
  baseUrl: string
): Promise<string> {
  const url = guestMenuUrl(propertySlug, baseUrl);
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 2,
    color: {
      dark: "#222222",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  });
  return svg;
}
