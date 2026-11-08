// Same storage key and default as the home page (index.html), so the
// language a visitor picks follows them from page to page.
const LANG_KEY = "carasia-lang";

function readSavedLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "es" || saved === "en" ? saved : "en";
  } catch (error) {
    return "en";
  }
}

function saveLanguage(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (error) {}
}

const state = {
  lang: readSavedLanguage(),
  products: [],
  category: "all",
  query: "",
};

const text = (es, en) => state.lang === "es" ? es : en;

const esc = value =>
  String(value ?? "").replace(/[&<>'"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[char]);

const categoryNames = {
  "Vehicle Accessories": {
    es: "Accesorios para vehículos",
    en: "Vehicle Accessories"
  },
  "Construction Tools": {
    es: "Herramientas de construcción",
    en: "Construction Tools"
  },
  "LED Lights": {
    es: "Luces LED",
    en: "LED Lights"
  },
  "Solar & Energy": {
    es: "Energía solar y almacenamiento",
    en: "Solar & Energy"
  },
  "Metals & Alloys": {
    es: "Metales y aleaciones",
    en: "Metals & Alloys"
  },
};

const subcategoryNames = {
  "Floor Mats": {
    es: "Alfombras para vehículos",
    en: "Floor Mats"
  },
  "Warning Lights": {
    es: "Luces de advertencia",
    en: "Warning Lights"
  },
  "LED Headlights": {
    es: "Faros LED",
    en: "LED Headlights"
  },
  "Titanium & Titanium Alloys": {
    es: "Titanio y aleaciones de titanio",
    en: "Titanium & Titanium Alloys"
  },
  "Energy Storage & Inverters": {
    es: "Almacenamiento e inversores",
    en: "Energy Storage & Inverters"
  },
  "Core Drilling": {
    es: "Perforación con corona",
    en: "Core Drilling"
  },
  "Cutting Discs": {
    es: "Discos de corte",
    en: "Cutting Discs"
  },
  "Grinding Wheels": {
    es: "Muelas de desbaste",
    en: "Grinding Wheels"
  },
  "Chamfering": {
    es: "Biselado",
    en: "Chamfering"
  },
  "Milling": {
    es: "Fresado",
    en: "Milling"
  },
  "Hand Tools": {
    es: "Herramientas manuales",
    en: "Hand Tools"
  },
};

function localizeStatic() {
  document.documentElement.lang = state.lang;

  document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  document.querySelectorAll("[data-es][data-en]").forEach(element => {
    element.textContent = element.dataset[state.lang];
  });

  document.querySelectorAll("[data-aria-es][data-aria-en]").forEach(element => {
    element.setAttribute(
      "aria-label",
      element.dataset[state.lang === "es" ? "ariaEs" : "ariaEn"]
    );
  });

  const menuButton = document.querySelector(".catalog-menu-button");
  if (menuButton) {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute(
      "aria-label",
      open ? text("Cerrar menú", "Close menu") : text("Abrir menú", "Open menu")
    );
  }

  if (document.body.dataset.page === "catalog") {
    document.title = text("Productos | Carasia Consulting", "Products | Carasia Consulting");
  }

  if (document.body.dataset.page === "privacy") {
    document.title = text("Privacidad | Carasia Consulting", "Privacy | Carasia Consulting");
  }

  document
    .querySelectorAll("[data-placeholder-es][data-placeholder-en]")
    .forEach(element => {
      element.placeholder =
        element.dataset[
          `placeholder${state.lang === "es" ? "Es" : "En"}`
        ];
    });

  document.querySelectorAll(".lang-button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.lang === state.lang
    );
  });

  sortProductMenu();
}

function sortProductMenu() {
  document.querySelectorAll(".products-dropdown").forEach(menu => {
    const links = [...menu.querySelectorAll("a")];
    const allProducts = links.find(link => link.dataset.category === "all");
    const categories = links
      .filter(link => link.dataset.category !== "all")
      .sort((a, b) => a.textContent.trim().localeCompare(
        b.textContent.trim(),
        state.lang,
        { sensitivity: "base" }
      ));

    menu.replaceChildren(...(allProducts ? [allProducts] : []), ...categories);
  });
}

