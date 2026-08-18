const state = {
  lang: localStorage.getItem("carasia-language") || "es",
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

  document.querySelectorAll("[data-es][data-en]").forEach(element => {
    element.textContent = element.dataset[state.lang];
  });

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
              <span><span class="sku-nowrap">${esc(product.sku)}</span>${product.model && product.category !== "LED Lights" ? ` · ${esc(product.model)}` : ""}</span>
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

  root.innerHTML = [
    `
      <button
        class="filter-button ${
          state.category === "all" ? "active" : ""
        }"
        data-category="all"
      >
        ${text("Todos", "All")}
      </button>
    `,
    ...categories.map(category => `
      <button
        class="filter-button ${
          state.category === category ? "active" : ""
        }"
        data-category="${esc(category)}"
      >
        ${esc(categoryLabel(category))}
      </button>
    `),
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

  const subject = encodeURIComponent(
    `${text("Consulta sobre", "Inquiry about")} ` +
    `${product.sku} - ${productTitle(product)}`
  );

  const message = encodeURIComponent(
    `${text(
      "Hola, quisiera solicitar información sobre",
      "Hello, I would like information about"
    )} ${product.sku} - ${productTitle(product)}.`
  );

  root.innerHTML = `
    <a class="back-link" href="catalog.html">
      ← ${text("Volver al catálogo", "Back to catalog")}
    </a>

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
            >
          </div>
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
          <span class="sku-nowrap">${esc(product.sku)}</span>
          ${product.model && product.category !== "LED Lights"
            ? ` · ${esc(product.model)}`
            : ""}
        </div>

        <p class="product-intro">
          ${esc(application(product))}
        </p>

        <section class="detail-panel">
          <h2>
            ${text("Especificaciones", "Specifications")}
          </h2>

          <p>${esc(specifications(product))}</p>
        </section>

        <section class="detail-panel">
          <h2>
            ${text(
              "Disponibilidad y cotización",
              "Availability and quotation"
            )}
          </h2>

          <p>
            ${text(
              "Las cantidades, opciones, plazos y precios se confirman según los requisitos de cada solicitud.",
              "Quantities, options, lead times, and pricing are confirmed according to each inquiry's requirements."
            )}
          </p>
        </section>

        <div class="cta-row">
          <a
            class="button button-primary"
            href="mailto:carasiaconsulting@gmail.com?subject=${subject}&body=${message}"
          >
            ${text(
              "Solicitar cotización",
              "Request a quote"
            )}
          </a>

          <a
            class="button button-secondary"
            href="index.html#contact"
          >
            ${text(
              "Contactar a Carasia",
              "Contact Carasia"
            )}
          </a>
        </div>
      </article>
    </div>
  `;
}

async function initialize() {
  const response =
    await fetch("data/products.json");

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
  } else {
    renderProduct();
  }
}

document
  .querySelectorAll(".lang-button")
  .forEach(button => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;

      localStorage.setItem(
        "carasia-language",
        state.lang
      );

      localizeStatic();

      document.body.dataset.page === "catalog"
        ? renderCatalog()
        : renderProduct();
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
    box.innerHTML = '<button class="catalog-lightbox-close" type="button" aria-label="Close enlarged image">&times;</button><img class="catalog-lightbox-image" alt="">';
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
