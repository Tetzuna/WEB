/* =============================================
   ÉLUME PARFUM — JAVASCRIPT
   ============================================= */

// ---- Utility ----
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function showToast(msg, duration = 3000) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// =============================================
// NAVBAR — scroll effect + hamburger
// =============================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu= document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// =============================================
// PRODUCTS DATA
// =============================================
const products = [
  { id:1, name:'Velvet Rose',      scent:'Floral · Musk',      price:'Rp 450.000', emoji:'🌹', bg:'#f8e8e0', category:'women',  badge:'hot',    badgeText:'Hot' },
  { id:2, name:'Dark Oud',         scent:'Woody · Oriental',   price:'Rp 580.000', emoji:'🪵', bg:'#e8ddd0', category:'men',    badge:'',        badgeText:'' },
  { id:3, name:'Citrus Breeze',    scent:'Citrus · Aquatic',   price:'Rp 320.000', emoji:'🍋', bg:'#f8f0d0', category:'unisex', badge:'new',     badgeText:'New' },
  { id:4, name:'Midnight Iris',    scent:'Iris · Chypre',      price:'Rp 620.000', emoji:'💜', bg:'#ede0f8', category:'women',  badge:'limited', badgeText:'Limited' },
  { id:5, name:'Ocean Mist',       scent:'Aquatic · Fresh',    price:'Rp 380.000', emoji:'🌊', bg:'#d8eef8', category:'men',    badge:'new',     badgeText:'New' },
  { id:6, name:'Amber Saffron',    scent:'Oriental · Spicy',   price:'Rp 750.000', emoji:'🌾', bg:'#f8eed0', category:'unisex', badge:'limited', badgeText:'Limited' },
  { id:7, name:'Peony & Lace',     scent:'Floral · Powdery',   price:'Rp 420.000', emoji:'🌸', bg:'#fce8f0', category:'women',  badge:'',        badgeText:'' },
  { id:8, name:'Cedar & Smoke',    scent:'Woody · Leather',    price:'Rp 540.000', emoji:'🌲', bg:'#e0e8d8', category:'men',    badge:'',        badgeText:'' },
];

function renderProducts(filter = 'all') {
  const grid = $('productsGrid');
  grid.innerHTML = '';
  products.forEach(p => {
    const show = filter === 'all' || p.category === filter;
    const badgeHtml = p.badge
      ? `<span class="product-badge badge-${p.badge}">${p.badgeText}</span>`
      : '';
    const card = document.createElement('div');
    card.className = 'product-card' + (show ? '' : ' hidden');
    card.dataset.category = p.category;
    card.innerHTML = `
      <div class="product-img">
        <div class="product-img-bg" style="background:${p.bg}">${p.emoji}</div>
        ${badgeHtml}
        <button class="product-wishlist" aria-label="Wishlist">🤍</button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-scent">${p.scent}</div>
        <div class="product-footer">
          <div class="product-price">${p.price}</div>
          <button class="product-add" aria-label="Tambah ke keranjang">+</button>
        </div>
      </div>
    `;
    // Wishlist toggle
    card.querySelector('.product-wishlist').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const inWishlist = btn.textContent === '❤️';
      btn.textContent = inWishlist ? '🤍' : '❤️';
      showToast(inWishlist ? 'Dihapus dari wishlist' : `${p.name} ditambahkan ke wishlist ♥`);
    });
    // Add to cart
    card.querySelector('.product-add').addEventListener('click', e => {
      e.stopPropagation();
      showToast(`🛒 ${p.name} ditambahkan ke keranjang!`);
    });
    grid.appendChild(card);
  });
}

renderProducts();

// Filter tabs
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

// =============================================
// FORMS
// =============================================
$('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('✅ Berhasil didaftarkan! Cek email Anda.');
  e.target.reset();
});

$('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('✅ Pesan terkirim! Kami akan membalas segera.');
  e.target.reset();
});

// =============================================
// CHATBOT WIDGET
// =============================================

/* -- API Config -- */
const API_URL = 'http://localhost:7860/api/v1/run/4d366725-5888-4978-9e8a-9101e1c06d52';
const API_KEY  = 'sk-tzM4u1z59g7LVH74J7MImS1rBL4_VvxRJ5Qlkp1UtG8';

