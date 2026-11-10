// Floating WhatsApp chat button, shown on every page.
// Self-contained: adds its own styles and follows the page language (EN/ES).
(() => {
  const NUMBER = "8613686014118";
  const copy = {
    en: { label: "Chat with us on WhatsApp", tip: "Chat with us", message: "Hi Carasia, I'd like help sourcing a product." },
    es: { label: "Escríbanos por WhatsApp", tip: "Escríbanos", message: "Hola Carasia, quisiera ayuda para encontrar un producto." },
  };

  const style = document.createElement("style");
  style.textContent = `
    .wa-float {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 60;
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-family: Arial, Helvetica, sans-serif;
    }
    .wa-float-tip {
      padding: 8px 12px;
      border-radius: 999px;
      background: #fff;
      color: #05275b;
      font-size: .85rem;
      font-weight: 800;
      box-shadow: 0 8px 22px rgba(5, 39, 91, .18);
      opacity: 0;
      transform: translateX(6px);
      transition: opacity .2s ease, transform .2s ease;
      pointer-events: none;
      white-space: nowrap;
    }
    .wa-float:hover .wa-float-tip,
    .wa-float:focus-visible .wa-float-tip { opacity: 1; transform: none; }
    .wa-float-button {
      display: grid;
      place-items: center;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #25d366;
      box-shadow: 0 10px 26px rgba(0, 0, 0, .28);
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .wa-float:hover .wa-float-button { transform: translateY(-2px) scale(1.04); box-shadow: 0 14px 30px rgba(0, 0, 0, .32); }
    .wa-float:focus-visible { outline: none; }
    .wa-float:focus-visible .wa-float-button { outline: 3px solid #f1ca76; outline-offset: 3px; }
    .wa-float-button svg { width: 32px; height: 32px; fill: #fff; }
    @media (max-width: 560px) {
      .wa-float { right: 14px; bottom: 14px; }
      .wa-float-button { width: 52px; height: 52px; }
      .wa-float-button svg { width: 28px; height: 28px; }
    }
    /* Product pages already pin Quote + WhatsApp buttons on phones */
    @media (max-width: 860px) {
      body[data-page="product"] .wa-float { display: none; }
    }
    @media print { .wa-float { display: none; } }
  `;
  document.head.appendChild(style);

  const link = document.createElement("a");
  link.className = "wa-float";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.dataset.umamiEvent = "contact-click";
  link.dataset.umamiEventChannel = "whatsapp-float";
  link.innerHTML = `
    <span class="wa-float-tip"></span>
    <span class="wa-float-button" aria-hidden="true">
      <svg viewBox="0 0 32 32"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8C29 8.7 23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.6l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.8C5.1 10 10 5.3 16 5.3S26.9 10 26.9 15.8 22 26.4 16 26.4zm6-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.7 1.2 3.1 1.3 3.3 2.3 3.5 5.5 4.9c2 .9 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.7-.3z"/></svg>
    </span>
  `;

  const update = () => {
    const t = copy[document.documentElement.lang === "es" ? "es" : "en"];
    link.href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(t.message)}`;
    link.setAttribute("aria-label", t.label);
    link.querySelector(".wa-float-tip").textContent = t.tip;
  };

  const start = () => {
    document.body.appendChild(link);
    update();
    // Follow the EN/ES switch, which changes <html lang="...">
    new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  };

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
