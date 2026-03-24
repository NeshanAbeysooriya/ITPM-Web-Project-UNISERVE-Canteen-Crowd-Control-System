export function loadCart() {
  let cartString = localStorage.getItem("cart");
  if (!cartString) {
    localStorage.setItem("cart", "[]");
    cartString = "[]";
  }
  return JSON.parse(cartString);
}

export function addToCart(product, quantity) {
  let cart = loadCart();

  const productId = product._id ?? product.productID ?? product.name;

  const existingItemIndex = cart.findIndex(
    (item) => item._id === productId
  );

  if (existingItemIndex === -1) {
    if (quantity < 1) return;

    const cartItem = {
      _id: productId,
      name: product.name,
      price: product.price,
      labelledPrice: product.labelledPrice || product.price,
      quantity: quantity,
      image: product.image,
    };

    cart.push(cartItem);
  } else {
    const existingItem = cart[existingItemIndex];
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity < 1) {
      cart = cart.filter((item) => item._id !== productId);
    } else {
      cart[existingItemIndex].quantity = newQuantity;
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

export function getTotal() {
  const cart = loadCart();
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total;
}