function generateSessionId() {
  // Use crypto.randomUUID if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// Keep a persistent session ID per page load
const SESSION_ID = generateSessionId();

/* -- DOM refs -- */
const chatWidget   = document.getElementById('chatWidget');
const chatToggle   = document.getElementById('chatToggle');
const chatWindow   = document.getElementById('chatWindow');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput    = document.getElementById('chatInput');
const chatSendBtn  = document.getElementById('chatSendBtn');
const chatBadge    = document.getElementById('chatBadge');
const quickReplies = document.getElementById('quickReplies');

/* -- Toggle open/close -- */
function openChat() {
  chatWidget.classList.add('open');
  chatBadge.classList.add('hidden');
  chatInput.focus();
}
function closeChat() {
  chatWidget.classList.remove('open');
}

chatToggle.addEventListener('click', () => {
  chatWidget.classList.contains('open') ? closeChat() : openChat();
});
chatCloseBtn.addEventListener('click', closeChat);

/* -- Scroll messages to bottom -- */
function scrollToBottom() {
  chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
}

/* -- Append a message bubble -- */
function appendMessage(text, role = 'bot') {
  const wrap = document.createElement('div');
  wrap.className = `chat-message ${role}`;

  const html = role === 'bot'
    ? `<div class="msg-avatar">É</div><div class="msg-bubble">${text}</div>`
    : `<div class="msg-bubble">${text}</div>`;
  wrap.innerHTML = html;

  chatMessages.appendChild(wrap);
  scrollToBottom();
  return wrap;
}

/* -- Typing indicator -- */
function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'typing-indicator';
  wrap.id = 'typingIndicator';
  wrap.innerHTML = `
    <div class="msg-avatar">É</div>
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>`;
  chatMessages.appendChild(wrap);
  scrollToBottom();
}
function hideTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

/* -- Quick replies -- */
if (quickReplies) {
  quickReplies.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.dataset.msg;
      quickReplies.remove();          // remove quick-reply buttons after first use
      sendMessage(msg);
    });
  });
}

/* -- Extract text from Langflow API response -- */
function extractBotText(data) {
  try {
    // Langflow v1 response shape:
    // data.outputs[0].outputs[0].results.message.text
    const text =
      data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
      data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
      data?.result ||
      data?.message ||
      null;

    if (text) return text;

    // Try to stringify for debugging
    return 'Maaf, saya tidak dapat memproses respons saat ini.';
  } catch {
    return 'Terjadi kesalahan saat memproses respons.';
  }
}

/* -- Send message to Langflow API -- */
async function sendToAPI(userMessage) {
  const payload = {
    output_type: 'chat',
    input_type:  'chat',
    input_value: userMessage,
    session_id:  SESSION_ID,
  };

  const response = await fetch(API_URL, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':     API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/* -- Main send function -- */
async function sendMessage(text) {
  const message = (text || chatInput.value).trim();
  if (!message) return;

  // Clear input & disable
  chatInput.value = '';
  chatInput.disabled = true;
  chatSendBtn.disabled = true;

  // Show user bubble
  appendMessage(message, 'user');

  // Show typing
  showTyping();

  try {
    const data = await sendToAPI(message);
    hideTyping();
    const botText = extractBotText(data);
    appendMessage(botText, 'bot');
  } catch (err) {
    hideTyping();
    console.error('Chat API error:', err);
    // Friendly fallback when API is unreachable
    const fallback = getFallbackReply(message);
    appendMessage(fallback, 'bot');
  } finally {
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    chatInput.focus();
  }
}

/* -- Fallback replies when API is offline -- */
function getFallbackReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('wanita') || m.includes('perempuan'))
    return 'Untuk wanita, kami merekomendasikan <strong>Velvet Rose</strong> (floral musk) dan <strong>Midnight Iris</strong> (iris chypre). Keduanya tahan lebih dari 10 jam! 🌹';
  if (m.includes('pria') || m.includes('laki'))
    return 'Untuk pria, coba <strong>Dark Oud</strong> (woody oriental) atau <strong>Ocean Mist</strong> (aquatic fresh). Maskulin dan elegan! 🌊';
  if (m.includes('harga') || m.includes('murah') || m.includes('mahal'))
    return 'Harga parfum Élume mulai dari <strong>Rp 320.000</strong> hingga <strong>Rp 750.000</strong> per botol (50ml). Ada pilihan travel size 10ml mulai <strong>Rp 95.000</strong>! 💰';
  if (m.includes('pesan') || m.includes('beli') || m.includes('order'))
    return 'Cara memesan: 1️⃣ Pilih produk di halaman ini, 2️⃣ Klik tombol "+", 3️⃣ Lanjut ke checkout. Kami juga melayani pemesanan via WhatsApp di <strong>+62 21 1234 5678</strong>.';
  if (m.includes('ongkir') || m.includes('kirim') || m.includes('pengiriman'))
    return 'Kami melayani pengiriman ke seluruh Indonesia! Gratis ongkir untuk pembelian di atas <strong>Rp 350.000</strong>. Estimasi 2–5 hari kerja. 📦';
  if (m.includes('unisex'))
    return 'Parfum unisex terpopuler kami: <strong>Citrus Breeze</strong> (segar & ringan) dan <strong>Amber Saffron</strong> (hangat & eksotis). Cocok untuk siapa saja! ✨';
  return 'Terima kasih telah menghubungi <strong>Élume Parfum</strong>! Saat ini asisten AI kami sedang offline. Silakan hubungi kami di <strong>hello@elumeparfum.id</strong> atau WhatsApp <strong>+62 21 1234 5678</strong>. 🌟';
}

/* -- Send on Enter key -- */
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/* -- Send button click -- */
chatSendBtn.addEventListener('click', () => sendMessage());

// =============================================
// INTERSECTION OBSERVER — fade-in sections
// =============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.product-card, .testimonial-card, .step, .feature, .contact-item'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  observer.observe(el);
});
