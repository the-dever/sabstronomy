const space = document.querySelector(".space");
const stars = document.querySelector(".stars-container");
const moon = document.querySelector(".moon");
const overlay = document.querySelector(".overlay");
const cross = document.querySelector(".cross");
const starZodiac = document.querySelector(".zodiac-star");
const modalInfo = document.querySelector(".modal-info");
const modalZodiac = document.querySelector(".modal-zodiac");
const modalDetails = document.querySelectorAll(".modal-details");
const modalDetailsToday = document.querySelector(".modal-details-today");
// prettier-ignore
const modalDetailsYesterday = document.querySelector(".modal-details-yesterday");
const modalDetailsTomorrow = document.querySelector(".modal-details-tomorrow");
const btns = document.querySelectorAll(".btn");

let requestedSign;

/* ---------------------------------------------------------- MARKUP -------------------------------------------------------------- */
const generateMarkup = (id, when = "today") => {
  return `
    <figure><img src="images/${id.requested}.jpg" alt="${
    id.requested
  }-sign" /></figure>
    <p class="date-range">${id.date_range}</p>
    <div>
      <p>Date: ${id.current_date}</p>
      <p>Mood: ${id.mood}</p>
      <p>Compatibility: ${id.compatibility}</p>
      <p>Colour: ${id.color}</p>
      <p>Lucky Time: ${id.lucky_time}</p>
      <p>Lucky Number: ${id.lucky_number}</p>
    </div>
    <p>${id.description}</p>${
    when === "today"
      ? `
      <div class="detail-actions">
        <button id='yesterday'><i class="fas fa-arrow-left"></i> YESTERDAY</button>
        <button id='tomorrow'>TOMORROW <i class="fas fa-arrow-right"></i></button>
      </div>
      `
      : when === "yesterday"
      ? `
      <div class="detail-actions">
        <button id='today'>TODAY <i class="fas fa-arrow-right"></i></button>
      </div>
      `
      : `
      <div class="detail-actions">
        <button id='today'><i class="fas fa-arrow-left"></i> TODAY</button>
      </div>
      `
  }
  `;
};

/* ---------------------------------------------------------- FETCHING DATA -------------------------------------------------------------- */
const fetchData = async (sign, when = "today", modalType) => {
  try {
    const response = await fetch(
      `https://aztro.sameerkumar.website/?sign=${sign}&day=${when}`,
      {
        method: "POST",
      }
    );
    if (!response.ok)
      throw new Error(
        "Details for the requested sign is not available right now :("
      );
    const data = await response.json();
    data.requested = sign;
    const markup = generateMarkup(data, when);
    modalType.innerHTML = "";
    modalType.insertAdjacentHTML("afterbegin", markup);
    modalType.style.background = `linear-gradient(to bottom right,rgba(33, 33, 33, 0.7), rgba(33, 33, 33, 0.7)),url(images/${sign}.jpg)`;
    modalType.style.backgroundPosition = "center";
    modalType.style.backgroundSize = "cover";
  } catch (err) {
    modalType.innerHTML = "";
    modalType.insertAdjacentHTML("afterbegin", `<p>${err.message}</p>`);
    console.log(err);
  }
};

/* ---------------------------------------------------------- General MODAL -------------------------------------------------------------- */
moon.addEventListener("click", () => {
  overlay.classList.add("overlay-active");
  modalInfo.classList.add("modal-active");
  cross.classList.add("cross-active");
});

document.body.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("moon") ||
    e.target.closest(".modal-info") ||
    e.target.classList.contains("zodiac-star") ||
    e.target.closest(".modal-zodiac") ||
    e.target.closest(".modal-details")
  )
    return;
  overlay.classList.remove("overlay-active");
  cross.classList.remove("cross-active");
  modalInfo.classList.remove("modal-active");
  modalZodiac.classList.remove("modal-active");
  modalDetailsToday.classList.remove("modal-active");
  modalDetailsYesterday.classList.remove("modal-active");
  modalDetailsTomorrow.classList.remove("modal-active");
});

/* ---------------------------------------------------------- ZODIAC MODAL -------------------------------------------------------------- */
starZodiac.addEventListener("click", () => {
  overlay.classList.add("overlay-active");
  modalZodiac.classList.add("modal-active");
  cross.classList.add("cross-active");
});

modalZodiac.addEventListener("click", (e) => {
  const clicked = e.target;
  if (!clicked.classList.contains("btn")) return;
  modalZodiac.classList.remove("modal-active");
  modalDetailsToday.classList.add("modal-active");
  requestedSign = clicked.id;
  console.log(requestedSign);
  // FETCHING DATA
  fetchData(clicked.id, "today", modalDetailsToday);
});

/* ---------------------------------------------------------- DETAILS MODAL -------------------------------------------------------------- */

[modalDetailsToday, modalDetailsTomorrow, modalDetailsYesterday].forEach(
  (modal) => {
    modal.addEventListener("click", (e) => {
      const clicked = e.target;
      if (!clicked.closest(".detail-actions")) return;
      if (clicked.id === "today") {
        fetchData(requestedSign, clicked.id, modalDetailsToday);
        modalDetailsToday.classList.add("modal-active");
        modalDetailsYesterday.classList.remove("modal-active");
        modalDetailsTomorrow.classList.remove("modal-active");
      }

      if (clicked.id === "tomorrow") {
        fetchData(requestedSign, clicked.id, modalDetailsTomorrow);
        modalDetailsTomorrow.classList.add("modal-active");
        modalDetailsToday.classList.remove("modal-active");
        modalDetailsYesterday.classList.remove("modal-active");
      }

      if (clicked.id === "yesterday") {
        fetchData(requestedSign, clicked.id, modalDetailsYesterday);
        modalDetailsYesterday.classList.add("modal-active");
        modalDetailsToday.classList.remove("modal-active");
        modalDetailsTomorrow.classList.remove("modal-active");
      }
    });
  }
);

/* ---------------------------------------------------------- STARS -------------------------------------------------------------- */
const multiplyStars = () => {
  const num = Math.trunc(Math.random() * 50) + 10;
  const arr = Array(num).fill(0);
  arr.forEach((a) => {
    const markup = `<div class="stars" style="top:${
      Math.trunc(Math.random() * 90) + 2
    }%;left:${Math.trunc(Math.random() * 96) + 2}%;animation-duration:${
      Math.trunc(Math.random() * 15) + 2
    }s;"></div>`;
    stars.insertAdjacentHTML("afterbegin", markup);
  });
};
multiplyStars();

/* ---------------------------------------------------------- WIND -------------------------------------------------------------- */
const multiplyWind = () => {
  space.insertAdjacentHTML(
    "afterbegin",
    `<div class="wind-container"><span class="wind" style="top:-${
      Math.random() * 35 + 2
    }rem;"></span></div>`
  );
  setInterval(() => {
    space.insertAdjacentHTML(
      "afterbegin",
      `<div class="wind-container"><span class="wind" style="top:-${
        Math.random() * 35 + 2
      }rem;"></span></div>`
    );
  }, 300);

  setInterval(() => {
    space.childNodes.forEach((s) => {
      if (s.classList.contains("wind-container")) s.remove();
    });
  }, 20000);
};
multiplyWind();
