// =============================
// 1. FOTO SLIDER
// Ganti nama file sesuai foto milikmu di folder images.
// =============================
const photos = [
  "images/foto-1.jpeg",
  "images/foto-2.jpeg",
  "images/foto-3.jpeg",
  "images/foto-4.jpeg",
  "images/foto-5.jpeg"
];
let currentPhoto = 0;
const slideImage = document.getElementById("slideImage");
const slideCount = document.getElementById("slideCount");

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  slideImage.style.opacity = "0";
  setTimeout(() => {
    slideImage.src = photos[currentPhoto];
    slideImage.style.opacity = "1";
    slideCount.textContent = `${String(currentPhoto + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
  }, 180);
}
document.getElementById("prevSlide").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.getElementById("nextSlide").addEventListener("click", () => showPhoto(currentPhoto + 1));
// Ganti 5000 untuk mengubah jeda otomatis (milidetik).
setInterval(() => showPhoto(currentPhoto + 1), 5000);

// =============================
// 2. 
/* =================================
   PLAYLIST + FLOATING MUSIC PLAYER
   Keduanya menggunakan satu audio
================================= */


const tracks = [
    {
        title: "A Sorrowful Reunion",
        artist: "Reality Club",
        src: "music/lagu-1.mp3",
        cover: "images/cover-1.jpeg"
    },
    {
        title: "2112",
        artist: "Reality Club",
        src: "music/lagu-2.mp3",
        cover: "images/cover-2.jpeg"
    },
    {
        title: "Love Epiphany",
        artist: "Reality Club",
        src: "music/lagu-3.mp3",
        cover: "images/cover-3.jpeg"
    },
    {
        title: "Untuk Apa/Untuk Apa?",
        artist: "Hindia",
        src: "music/lagu-4.mp3",
        cover: "images/cover-4.jpeg"
    }
];


let currentTrack = 0;

// SATU AUDIO UNTUK KEDUA PLAYER
const audio = document.getElementById("audioPlayer");

// Playlist utama
const playPause = document.getElementById("playPause");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const playlist = document.getElementById("playlist");
const progress = document.getElementById("progress");

// Floating player
const musicTitle = document.getElementById("musicTitle");
const musicArtist = document.getElementById("musicArtist");
const playMusic = document.getElementById("playMusic");
const prevMusic = document.getElementById("prevMusic");
const nextMusic = document.getElementById("nextMusic");
const musicProgress = document.getElementById("musicProgress");

const floatingPlayer = document.getElementById("floatingMusicPlayer");
const minimizeMusic = document.getElementById("minimizeMusic");
const openMusic = document.getElementById("openMusic");

// Waktu lagu
const mainCurrentTime = document.getElementById("currentTime");
const mainDuration = document.getElementById("duration");
const miniCurrentTime = document.getElementById("miniCurrentTime");
const miniDuration = document.getElementById("miniDuration");

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");

    return `${min}:${sec}`;
}

// Memuat lagu yang sama ke kedua tampilan
function loadTrack(index, autoplay = false) {
    currentTrack = (index + tracks.length) % tracks.length;

    const track = tracks[currentTrack];

    audio.src = track.src;

    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;

// Mengubah cover besar playlist
const mainCover = document.querySelector(".music-art");

if (mainCover) {
    mainCover.style.backgroundImage = `url("${track.cover}")`;
    mainCover.classList.add("has-cover");
}

// Mengubah cover floating music player
const miniCover = document.querySelector(".floating-music-player .music-cover");

if (miniCover) {
    miniCover.style.backgroundImage = `url("${track.cover}")`;
    miniCover.classList.add("has-cover");
}

// Memastikan foto mini menggunakan gambar penuh


    musicTitle.textContent = track.title;
    musicArtist.textContent = track.artist;

    progress.value = 0;
    musicProgress.value = 0;

    mainCurrentTime.textContent = "0:00";
    miniCurrentTime.textContent = "0:00";

    mainDuration.textContent = "0:00";
    miniDuration.textContent = "0:00";

    renderPlaylist();

    if (autoplay) {
        audio.play().catch(error => {
            console.error("Musik gagal diputar:", error);
        });
    }
}


function renderPlaylist() {
    playlist.innerHTML = "";

    tracks.forEach((track, index) => {
        const item = document.createElement("li");

        item.className = index === currentTrack ? "active" : "";

        item.innerHTML = `
            <img src="${track.cover}" class="playlist-cover"
                 alt="${track.title}">

            <div class="playlist-song-info">
                <span class="playlist-song-title">
                    ${track.title}
                </span>
                <span class="playlist-song-artist">
                    ${track.artist}
                </span>
            </div>

            <span class="playlist-song-icon">
                ${index === currentTrack ? "♫" : "▶"}
            </span>
        `;

        item.addEventListener("click", () => {
            loadTrack(index, true);
        });

        playlist.appendChild(item);
    });
}


// Sinkronisasi tombol Play dan Pause
function updatePlayButtons() {
    const icon = audio.paused ? "▶" : "Ⅱ";

    playPause.textContent = icon;
    playMusic.textContent = icon;
}

audio.addEventListener("play", updatePlayButtons);
audio.addEventListener("pause", updatePlayButtons);

// Tombol Play playlist utama
playPause.addEventListener("click", () => {
    if (audio.paused) {
        audio.play().catch(error => console.error(error));
    } else {
        audio.pause();
    }
});

// Tombol Play floating player
playMusic.addEventListener("click", () => {
    if (audio.paused) {
        audio.play().catch(error => console.error(error));
    } else {
        audio.pause();
    }
});

// Lagu sebelumnya
function previousTrack() {
    loadTrack(currentTrack - 1, true);
}

// Lagu berikutnya
function nextTrack() {
    loadTrack(currentTrack + 1, true);
}

document.getElementById("prevTrack").addEventListener("click", previousTrack);
document.getElementById("nextTrack").addEventListener("click", nextTrack);

prevMusic.addEventListener("click", previousTrack);
nextMusic.addEventListener("click", nextTrack);

// Otomatis lanjut lagu berikutnya
audio.addEventListener("ended", nextTrack);

// Sinkronisasi progress dan waktu
audio.addEventListener("timeupdate", () => {
    const value = audio.duration
        ? (audio.currentTime / audio.duration) * 100
        : 0;

    progress.value = value;
    musicProgress.value = value;

    const current = formatTime(audio.currentTime);
    const total = formatTime(audio.duration);

    mainCurrentTime.textContent = current;
    miniCurrentTime.textContent = current;

    mainDuration.textContent = total;
    miniDuration.textContent = total;
});

// Update durasi setelah lagu dimuat
audio.addEventListener("loadedmetadata", () => {
    const total = formatTime(audio.duration);

    mainDuration.textContent = total;
    miniDuration.textContent = total;
});

// Mengatur posisi lagu dari playlist utama
progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// Mengatur posisi lagu dari floating player
musicProgress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime = (musicProgress.value / 100) * audio.duration;
    }
});

// Mengecilkan floating player
minimizeMusic.addEventListener("click", () => {
    floatingPlayer.classList.add("minimized");
    openMusic.classList.add("show");
});

// Membuka kembali floating player
openMusic.addEventListener("click", () => {
    floatingPlayer.classList.remove("minimized");
    openMusic.classList.remove("show");
});

// Memuat lagu pertama
loadTrack(0);


// =============================
// 3. ANIMASI SAAT BAGIAN HALAMAN MUNCUL
// =============================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

// =============================
// 4. NAVIGASI MOBILE, TAHUN, DAN TOMBOL KE ATAS
// =============================
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));
document.getElementById("year").textContent = new Date().getFullYear();

const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 500);
  const sections = document.querySelectorAll("main section[id]");
  let activeId = "beranda";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) activeId = section.id;
  });
  nav.querySelectorAll("a").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));


// ======================================
// 5. DREAMY INTERACTIVE CURSOR
// SOFT PINK FOLLOW CURSOR
// ======================================

(() => {
  const cursor = document.getElementById("portfolioCursor");
  const canvas = document.getElementById("portfolioParticles");
  const atmosphere = document.querySelector(".interactive-atmosphere");

  if (!cursor) {
    console.warn("Portfolio cursor tidak ditemukan!");
    return;
  }

  // Pastikan cursor berada langsung di dalam body
  document.body.appendChild(cursor);

  // Pengaturan cursor
  cursor.style.position = "fixed";
  cursor.style.left = "0px";
  cursor.style.top = "0px";
  cursor.style.zIndex = "999999";
  cursor.style.pointerEvents = "none";
  cursor.style.opacity = "0";
  cursor.style.willChange = "transform";

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let currentX = mouseX;
  let currentY = mouseY;

  let isMoving = false;

  // Mengikuti gerakan mouse
  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;

    cursor.style.opacity = "1";

    if (atmosphere) {
      atmosphere.style.setProperty("--glow-x", mouseX + "px");
      atmosphere.style.setProperty("--glow-y", mouseY + "px");
      atmosphere.style.setProperty(
        "--glow-blue-x",
        (window.innerWidth - mouseX) + "px"
      );
      atmosphere.style.setProperty(
        "--glow-blue-y",
        (window.innerHeight - mouseY) + "px"
      );
    }
  });

  // Sembunyikan saat mouse keluar halaman
  document.addEventListener("pointerleave", () => {
    cursor.style.opacity = "0";
  });

  document.addEventListener("pointerenter", () => {
    cursor.style.opacity = "1";
  });

  // Animasi mengikuti mouse
  function animateCursor() {
    currentX += (mouseX - currentX) * 0.25;
    currentY += (mouseY - currentY) * 0.25;

    cursor.style.transform =
      `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Efek saat menyentuh elemen interaktif
  const hoverElements = document.querySelectorAll(
    "a, button, input, textarea, select, .button, .skill-card, .material-card, .contact-card, .about-card, .info-card, .timeline-item"
  );

  hoverElements.forEach((element) => {
    element.addEventListener("pointerenter", () => {
      cursor.classList.add("is-hovering");
    });

    element.addEventListener("pointerleave", () => {
      cursor.classList.remove("is-hovering");
    });
  });

  // Partikel soft pink
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;

      canvas.style.width = "100%";
      canvas.style.height = "100%";

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("pointermove", (e) => {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 2 + 1,
          opacity: 1,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5
        });
      }

      if (particles.length > 70) {
        particles.splice(0, particles.length - 70);
      }
    });

    function animateParticles() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles = particles.filter(p => p.opacity > 0.02);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= 0.018;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255, 143, 179, ${p.opacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff8fb3";
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // Magnetic hover
  const magneticElements = document.querySelectorAll(
    ".button, .nav a, .skill-card, .material-card, .contact-card, .about-card, .info-card, .timeline-item"
  );

  magneticElements.forEach(element => {
    element.addEventListener("pointermove", e => {
      const rect = element.getBoundingClientRect();

      const x = (e.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.08;

      element.style.translate = `${x}px ${y}px`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.translate = "0px 0px";
    });
  });

  // Hero image tilt
  const hero = document.querySelector(".hero-visual");

  if (hero) {
    hero.addEventListener("pointermove", e => {
      const rect = hero.getBoundingClientRect();

      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      hero.style.transform =
        `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });

    hero.addEventListener("pointerleave", () => {
      hero.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    });
  }

})();



// MATERIAL PARTITIONS: open each partisi and return to the list.
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("materialsGrid");
  const details = document.getElementById("materialDetails");
  if (!grid || !details) return;

  const openMaterial = (id) => {
    const selected = document.getElementById(id);
    if (!selected) return;
    grid.hidden = true;
    details.hidden = false;
    details.querySelectorAll(".material-detail").forEach(panel => {
      panel.hidden = panel !== selected;
    });
    history.replaceState(null, "", `#${id}`);
    document.getElementById("materi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  grid.querySelectorAll("[data-open-material]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      openMaterial(link.dataset.openMaterial);
    });
  });

  details.querySelectorAll(".material-back").forEach(button => {
    button.addEventListener("click", () => {
      details.hidden = true;
      grid.hidden = false;
      history.replaceState(null, "", "#materi");
      document.getElementById("materi")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
