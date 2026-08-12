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
    es: "Accesorios para vehÃ­culos",
    en: "Vehicle Accessories"
  },
  "Construction Tools": {
    es: "Herramientas de construcciÃ³n",
    en: "Construction Tools"
  },
  "Solar & Energy": {
    es: "EnergÃ­a solar y almacenamiento",
    en: "Solar & Energy"
  },
};

const subcategoryNames = {
  "Floor Mats": {
    es: "Alfombras para vehÃ­culos",
    en: "Floor Mats"
  },
  "Warning Lights": {
    es: "Luces de advertencia",
    en: "Warning Lights"
  },
  "Energy Storage & Inverters": {
    es: "Almacenamiento e inversores",
    en: "Energy Storage & Inverters"
  },
  "Core Drilling": {
    es: "PerforaciÃ³n con corona",
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
        aria-label="${esc(productName(product))}"
      >
        <img
          src="${esc(product.image)}"
          alt="${esc(productName(product))}"
          loading="lazy"
        >
      </a>

      <div class="product-card-body">
        <div class="product-meta">
          <span>${esc(subcategoryLabel(product.subcategory))}</span>
          <span>${esc(product.sku)}</span>
        </div>

        <h3>${esc(productName(product))}</h3>

        <p>${esc(application(product))}</p>

        <a
          class="card-link"
          href="product.html?id=${encodeURIComponent(product.sku)}"
        >
          ${text("Ver detalles â†’", "View details â†’")}
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
  ];

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
  ];

  root.innerHTML = categories.map(category => {
    const products = visible.filter(
      product => product.category === category
    );

    return `
      <section class="category-block">
        <div class="category-heading">
          <div>
            <span class="eyebrow">
              ${text("CategorÃ­a", "Category")}
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
        â† ${text("Volver al catÃ¡logo", "Back to catalog")}
      </a>

      <div class="empty-state">
        ${text(
          "No se encontrÃ³ este producto.",
          "This product could not be found."
        )}
      </div>
    `;

    return;
  }

  document.title =
    `${productName(product)} | Carasia Consulting`;

  const subject = encodeURIComponent(
    `${text("Consulta sobre", "Inquiry about")} ` +
    `${product.sku} - ${productName(product)}`
  );

  const message = encodeURIComponent(
    `${text(
      "Hola, quisiera solicitar informaciÃ³n sobre",
      "Hello, I would like information about"
    )} ${product.sku} - ${productName(product)}.`
  );

  root.innerHTML = `
    <a class="back-link" href="catalog.html">
      â† ${text("Volver al catÃ¡logo", "Back to catalog")}
    </a>

    <div class="product-layout">
      <div class="product-gallery">
        <img
          src="${esc(product.image)}"
          alt="${esc(productName(product))}"
        >
      </div>

      <article class="product-details">
        <span class="product-category">
          ${esc(categoryLabel(product.category))}
          Â·
          ${esc(subcategoryLabel(product.subcategory))}
        </span>

        <h1>${esc(productName(product))}</h1>

        <div class="product-model">
          ${esc(product.sku)}
          ${product.model
            ? ` Â· ${esc(product.model)}`
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
              "Disponibilidad y cotizaciÃ³n",
              "Availability and quotation"
            )}
          </h2>

          <p>
            ${text(
              "Las cantidades, opciones, plazos y precios se confirman segÃºn los requisitos de cada solicitud.",
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
              "Solicitar cotizaciÃ³n",
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
          "No fue posible cargar el catÃ¡logo.",
          "The catalog could not be loaded."
        )}
      </div>
    `;
  }

  console.error(error);
});
