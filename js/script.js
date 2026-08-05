const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLmyIL4VfU9utOkrz6VdJmMLY937fPxHSjLU-auQlSJ_vOPfRhLcNxCulA-FRf-Z95/exec";

// ===============================
// FUNGSI UPDATE TAMPILAN STATUS & LOCAL STORAGE
// ===============================
function updateStatusTampilan(teksStatus, iconEmoji = "🟢") {
    // 1. Update Teks Status Hari Ini
    const elStatusHari = document.getElementById("statusHari");
    if (elStatusHari) {
        elStatusHari.textContent = teksStatus;
    }

    // 2. Update Icon Emoji (misal: 🟢 untuk masuk, 🔵 untuk pulang)
    const elStatusIcon = document.querySelector(".status-icon");
    if (elStatusIcon) {
        elStatusIcon.textContent = iconEmoji;
    }

    // 3. Simpan ke localStorage berdasarkan tanggal hari ini
    const hariIniStr = new Date().toISOString().split('T')[0];
    localStorage.setItem("statusAbsen_" + hariIniStr, JSON.stringify({
        teks: teksStatus,
        icon: iconEmoji
    }));
}

// Muat status tersimpan dari localStorage saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    const hariIniStr = new Date().toISOString().split('T')[0];
    const savedData = localStorage.getItem("statusAbsen_" + hariIniStr);
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            updateStatusTampilan(parsed.teks, parsed.icon);
        } catch (e) {
            console.error("Gagal membaca status tersimpan", e);
        }
    }
});


// ===============================
// 1. TANGGAL & JAM SEKARANG (REALTIME)
// ===============================
function updateTanggalJam() {
    const sekarang = new Date();

    const elTanggal = document.getElementById("tanggalSekarang");
    const elJam = document.getElementById("jamSekarang");

    if (elTanggal) {
        elTanggal.textContent = sekarang.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    if (elJam) {
        elJam.textContent = sekarang.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    }
}

setInterval(updateTanggalJam, 1000);
updateTanggalJam();


// ===============================
// 2. TANGGAL ABSENSI & ALASAN
// ===============================
const inputTanggal = document.getElementById("tanggalAbsen");
const hariIni = new Date();
const yyyy = hariIni.getFullYear();
const mm = String(hariIni.getMonth() + 1).padStart(2, "0");
const dd = String(hariIni.getDate()).padStart(2, "0");
const tanggalHariIni = `${yyyy}-${mm}-${dd}`;

if (inputTanggal) {
    inputTanggal.value = tanggalHariIni;
    inputTanggal.max = tanggalHariIni;

    // Tampilkan kolom alasan jika memilih tanggal kemarin/lampau
    inputTanggal.addEventListener("change", function () {
        const alasanGroup = document.getElementById("alasanGroup");
        if (alasanGroup) {
            if (this.value < tanggalHariIni) {
                alasanGroup.style.display = "block";
            } else {
                alasanGroup.style.display = "none";
            }
        }
    });
}


// ===============================
// 3. STATUS KETERLAMBATAN
// ===============================
function cekKeterlambatan(jamMasuk) {
    if (!jamMasuk) return "-";
    if (jamMasuk <= "08:31") {
        return "Tepat Waktu";
    }
    if (jamMasuk <= "09:01") {
        return "Terlambat";
    }
    return "Sangat Terlambat";
}


// ===============================
// 4. LOKASI GEOLOCATION
// ===============================
let lokasiTerkini = "Belum diambil";

function muatLokasiOtomatis() {
    const elLokasi = document.getElementById("lokasi");
    if (!elLokasi) return;

    if (!navigator.geolocation) {
        elLokasi.textContent = "GPS tidak didukung";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            lokasiTerkini = `${lat}, ${lng}`;
            elLokasi.textContent = lokasiTerkini;
        },
        function (error) {
            elLokasi.textContent = "Gagal mengambil lokasi";
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

muatLokasiOtomatis();


// ===============================
// 5. FITUR KAMERA & SELFIE
// ===============================
let stream = null;
let fotoSelfieTerakhir = null;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const hasilFoto = document.getElementById("hasilFoto");

const btnKamera = document.getElementById("btnKamera");
const btnSelfie = document.getElementById("btnSelfie");
const btnUlang = document.getElementById("btnUlang");
const placeholder = document.getElementById("cameraPlaceholder");

// 1. Aktifkan Kamera
if (btnKamera) {
    btnKamera.addEventListener("click", async function () {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            });

            if (video) {
                video.srcObject = stream;
                video.style.display = "block";
            }
            if (hasilFoto) hasilFoto.style.display = "none";
            if (placeholder) placeholder.style.display = "none";

            if (btnSelfie) btnSelfie.style.display = "inline-flex";
            if (btnUlang) btnUlang.style.display = "none";
            btnKamera.style.display = "none"; 
        } catch (err) {
            alert("Kamera tidak dapat diakses. Pastikan izin kamera telah diberikan.");
        }
    });
}

// 2. Ambil Selfie
if (btnSelfie) {
    btnSelfie.addEventListener("click", function () {
        if (!stream) return;

        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        fotoSelfieTerakhir = canvas.toDataURL("image/jpeg");

        if (hasilFoto) {
            hasilFoto.src = fotoSelfieTerakhir;
            hasilFoto.style.display = "block";
        }
        if (video) video.style.display = "none";

        if (btnSelfie) btnSelfie.style.display = "none";
        if (btnUlang) btnUlang.style.display = "inline-flex";

        stream.getTracks().forEach(track => track.stop());
    });
}

// 3. Ambil Ulang Foto
if (btnUlang) {
    btnUlang.addEventListener("click", function () {
        if (btnKamera) btnKamera.click();
    });
}


