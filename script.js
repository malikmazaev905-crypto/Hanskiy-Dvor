
document.documentElement.classList.add("js-ready");

// PRELOADER
const preloader = document.querySelector(".preloader");

function finishLoading() {
  preloader?.classList.add("done");
  document.body.classList.remove("loading");
}

document.body.classList.add("loading");

window.addEventListener("load", () => {
  window.setTimeout(finishLoading, 650);
});

// Fallback: не оставляем прелоадер поверх страницы надолго.
window.setTimeout(finishLoading, 2200);

// SCROLL REVEALS
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// MOBILE MENU
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function closeMobileMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileNav.classList.toggle("open", !isOpen);
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 640) closeMobileMenu();
});

// CART
const cart = [];

const cartCount = document.querySelector("#cart-count");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const toast = document.querySelector(".toast");

let toastTimer;

function formatMoney(amount) {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = count;
  cartTotal.textContent = formatMoney(total);

  if (cart.length === 0) {
    cartItems.textContent = "Пока ничего не выбрано.";
    return;
  }

  cartItems.textContent = cart
    .map((item) => `${item.name} × ${item.quantity}`)
    .join(" · ");
}

document.querySelectorAll(".dish-add").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.dish;
    const price = Number(button.dataset.price);

    if (!name || !Number.isFinite(price) || price <= 0) return;

    const existing = cart.find((item) => item.name === name);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    renderCart();
    showToast(`${name} добавлено в корзину`);

    button.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(.86)" },
        { transform: "scale(1)" }
      ],
      { duration: 250, easing: "ease-out" }
    );
  });
});

document.querySelector("#clear-cart").addEventListener("click", () => {
  cart.length = 0;
  renderCart();
  showToast("Корзина очищена");
});

// BRANCH SELECTOR
const branches = {
  center: {
    name: "Центральный",
    address: "Адрес будет добавлен после согласования.",
    hours: "График работы уточняется."
  },
  park: {
    name: "У парка",
    address: "Демонстрационный адрес — замените реальным.",
    hours: "График работы уточняется."
  },
  avenue: {
    name: "Проспект",
    address: "Демонстрационный адрес — замените реальным.",
    hours: "График работы уточняется."
  }
};

document.querySelectorAll(".branch-button").forEach((button) => {
  button.addEventListener("click", () => {
    const branch = branches[button.dataset.branch];

    if (!branch) return;

    document.querySelectorAll(".branch-button").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    document.querySelector("#branch-name").textContent = branch.name;
    document.querySelector("#branch-address").textContent = branch.address;
    document.querySelector("#branch-hours").textContent = branch.hours;
  });
});

// MAGNETIC BUTTONS — subtle pointer movement on desktop
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canHover && !reduceMotion) {
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(${x * 0.06}px, ${y * 0.08}px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

renderCart();
