/* =============================================
   VESTI FASHION — JAVASCRIPT
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
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

// =============================================
// NAVBAR
// =============================================
const navbar     = $('navbar');
const hamburger  = $('hamburger');
const mobileMenu = $('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// =============================================
// CART STATE
// =============================================
let cart = [];

function cartTotal() {
  return cart.reduce((sum, item) => {
    const num = parseInt(item.price.replace(/\D/g, ''), 10);
    return sum + num;
  }, 0);
}

function formatRp(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

function updateCartCount() {
  const el = $('cartCount');
  el.textContent = cart.length;
  el.classList.toggle('zero', cart.length === 0);
}

function renderCartDrawer() {
  const body   = $('cartDrawerBody');
  const footer = $('cartDrawerFooter');
  const total  = $('cartTotal');

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div style="font-size:3rem">🛒</div>
        <p>Keranjang kamu masih kosong</p>
        <a href="#products" class="btn btn-dark" id="startShoppingBtn">Mulai Belanja</a>
      </div>`;
    footer.style.display = 'none';
    // re-bind start shopping button
    const ssBtn = $('startShoppingBtn');
    if (ssBtn) ssBtn.addEventListener('click', closeCart);
  } else {
    body.innerHTML = cart.map((item, idx) => `
      <div class="cart-item">
        <div class="cart-item-img" style="background:${item.bg}">${item.emoji}</div>
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>${item.type}</span>
        </div>
        <div class="cart-item-price">${item.price}</div>
        <button class="cart-item-remove" data-idx="${idx}">✕</button>
      </div>`).join('');
    footer.style.display = 'flex';
    total.textContent = 'Total: ' + formatRp(cartTotal());

    body.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const removed = cart.splice(idx, 1)[0];
        updateCartCount();
        renderCartDrawer();
        showToast(`🗑️ ${removed.name} dihapus dari keranjang`);
      });
    });
  }
}

function openCart() {
  $('cartDrawer').classList.add('open');
  $('cartOverlay').classList.add('open');
  renderCartDrawer();
}
function closeCart() {
  $('cartDrawer').classList.remove('open');
  $('cartOverlay').classList.remove('open');
}

$('cartBtn').addEventListener('click', openCart);
$('cartDrawerClose').addEventListener('click', closeCart);
$('cartOverlay').addEventListener('click', closeCart);
$('checkoutBtn').addEventListener('click', () => {
  closeCart();
  showToast('✅ Terima kasih! Pesanan kamu sedang diproses.', 4000);
  cart = [];
  updateCartCount();
  renderCartDrawer();
});

// =============================================
// PRODUCTS DATA
// =============================================
const products = [
  { id:1,  name:'Floral Summer Dress',  type:'Dress · Wanita',    price:'Rp 185.000', emoji:'👗', bg:'#fce8f4', category:'wanita',    badge:'hot',    badgeText:'Hot',      sizes:['S','M','L','XL'],    priceOld:'Rp 230.000' },
  { id:2,  name:'Oxford Button Shirt',  type:'Kemeja · Pria',     price:'Rp 165.000', emoji:'👔', bg:'#dce8f8', category:'pria',      badge:'',        badgeText:'',         sizes:['M','L','XL','XXL'],  priceOld:'' },
  { id:3,  name:'Slim Chino Pants',     type:'Celana · Pria',     price:'Rp 210.000', emoji:'👖', bg:'#e8e8e8', category:'pria',      badge:'new',     badgeText:'New',      sizes:['28','30','32','34'], priceOld:'' },
  { id:4,  name:'Oversized Hoodie',     type:'Hoodie · Unisex',   price:'Rp 245.000', emoji:'🧥', bg:'#e8f0d8', category:'wanita',    badge:'',        badgeText:'',         sizes:['S','M','L','XL'],    priceOld:'' },
  { id:5,  name:'Mini Pleated Skirt',   type:'Rok · Wanita',      price:'Rp 135.000', emoji:'🩱', bg:'#f8dce8', category:'wanita',    badge:'sale',    badgeText:'Sale',     sizes:['S','M','L'],         priceOld:'Rp 195.000' },
  { id:6,  name:'Linen Blazer',         type:'Blazer · Pria',     price:'Rp 320.000', emoji:'🧳', bg:'#f0e8d8', category:'pria',      badge:'limited', badgeText:'Limited',  sizes:['M','L','XL'],        priceOld:'' },
  { id:7,  name:'Kids Dino Tee',        type:'Kaos · Anak',       price:'Rp 85.000',  emoji:'🦕', bg:'#d8f8e8', category:'anak',      badge:'new',     badgeText:'New',      sizes:['2','4','6','8'],     priceOld:'' },
  { id:8,  name:'Tote Canvas Bag',      type:'Tas · Aksesoris',   price:'Rp 95.000',  emoji:'👜', bg:'#f8f0d8', category:'aksesoris', badge:'',        badgeText:'',         sizes:[],                    priceOld:'' },
  { id:9,  name:'Ribbed Crop Top',      type:'Atasan · Wanita',   price:'Rp 95.000',  emoji:'👙', bg:'#f8e8f8', category:'wanita',    badge:'sale',    badgeText:'Sale',     sizes:['S','M','L'],         priceOld:'Rp 140.000' },
  { id:10, name:'Cargo Shorts',         type:'Celana · Pria',     price:'Rp 155.000', emoji:'🩳', bg:'#e8f4e8', category:'pria',      badge:'',        badgeText:'',         sizes:['30','32','34'],      priceOld:'' },
  { id:11, name:'Kids Rainbow Dress',   type:'Dress · Anak',      price:'Rp 110.000', emoji:'🌈', bg:'#fff0d8', category:'anak',      badge:'hot',     badgeText:'Hot',      sizes:['4','6','8','10'],    priceOld:'' },
  { id:12, name:'Baseball Cap',         type:'Topi · Aksesoris',  price:'Rp 75.000',  emoji:'🧢', bg:'#d8e8f8', category:'aksesoris', badge:'',        badgeText:'',         sizes:['Free Size'],         priceOld:'' },
];

function renderProducts(filter = 'all') {
  const grid = $('productsGrid');
  grid.innerHTML = '';

  const list = filter === 'all' ? products : products.filter(p => p.category === filter || (filter === 'sale' && p.badge === 'sale'));

  list.forEach(p => {
    const badgeHtml = p.badge
      ? `<span class="product-badge badge-${p.badge}">${p.badgeText}</span>`
      : '';
    const sizesHtml = p.sizes.length
      ? `<div class="product-sizes">${p.sizes.map(s => `<span class="size-chip">${s}</span>`).join('')}</div>`
      : '';
    const oldPriceHtml = p.priceOld
      ? `<span class="product-price-old">${p.priceOld}</span>`
      : '';

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = p.category;
    card.innerHTML = `
      <div class="product-img">
        <div class="product-img-bg" style="background:${p.bg}">${p.emoji}</div>
        ${badgeHtml}
        <button class="product-wishlist" aria-label="Wishlist">🤍</button>
        ${sizesHtml}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-type">${p.type}</div>
        <div class="product-footer">
          <div class="price-wrap">
            <div class="product-price">${p.price}</div>
            ${oldPriceHtml}
          </div>
          <button class="product-add" aria-label="Tambah ke keranjang">+</button>
        </div>
      </div>
    `;

    // Wishlist
    card.querySelector('.product-wishlist').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const inWl = btn.textContent === '❤️';
      btn.textContent = inWl ? '🤍' : '❤️';
      showToast(inWl ? `💔 ${p.name} dihapus dari wishlist` : `❤️ ${p.name} ditambahkan ke wishlist!`);
    });

    // Add to cart
    card.querySelector('.product-add').addEventListener('click', e => {
      e.stopPropagation();
      cart.push(p);
      updateCartCount();
      showToast(`🛒 <strong>${p.name}</strong> ditambahkan ke keranjang!`);
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

// Category cards link to filter
$$('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    const filter = card.dataset.filter;
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      $$('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === filter);
      });
      renderProducts(filter);
    }, 400);
  });
});

// =============================================
// COUNTDOWN TIMER
// =============================================
let countdownEnd = Date.now() + (8 * 3600 + 45 * 60) * 1000;

function updateCountdown() {
  const diff = Math.max(0, countdownEnd - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = n => String(n).padStart(2, '0');
  const hEl = $('cdHour'), mEl = $('cdMin'), sEl = $('cdSec');
  if (hEl) hEl.textContent = pad(h);
  if (mEl) mEl.textContent = pad(m);
  if (sEl) sEl.textContent = pad(s);
  if (diff === 0) countdownEnd = Date.now() + 24 * 3600000;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// =============================================
// FORMS
// =============================================
$('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('🎉 Voucher Rp 50.000 sudah dikirim ke email kamu!', 4000);
  e.target.reset();
});

$('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('✅ Pesan terkirim! Tim kami akan membalas dalam 1×24 jam.', 4000);
  e.target.reset();
});

// =============================================
// CHATBOT
// =============================================
const API_URL = 'http://localhost:7860/api/v1/run/4d366725-5888-4978-9e8a-9101e1c06d52';
const API_KEY  = 'sk-tzM4u1z59g7LVH74J7MImS1rBL4_VvxRJ5Qlkp1UtG8';

function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
const SESSION_ID = generateSessionId();

const chatWidget   = $('chatWidget');
const chatToggle   = $('chatToggle');
const chatWindow   = $('chatWindow');
const chatCloseBtn = $('chatCloseBtn');
const chatMessages = $('chatMessages');
const chatInput    = $('chatInput');
const chatSendBtn  = $('chatSendBtn');
const chatBadge    = $('chatBadge');
const quickReplies = $('quickReplies');

function openChatWidget() {
  chatWidget.classList.add('open');
  chatBadge.classList.add('hidden');
  chatInput.focus();
}
function closeChatWidget() {
  chatWidget.classList.remove('open');
}

chatToggle.addEventListener('click', () => {
  chatWidget.classList.contains('open') ? closeChatWidget() : openChatWidget();
});
chatCloseBtn.addEventListener('click', closeChatWidget);

function scrollChatToBottom() {
  chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
}

function appendMessage(text, role = 'bot') {
  const wrap = document.createElement('div');
  wrap.className = `chat-message ${role}`;
  wrap.innerHTML = role === 'bot'
    ? `<div class="msg-avatar">V</div><div class="msg-bubble">${text}</div>`
    : `<div class="msg-bubble">${text}</div>`;
  chatMessages.appendChild(wrap);
  scrollChatToBottom();
}

function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'typing-indicator';
  wrap.id = 'typingIndicator';
  wrap.innerHTML = `
    <div class="msg-avatar">V</div>
    <div class="typing-dots"><span></span><span></span><span></span></div>`;
  chatMessages.appendChild(wrap);
  scrollChatToBottom();
}
function hideTyping() {
  const t = $('typingIndicator');
  if (t) t.remove();
}

if (quickReplies) {
  quickReplies.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.dataset.msg;
      quickReplies.remove();
      sendMessage(msg);
    });
  });
}

function extractBotText(data) {
  try {
    return (
      data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
      data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
      data?.result ||
      data?.message ||
      'Maaf, saya tidak dapat memproses respons saat ini.'
    );
  } catch {
    return 'Terjadi kesalahan saat memproses respons.';
  }
}

async function sendToAPI(userMessage) {
  const payload = {
    output_type: 'chat',
    input_type:  'chat',
    input_value: userMessage,
    session_id:  SESSION_ID,
  };
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function sendMessage(text) {
  const message = (text || chatInput.value).trim();
  if (!message) return;

  chatInput.value = '';
  chatInput.disabled = true;
  chatSendBtn.disabled = true;

  appendMessage(message, 'user');
  showTyping();

  try {
    const data = await sendToAPI(message);
    hideTyping();
    appendMessage(extractBotText(data), 'bot');
  } catch (err) {
    hideTyping();
    console.error('Chat API error:', err);
    appendMessage(getFallbackReply(message), 'bot');
  } finally {
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    chatInput.focus();
  }
}

function getFallbackReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('wanita') || m.includes('perempuan') || m.includes('cewek'))
    return 'Untuk wanita, koleksi terpopuler kami adalah <strong>Floral Summer Dress</strong>, <strong>Ribbed Crop Top</strong>, dan <strong>Mini Pleated Skirt</strong>. Semuanya lagi diskon lho! 👗✨';
  if (m.includes('pria') || m.includes('laki') || m.includes('cowok'))
    return 'Untuk pria, coba <strong>Slim Chino Pants</strong>, <strong>Oxford Button Shirt</strong>, atau <strong>Linen Blazer</strong> untuk tampilan yang rapi dan modern. 👔';
  if (m.includes('anak'))
    return 'Koleksi anak kami imut-imut dan nyaman! Ada <strong>Kids Dino Tee</strong> dan <strong>Kids Rainbow Dress</strong> dengan bahan lembut yang aman untuk kulit si kecil. 🧒🌈';
  if (m.includes('ukuran') || m.includes('size') || m.includes('panduan'))
    return 'Panduan ukuran VESTI:<br>• <b>S</b>: Lingkar dada 80-84 cm<br>• <b>M</b>: 85-89 cm<br>• <b>L</b>: 90-94 cm<br>• <b>XL</b>: 95-99 cm<br>Ragu? Chat CS kami di WhatsApp +62 812 3456 7890! 📏';
  if (m.includes('harga') || m.includes('murah') || m.includes('diskon') || m.includes('promo') || m.includes('sale'))
    return 'Ada <strong>Flash Sale up to 70% off</strong> sekarang! Harga mulai dari <strong>Rp 75.000</strong>. Gunakan voucher <b>VESTI50</b> untuk diskon tambahan Rp 50.000 pada pembelian pertama! 🏷️';
  if (m.includes('ongkir') || m.includes('kirim') || m.includes('pengiriman'))
    return 'Gratis ongkir untuk pembelian di atas <strong>Rp 300.000</strong>! Estimasi pengiriman 1–3 hari kerja (Jawa) dan 3–7 hari (luar Jawa). Tersedia COD & semua jasa pengiriman. 📦';
  if (m.includes('retur') || m.includes('kembali') || m.includes('refund'))
    return 'VESTI punya <strong>garansi retur 30 hari</strong> — gratis ongkir retur! Syaratnya: produk belum dicuci, tag masih terpasang. Proses refund 3–5 hari kerja. ↩️';
  if (m.includes('bayar') || m.includes('payment') || m.includes('cod'))
    return 'Metode pembayaran yang kami terima: <strong>COD, Transfer Bank, GoPay, OVO, Dana, ShopeePay, QRIS</strong>. Pembayaran 100% aman dan terjamin! 💳';
  return 'Hai! 👋 Saya asisten VESTI. Saat ini AI saya sedang offline. Silakan hubungi CS kami via WhatsApp <strong>+62 812 3456 7890</strong> atau email <strong>hello@vesti.id</strong>. Kami siap membantu 08.00–21.00 WIB! 🛍️';
}

chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
chatSendBtn.addEventListener('click', () => sendMessage());

// =============================================
// INTERSECTION OBSERVER — fade in
// =============================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.product-card, .testimonial-card, .step, .feature, .contact-item, .cat-card, .about-stat'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
