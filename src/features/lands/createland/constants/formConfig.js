// Static configuration and validation rules for the property form

export const FORM_STEPS = [
  { num: 1, label: "المعلومات الأساسية" },
  { num: 2, label: "المساحة والموقع" },
  { num: 3, label: "التفاصيل المالية" },
  { num: 4, label: "الصور والإقرارات" },
];

export const LAND_TYPES = [
  { value: "سكني", label: "سكني" },
  { value: "تجاري", label: "تجاري" },
  { value: "زراعي", label: "زراعي" },
];

export const PURPOSE_TYPES = [
  { value: "بيع", label: "بيع" },
  { value: "استثمار", label: "استثمار" },
];

export const VALIDATION_RULES = {
  MIN_AREA: 5000,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_ADDITIONAL_IMAGES: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
};

export const INITIAL_FORM_DATA = {
  announcement_number: "",
  region: "",
  city: "",
  title: "",
  land_type: "سكني",
  purpose: "بيع",
  geo_location_text: "",
  total_area: "",
  length_north: "",
  length_south: "",
  length_east: "",
  length_west: "",
  description: "",
  deed_number: "",
  price_per_sqm: "",
  investment_duration: "",
  estimated_investment_value: "",
  agency_number: "",
  legal_declaration: false,
  cover_image: null,
  images: [],
};