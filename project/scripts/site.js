const gardenTerms = [
  {
    id: "compost",
    word: "Compost",
    category: "Soil & compost",
    definition: "Organic material that has broken down into a dark, crumbly soil amendment. Finished compost adds organic matter and supports healthy soil structure."
  },
  {
    id: "drip-line",
    word: "Drip line",
    category: "Plant care",
    definition: "The circle on the ground beneath the outer edge of a plant's canopy. Many feeder roots grow near this area, so water applied here can reach active roots."
  },
  {
    id: "full-sun",
    word: "Full sun",
    category: "Light & climate",
    definition: "A plant label's direction for a location that receives around six or more hours of direct sunlight daily. Check the needs of each plant and your local conditions."
  },
  {
    id: "germination",
    word: "Germination",
    category: "Plant life",
    definition: "The process in which a seed absorbs water and begins to sprout. Suitable warmth, moisture, and sometimes light help seeds germinate."
  },
  {
    id: "hardiness-zone",
    word: "Hardiness zone",
    category: "Light & climate",
    definition: "A region grouped by its typical coldest winter temperatures. A plant's hardiness zone can help indicate whether it may survive winter outdoors in your area."
  },
  {
    id: "mulch",
    word: "Mulch",
    category: "Soil & compost",
    definition: "A protective layer placed on the soil surface, often made from leaves, bark, or straw. Mulch can help moderate soil temperature and reduce moisture loss."
  },
  {
    id: "partial-shade",
    word: "Partial shade",
    category: "Light & climate",
    definition: "A growing spot that receives some direct sunlight but is shaded for part of the day. The exact hours vary by plant label and local growing conditions."
  },
  {
    id: "perennial",
    word: "Perennial",
    category: "Plant life",
    definition: "A plant that lives for more than two years. Many perennials grow and flower during favorable seasons, then return from their roots or stems."
  },
  {
    id: "pruning",
    word: "Pruning",
    category: "Plant care",
    definition: "The selective removal of plant stems, branches, or leaves. The best timing and technique depend on the plant and the reason for pruning."
  },
  {
    id: "soil-drainage",
    word: "Soil drainage",
    category: "Soil & compost",
    definition: "How readily excess water moves through soil. Good drainage helps keep roots supplied with air, while different plants tolerate different moisture levels."
  },
  {
    id: "transplant",
    word: "Transplant",
    category: "Plant care",
    definition: "A young plant started elsewhere and moved into its growing location. Gradually acclimating seedlings outdoors can help prepare them for the change."
  },
  {
    id: "well-watered",
    word: "Water deeply",
    category: "Watering",
    definition: "Apply enough water to moisten the soil around the root zone rather than only wetting the surface. How much and how often depends on soil, weather, and plant."
  }
];

const savedTermsKey = "rootedLexiconSavedTerms";

function getSavedTerms() {
  try {
    const saved = JSON.parse(localStorage.getItem(savedTermsKey) ?? "[]");
    return Array.isArray(saved)
      ? saved.filter((id) => gardenTerms.some((term) => term.id === id))
      : [];
  } catch (error) {
    console.error(`Unable to read saved garden terms from localStorage.`, error);
    return [];
  }
}

function saveTerms(ids) {
  try {
    localStorage.setItem(savedTermsKey, JSON.stringify(ids));
    return true;
  } catch (error) {
    console.error(`Unable to save garden terms to localStorage.`, error);
    return false;
  }
}

function renderTerms(terms, savedIds) {
  const list = document.querySelector("#term-list");
  if (!list) return;

  if (terms.length === 0) {
    list.innerHTML = `<p class="no-results">No terms match that search. Try another word or browse all definitions.</p>`;
    return;
  }

  list.innerHTML = terms.map((term) => {
    const isSaved = savedIds.includes(term.id);
    return `
      <article class="term-card">
        <p class="term-category">${term.category}</p>
        <h3>${term.word}</h3>
        <p class="term-definition">${term.definition}</p>
        <button class="save-button" type="button" data-term-id="${term.id}" aria-pressed="${isSaved}">
          ${isSaved ? "♥ Saved" : "♡ Save term"}
        </button>
      </article>`;
  }).join("");
}

