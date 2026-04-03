// Menu item validation utility
export const validateMenuForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === "") {
    errors.name = "Food name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Food name must be at least 2 characters";
  } else if (formData.name.trim().length > 50) {
    errors.name = "Food name must not exceed 50 characters";
  }

  // Description validation
  if (!formData.description || formData.description.trim() === "") {
    errors.description = "Description is required";
  } else if (formData.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  } else if (formData.description.trim().length > 500) {
    errors.description = "Description must not exceed 500 characters";
  }

  // Price validation
  if (!formData.price && formData.price !== 0) {
    errors.price = "Price is required";
  } else if (Number(formData.price) <= 0) {
    errors.price = "Price must be greater than 0";
  } else if (isNaN(Number(formData.price))) {
    errors.price = "Price must be a valid number";
  }

  // Category validation
  if (!formData.category || formData.category.trim() === "") {
    errors.category = "Category is required";
  }

  // Prep time validation
  if (formData.prepTime < 0) {
    errors.prepTime = "Prep time cannot be negative";
  } else if (!Number.isInteger(Number(formData.prepTime))) {
    errors.prepTime = "Prep time must be a whole number";
  }

  // Quantity validation
  if (formData.quantity < 0) {
    errors.quantity = "Quantity cannot be negative";
  } else if (!Number.isInteger(Number(formData.quantity))) {
    errors.quantity = "Quantity must be a whole number";
  }

  return errors;
};

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
