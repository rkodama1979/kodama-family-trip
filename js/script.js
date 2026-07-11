
const regionNames = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "関東",
  chubu: "中部",
  kinki: "近畿",
  chugoku: "中国",
  shikoku: "四国",
  kyushu: "九州",
  okinawa: "沖縄"
};

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".global-nav");
const cards = [...document.querySelectorAll(".destination-card")];
const regions = [...document.querySelectorAll(".map-region:not(.disabled)")];
const mapStatus = document.getElementById("map-status");
const destinationCount = document.getElementById("destination-count");
const resetMap = document.getElementById("reset-map");
const emptyState = document.getElementById("empty-state");
const emptyReset = document.getElementById("empty-reset");
const toast = document.getElementById("toast");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu() {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
  document.body.classList.toggle("menu-open", !open);
});

document.querySelectorAll(".global-nav a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

function filterDestinations(region = null) {
  let visible = 0;

  cards.forEach(card => {
    const show = !region || card.dataset.region === region;
    card.classList.toggle("is-hidden", !show);
    if (show) visible += 1;
  });

  regions.forEach(item => {
    item.classList.toggle("active", item.dataset.region === region);
  });

  if (region) {
    mapStatus.textContent = `${regionNames[region]}地方の候補地を表示中`;
    destinationCount.textContent = `${visible}件の候補地を表示中`;
  } else {
    mapStatus.textContent = "全国の候補地を表示中";
    destinationCount.textContent = `${visible}件の候補地を表示中`;
  }

  emptyState.hidden = visible !== 0;
  document.getElementById("destinations").scrollIntoView({ behavior: "smooth", block: "start" });
}

regions.forEach(region => {
  const selectRegion = () => filterDestinations(region.dataset.region);

  region.addEventListener("click", selectRegion);
  region.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectRegion();
    }
  });
});

resetMap.addEventListener("click", () => filterDestinations());
emptyReset.addEventListener("click", () => filterDestinations());

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

document.querySelectorAll(".details-button").forEach(button => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.destination}の詳細ページは次の段階で追加します`);
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});
updateHeader();


// Make each destination card clickable without adding animation.
document.querySelectorAll(".destination-card").forEach(card => {
  const detailLink = card.querySelector(".details-link");
  if (!detailLink) return;

  const openCard = event => {
    if (event.target.closest("a, button")) return;
    window.location.href = detailLink.href;
  };

  card.addEventListener("click", openCard);
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = detailLink.href;
    }
  });
});
