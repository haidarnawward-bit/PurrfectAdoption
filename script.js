document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".main-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Buka menu" : "Tutup menu");
      navigation.classList.toggle("is-open", !isOpen);
    });
  }

  document.querySelectorAll(".hero-slider[data-carousel]").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    const counter = carousel.querySelector("[data-current]");
    let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    let timer;

    if (slides.length < 2) return;
    if (currentIndex < 0) currentIndex = 0;

    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === currentIndex);
      });
      if (counter) counter.textContent = String(currentIndex + 1).padStart(2, "0");
    };

    const restartTimer = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => showSlide(currentIndex + 1), 5000);
    };

    carousel.querySelector("[data-prev]")?.addEventListener("click", () => {
      showSlide(currentIndex - 1);
      restartTimer();
    });
    carousel.querySelector("[data-next]")?.addEventListener("click", () => {
      showSlide(currentIndex + 1);
      restartTimer();
    });
    restartTimer();
  });

  document.querySelectorAll(".founder-gallery").forEach((gallery) => {
    const track = gallery.querySelector(".gallery-track");
    if (!track) return;

    const scrollByCard = (direction) => {
      const card = track.querySelector(".gallery-slide");
      if (!card) return;
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 15;
      track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
    };

    gallery.querySelector("[data-gallery-prev]")?.addEventListener("click", () => scrollByCard(-1));
    gallery.querySelector("[data-gallery-next]")?.addEventListener("click", () => scrollByCard(1));
  });

  document.querySelector("[data-feedback-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

    const message = form.querySelector("[data-form-message]");
    if (message) {
      message.textContent = "Terima kasih! Ini masih demo front-end, jadi feedback belum dikirim atau disimpan.";
    }
  });

  initializeContactLink();
  initializeAdoptionRequests();
});

function initializeContactLink() {
  const link = document.createElement("a");
  link.className = "contact-launcher";
  link.href = "Kontak.html";
  link.innerHTML = '<span aria-hidden="true">✉</span> Hubungi kami';

  const header = document.querySelector(".nav-wrap");
  const menuButton = header?.querySelector(".nav-toggle");
  if (header && menuButton) {
    header.insertBefore(link, menuButton);
  } else {
    document.body.append(link);
  }
}

function initializeAdoptionRequests() {
  const adoptionButtons = document.querySelectorAll("[data-adoption-button]");
  if (adoptionButtons.length === 0) return;

  const dialog = document.createElement("dialog");
  dialog.className = "adoption-dialog";
  dialog.setAttribute("aria-labelledby", "adoption-dialog-title");
  dialog.innerHTML = `
    <div class="dialog-head">
      <div><span class="eyebrow">MULAI KENALAN</span><h2 id="adoption-dialog-title">Ajukan adopsi</h2></div>
      <button class="dialog-close" type="button" data-adoption-close aria-label="Tutup form adopsi">×</button>
    </div>
    <p class="adoption-selected">Kamu tertarik berkenalan dengan <strong data-adoption-name></strong>.</p>
    <form class="adoption-form" data-adoption-form>
      <label for="adoption-name">Nama lengkap *</label><input id="adoption-name" name="name" autocomplete="name" required>
      <label for="adoption-email">Email *</label><input id="adoption-email" name="email" type="email" autocomplete="email" required>
      <label for="adoption-message">Ceritakan sedikit tentang rumah dan pengalaman merawat hewan *</label><textarea id="adoption-message" name="message" rows="4" required></textarea>
      <button class="button button-blue adoption-submit" type="submit">Kirim minat adopsi <span>→</span></button>
    </form>
    <p class="adoption-result" data-adoption-result role="status" aria-live="polite">Demo saja: pengajuan ini belum terkirim ke penampungan atau tersimpan.</p>`;
  document.body.append(dialog);

  const selectedName = dialog.querySelector("[data-adoption-name]");
  const result = dialog.querySelector("[data-adoption-result]");
  const form = dialog.querySelector("[data-adoption-form]");
  let selectedAnimal = "";

  adoptionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedAnimal = button.dataset.animal || "";
      if (selectedName) selectedName.textContent = selectedAnimal;
      if (result) result.textContent = "Demo saja: pengajuan ini belum terkirim ke penampungan atau tersimpan.";
      dialog.showModal();
      dialog.querySelector("#adoption-name")?.focus();
    });
  });
  dialog.querySelector("[data-adoption-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;
    const name = new FormData(form).get("name");
    if (result) {
      result.textContent = `Terima kasih, ${name}. Minat adopsi ${selectedAnimal} sudah diperiksa di demo ini, tetapi belum dikirim atau disimpan. Hubungi pengelola untuk mengonfirmasi ketersediaan.`;
    }
  });
}