function categoryLabel(category) {
  const entry = categoryNames[category];
  return entry ? entry[state.lang] : category;
}

function subcategoryLabel(subcategory) {
  const entry = subcategoryNames[subcategory];
  return entry ? entry[state.lang] : subcategory;
}

function productName(product) {
  return state.lang === "es"
    ? product.nameEs
    : product.nameEn;
}

function productTitle(product) {
  const name = productName(product);

  return product.category === "LED Lights" && product.model
    ? `${name} — ${product.model}`
    : name;
}

function application(product) {
  return state.lang === "es"
    ? product.applicationEs
    : product.applicationEn;
}

function specifications(product) {
  return state.lang === "es"
    ? product.specificationsEs
    : product.specificationsEn;
}

function productCard(product) {
  return `
    <article class="product-card">
      <a
        class="product-image"
        href="product.html?id=${encodeURIComponent(product.sku)}"
        aria-label="${esc(productTitle(product))}"
      >
        <img
          src="${esc(product.image)}"
          alt="${esc(productTitle(product))}"
          loading="lazy"
        >
      </a>

      <div class="product-card-body">
        <div class="product-meta">
          <span>${esc(subcategoryLabel(product.subcategory))}</span>
          <span>${esc(product.sku)}${product.model && product.category !== "LED Lights" ? ` · ${esc(product.model)}` : ""}</span>
        </div>

        <h3>${esc(productTitle(product))}</h3>

        <p>${esc(application(product))}</p>

        <a
          class="card-link"
          href="product.html?id=${encodeURIComponent(product.sku)}"
        >
          ${text("Ver detalles", "View details")}
        </a>
      </div>
    </article>
  `;
}

function renderFilters() {
  const categories = [
    ...new Set(
      state.products.map(product => product.category)
    )
  ].sort((a, b) => categoryLabel(a).localeCompare(
    categoryLabel(b), state.lang, { sensitivity: "base" }
  ));

  const root = document.getElementById("category-filters");

  if (!root) return;

  // Simple line icons for each category tile.
  const icon = paths => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
  const categoryIcons = {
    all: icon('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    "Construction Tools": icon('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'),
    "LED Lights": icon('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'),
    "Metals & Alloys": icon('<path d="M3 17l3-6h12l3 6z"/><path d="M7 11l2-4h6l2 4"/>'),
    "Solar & Energy": icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    "Vehicle Accessories": icon('<path d="M5 16l1.5-5A2 2 0 0 1 8.4 9.5h7.2a2 2 0 0 1 1.9 1.5L19 16"/><rect x="3" y="16" width="18" height="3" rx="1"/><circle cx="7.5" cy="19.5" r="1.5"/><circle cx="16.5" cy="19.5" r="1.5"/>'),
  };
  const countFor = category => category === "all"
    ? state.products.length
    : state.products.filter(product => product.category === category).length;
  const tile = (category, label) => `
    <button
      type="button"
      class="filter-button ${state.category === category ? "active" : ""}"
      data-category="${esc(category)}"
      aria-pressed="${state.category === category}"
    >
      <span class="filter-icon">${categoryIcons[category] || categoryIcons.all}</span>
      <span class="filter-label">${esc(label)}</span>
      <span class="filter-count">${countFor(category)}</span>
    </button>
  `;

  root.innerHTML = [
    tile("all", text("Todos los productos", "All products")),
    ...categories.map(category => tile(category, categoryLabel(category))),
  ].join("");

  root.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      renderCatalog();
    });
  });
}

