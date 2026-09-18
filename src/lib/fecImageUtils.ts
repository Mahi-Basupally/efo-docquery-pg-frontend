// FECIMAGE_URL (see .env / next.config.js) is the FEC's public image viewer
// base URL - an image number becomes a viewable document link by appending
// it directly, e.g. 'https://docquery.fec.gov/cgi-bin/fecimg/?' + '202403299024713758'.
export const getFecImageUrl = (imageNumber?: string | number | null): string | undefined => {
  if (!imageNumber) return undefined;
  const base = process.env.FECIMAGE_URL;
  if (!base) return undefined;
  return `${base}${imageNumber}`;
};
