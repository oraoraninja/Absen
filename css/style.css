const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxmv-A1dEmCuFIRTyKyXIEjnbQoUaVHwCUmTJIQS_JVrRTRunJD5d4zOKDkC_sHBk7A/exec";

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

            if (btnSelfie) btnSelfie.style.display = "flex";
            if (btnUlang) btnUlang.style.display = "none";
            btnKamera.style.display = "none"; 
        } catch (err) {
            alert("Kamera tidak dapat diakses. Pastikan izin kamera telah diberikan.");
        }
    });
}

// 2. Ambil Selfie (Disesuaikan dengan Preview Kamera)
if (btnSelfie) {
    btnSelfie.addEventListener("click", function () {
        if (!stream) return;

        const context = canvas.getContext("2d");

        // Set ukuran canvas sesuai resolusi video asli
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Reset transformasi sebelumnya jika ada
        context.setTransform(1, 0, 0, 1, 0, 0);

        // Balikkan canvas secara horizontal agar persis seperti efek mirror pada video preview
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        // Gambar elemen video ke canvas yang telah dibalik
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas ke Base64 / URL Gambar
        fotoSelfieTerakhir = canvas.toDataURL("image/jpeg");

        // Tampilkan hasil foto dan sembunyikan video
        if (hasilFoto) {
            hasilFoto.src = fotoSelfieTerakhir;
            hasilFoto.style.display = "block";
        }
        if (video) video.style.display = "none";

        // Atur tampilan tombol
        if (btnSelfie) btnSelfie.style.display = "none";
        if (btnUlang) btnUlang.style.display = "flex";

        // Matikan stream kamera untuk menghemat daya
        stream.getTracks().forEach(track => track.stop());
    });
}

// 3. Ambil Ulang Foto
if (btnUlang) {
    btnUlang.addEventListener("click", function () {
        // Klik ulang akan memicu tombol aktifkan kamera kembali
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
// 7. ABSEN MASUK
// ===============================

const btnMasuk = document.getElementById("btnMasuk");
if (btnMasuk) {
    btnMasuk.addEventListener("click", function () {
        const nama = document.getElementById("nama")?.value.trim() || "";
        const tanggal = document.getElementById("tanggalAbsen")?.value || "";
        const masuk = document.getElementById("jamMasuk")?.value || "";
        const status = document.getElementById("status")?.value || "";
        const alasan = document.getElementById("alasan")?.value.trim() || "";

        if (nama === "") { alert("Silakan masukkan nama pegawai."); return; }
        if (status === "Hadir" && masuk === "") { alert("Jam masuk harus diisi."); return; }
        if (!fotoSelfieTerakhir) { alert("Silakan ambil foto selfie terlebih dahulu."); return; }

        const hasilKeterlambatan = cekKeterlambatan(masuk);
        btnMasuk.disabled = true;
        btnMasuk.innerText = "Mengirim Data...";

        const formData = new URLSearchParams();
        formData.append("jenisAbsen", "Absen Masuk");
        formData.append("nama", nama);
        formData.append("tanggal", tanggal);
        formData.append("jamMasuk", masuk);
        formData.append("jamPulang", "-");
        formData.append("status", status);
        formData.append("kehadiran", hasilKeterlambatan);
        formData.append("lokasi", lokasiTerkini);
        formData.append("alasan", alasan || "-");
        formData.append("fotoSelfie", fotoSelfieTerakhir);

        fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        })
        .then(() => {
            btnMasuk.disabled = false;
            btnMasuk.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Absen Masuk';
            
            const elHasil = document.getElementById("hasil");
            if (elHasil) {
                elHasil.innerHTML = `
                    <b style="color:#16a34a;">ABSEN MASUK BERHASIL & TERSIMPAN</b><br><br>
                    <img src="${fotoSelfieTerakhir}" style="width:200px; height:200px; object-fit:cover; display:block; border-radius:15px; border:3px solid #2563eb; margin-bottom:15px;">
                    <b>Nama:</b> ${nama}<br>
                    <b>Tanggal:</b> ${tanggal}<br>
                    <b>Jam Masuk:</b> ${masuk}<br>
                    <b>Status:</b> ${status}<br>
                    <b>Kehadiran:</b> ${hasilKeterlambatan}<br>
                    <b>Lokasi:</b> ${lokasiTerkini}<br>
                    <b>Alasan:</b> ${alasan || "-"}
                `;
            }
            const elStatusHari = document.getElementById("statusHari");
            if (elStatusHari) elStatusHari.innerHTML = "🟡 Sudah Absen Masuk";
        })
        .catch(err => {
            btnMasuk.disabled = false;
            btnMasuk.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Absen Masuk';
            alert("Gagal mengirim data. Silakan coba lagi.");
        });
    });
}


// ===============================
// 8. ABSEN PULANG
// ===============================

const btnPulang = document.getElementById("btnPulang");
if (btnPulang) {
    btnPulang.addEventListener("click", function () {
        const nama = document.getElementById("nama")?.value.trim() || "";
        const masuk = document.getElementById("jamMasuk")?.value || "";
        const pulang = document.getElementById("jamPulang")?.value || "";

        if (nama === "") { alert("Silakan masukkan nama pegawai."); return; }
        if (pulang === "") { alert("Jam pulang harus diisi."); return; }
        if (masuk !== "" && pulang < masuk) { alert("Jam pulang tidak boleh lebih awal dari jam masuk."); return; }
        if (!fotoSelfieTerakhir) { alert("Silakan ambil foto selfie untuk absen pulang."); return; }

        btnPulang.disabled = true;
        btnPulang.innerText = "Mengirim Data...";

        const formData = new URLSearchParams();
        formData.append("jenisAbsen", "Absen Pulang");
        formData.append("nama", nama);
        formData.append("tanggal", document.getElementById("tanggalAbsen")?.value || "");
        formData.append("jamMasuk", masuk || "-");
        formData.append("jamPulang", pulang);
        formData.append("status", document.getElementById("status")?.value || "");
        formData.append("kehadiran", "-");
        formData.append("lokasi", lokasiTerkini);
        formData.append("alasan", "-");
        formData.append("fotoSelfie", fotoSelfieTerakhir);

        fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        })
        .then(() => {
            btnPulang.disabled = false;
            btnPulang.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Absen Pulang';

            const elHasil = document.getElementById("hasil");
            if (elHasil) {
                elHasil.innerHTML += `
                    <hr style="margin: 15px 0; border: 0; border-top: 1px dashed #ccc;">
                    <b style="color:#2563eb;">ABSEN PULANG BERHASIL & TERSIMPAN</b><br><br>
                    <img src="${fotoSelfieTerakhir}" style="width:150px; height:150px; object-fit:cover; display:block; border-radius:15px; border:3px solid #2563eb; margin-bottom:15px;">
                    <b>Jam Pulang:</b> ${pulang}<br>
                    <b>Lokasi Pulang:</b> ${lokasiTerkini}
                `;
            }
            const elStatusHari = document.getElementById("statusHari");
            if (elStatusHari) elStatusHari.innerHTML = "🔵 Sudah Absen Pulang";
        })
        .catch(err => {
            btnPulang.disabled = false;
            btnPulang.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Absen Pulang';
            alert("Gagal mengirim data.");
        });
    });
}
