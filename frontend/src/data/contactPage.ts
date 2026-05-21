export const CONTACT_HERO_IMAGE = "/images/service1.png";
export const CONTACT_CTA_IMAGE = "/images/service1.png";

export const WHATSAPP_URL = "https://wa.me/919948059533";
export const CONTACT_EMAIL = "info@crusoetec.com";
/** Head office — Visakhapatnam */
export const CONTACT_PHONE_VIZAG = "+919948059533";
/** Hyderabad branch */
export const CONTACT_PHONE_HYDERABAD = "+918179467755";

export const MAPS_SHARE_HYDERABAD = "https://maps.app.goo.gl/8JikbDhmBiC8yCNh6";
export const MAPS_SHARE_VIZAG = "https://maps.app.goo.gl/6XrJycS66Ynu3VdA9";

const HYDERABAD_ADDRESS =
  "Plot No.27, Gachibowli, Behind Radisson Hotel, Hyderabad, India 500032";

const VIZAG_ADDRESS =
  "Crusoe Technologies LLP, #50-84-11, Madhuranagar, Visakhapatnam, India 530016";

/** Google Maps embed — lat/lng pins exact Crusoe location from shared map links */
export function getGoogleMapsEmbedUrl(options: {
  lat: number;
  lng: number;
  zoom?: number;
}): string {
  const { lat, lng, zoom = 16 } = options;
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;
}

export const SERVICE_OPTIONS = [
  "Quality Assurance",
  "Automated Testing",
  "CAD Customisation",
  "Software Tooling",
  "Engineering Services",
] as const;

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
    embedUrl: getGoogleMapsEmbedUrl({ lat: 17.7319097, lng: 83.3064899 }),
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
    embedUrl: getGoogleMapsEmbedUrl({ lat: 17.4470013, lng: 78.3617431 }),
    directionsUrl: MAPS_SHARE_HYDERABAD,
  },
] as const;

export const contactInfoBlocks = [
  {
    id: "vizag",
    title: "Head Office — Visakhapatnam",
    address: VIZAG_ADDRESS,
    phone: CONTACT_PHONE_VIZAG,
    tel: "tel:+919948059533",
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
