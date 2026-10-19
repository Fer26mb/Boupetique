const API_URL =
  location.port === "8000" || location.hostname.endsWith(".trycloudflare.com")
    ? "/api"
    : "http://localhost:8080/api";

async function includePartials() {
  const includeNodes = document.querySelectorAll("[data-include]");
  const tasks = Array.from(includeNodes).map(async (node) => {
    const includePath = node.getAttribute("data-include");
    if (!includePath) {
      return;
    }

    const includeUrl = new URL(includePath, window.location.href);
    try {
      const response = await fetch(includeUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      node.innerHTML = await response.text();
    } catch (error) {
      console.error(`No se pudo cargar ${includePath}`, error);
    }
  });

  await Promise.all(tasks);
}

function setActiveNavLink() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) {
    return;
  }

  const activeLink = document.querySelector(`[data-nav="${currentPage}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }
}

function getSiteRoot() {
  const currentPath = window.location.pathname;
  const htmlDirectory = currentPath.indexOf("/html/");
  return htmlDirectory >= 0
    ? currentPath.slice(0, htmlDirectory + 1)
    : currentPath.slice(0, currentPath.lastIndexOf("/") + 1);
}

function sitePath(path) {
  return `${getSiteRoot()}${path.replace(/^\//, "")}`;
}

function escaparHTML(value) {
  const temporaryEl = document.createElement("div");
  temporaryEl.textContent = String(value ?? "");
  return temporaryEl.innerHTML;
}

function formatoMXN(valor) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(valor) || 0);
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("userSession"));
  } catch {
    return null;
  }
}

function guardarSesion(usuario) {
  localStorage.setItem("userSession", JSON.stringify({
    id: usuario.id,
    userName: usuario.userName,
    email: usuario.email
  }));
}

function cerrarSesion() {
  localStorage.removeItem("userSession");
  if (document.body.dataset.page === "cuenta") {
    window.location.href = sitePath("/index.html");
  } else {
    window.location.reload();
  }
}

function rutaActual() {
  const ruta = window.location.pathname.slice(getSiteRoot().length) || "index.html";
  return `${ruta}${window.location.search}${window.location.hash}`;
}

function loginUrl(modo) {
  const params = new URLSearchParams();
  if (document.body.dataset.page !== "login") params.set("redirect", rutaActual());
  if (modo === "registro") params.set("modo", "registro");
  const query = params.toString();
  return sitePath(`/html/login.html${query ? `?${query}` : ""}`);
}

