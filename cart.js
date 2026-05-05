// 1. HYDRATION: Load saved data on startup
// We check LocalStorage first. If it exists, parse it. If not, start with an empty array.
const savedCart = localStorage.getItem("shopping_cart");
let cartState = savedCart ? JSON.parse(savedCart) : [];

// 2. EVENT DELEGATION: Listen to the catalog (Only runs on shop.html)
const catalogContainer = document.getElementById("product-container");

// We only attach this listener if the container exists on the current page
if (catalogContainer) {
  catalogContainer.addEventListener("click", function (event) {
    // .closest() ensures the click registers even if the user clicks the inner <path> of the SVG
    const btn = event.target.closest(".add-to-cart");

    if (btn) {
      event.preventDefault();

      // Note: Since globalCatalog is defined in shop.html, we grab the full product details here.
      const productId = parseInt(btn.getAttribute("data-id"));
      const productData = globalCatalog.find((p) => p.id === productId);

      if (productData) {
        addToCart(productData);
      }
    }
  });
}

// 3. BUSINESS LOGIC: Add to Cart
function addToCart(product) {
  // Check if the product already exists in the cart array
  const existingItem = cartState.find((item) => item.id === product.id);

  if (existingItem) {
    // If it exists, just increment the quantity
    existingItem.quantity++;
  } else {
    // If it's new, push the full product info so cart.html has what it needs to display
    cartState.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  // 4. SERIALIZATION: Save immediately after changing
  localStorage.setItem("shopping_cart", JSON.stringify(cartState));
  console.log("Cart updated:", cartState);

  // Re-render the UI so the user sees the update instantly
  updateCartUI();
}

// 5. UI SYNCHRONIZATION: Read State and Update DOM
function updateCartUI() {
  // --- NEW: Update the Navbar Cart Badge ---
  const badge = document.getElementById("cart-badge");
  if (badge) {
    // .reduce() loops through the cart and adds up all the quantities
    const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);

    badge.innerText = totalItems; // Update the number

    // Hide the red circle if the cart is empty, show it if it has items
    if (totalItems > 0) {
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }
  // -----------------------------------------

  const cartContainer = document.getElementById("cart-items-container");
  const summarySubtotal = document.getElementById("cart-subtotal");
  const summaryTax = document.getElementById("cart-tax");
  const summaryTotal = document.getElementById("cart-total");

  // Only attempt to render the cart items if we are actually on the cart.html page
  if (cartContainer) {
    cartContainer.innerHTML = ""; // Clear previous HTML

    // Handle Empty Cart State
    if (cartState.length === 0) {
      cartContainer.innerHTML =
        '<p class="text-center py-10 text-gray-500">Your cart is currently empty.</p>';
      if (summarySubtotal) summarySubtotal.innerText = "£0.00";
      if (summaryTax) summaryTax.innerText = "£0.00";
      if (summaryTotal) summaryTotal.innerText = "£0.00";
      return;
    }

    let subtotal = 0;

    // Loop through state and build HTML for each item
    cartState.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemHTML = `
            <div class="bg-gray-50 p-6 mb-6">
                <div class="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                    <div class="flex-1 flex items-center gap-4">
                        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded">
                        <div>
                            <p class="font-bold text-gray-800">${item.title}</p>
                            <p class="text-sm text-gray-600">ID: ${item.id}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <p class="text-gray-800 font-semibold">£${itemTotal.toFixed(2)}</p>

                        <!-- Quantity Controls -->
                        <div class="flex items-center border border-gray-300 rounded bg-white">
                            <button onclick="changeQuantity(${index}, -1)" class="px-3 py-1 text-gray-600 hover:bg-gray-200 transition">-</button>
                            <span class="px-3 py-1 text-gray-800 font-semibold border-l border-r border-gray-300">${item.quantity}</span>
                            <button onclick="changeQuantity(${index}, 1)" class="px-3 py-1 text-gray-600 hover:bg-gray-200 transition">+</button>
                        </div>

                        <!-- Remove Item Button -->
                        <button onclick="removeFromCart(${index})" class="text-gray-500 hover:text-red-500 transition">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            `;
      cartContainer.insertAdjacentHTML("beforeend", itemHTML);
    });

    // Calculate and Update Totals
    const shipping = 5.0;
    const tax = subtotal * 0.07; // Assuming a 7% tax rate
    const total = subtotal + shipping + tax;

    if (summarySubtotal) summarySubtotal.innerText = `£${subtotal.toFixed(2)}`;
    if (summaryTax) summaryTax.innerText = `£${tax.toFixed(2)}`;
    if (summaryTotal) summaryTotal.innerText = `£${total.toFixed(2)}`;
  }
}

// 6. BUSINESS LOGIC: Change Quantity (+ / -)
function changeQuantity(index, amount) {
  // Update the quantity
  cartState[index].quantity += amount;

  // If the quantity drops to 0 or below, entirely remove the item
  if (cartState[index].quantity <= 0) {
    removeFromCart(index);
    return; // removeFromCart already handles saving and updating UI
  }

  // Serialize and Save back to LocalStorage
  localStorage.setItem("shopping_cart", JSON.stringify(cartState));

  // Re-render the UI to show new totals
  updateCartUI();
}

// 7. BUSINESS LOGIC: Remove an item entirely
function removeFromCart(index) {
  // Remove 1 item at the specific index
  cartState.splice(index, 1);

  // Serialize and Save back to LocalStorage
  localStorage.setItem("shopping_cart", JSON.stringify(cartState));

  // Re-render the UI
  updateCartUI();
}

// 8. INITIALIZATION: Call update once when the page loads to fill the cart
document.addEventListener("DOMContentLoaded", updateCartUI);
