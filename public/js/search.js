// public/js/search.js

const input = document.getElementById("destinationInput");
const dropdown = document.getElementById("searchDropdown");

let debounceTimer;

function showDropdown() {
  dropdown.classList.remove("d-none");
  dropdown.style.display = "block";
}

function hideDropdown() {
  dropdown.classList.add("d-none");
  dropdown.style.display = "none";
}

function escapeHTML(str = "") {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

async function fetchSuggestions(query) {
  const res = await fetch(`/listings/search/suggestions?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data;
}

input.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  const q = input.value.trim();

  if (!q) {
    hideDropdown();
    dropdown.innerHTML = "";
    return;
  }

  debounceTimer = setTimeout(async () => {
    try {
      const results = await fetchSuggestions(q);

      dropdown.innerHTML = "";

      if (!results.length) {
        dropdown.innerHTML = `<div class="drop-item disabled">No results found</div>`;
        showDropdown();
        return;
      }

      results.forEach((item) => {
        const text = item; // item is already the formatted string from backend

        const div = document.createElement("div");
        div.className = "drop-item";
        div.innerHTML = `
          <i class="fa-solid fa-location-dot"></i>
          <span>${escapeHTML(text)}</span>
        `;

        // ✅ click -> fill input + close dropdown
        div.addEventListener("click", () => {
          input.value = text;
          hideDropdown();
        });

        dropdown.appendChild(div);
      });

      showDropdown();
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  }, 250); // ✅ debounce = 250ms
});

// ✅ click outside -> close dropdown
document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target) && e.target !== input) {
    hideDropdown();
  }
});

// ✅ focus -> show dropdown if already has results
input.addEventListener("focus", () => {
  if (dropdown.innerHTML.trim() !== "") {
    showDropdown();
  }
});