// ===============================
// 6. ISIAN JAM OTOMATIS
// ===============================
function waktuSekarang() {
    const sekarang = new Date();
    let jam = sekarang.getHours().toString().padStart(2, '0');
    let menit = sekarang.getMinutes().toString().padStart(2, '0');
    return `${jam}:${menit}`;
}

const btnNowMasuk = document.getElementById("btnNowMasuk");
if (btnNowMasuk) {
    btnNowMasuk.addEventListener("click", function () {
        const elJamMasuk = document.getElementById("jamMasuk");
        if (elJamMasuk) elJamMasuk.value = waktuSekarang();
    });
}

const btnNowPulang = document.getElementById("btnNowPulang");
if (btnNowPulang) {
    btnNowPulang.addEventListener("click", function () {
        const elJamPulang = document.getElementById("jamPulang");
        if (elJamPulang) elJamPulang.value = waktuSekarang();
    });
}


// ===============================
// 7. PROSES ABSEN MASUK
// ===============================
const btnMasuk = document.getElementById("btnMasuk");
if (btnMasuk) {
  btnMasuk.addEventListener("click", function () {
    const nama = document.getElementById("nama")?.value.trim() || "";
    const jabatan = document.getElementById("jabatan")?.value.trim() || "";
    const status = document.getElementById("status")?.value || "";
    const tanggal = document.getElementById("tanggalAbsen")?.value || "";
    const jamMasuk = document.getElementById("jamMasuk")?.value || "";
    const alasan = document.getElementById("alasan")?.value.trim() || "";
    const keterangan = document.getElementById("keterangan")?.value.trim() || "";

    if (nama === "") { alert("Silakan masukkan nama pegawai."); return; }
    if (status === "Hadir" && jamMasuk === "") { alert("Jam masuk harus diisi."); return; }

    const hasilKehadiran = cekKeterlambatan(jamMasuk);

    btnMasuk.disabled = true;
    btnMasuk.innerText = "Mengirim Data...";

    const formData = new URLSearchParams();
    formData.append("jenisAbsen", "Absen Masuk");
    formData.append("nama", nama);
    formData.append("jabatan", jabatan || "-");
    formData.append("tanggal", tanggal);
    formData.append("jamMasuk", jamMasuk);
    formData.append("jamPulang", "-");
    formData.append("status", status);
    formData.append("keterangan", keterangan || "-");
    formData.append("kehadiran", hasilKehadiran);
    formData.append("lokasi", lokasiTerkini);
    formData.append("alasan", alasan || "-");
    formData.append("fotoSelfie", fotoSelfieTerakhir || "-");

    fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    })
    .then(res => res.json())
    .then(data => {
      btnMasuk.disabled = false;
      btnMasuk.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Absen Masuk';
      
      // Update elemen status pada HTML
      const statusText = `Sudah Absen Masuk (${jamMasuk || "Masuk"})`;
      updateStatusTampilan(statusText, "🟢");

      const elHasil = document.getElementById("hasil");
      if (elHasil) elHasil.innerText = `Absen Masuk Berhasil pada jam ${jamMasuk}`;

      alert("Absen Masuk Berhasil!");
    })
    .catch(err => {
      btnMasuk.disabled = false;
      btnMasuk.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Absen Masuk';
      alert("Gagal mengirim data. Silakan coba lagi.");
    });
  });
}

// ===============================
// 8. PROSES ABSEN PULANG
// ===============================
const btnPulang = document.getElementById("btnPulang");
if (btnPulang) {
  btnPulang.addEventListener("click", function () {
    const nama = document.getElementById("nama")?.value.trim() || "";
    const jabatan = document.getElementById("jabatan")?.value.trim() || "";
    const status = document.getElementById("status")?.value || "";
    const tanggal = document.getElementById("tanggalAbsen")?.value || "";
    const jamMasuk = document.getElementById("jamMasuk")?.value || "-";
    const jamPulang = document.getElementById("jamPulang")?.value || "";
    const keterangan = document.getElementById("keterangan")?.value.trim() || "";

    if (nama === "") { alert("Silakan masukkan nama pegawai."); return; }
    if (jamPulang === "") { alert("Jam pulang harus diisi."); return; }

    btnPulang.disabled = true;
    btnPulang.innerText = "Mengirim Data...";

    const formData = new URLSearchParams();
    formData.append("jenisAbsen", "Absen Pulang");
    formData.append("nama", nama);
    formData.append("jabatan", jabatan || "-");
    formData.append("tanggal", tanggal);
    formData.append("jamMasuk", jamMasuk);
    formData.append("jamPulang", jamPulang);
    formData.append("status", status);
    formData.append("keterangan", keterangan || "-");
    formData.append("kehadiran", "-");
    formData.append("lokasi", lokasiTerkini);
    formData.append("alasan", "-");
    formData.append("fotoSelfie", fotoSelfieTerakhir || "-");

    fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    })
    .then(res => res.json())
    .then(data => {
      btnPulang.disabled = false;
      btnPulang.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Absen Pulang';
      
      // Update elemen status pada HTML
      const statusText = `Sudah Absen Pulang (${jamPulang})`;
      updateStatusTampilan(statusText, "🔵");

      const elHasil = document.getElementById("hasil");
      if (elHasil) elHasil.innerText = `Absen Pulang Berhasil pada jam ${jamPulang}`;

      alert("Absen Pulang Berhasil!");
    })
    .catch(err => {
      btnPulang.disabled = false;
      btnPulang.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Absen Pulang';
      alert("Gagal mengirim data.");
    });
  });
}