function renderCatalog() {
  renderFilters();

  const query = state.query
    .trim()
    .toLocaleLowerCase(state.lang);

  const visible = state.products.filter(product => {
    const categoryMatch =
      state.category === "all" ||
      product.category === state.category;

    const searchText = [
      product.sku,
      product.model,
      product.nameEn,
      product.nameEs,
      product.applicationEn,
      product.applicationEs,
      product.specificationsEn,
      product.specificationsEs,
    ]
      .join(" ")
      .toLocaleLowerCase(state.lang);

    return (
      categoryMatch &&
      (!query || searchText.includes(query))
    );
  });

  const count = document.getElementById("result-count");

  if (count) {
    count.textContent = text(
      `${visible.length} productos`,
      `${visible.length} products`
    );
  }

  const root = document.getElementById("catalog-results");

  if (!root) return;

  if (!visible.length) {
    root.innerHTML = `
      <div class="empty-state">
        ${text(
          "No se encontraron productos con esos criterios.",
          "No products matched those filters."
        )}
        <p class="catalog-help">
          ${text("¿No ve lo que necesita? ¡No hay problema!", "Don't see what you need? No problem!")}
          <a href="index.html#contact" data-umami-event="catalog-request-product">${text(
            "Contáctenos para encontrar su proveedor →",
            "Contact us to find your supplier →"
          )}</a>
        </p>
      </div>
    `;

    return;
  }

  const categories = [
    ...new Set(
      visible.map(product => product.category)
    )
  ].sort((a, b) => categoryLabel(a).localeCompare(
    categoryLabel(b), state.lang, { sensitivity: "base" }
  ));

  root.innerHTML = categories.map(category => {
    const products = visible.filter(
      product => product.category === category
    );

    return `
      <section class="category-block">
        <div class="category-heading">
          <div>
            <span class="eyebrow">
              ${text("Categoría", "Category")}
            </span>

            <h2>${esc(categoryLabel(category))}</h2>
          </div>

          <p>
            ${text(
              `${products.length} productos disponibles`,
              `${products.length} products available`
            )}
          </p>
        </div>

        <div class="product-grid">
          ${products.map(productCard).join("")}
        </div>
      </section>
    `;
  }).join("");
}

// ---------- PRODUCT DETAIL PAGE ----------

const CONTACT = {
  email: "carasiaconsulting@gmail.com",
  whatsapp: "8613686014118",
};

