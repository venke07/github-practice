import { sendToGemini } from './api.js';
import { loadEnv } from './env-loader.js';

// --- Mock Data ---
const PRODUCTS = [
    {
        id: 1,
        name: "Quantum Headset X1",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Immersive noise-cancelling audio with holographic soundstage."
    },
    {
        id: 2,
        name: "Neon Goggles v2",
        price: 149.50,
        image: "https://images.unsplash.com/photo-1576403264663-149d683699b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "AR-enabled protective eyewear with heads-up display."
    },
    {
        id: 3,
        name: "CyberWatch Pro",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Biometric monitoring with neural link integration capabilities."
    },
    {
        id: 4,
        name: "Levitating Speaker",
        price: 199.00,
        image: "https://images.unsplash.com/photo-1628148819582-77443834279b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "360-degree sound that defies gravity. Pure crystal audio."
    },
    {
        id: 5,
        name: "Glitch Hoodie",
        price: 85.00,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Smart-fabric streetwear that changes color based on mood."
    },
    {
        id: 6,
        name: "Nano Drone",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Pocket-sized 8K camera drone with autonomous follow mode."
    }
];

// --- State ---
let cart = [];
let chatHistory = [];
let apiKey = '';

// --- DOM Elements ---
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const overlay = document.getElementById('overlay');

// AI Elements
const aiToggleBtn = document.getElementById('ai-toggle');
const closeAiBtn = document.getElementById('close-ai');
const chatWindow = document.getElementById('ai-chat-window');
const apiKeyContainer = document.getElementById('api-key-container');
const chatMessages = document.getElementById('chat-messages');
const chatInputArea = document.getElementById('chat-input-area');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');


// --- Initialization ---
async function init() {
    // Attempt to load from .env first
    const env = await loadEnv();
    apiKey = env.GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';

    renderProducts();
    updateCartUI();
    checkApiKey();
    setupEventListeners();

    // Welcome Notification
    setTimeout(() => showNotification("✨ Lumina AI is online and ready to help!"), 1500);
}

// --- Product Logic ---
function renderProducts() {
    productGrid.innerHTML = PRODUCTS.map(product => `
        <div class="product-card">
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <p style="font-size: 0.8rem; color: #a1a1aa; margin-bottom: 1rem;">${product.description}</p>
                <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Expose addToCart to global scope since it's called from HTML string
window.addToCart = function (id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
        cart.push(product);
        updateCartUI();
        showNotification(`Added ${product.name} to bag`);
    }
};

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    updateCartUI();
};

function updateCartUI() {
    cartCountEl.innerText = cart.length;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your bag is empty.</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalEl.innerText = '$' + total.toFixed(2);
}

// --- Cart Sidebar Logic ---
function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// --- Checkout Logic ---
function openCheckout() {
    if (cart.length === 0) {
        showNotification("Add some items to your bag first!");
        return;
    }
    cartSidebar.classList.remove('active');
    document.getElementById('checkout-modal').classList.add('active');
    overlay.classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
    overlay.classList.remove('active');
}

window.processCheckout = function (event) {
    event.preventDefault();
    const btn = event.target.querySelector('.pay-btn');
    const modalContent = document.querySelector('.modal-content');

    btn.innerText = "Processing Transaction...";
    btn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        // Switch to success view
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 2rem 0; animation: fadeIn 0.5s ease;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🚀</div>
                <h2 style="margin-bottom: 1rem;">Order Confirmed!</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Welcome to the future. Your order is being processed by our nano-drones.</p>
                <button class="pay-btn" onclick="location.reload()">Back to Store</button>
            </div>
        `;

        cart = [];
        updateCartUI();
        showNotification("Purchase successful!");
    }, 2500);
};

// --- AI Chat Logic ---
function toggleChat() {
    chatWindow.classList.toggle('hidden');
}

function checkApiKey() {
    if (apiKey) {
        apiKeyContainer.classList.add('hidden');
        chatMessages.classList.remove('hidden');
        chatInputArea.classList.remove('hidden');
    } else {
        apiKeyContainer.classList.remove('hidden');
        chatMessages.classList.add('hidden');
        chatInputArea.classList.add('hidden');
    }
}

function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (key) {
        apiKey = key;
        localStorage.setItem('gemini_api_key', key);
        checkApiKey();
    }
}

async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message || !apiKey) return;

    // Add User Message
    addMessageToUI('user', message);
    userInput.value = '';

    // Show Loading/Typing state
    const loadingId = addMessageToUI('ai', 'Thinking...');

    try {
        const response = await sendToGemini(message, chatHistory, apiKey, PRODUCTS);

        // Remove loading message and add actual response
        const loadingMsg = document.getElementById(loadingId);
        if (loadingMsg) loadingMsg.remove();

        addMessageToUI('ai', response);

        // Update History
        chatHistory.push({ role: 'user', parts: [{ text: message }] });
        chatHistory.push({ role: 'model', parts: [{ text: response }] });

    } catch (error) {
        const loadingMsg = document.getElementById(loadingId);
        if (loadingMsg) {
            loadingMsg.innerText = `Error: ${error.message}. Please check if your key in .env or local storage is valid.`;
        }
        console.error(error);
    }
}

function addMessageToUI(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(role === 'user' ? 'user-message' : 'ai-message');

    const id = 'msg-' + Date.now();
    msgDiv.id = id;

    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function showNotification(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(99, 102, 241, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: fadeInOut 3s forwards;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);

    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.innerHTML = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, 20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                90% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// --- Event Listeners ---
function setupEventListeners() {
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);

    document.querySelector('.checkout-btn').addEventListener('click', openCheckout);
    document.getElementById('close-checkout').addEventListener('click', closeCheckout);
    document.getElementById('checkout-form').addEventListener('submit', window.processCheckout);

    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        document.getElementById('checkout-modal').classList.remove('active');
        overlay.classList.remove('active');
    });

    aiToggleBtn.addEventListener('click', toggleChat);
    closeAiBtn.addEventListener('click', toggleChat);

    saveApiKeyBtn.addEventListener('click', saveApiKey);

    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
}

// Start
document.addEventListener('DOMContentLoaded', init);