function destinoTrasLogin() {
  const destino = new URLSearchParams(window.location.search).get("redirect") || "";
  return /^(index\.html|html\/[\w-]+\.html)([?#][\w=&#%.-]*)?$/.test(destino) ? destino : "index.html";
}

function renderUserSession() {
  const session = getSession();
  const accountMenu = document.getElementById("accountMenu");
  const avatar = document.getElementById("accountAvatar");
  const greeting = document.getElementById("accountGreeting");
  if (!accountMenu || !avatar || !greeting) {
    return;
  }

  if (!session?.id) {
    avatar.innerHTML = '<i class="bi bi-person"></i>';
    greeting.textContent = "Entrar";
    accountMenu.innerHTML = `
      <a href="${loginUrl()}" class="btn btn-boupetique w-100 fw-semibold mb-2">Inicia sesión</a>
      <p class="text-center small text-muted mb-0">
        ¿Nuevo en Boupetique? <a href="${loginUrl("registro")}" class="fw-semibold text-boupetique">Regístrate</a>
      </p>
    `;
    return;
  }

  const nombre = escaparHTML(session.userName);
  avatar.textContent = String(session.userName || "?").charAt(0).toUpperCase();
  greeting.textContent = `Hola, ${session.userName}`;
  accountMenu.innerHTML = `
    <div class="account-header">
      <p class="fw-semibold mb-0">${nombre}</p>
      <p class="small text-muted mb-0 text-truncate">${escaparHTML(session.email)}</p>
    </div>
    <a class="dropdown-item" href="${sitePath("/html/cuenta.html#perfil")}"><i class="bi bi-person-circle"></i> Mi cuenta</a>
    <a class="dropdown-item" href="${sitePath("/html/cuenta.html#mascotas")}"><i class="bi bi-heart"></i> Mis mascotas</a>
    <a class="dropdown-item" href="${sitePath("/html/cuenta.html#pedidos")}"><i class="bi bi-bag-check"></i> Mis pedidos</a>
    <a class="dropdown-item" href="${sitePath("/html/cuenta.html#pagos")}"><i class="bi bi-credit-card"></i> Métodos de pago</a>
    <hr class="dropdown-divider">
    <button type="button" class="dropdown-item text-danger" id="btnLogout"><i class="bi bi-box-arrow-right text-danger"></i> Cerrar sesión</button>
  `;
  document.getElementById("btnLogout").addEventListener("click", cerrarSesion);
}

const ENVIO_GRATIS_DESDE = 899;

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function renderCartIndicator() {
  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotalPreview");
  const miniCart = document.getElementById("miniCart");
  if (!countEl || !totalEl || !miniCart) {
    return;
  }

  const cart = leerCarrito();
  const piezas = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const total = cart.reduce((sum, item) => sum + (Number(item.Precio_Base) || 0) * (Number(item.quantity) || 0), 0);

  countEl.textContent = piezas > 9 ? "9+" : String(piezas);
  countEl.classList.toggle("d-none", piezas === 0);
  totalEl.textContent = formatoMXN(total);
  totalEl.classList.toggle("d-none", piezas === 0);
  totalEl.classList.toggle("d-lg-inline", piezas > 0);

  if (cart.length === 0) {
    miniCart.innerHTML = `
      <div class="mini-cart-content text-center">
        <p class="mb-2">Tu carrito está vacío</p>
        <a href="${sitePath("/html/productos.html")}" class="btn btn-boupetique btn-sm w-100">Ver productos</a>
      </div>
    `;
    return;
  }

  const items = cart.slice(0, 3).map((item) => `
    <div class="mini-cart-item">
      <img src="${escaparHTML(item.Imagen_URL || sitePath("/assets/productos-img/default.jpeg"))}" alt="">
      <div class="flex-grow-1">
        <div class="mini-cart-name">${escaparHTML(item.Nombre)}</div>
        <small class="text-muted">${item.quantity} × ${formatoMXN(item.Precio_Base)}</small>
      </div>
    </div>
  `).join("");
  const restantes = cart.length - 3;
  const faltante = ENVIO_GRATIS_DESDE - total;

  miniCart.innerHTML = `
    <div class="mini-cart-content">
      ${items}
      ${restantes > 0 ? `<p class="small text-muted mb-1">y ${restantes} producto${restantes > 1 ? "s" : ""} más</p>` : ""}
      <div class="d-flex justify-content-between fw-semibold border-top pt-2 mt-1">
        <span>Subtotal (${piezas} pza${piezas > 1 ? "s" : ""})</span><span>${formatoMXN(total)}</span>
      </div>
      <p class="mini-cart-envio mb-2">${faltante > 0 ? `Te faltan ${formatoMXN(faltante)} para envío gratis` : "¡Tienes envío gratis!"}</p>
      <a href="${sitePath("/html/carrito.html")}" class="btn btn-boupetique btn-sm w-100">Ver carrito</a>
    </div>
  `;
}

window.addEventListener("storage", (e) => {
  if (e.key === "cart") renderCartIndicator();
  if (e.key === "userSession") renderUserSession();
});

function setGitHubPagesBasePath() {
  const siteRoot = getSiteRoot();

  document.querySelectorAll('[href^="/"], [src^="/"]').forEach((element) => {
    const attribute = element.hasAttribute("href") ? "href" : "src";
    const path = element.getAttribute(attribute);
    element.setAttribute(attribute, `${siteRoot}${path.slice(1)}`);
  });
}

function initializeAutoHideHeader() {
    const header = document.getElementById("site-header");

    if (!header) {
        return;
    }

    let previousScrollPosition = window.scrollY;
    let animationPending = false;

    window.addEventListener(
        "scroll",
        () => {
            if (animationPending) {
                return;
            }

            animationPending = true;

            window.requestAnimationFrame(() => {
                const currentScrollPosition = window.scrollY;
                const mobileMenu = document.getElementById("navbarScroll");
                const mobileMenuIsOpen =
                    mobileMenu?.classList.contains("show");

                if (currentScrollPosition <= 10 || mobileMenuIsOpen) {
                    header.classList.remove("header-hidden");
                } else if (
                    currentScrollPosition > previousScrollPosition &&
                    currentScrollPosition > header.offsetHeight
                ) {
                    header.classList.add("header-hidden");
                } else if (
                    currentScrollPosition < previousScrollPosition
                ) {
                    header.classList.remove("header-hidden");
                }

                previousScrollPosition = Math.max(
                    currentScrollPosition,
                    0
                );

                animationPending = false;
            });
        },
        { passive: true }
    );
}

function animateCount(el, start, end, duration = 300) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = Math.round(start + (end - start) * progress);

        el.textContent = currentVal;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function setBilling(mode) {
    const pill = document.getElementById("switchPill");
    const monthlyBtn = document.getElementById("monthlyBtn");
    const yearlyBtn = document.getElementById("yearlyBtn");
    const priceElements = document.querySelectorAll(".price-val");
    const periodLabels = document.querySelectorAll(".price-period");

    const isYearly = mode === "yearly";

    if (pill) {
        pill.style.transform = isYearly ? "translateX(100%)" : "translateX(0%)";
    }

    if (monthlyBtn && yearlyBtn) {
        monthlyBtn.classList.toggle("active", !isYearly);
        yearlyBtn.classList.toggle("active", isYearly);
    }

    priceElements.forEach((el) => {
        const free = el.getAttribute("free");

        if (free) {
            el.textContent = "Gratis";
            return;
        }

        const monthlyValue = Number.parseInt(el.getAttribute("data-monthly") || "0", 10) || 0;
        const yearlyValue = Number.parseInt(el.getAttribute("data-yearly") || String(monthlyValue * 12), 10) || 0;
        const targetVal = isYearly ? yearlyValue : monthlyValue;

        const startVal = Number.parseInt(String(el.textContent).replace(/[^\d]/g, ""), 10) || 0;

        animateCount(el, startVal, targetVal);
    });

    periodLabels.forEach((label) => {
        label.textContent = isYearly ? "/año" : "/mes";
    });
}

window.setBilling = setBilling;

function initializePricing() {
    const monthlyBtn = document.getElementById("monthlyBtn");
    const yearlyBtn = document.getElementById("yearlyBtn");

    if (monthlyBtn && yearlyBtn) {
        monthlyBtn.addEventListener("click", () => setBilling("monthly"));
        yearlyBtn.addEventListener("click", () => setBilling("yearly"));
    }

    document.querySelectorAll("[data-plan]").forEach((boton) => {
        boton.addEventListener("click", () => {
            const plan = boton.dataset.plan;
            if (plan === "Básico") {
                window.location.href = getSession()?.id ? sitePath("/html/cuenta.html") : loginUrl("registro");
                return;
            }
            Swal.fire({
                icon: "info",
                title: "¡Muy pronto!",
                text: `El plan ${plan} estará disponible muy pronto. Te avisaremos por correo cuando puedas suscribirte.`,
                confirmButtonColor: "#d96b27"
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await includePartials();
    renderUserSession();
    setGitHubPagesBasePath();
    setActiveNavLink();
    renderCartIndicator();
    initializeAutoHideHeader();
    initializePricing();
    setBilling("monthly");
    initializePasswordToggle(); 
});

function initializePasswordToggle() {
    const toggleBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("passwordInput");
    const eyeIcon = document.getElementById("eyeIcon");

    if (!toggleBtn || !passwordInput || !eyeIcon) {
        return;
    }

    const eyeOpen = `
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-8.837 8.212-6.633 8.212s-6.298-7.732-6.633-8.212A13 13 0 0 1 1.173 8"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    `;

    const eyeClosed = `
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-1.745 2.05-3.666 3.12zm-3.707-1.849L8.414 8.151a1.5 1.5 0 0 0-.565-.565L6.611 6.348a2.5 2.5 0 0 1 3.041 3.041M1.646 1.146l13.208 13.208-.708.708-2.072-2.072A8.6 8.6 0 0 1 8 13.5C3 13.5 0 8 0 8s1.543-2.726 4.146-4.524L1.146 1.854zM2.87 4.792A13 13 0 0 0 1.173 8a13 13 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c1.472 0 2.825-.562 3.978-1.503L10.3 9.32a3.5 3.5 0 0 1-4.62-4.62z"/>
    `;

    toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");
        eyeIcon.innerHTML = isPassword ? eyeClosed : eyeOpen;
    });
}

const reviewsRow1 = [
  {
    quote: "La cama ortopédica para perro superó todas mis expectativas. Max solía levantarse con rigidez en las caderas y desde la primera semana se nota su descanso profundo.",
    name: "David Wright",
    role: "Dueño de Golden Retriever",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    quote: "Los snacks 100% naturales son de una calidad brutal. Mi perrita suele ser sumamente alérgica a ciertos conservadores, pero estos los digiere a la perfección.",
    name: "Manu Arora",
    role: "Humano de Luna (Bulldog Francés)",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    quote: "El arnés ergonómico y la correa reflectante llegaron al día siguiente de pedir en Boupetique. Los acabados y la resistencia son de diez.",
    name: "Jack Brown",
    role: "Dueño de Pastor Alemán",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    quote: "Buscaba juguetes cognitivos resistentes para evitar la ansiedad por separación en casa. Boupetique tiene la mejor selección técnica del mercado.",
    name: "Eva Green",
    role: "Entrenadora canina & Pet Lover",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120"
  }
];

const reviewsRow2 = [
  {
    quote: "El árbol rascador modular no solo es el favorito de mis gatos, sino que estéticamente parece una pieza de diseño en la sala. Resistente y fácil de limpiar.",
    name: "Ivy Wilson",
    role: "Tutora de Mishi & Oliver",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    quote: "No vuelvo a comprar comida o premios en ningún otro sitio. El empaque sustentable y la frescura de los ingredientes marcan una diferencia enorme.",
    name: "Carlos Méndez",
    role: "Papá de gato Siamés",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    quote: "La fuente de agua en acero inoxidable con filtro silencioso logró que mis gatos finalmente bebieran suficiente agua al día. Su salud renal mejoró muchísimo.",
    name: "Cathy Lee",
    role: "Mamá de 3 felinos rescatados",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    quote: "Atención al cliente impecable en Boupetique. Me orientaron sobre las tallas exactas de collar y ropa térmica para mi Pug antes de comprar.",
    name: "Sofía Valenzuela",
    role: "Dueña de Milo",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120&h=120"
  }
];

function createReviewCard(review) {
  return `
    <div class="review-card">
      <p class="quote-text">"${review.quote}"</p>
      <div class="card-author">
        <img class="avatar-image" src="${review.avatarUrl}" alt="${review.name}" loading="lazy">
        <div class="author-info">
          <span class="author-name">${review.name}</span>
          <span class="author-meta">${review.role}</span>
        </div>
      </div>
    </div>
  `;
}

function setupTrack(trackElement, data, direction, speed) {
  const cardsHtml = data.map(createReviewCard).join('');
  trackElement.innerHTML = cardsHtml + cardsHtml;

  trackElement.style.setProperty('--scroll-duration', `${speed}s`);

  if (direction === 'right') {
    trackElement.classList.add('animate-right');
  } else {
    trackElement.classList.add('animate-left');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const track1 = document.getElementById('track1');
  const track2 = document.getElementById('track2');

  if (track1 && track2) {
    const speedTrack1 = track1.parentElement.dataset.speed || 35;
    const dirTrack1 = track1.parentElement.dataset.direction || 'left';

    const speedTrack2 = track2.parentElement.dataset.speed || 40;
    const dirTrack2 = track2.parentElement.dataset.direction || 'right';

    setupTrack(track1, reviewsRow1, dirTrack1, speedTrack1);
    setupTrack(track2, reviewsRow2, dirTrack2, speedTrack2);
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("track");
    if (!track) return;

    let cards = Array.from(track.querySelectorAll(".fp-card"));
    
    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);
    [firstClone, lastClone].forEach((clone) => {
        clone.setAttribute("tabindex", "-1");
        clone.setAttribute("aria-hidden", "true");
    });
    track.appendChild(firstClone);
    track.insertBefore(lastClone, cards[0]);

    cards = Array.from(track.querySelectorAll(".fp-card"));
    const BLUR_AMOUNT = 7; 

    function focusOf(d, blur) {
        const a = Math.min(Math.abs(d), 1);
        return {
            scale: 1 - 0.14 * a,
            blur: Math.min(Math.abs(d), 2) * blur,
            opacity: 1 - 0.5 * a,
            saturate: 1 - 0.45 * a,
        };
    }

    function paint() {
        if (!track || !cards.length) return;
        const mid = track.scrollLeft + track.clientWidth / 2;
        const w = cards[0].offsetWidth || 1;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const currentBlur = reduce ? 0 : BLUR_AMOUNT;

        cards.forEach((c) => {
            const center = c.offsetLeft + c.offsetWidth / 2;
            const d = (center - mid) / w; 
            const f = focusOf(d, currentBlur);

            c.style.transform = `scale(${f.scale.toFixed(4)})`;
            c.style.filter = f.blur > 0.05 
                ? `blur(${f.blur.toFixed(2)}px) saturate(${f.saturate.toFixed(3)})` 
                : "none";
            c.style.opacity = f.opacity.toFixed(3);
        });
    }

    function checkLoop() {
        if (track.scrollLeft === 0) {
            track.classList.add("dragging");
            track.scrollLeft = cards[cards.length - 2].offsetLeft + cards[cards.length - 2].offsetWidth / 2 - track.clientWidth / 2;
            track.classList.remove("dragging");
        } else if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) {
            track.classList.add("dragging");
            track.scrollLeft = cards[1].offsetLeft + cards[1].offsetWidth / 2 - track.clientWidth / 2;
            track.classList.remove("dragging");
        }
    }

    let raf = 0;
    track.addEventListener("scroll", () => {
        if (!raf) {
            raf = requestAnimationFrame(() => {
                raf = 0;
                paint();
                checkLoop();
            });
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        requestAnimationFrame(paint);
    });

    setTimeout(() => {
        track.classList.add("dragging");
        track.scrollLeft = cards[1].offsetLeft + cards[1].offsetWidth / 2 - track.clientWidth / 2;
        track.classList.remove("dragging");
        paint();
    }, 50);

    let isDragging = false;
    let moved = false;
    let startX;
    let startClientX;
    let scrollLeft;

    track.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        isDragging = true;
        moved = false;
        track.classList.add("dragging");
        startX = e.pageX - track.offsetLeft;
        startClientX = e.clientX;
        scrollLeft = track.scrollLeft;
        track.setPointerCapture(e.pointerId);
    });

    track.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        if (Math.abs(e.clientX - startClientX) > 5) moved = true;
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX);
        track.scrollLeft = scrollLeft - walk;
    });

    track.addEventListener("click", (e) => {
        if (moved) return;
        const card = document.elementFromPoint(e.clientX, e.clientY)?.closest(".fp-card");
        if (!card?.dataset.href) return;
        const index = cards.indexOf(card);
        if (index !== getActiveIndex()) {
            step(index - getActiveIndex());
            return;
        }
        window.location.href = card.dataset.href;
    });

    track.addEventListener("keydown", (e) => {
        const card = e.target.closest(".fp-card");
        if (e.key === "Enter" && card?.dataset.href) window.location.href = card.dataset.href;
    });

    const stopDragging = () => {
        isDragging = false;
        track.classList.remove("dragging");
    };

    track.addEventListener("pointerup", stopDragging);
    track.addEventListener("pointercancel", stopDragging);


    let autoplayTimer;
    let currentIndex = 1;

    function getActiveIndex() {
        const mid = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let minDiff = Infinity;
        cards.forEach((c, i) => {
            const center = c.offsetLeft + c.offsetWidth / 2;
            const diff = Math.abs(center - mid);
            if (diff < minDiff) {
                minDiff = diff;
                closest = i;
            }
        });
        return closest;
    }

    function step(direction) {
        let active = getActiveIndex();
        currentIndex = active + direction;
        
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex >= cards.length) currentIndex = cards.length - 1;
        
        const card = cards[currentIndex];
        track.scrollTo({
            left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
            behavior: "smooth"
        });
        
        resetAutoplay();
    }

    const prevBtn = document.getElementById("fp-prev");
    const nextBtn = document.getElementById("fp-next");

    if (prevBtn) prevBtn.addEventListener("click", () => step(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => step(1));

    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            if (isDragging || !track || !cards.length) return;
            step(1);
        }, 4500);
    }

    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }

    startAutoplay();
});