// 1. Tombol Belanja Sekarang (Scroll ke bawah)
const turunKeBawah = () => {
    const target = document.getElementById('koleksi-produk');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
};

// 2. Tambah Produk ke Keranjang (Tanpa Pindah Halaman)
const pilihProduk = (nama, harga) => {
    // Ambil data keranjang atau buat array kosong jika belum ada
    let cart = JSON.parse(sessionStorage.getItem('zaloraCartList')) || [];

    // Cek apakah produk sudah ada di keranjang
    const item = cart.find(i => i.nama === nama);
    if (item) {
        item.qty += 1; // Jika ada, tambahkan jumlahnya
    } else {
        cart.push({ nama, harga, qty: 1 }); // Jika belum, masukkan produk baru
    }

    // Simpan kembali ke sessionStorage
    sessionStorage.setItem('zaloraCartList', JSON.stringify(cart));

    // Update angka di navbar & beri notifikasi
    updateCartCount();
    alert(`"${nama}" berhasil ditambahkan ke keranjang!`);
};

// 3. Update Angka di sebelah tulisan "Keranjang"
const updateCartCount = () => {
    const cart = JSON.parse(sessionStorage.getItem('zaloraCartList')) || [];
    const totalItem = cart.reduce((sum, item) => sum + item.qty, 0);
    
    const badge = document.getElementById('cartCount');
    if (badge) badge.innerText = totalItem;
};

// Jalankan otomatis saat halaman dimuat
document.addEventListener("DOMContentLoaded", updateCartCount);