// Turn a spec line such as "4-piece set; 2 kg/set; color Blue" or
// "Grades: TA2; TA3. Referenced standards: GB/T 37520." into table rows.
function specRows(value) {
  const rows = [];
  String(value ?? "")
    .split(/;\s*|\.\s+(?=[A-Z])/)
    .map(part => part.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .forEach(part => {
      const colon = part.indexOf(":");
      const previous = rows[rows.length - 1];
      if (colon > 0 && colon <= 40) {
        rows.push({ label: part.slice(0, colon).trim(), value: part.slice(colon + 1).trim() });
      } else if (previous && previous.label && /^[\w.\-/+]{1,12}$/.test(part)) {
        // Short codes after a labeled item ("Grades: TA2; TA3; TC4") belong to that item.
        previous.value += `, ${part}`;
      } else {
        rows.push({ label: "", value: part });
      }
    });
  return rows;
}

function specTable(product) {
  const rows = specRows(specifications(product));
  if (!rows.length) return "";
  return `
    <table class="spec-table">
      <tbody>
        ${rows.map(row => row.label
          ? `<tr><th scope="row">${esc(row.label)}</th><td>${esc(row.value)}</td></tr>`
          : `<tr><td colspan="2">${esc(row.value)}</td></tr>`
        ).join("")}
      </tbody>
    </table>
  `;
}

// Line icons used on the product page buttons.
const BUTTON_ICONS = {
  quote: '<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  whatsapp: '<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9.5 9.5c.3 1.6 1.4 3.2 3 4l1-1 2 1c-.3 1-1.2 1.5-2 1.4-2.6-.4-4.8-2.6-5.2-5.2-.1-.8.4-1.7 1.4-2l1 2z"/></svg>',
  send: '<svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14"/><path d="M21 3l-7 18-4-7-7-4z"/></svg>',
};

function whatsappLink(product) {
  const message = text(
    `Hola, me interesa ${product.sku} - ${productTitle(product)}. ¿Me pueden enviar una cotización?`,
    `Hi, I'm interested in ${product.sku} - ${productTitle(product)}. Could you send me a quote?`
  );
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

function similarProducts(product, limit = 3) {
  const others = state.products.filter(item => item.sku !== product.sku);
  const sameSub = others.filter(item => item.subcategory === product.subcategory);
  const sameCat = others.filter(
    item => item.category === product.category && item.subcategory !== product.subcategory
  );
  const candidates = [...sameSub, ...sameCat];
  // Prefer products with different names (e.g. not three colors of the same mat),
  // then fill any remaining spots with the closest matches.
  const seen = new Set([productTitle(product)]);
  const varied = candidates.filter(item => {
    const title = productTitle(item);
    if (seen.has(title)) return false;
    seen.add(title);
    return true;
  });
  const rest = candidates.filter(item => !varied.includes(item));
  return [...varied, ...rest].slice(0, limit);
}

function quoteForm(product) {
  const productLabel = `${product.sku} - ${productTitle(product)}`;
  return `
    <section class="quote-panel" id="quote" aria-labelledby="quote-title">
      <div class="quote-intro">
        <span class="eyebrow">${text("Cotización", "Quote")}</span>
        <h2 id="quote-title">${text("Solicite una cotización", "Request a quote")}</h2>
        <p>${text(
          "Cuéntenos cantidad y destino. Nuestro equipo en China le responderá con opciones.",
          "Tell us the quantity and destination. Our team in China will reply with options."
        )}</p>
        <p class="quote-product"><strong>${text("Producto", "Product")}:</strong> ${esc(productLabel)}</p>
      </div>
      <form class="quote-form" action="https://formsubmit.co/${CONTACT.email}" method="POST">
        <input type="hidden" name="_subject" value="${esc(`Quote request: ${productLabel}`)}">
        <input type="hidden" name="product" value="${esc(productLabel)}">
        <div class="quote-fields">
          <label class="quote-field">
            <span>${text("Cantidad estimada", "Estimated quantity")}</span>
            <input name="quantity" autocomplete="off">
          </label>
          <label class="quote-field">
            <span>${text("Destino", "Destination")}</span>
            <input name="destination" autocomplete="country-name">
          </label>
          <label class="quote-field">
            <span>${text("Nombre", "Name")} *</span>
            <input name="name" required autocomplete="name">
          </label>
          <label class="quote-field">
            <span>${text("Correo o WhatsApp", "Email or WhatsApp")} *</span>
            <input name="contact" required autocomplete="email">
          </label>
          <label class="quote-field full">
            <span>${text("Detalles (opcional)", "Details (optional)")}</span>
            <textarea name="details" rows="3"></textarea>
          </label>
        </div>
        <button class="button button-primary quote-submit" type="submit" data-umami-event="product-quote-submit">
          ${BUTTON_ICONS.send}${text("Enviar solicitud", "Send request")}
        </button>
        <p class="quote-privacy">
          ${text(
            "Solo usamos estos datos para responder a su solicitud.",
            "We only use these details to reply to your request."
          )}
          <a href="privacy.html">${text("Aviso de privacidad", "Privacy notice")}</a>
        </p>
      </form>
    </section>
  `;
}

function orderingSteps() {
  const steps = [
    ["Envíe su solicitud", "Send your request"],
    ["Comparamos proveedores verificados", "We compare verified suppliers"],
    ["Inspeccionamos antes del envío", "We inspect before shipping"],
    ["Entregado a usted", "Delivered to you"],
  ];
  return `
    <section class="ordering-steps">
      <h2>${text("Cómo funciona el pedido", "How ordering works")}</h2>
      <ol>
        ${steps.map(([es, en], index) => `
          <li><span class="step-badge">${index + 1}</span><span>${text(es, en)}</span></li>
        `).join("")}
      </ol>
    </section>
  `;
}

function renderProduct() {
  const root = document.getElementById("product-view");

  if (!root) return;

  const sku =
    new URLSearchParams(location.search).get("id");

  const product = state.products.find(
    item => item.sku === sku
  );

  if (!product) {
    root.innerHTML = `
      <a class="back-link" href="catalog.html">
        ← ${text("Volver al catálogo", "Back to catalog")}
      </a>

      <div class="empty-state">
        ${text(
          "No se encontró este producto.",
          "This product could not be found."
        )}
      </div>
    `;

    return;
  }

  document.title =
    `${productTitle(product)} | Carasia Consulting`;

  // Keep anything the visitor already typed when the language is switched.
  const typed = {};
  root.querySelectorAll(".quote-form [name]").forEach(field => {
    if (field.type !== "hidden") typed[field.name] = field.value;
  });

  const categoryLink = `catalog.html?category=${encodeURIComponent(product.category)}`;
  const similar = similarProducts(product);
  const badges = [
    ["Proveedores verificados", "Verified suppliers"],
    ["Inspección antes del envío", "Inspection before shipping"],
    ["Atención en inglés y español", "English & Spanish support"],
  ];

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="${text("Ruta de navegación", "Breadcrumb")}">
      <a href="catalog.html">${text("Productos", "Products")}</a>
      <span aria-hidden="true">›</span>
      <a href="${categoryLink}">${esc(categoryLabel(product.category))}</a>
      <span aria-hidden="true">›</span>
      <span>${esc(subcategoryLabel(product.subcategory))}</span>
    </nav>

    <div class="product-layout">
      <div class="product-media-stack">
        <div class="product-gallery">
          <img
            src="${esc(product.image)}"
            alt="${esc(productTitle(product))}"
          >
        </div>
        ${product.catalogImage ? `
          <div class="product-gallery product-gallery-secondary">
            <img
              src="${esc(product.catalogImage)}"
              alt="${esc(productTitle(product))} — ${text("página del catálogo", "catalog page")}"
              tabindex="0"
            >
          </div>
          <p class="gallery-hint">${text("Toque la página del catálogo para ampliarla.", "Tap the catalog page to enlarge it.")}</p>
        ` : ""}
      </div>

      <article class="product-details">
        <span class="product-category">
          ${esc(categoryLabel(product.category))}
          ·
          ${esc(subcategoryLabel(product.subcategory))}
        </span>

        <h1>${esc(productTitle(product))}</h1>

        <div class="product-model">
          ${esc(product.sku)}
          ${product.model && product.category !== "LED Lights"
            ? ` · ${esc(product.model)}`
            : ""}
        </div>

        <p class="product-intro">
          ${esc(application(product))}
        </p>

        <ul class="trust-badges">
          ${badges.map(([es, en]) => `<li>${text(es, en)}</li>`).join("")}
        </ul>

        <div class="cta-row">
          <a class="button button-primary" href="#quote" data-quote-jump data-umami-event="product-quote-open">
            ${BUTTON_ICONS.quote}${text("Solicitar cotización", "Request a quote")}
          </a>
          <a class="button button-whatsapp" href="${whatsappLink(product)}" target="_blank" rel="noopener noreferrer" data-umami-event="contact-click" data-umami-event-channel="whatsapp-product">
            ${BUTTON_ICONS.whatsapp}WhatsApp
          </a>
        </div>

        <section class="detail-panel">
          <h2>${text("Especificaciones", "Specifications")}</h2>
          ${specTable(product)}
        </section>

        <section class="detail-panel">
          <h2>${text("Disponibilidad y cotización", "Availability and quotation")}</h2>
          <p>
            ${text(
              "El pedido mínimo, las opciones, el plazo de entrega y el precio se confirman con su cotización.",
              "Minimum order, options, lead time, and pricing are confirmed with your quote."
            )}
          </p>
        </section>
      </article>
    </div>

    ${orderingSteps()}

    ${quoteForm(product)}

    ${similar.length ? `
      <section class="similar-products">
        <h2>${text("Productos similares", "Similar products")}</h2>
        <div class="product-grid">
          ${similar.map(productCard).join("")}
        </div>
      </section>
    ` : ""}

    <div class="mobile-quote-bar" aria-hidden="false">
      <a class="button button-primary" href="#quote" data-quote-jump>${BUTTON_ICONS.quote}${text("Cotizar", "Get a quote")}</a>
      <a class="button button-whatsapp" href="${whatsappLink(product)}" target="_blank" rel="noopener noreferrer" data-umami-event="contact-click" data-umami-event-channel="whatsapp-product">${BUTTON_ICONS.whatsapp}WhatsApp</a>
    </div>
  `;

  Object.entries(typed).forEach(([name, value]) => {
    const field = root.querySelector(`.quote-form [name="${name}"]`);
    if (field) field.value = value;
  });

  root.querySelectorAll("[data-quote-jump]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      document.getElementById("quote").scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        root.querySelector('.quote-form [name="quantity"]')?.focus({ preventScroll: true });
      }, 600);
    });
  });

  // Hide the pinned phone buttons while the quote form itself is on screen.
  const bar = root.querySelector(".mobile-quote-bar");
  const panel = document.getElementById("quote");
  if (bar && panel && "IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      bar.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(panel);
  }
}

// ---------- PRODUCTS PAGE BANNER: cut-out product carousel ----------

let carouselTimer = null;
let carouselIndex = 0; // remembered so a language switch keeps the same product showing

// Products shown in the cut-out carousel. Each has a transparent-background
// image in images/showcase/<SKU>.webp (made from the product photo).
const CAROUSEL_SKUS = [
  "CAR-0110", "CAR-0264", "CAR-0114", "CAR-0258", "CAR-0123", "CAR-0170",
  "CAR-0273", "CAR-0133", "CAR-0018", "CAR-0124", "CAR-0135", "CAR-0129",
];
const CAROUSEL_PAUSE_MS = 2600;

function renderCarousel(root) {
  const items = CAROUSEL_SKUS
    .map(sku => state.products.find(item => item.sku === sku))
    .filter(Boolean);
  if (!items.length) return;

  root.innerHTML = `
    <div class="reel" role="region" aria-roledescription="carousel"
         aria-label="${text("Productos destacados", "Featured products")}">
      <div class="reel-stage">
        <span class="reel-glow" aria-hidden="true"></span>
        <div class="reel-window">
          ${items.map((item, index) => `
            <a class="reel-item" href="product.html?id=${encodeURIComponent(item.sku)}"
               data-index="${index}" aria-label="${esc(productTitle(item))}">
              <img src="images/showcase/${esc(item.sku)}.webp?v=3" alt="" draggable="false">
            </a>
          `).join("")}
        </div>
        <button class="reel-arrow prev" type="button" aria-label="${text("Anterior", "Previous")}">‹</button>
        <button class="reel-arrow next" type="button" aria-label="${text("Siguiente", "Next")}">›</button>
      </div>
      <a class="reel-caption" href="#" aria-live="polite">
        <small></small>
        <span></span>
      </a>
      <div class="reel-ticks" aria-hidden="true">
        ${items.map(() => "<i></i>").join("")}
      </div>
    </div>
  `;

  const reel = root.querySelector(".reel");
  const nodes = [...root.querySelectorAll(".reel-item")];
  const ticks = [...root.querySelectorAll(".reel-ticks i")];
  const caption = root.querySelector(".reel-caption");
  const count = nodes.length;
  let current = carouselIndex % count;
  let previousOffsets = nodes.map(() => 0);

  const layout = () => {
    carouselIndex = current;
    nodes.forEach((node, index) => {
      // Shortest distance around the loop: -1 = left, 0 = centre, +1 = right
      let offset = index - current;
      if (offset > count / 2) offset -= count;
      if (offset < -count / 2) offset += count;
      const distance = Math.abs(offset);

      // Items wrapping from one end to the other jump without animating.
      const wrapped = Math.abs(offset - previousOffsets[index]) > 1;
      node.classList.toggle("no-anim", wrapped);
      previousOffsets[index] = offset;

      const scale = distance === 0 ? 1 : distance === 1 ? 0.56 : 0.4;
      node.style.transform = `translate(-50%, -50%) translateX(${offset * 70}%) scale(${scale})`;
      node.style.opacity = distance === 0 ? "1" : distance === 1 ? "0.5" : "0";
      node.style.zIndex = String(10 - distance);
      node.classList.toggle("is-center", distance === 0);
      node.tabIndex = distance === 0 ? 0 : -1;
      node.setAttribute("aria-hidden", distance === 0 ? "false" : "true");
    });
    ticks.forEach((tick, index) => tick.classList.toggle("on", index === current));

    const item = items[current];
    caption.href = `product.html?id=${encodeURIComponent(item.sku)}`;
    caption.querySelector("small").textContent = categoryLabel(item.category);
    caption.querySelector("span").textContent = productTitle(item);
  };

  const go = step => {
    current = (current + step + count) % count;
    layout();
  };

  root.querySelector(".reel-arrow.prev").addEventListener("click", () => { go(-1); restart(); });
  root.querySelector(".reel-arrow.next").addEventListener("click", () => { go(1); restart(); });
  // Clicking a side item brings it to the centre instead of leaving the page.
  nodes.forEach(node => node.addEventListener("click", event => {
    const index = Number(node.dataset.index);
    if (index !== current) {
      event.preventDefault();
      current = index;
      layout();
      restart();
    }
  }));

  // Pause while the visitor is looking at or using the carousel.
  let paused = false;
  reel.addEventListener("mouseenter", () => { paused = true; });
  reel.addEventListener("mouseleave", () => { paused = false; });
  reel.addEventListener("focusin", () => { paused = true; });
  reel.addEventListener("focusout", () => { paused = false; });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function restart() {
    clearInterval(carouselTimer);
    if (reduced) return;
    carouselTimer = setInterval(() => {
      if (!paused && !document.hidden) go(1);
    }, CAROUSEL_PAUSE_MS);
  }

  layout();
  restart();
}

function renderShowcase() {
  const root = document.getElementById("hero-showcase");
  if (!root || !state.products.length) return;

  clearInterval(carouselTimer);
  root.className = "hero-showcase variant-carousel";
  renderCarousel(root);
}

async function initialize() {
  // Switch the page text to the saved language straight away,
  // instead of waiting for the product data to download.
  localizeStatic();

  // The privacy page only needs the language switch, not the product data.
  if (document.body.dataset.page === "privacy") return;

  const response =
    await fetch("data/products.json?v=20261107-1");

  if (!response.ok) {
    throw new Error(
      "Product data could not be loaded."
    );
  }

  state.products = await response.json();

  const requestedCategory = new URLSearchParams(location.search).get("category");
  const availableCategories = new Set(
    state.products.map(product => product.category)
  );

  state.category = requestedCategory === "all" || !requestedCategory
    ? "all"
    : availableCategories.has(requestedCategory)
      ? requestedCategory
      : "all";

  localizeStatic();

  if (document.body.dataset.page === "catalog") {
    document
      .getElementById("product-search")
      ?.addEventListener("input", event => {
        state.query = event.target.value;
        renderCatalog();
      });

    renderCatalog();
    renderShowcase();
  } else {
    renderProduct();
  }
}

document
  .querySelectorAll(".lang-button")
  .forEach(button => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;

      saveLanguage(state.lang);

      localizeStatic();

      if (document.body.dataset.page === "catalog") {
        renderCatalog();
        renderShowcase();
      } else {
        renderProduct();
      }
    });
  });

initialize().catch(error => {
  const root =
    document.getElementById("catalog-results") ||
    document.getElementById("product-view");

  if (root) {
    root.innerHTML = `
      <div class="empty-state">
        ${text(
          "No fue posible cargar el catálogo.",
          "The catalog could not be loaded."
        )}
      </div>
    `;
  }

  console.error(error);
});

function openCatalogLightbox(src, altText) {
  let box = document.getElementById("catalog-image-lightbox");
  if (!box) {
    box = document.createElement("div");
    box.id = "catalog-image-lightbox";
    box.className = "catalog-lightbox";
    box.innerHTML = `<button class="catalog-lightbox-close" type="button" aria-label="${text("Cerrar imagen ampliada", "Close enlarged image")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><img class="catalog-lightbox-image" alt="">`;
    document.body.appendChild(box);
    box.addEventListener("click", (e) => {
      if (e.target === box || e.target.closest(".catalog-lightbox-close")) {
        box.classList.remove("open");
        document.body.classList.remove("lightbox-open");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        box.classList.remove("open");
        document.body.classList.remove("lightbox-open");
      }
    });
  }
  const image = box.querySelector(".catalog-lightbox-image");
  image.src = src;
  image.alt = altText || "";
  box.classList.add("open");
  document.body.classList.add("lightbox-open");
}

document.addEventListener("click", (event) => {
  const img = event.target.closest("img");
  if (img && /-catalog\.webp(?:$|\?)/i.test(img.getAttribute("src") || "")) {
    event.preventDefault();
    openCatalogLightbox(img.src, img.alt);
  }
});
document.addEventListener("keydown", (event) => {
  const img = event.target.closest && event.target.closest("img");
  if (img && /-catalog\.webp(?:$|\?)/i.test(img.getAttribute("src") || "") && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openCatalogLightbox(img.src, img.alt);
  }
});
