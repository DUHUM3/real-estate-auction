// Form steps configuration and validation rules
import Icons from "../../../../icons/index";

export const FORM_STEPS = [
  { number: 1, title: "المعلومات الأساسية", icon: Icons.FaInfoCircle },
  { number: 2, title: "تفاصيل الأرض", icon: Icons.FaMapMarkerAlt },
  { number: 3, title: "الوصف والموافقة", icon: Icons.FaCheckCircle },
];

export const INITIAL_FORM_DATA = {
  title: "",
  region: "",
  city: "",
  purpose: "purchase",
  type: "residential",
  area: "",
  description: "",
  terms_accepted: false,
};

export const PURPOSE_OPTIONS = [
  { value: "sale", label: "شراء" },
  { value: "investment", label: "استثمار" },
];

export const TYPE_OPTIONS = [
  { value: "residential", label: "سكني" },
  { value: "commercial", label: "تجاري" },
  { value: "agricultural", label: "زراعي" },
];