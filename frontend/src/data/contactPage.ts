export const CONTACT_HERO_IMAGE = "/images/services/contact/contact1.png";
export const CONTACT_CTA_IMAGE = "/images/global/contactlast.png";

export const WHATSAPP_URL = "https://wa.me/919948059333";
export const CONTACT_EMAIL = "info@crusoetec.com";
/** Head office — Visakhapatnam */
export const CONTACT_PHONE_VIZAG = "+919948059333";
/** Hyderabad branch */
export const CONTACT_PHONE_HYDERABAD = "+918179467755";

/** Get Directions links */
export const MAPS_SHARE_VIZAG = "https://maps.app.goo.gl/FEKyYJHR6uweketr6";
export const MAPS_SHARE_HYDERABAD = "https://maps.app.goo.gl/7vbxaXHc64ufr4B88";

/** Map view links (used to derive iframe embed URLs) */
export const MAPS_VIEW_VIZAG = "https://maps.app.goo.gl/TK8KNRQiV4ArQSpX7";
export const MAPS_VIEW_HYDERABAD = "https://maps.app.goo.gl/u5uvp1QwnX5RBeFz5";

const HYDERABAD_ADDRESS =
  "Plot No.27, Gachibowli, Behind Radisson Hotel, Hyderabad, India 500032";

const VIZAG_ADDRESS =
  "#50-84-11, Madhuranagar, Visakhapatnam, India 530016";

const VIZAG_PLACE_HEX = "0x3a394333bdb2857f:0x8bd4fe21144c0f4";
const HYDERABAD_PLACE_HEX = "0x3bcb9314e97f09f7:0x795885e9fff42e29";

/** Official Google Maps iframe embed — shows place name card, address, and directions. */
function buildGooglePlaceEmbedUrl(options: {
  lat: number;
  lng: number;
  spanMeters: number;
  placeHex: string;
  placeName?: string;
}): string {
  const {
    lat,
    lng,
    spanMeters,
    placeHex,
    placeName = "Crusoe Technologies",
  } = options;

  const zoomScale = spanMeters / 665;
  const d = 3800.269954220732 * zoomScale;
  const encodedHex = placeHex.replace(":", "%3A");
  const encodedName = encodeURIComponent(placeName);

  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${d}!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodedHex}!2s${encodedName}!5e0!3m2!1sen!2sin!4v1737000000000!5m2!1sen!2sin`;
}

const MAPS_EMBED_VIZAG = buildGooglePlaceEmbedUrl({
  lat: 17.7319097,
  lng: 83.3064899,
  spanMeters: 1107,
  placeHex: VIZAG_PLACE_HEX,
});

const MAPS_EMBED_HYDERABAD = buildGooglePlaceEmbedUrl({
  lat: 17.4470013,
  lng: 78.3617431,
  spanMeters: 1109,
  placeHex: HYDERABAD_PLACE_HEX,
});

export const SERVICE_OPTIONS = [
  "Quality Assurance",
  "Automated Testing",
  "CAD Customisation",
  "Software Tooling",
  "Engineering Services",
  "Others",
] as const;

export const OTHER_SERVICE_OPTION = "Others";

export const contactOffices = [
  {
    id: "vizag",
    title: "Visakhapatnam Office",
    label: "Head Office — Visakhapatnam",
    address: VIZAG_ADDRESS,
    phone: CONTACT_PHONE_VIZAG,
    email: CONTACT_EMAIL,
    lat: 17.7319097,
    lng: 83.3064899,
    embedUrl: MAPS_EMBED_VIZAG,
    directionsUrl: MAPS_SHARE_VIZAG,
  },
  {
    id: "hyderabad",
    title: "Hyderabad Office",
    label: "Hyderabad Branch",
    address: HYDERABAD_ADDRESS,
    phone: CONTACT_PHONE_HYDERABAD,
    email: CONTACT_EMAIL,
    lat: 17.4470013,
    lng: 78.3617431,
    embedUrl: MAPS_EMBED_HYDERABAD,
    directionsUrl: MAPS_SHARE_HYDERABAD,
  },
] as const;

export const contactInfoBlocks = [
  {
    id: "vizag",
    title: "Head Office — Visakhapatnam",
    address: VIZAG_ADDRESS,
    phone: CONTACT_PHONE_VIZAG,
    tel: "tel:+919948059333",
    email: CONTACT_EMAIL,
    directionsUrl: MAPS_SHARE_VIZAG,
  },
  {
    id: "hyderabad",
    title: "Hyderabad Branch",
    address: HYDERABAD_ADDRESS,
    phone: CONTACT_PHONE_HYDERABAD,
    tel: "tel:+918179467755",
    email: CONTACT_EMAIL,
    directionsUrl: MAPS_SHARE_HYDERABAD,
  },
] as const;

export const whyContactCrusoe = [
  {
    icon: "zap" as const,
    title: "Fast Response",
    description:
      "We respond to enquiries quickly so your project momentum never stalls.",
  },
  {
    icon: "users" as const,
    title: "Expert Team",
    description:
      "Work with seasoned engineers and QA specialists across domains.",
  },
  {
    icon: "shield" as const,
    title: "Secure Communication",
    description:
      "Your information is handled with care and enterprise-grade discretion.",
  },
] as const;
