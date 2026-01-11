// API service for property creation

export const propertyService = {
  async createProperty(formData, token) {
    const response = await fetch(
      "https://core-api-x41.shaheenplus.sa/api/user/properties",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
      throw new Error(result.message || "فشل في إضافة الإعلان");
    }

    return result;
  },

  prepareFormData(adFormData, currentUser) {
    const formData = new FormData();

    const commonFields = [
      "announcement_number",
      "region",
      "city",
      "title",
      "land_type",
      "purpose",
      "geo_location_text",
      "total_area",
      "length_north",
      "length_south",
      "length_east",
      "length_west",
      "description",
      "deed_number",
      "legal_declaration",
    ];

    commonFields.forEach((field) => {
      if (typeof adFormData[field] === "boolean") {
        formData.append(field, adFormData[field] ? "true" : "false");
      } else if (
        adFormData[field] !== null &&
        adFormData[field] !== undefined &&
        adFormData[field] !== ""
      ) {
        formData.append(field, adFormData[field]);
      }
    });

    if (adFormData.purpose === "بيع") {
      formData.append("price_per_sqm", adFormData.price_per_sqm);
    } else if (adFormData.purpose === "استثمار") {
      formData.append("investment_duration", adFormData.investment_duration);
      formData.append(
        "estimated_investment_value",
        adFormData.estimated_investment_value
      );

      if (currentUser?.user_type === "وكيل شرعي" && adFormData.agency_number) {
        formData.append("agency_number", adFormData.agency_number);
      }
    }

    if (adFormData.cover_image) {
      formData.append("cover_image", adFormData.cover_image);
    }

    if (adFormData.images && adFormData.images.length > 0) {
      adFormData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    return formData;
  },
};