function renderSavedTerms(savedIds) {
  const savedList = document.querySelector("#saved-list");
  const savedCount = document.querySelector("#saved-count");
  if (!savedList || !savedCount) return;

  const savedTerms = gardenTerms.filter((term) => savedIds.includes(term.id));
  savedCount.textContent = `${savedTerms.length}`;
  savedList.innerHTML = savedTerms.length
    ? savedTerms.map((term) => `
      <div class="saved-item">
        <span>${term.word}</span>
        <button type="button" data-remove-term="${term.id}" aria-label="Remove ${term.word} from saved terms">Remove</button>
      </div>`).join("")
    : `<p class="empty-message">Your saved terms will appear here.</p>`;
}

function updateLexicon(searchText = "") {
  const normalizedSearch = searchText.trim().toLocaleLowerCase();
  const matchingTerms = gardenTerms.filter((term) =>
    `${term.word} ${term.category} ${term.definition}`.toLocaleLowerCase().includes(normalizedSearch)
  );
  const resultCount = document.querySelector("#result-count");
  const savedIds = getSavedTerms();

  renderTerms(matchingTerms, savedIds);
  renderSavedTerms(savedIds);
  if (resultCount) {
    resultCount.textContent = normalizedSearch
      ? `${matchingTerms.length} ${matchingTerms.length === 1 ? "term" : "terms"} found.`
      : `${matchingTerms.length} garden terms to explore.`;
  }
}

function toggleSavedTerm(termId) {
  const savedIds = getSavedTerms();
  const updatedIds = savedIds.includes(termId)
    ? savedIds.filter((id) => id !== termId)
    : [...savedIds, termId];

  if (saveTerms(updatedIds)) {
    const search = document.querySelector("#term-search");
    updateLexicon(search?.value ?? "");
  }
}

function setDailyTerm() {
  const heading = document.querySelector("#daily-term");
  const definition = document.querySelector("#daily-definition");
  if (!heading || !definition) return;

  const dayIndex = Math.floor(Date.now() / 86400000) % gardenTerms.length;
  const term = gardenTerms[dayIndex];
  heading.textContent = `Today's word: ${term.word}`;
  definition.textContent = `${term.definition}`;
}

function handleQuestionSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#form-status");
  if (!(form instanceof HTMLFormElement) || !status) return;

  const formData = new FormData(form);
  const question = {
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
    updates: formData.has("updates"),
    submittedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem("rootedLexiconLastQuestion", JSON.stringify(question));
    status.textContent = `Thanks, ${question.name}! Your question is saved in this browser.`;
    form.reset();
  } catch (error) {
    console.error(`Unable to save the garden question to localStorage.`, error);
    status.textContent = `Your browser could not save this question. Please try again or check its storage settings.`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = `${new Date().getFullYear()}`;
  });

  const lastModifiedElement = document.querySelector("[data-last-modified]");
  if (lastModifiedElement) {
    const lastModified = new Date(document.lastModified);
    lastModifiedElement.textContent = `${lastModified.toLocaleString()}`;
    lastModifiedElement.setAttribute("datetime", `${lastModified.toISOString()}`);
  }

  setDailyTerm();

  const search = document.querySelector("#term-search");
  if (search instanceof HTMLInputElement) {
    const params = new URLSearchParams(window.location.search);
    search.value = params.get("term") ?? "";
    updateLexicon(search.value);
    search.addEventListener("input", () => updateLexicon(search.value));

    document.querySelector("#clear-search")?.addEventListener("click", () => {
      search.value = "";
      updateLexicon();
      search.focus();
    });

    document.querySelector("#term-list")?.addEventListener("click", (event) => {
      const button = event.target instanceof Element
        ? event.target.closest("[data-term-id]")
        : null;
      const termId = button?.getAttribute("data-term-id");
      if (termId) toggleSavedTerm(termId);
    });

    document.querySelector("#saved-list")?.addEventListener("click", (event) => {
      const button = event.target instanceof Element
        ? event.target.closest("[data-remove-term]")
        : null;
      const termId = button?.getAttribute("data-remove-term");
      if (termId) toggleSavedTerm(termId);
    });
  }

  document.querySelector("#question-form")?.addEventListener("submit", handleQuestionSubmit);
});
