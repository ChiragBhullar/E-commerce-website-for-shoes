function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}
const PRODUCTS = [
    { id: "p1",  name: "Nike Air Max",              price: 129.99, img: "images/nikeairmax.webp" },
    { id: "p2",  name: "Adidas Ultraboost",         price: 159.99, img: "images/adidasultraboost.webp" },
    { id: "p3",  name: "Puma RS-X",                 price: 99.99,  img: "images/pumarSX.webp" },
    { id: "p4",  name: "Reebok Nano X",             price: 129.99, img: "images/reeboknanox.webp" },
    { id: "p5",  name: "New Balance 990v5",         price: 174.99, img: "images/newbalance990v5.webp" },
    { id: "p6",  name: "Asics Gel-Kayano 27",       price: 159.99, img: "images/asicsgelkayano27.webp" },
    { id: "p7",  name: "Under Armour HOVR Phantom", price: 139.99, img: "images/underarmour.webp" },
    { id: "p8",  name: "Brooks Ghost 13",           price: 129.99, img: "images/broolsgghost.webp" },
    { id: "p9",  name: "Saucony Triumph 18",        price: 149.99, img: "images/saucony.jpg" },
    { id: "p10", name: "Hoka One One Clifton 7",    price: 139.99, img: "images/hokaclifton7.webp" },
    { id: "p11", name: "Salomon Speedcross 5",      price: 129.99, img: "images/salomonspeedcross5.jpg" },
    { id: "p12", name: "Merrell Moab 2",            price: 99.99,  img: "images/merrellmoab2.jpg" }
];

function findProduct(id) {
    return PRODUCTS.find(p => p.id === id);
}
function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}
function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

let cart = loadJSON("sn_cart", {});  
let wishlist = loadJSON("sn_wishlist", []); 
let orders = loadJSON("sn_orders", []);     
function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveJSON("sn_cart", cart);
    renderCart();
    updateCartBadge();
}

function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    saveJSON("sn_cart", cart);
    renderCart();
    updateCartBadge();
}

function removeFromCart(id) {
    delete cart[id];
    saveJSON("sn_cart", cart);
    renderCart();
    updateCartBadge();
}

function cartTotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
        const p = findProduct(id);
        return p ? sum + p.price * qty : sum;
    }, 0);
}

function cartCount() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
}

function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const count = cartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
}

function renderCart() {
    const list = document.getElementById("cart-list");
    const summary = document.getElementById("cart-summary");
    if (!list) return;

    const entries = Object.entries(cart);
    if (entries.length === 0) {
        list.innerHTML = '<p class="empty-msg">Your cart is empty. Go add some shoes! 👟</p>';
        summary.style.display = "none";
        return;
    }

    list.innerHTML = entries.map(([id, qty]) => {
        const p = findProduct(id);
        if (!p) return "";
        return `
        <div class="cart-item">
            <img src="${p.img}" alt="${p.name}">
            <div class="cart-item-info">
                <h4>${p.name}</h4>
                <p>Price: $${p.price.toFixed(2)}</p>
                <div class="qty-controls">
                    <button onclick="changeQty('${id}', -1)">−</button>
                    <span>${qty}</span>
                    <button onclick="changeQty('${id}', 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <p class="price">$${(p.price * qty).toFixed(2)}</p>
                <button class="remove-btn" onclick="removeFromCart('${id}')">Remove</button>
            </div>
        </div>`;
    }).join("");

    summary.style.display = "flex";
    document.getElementById("cart-total").textContent = "$" + cartTotal().toFixed(2);
}

function checkout() {
    if (cartCount() === 0) return;
    const items = Object.entries(cart).map(([id, qty]) => {
        const p = findProduct(id);
        return `${p.name} × ${qty}`;
    }).join(", ");

    orders.unshift({
        id: "SN" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString(),
        items,
        total: cartTotal(),
        status: "Processing"
    });
    saveJSON("sn_orders", orders);

    cart = {};
    saveJSON("sn_cart", cart);
    renderCart();
    updateCartBadge();
    renderOrders();

    alert("Order placed! Check the Orders section for details.");
    document.getElementById("orders").scrollIntoView({ behavior: "smooth" });
}
function toggleWishlist(id, btnEl) {
    const idx = wishlist.indexOf(id);
    if (idx === -1) {
        wishlist.push(id);
    } else {
        wishlist.splice(idx, 1);
    }
    saveJSON("sn_wishlist", wishlist);
    if (btnEl) btnEl.classList.toggle("active", wishlist.includes(id));
    renderWishlist();
}

