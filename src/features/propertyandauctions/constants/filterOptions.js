// Filter options for properties and auctions
export const regions = []; // Add your regions here
export const landTypes = ["سكني", "تجاري", "زراعي"];
export const purposes = ["بيع", "استثمار"];
export const auctionStatuses = ["مفتوح", "مغلق"];

export const initialLandFilters = {
  search: "",
  region: "",
  city: "",
  land_type: "",
  purpose: "",
  min_area: "",
  max_area: "",
  min_price: "",
  max_price: "",
  min_investment: "",
  max_investment: "",
};

export const initialAuctionFilters = {
  search: "",
  status: "",
  date_from: "",
  date_to: "",
  company: "",
  address: "",
};