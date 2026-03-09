let db = [
    { id: 1, name: "Kabel HDMI Pro", cat: "Elektronik", status: "Tersedia", user: null, borrowTime: null },
    { id: 2, name: "Bola Basket Wilson", cat: "Olahraga", status: "Tersedia", user: null, borrowTime: null },
    { id: 3, name: "Proyektor Epson", cat: "Elektronik", status: "Tersedia", user: null, borrowTime: null }
];

let historyDb = [];
let selectedId = null;

// Fungsi Utama: Update Tampilan Daftar Barang
function updateUI() {
    const list = document.getElementById('itemList');
    if (!list) return;
    list.innerHTML = '';

    db.forEach(item => {
        const isAvail = item.status === "Tersedia";
        list.innerHTML += `
            <div class="item-card">
                <div style="flex:1">
                    <span class="tag ${isAvail ? 'available' : 'borrowed'}">
                        ${isAvail ? '✓ Tersedia' : '✗ Sedang Dipinjam'}
                    </span>
                    <h4 style="margin:5px 0">${item.name}</h4>
                    <p style="font-size:12px; color:#666; margin-bottom:5px;">${item.cat}</p>
                    ${!isAvail ? `
                        <div style="font-size:11px; color: #b91c1c; background: #fff1f2; padding: 8px; border-radius: 10px; margin-top:10px;">
                            <b>Peminjam:</b> ${item.user.name} (${item.user.class})<br>
                            <b>Waktu Pinjam:</b> ${item.borrowTime}
                        </div>
                    ` : ''}
                </div>
                <button class="btn-action ${isAvail ? 'btn-borrow' : 'btn-return'}" 
                        onclick="${isAvail ? `openModal(${item.id}, '${item.name}')` : `returnItem(${item.id})`}">
                    ${isAvail ? 'Pinjam' : 'Kembali'}
                </button>
            </div>
        `;
    });
}

// Navigasi Antar Halaman
function switchPage(page, el) {
    document.querySelectorAll('.main-content').forEach(p => p.classList.remove('active-page'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active-page');
    el.classList.add('active');
    if(page === 'history') renderHistory();
}

// Logika Modal
function openModal(id, name) {
    selectedId = id;
    document.getElementById('mHeader').innerText = "Pinjam " + name;
    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// Konfirmasi Peminjaman
function confirmLoan() {
    const data = {
        name: document.getElementById('bName').value,
        class: document.getElementById('bClass').value,
        nis: document.getElementById('bNis').value,
        phone: document.getElementById('bPhone').value
    };

    if(!data.name || !data.class || !data.nis || !data.phone) return alert("Mohon lengkapi semua data!");
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
    
    const idx = db.findIndex(i => i.id === selectedId);
    db[idx].status = "Dipinjam";
    db[idx].user = data;
    db[idx].borrowTime = timeString;
    
    closeModal();
    updateUI();
    
    // Reset input setelah berhasil
    ['bName','bClass','bNis','bPhone'].forEach(id => document.getElementById(id).value = '');
}

// Logika Pengembalian
function returnItem(id) {
    const idx = db.findIndex(i => i.id === id);
    const item = db[idx];
    const now = new Date();
    const returnTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
    
    // Simpan ke database riwayat
    historyDb.unshift({
        name: item.name,
        userName: item.user.name,
        userClass: item.user.class,
        borrowTime: item.borrowTime,
        returnTime: returnTime,
        date: now.toLocaleDateString('id-ID')
    });

    // Reset status barang
    db[idx].status = "Tersedia";
    db[idx].user = null;
    db[idx].borrowTime = null;
    
    alert("Barang dikembalikan! Data masuk ke riwayat.");
    updateUI();
}

// Render Halaman Riwayat
function renderHistory() {
    const hList = document.getElementById('historyList');
    if (!hList) return;
    if(historyDb.length === 0) {
        hList.innerHTML = '<p style="text-align: center; color: #999; margin-top: 50px;">Belum ada riwayat.</p>';
        return;
    }
    
    hList.innerHTML = '';
    historyDb.forEach(h => {
        hList.innerHTML += `
            <div class="history-card">
                <span class="tag history-tag">✓ Selesai</span>
                <h4 style="margin:5px 0">${h.name}</h4>
                <p style="font-size:12px">Peminjam: <b>${h.userName}</b> (${h.userClass})</p>
                <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #eee; font-size:11px; color:#666; display:flex; justify-content:space-between;">
                    <span>📅 ${h.date}</span>
                    <span>🕒 ${h.borrowTime} - ${h.returnTime}</span>
                </div>
            </div>
        `;
    });
}

// WhatsApp Darurat
function contactEmergency() {
    window.open(`https://wa.me/62881026200987?text=Bantuan darurat aplikasi Pinjam-In`, '_blank');
}

// Inisialisasi awal
window.onload = updateUI;