function renderWishlist() {
    const grid = document.getElementById("wishlist-grid");
    if (!grid) return;

    if (wishlist.length === 0) {
        grid.innerHTML = '<p class="empty-msg">No favorites yet. Tap the ♡ on any shoe to save it here.</p>';
        return;
    }

    grid.innerHTML = wishlist.map(id => {
        const p = findProduct(id);
        if (!p) return "";
        return `
        <div class="product-card">
            <h3>${p.name}</h3>
            <img src="${p.img}" alt="${p.name}">
            <p class="price">Price: $${p.price.toFixed(2)}</p>
            <button onclick="addToCart('${id}')">Add to Cart</button>
            <button class="remove-btn" style="margin-top:10px;" onclick="toggleWishlist('${id}'); renderWishlist(); syncWishlistButtons();">Remove</button>
        </div>`;
    }).join("");
}

function syncWishlistButtons() {
    document.querySelectorAll(".wishlist-btn").forEach(btn => {
        const id = btn.getAttribute("data-id");
        btn.classList.toggle("active", wishlist.includes(id));
    });
}
function filterProducts(term) {
    const q = term.trim().toLowerCase();
    document.querySelectorAll("#products .product-card").forEach(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = name.includes(q) ? "" : "none";
    });
}
function renderOrders() {
    const list = document.getElementById("orders-list");
    if (!list) return;

    if (orders.length === 0) {
        list.innerHTML = '<p class="empty-msg">No orders yet. Your past orders will show up here.</p>';
        return;
    }

    list.innerHTML = orders.map(o => `
        <div class="order-card">
            <div class="order-header">
                <h4>Order #${o.id}</h4>
                <span class="order-status ${o.status === 'Processing' ? 'processing' : ''}">${o.status}</span>
            </div>
            <p class="order-items">${o.items}</p>
            <p style="color:#777; font-size:14px; margin-bottom:8px;">Placed on ${o.date}</p>
            <p class="order-total">Total: $${o.total.toFixed(2)}</p>
        </div>
    `).join("");
}
function saveProfile(e) {
    e.preventDefault();
    const profile = {
        name: document.getElementById("profile-name").value,
        email: document.getElementById("profile-email").value,
        address: document.getElementById("profile-address").value
    };
    saveJSON("sn_profile", profile);

    const msg = document.getElementById("profile-success");
    msg.classList.add("show");
    setTimeout(() => msg.classList.remove("show"), 2500);
}

function loadProfile() {
    const profile = loadJSON("sn_profile", { name: "", email: "", address: "" });
    const nameEl = document.getElementById("profile-name");
    if (!nameEl) return;
    nameEl.value = profile.name;
    document.getElementById("profile-email").value = profile.email;
    document.getElementById("profile-address").value = profile.address;
}
function saveSettings() {
    const settings = {
        emailNotifications: document.getElementById("setting-email").checked,
        orderUpdates: document.getElementById("setting-orders").checked,
        newsletter: document.getElementById("setting-newsletter").checked
    };
    saveJSON("sn_settings", settings);
}

function loadSettings() {
    const settings = loadJSON("sn_settings", {
        emailNotifications: true,
        orderUpdates: true,
        newsletter: false
    });
    const emailEl = document.getElementById("setting-email");
    if (!emailEl) return;
    emailEl.checked = settings.emailNotifications;
    document.getElementById("setting-orders").checked = settings.orderUpdates;
    document.getElementById("setting-newsletter").checked = settings.newsletter;
}
function toggleFaq(el) {
    const item = el.parentElement;
    const wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
}
function submitSupport(e) {
    e.preventDefault();
    const msg = document.getElementById("support-success");
    msg.classList.add("show");
    document.getElementById("support-form").reset();
    setTimeout(() => msg.classList.remove("show"), 3000);
}
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    renderWishlist();
    renderOrders();
    updateCartBadge();
    syncWishlistButtons();
    loadProfile();
    loadSettings();

    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => filterProducts(e.target.value));
    }

    const profileForm = document.getElementById("profile-form");
    if (profileForm) profileForm.addEventListener("submit", saveProfile);

    const supportForm = document.getElementById("support-form");
    if (supportForm) supportForm.addEventListener("submit", submitSupport);

    document.querySelectorAll('#settings input[type="checkbox"]').forEach(cb => {
        cb.addEventListener("change", saveSettings);
    });
});
