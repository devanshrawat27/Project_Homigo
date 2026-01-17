const input = document.getElementById("destinationInput");
const dropdown = document.getElementById("searchDropdown");

const suggestions = [
  "Dehradun",
  "Delhi",
  "Mumbai",
  "Goa",
  "Jaipur",
  "Rishikesh",
  "Manali",
  "Shimla",
  "Bangalore",
  "Hyderabad"
];

function renderDropdown(items) {
  dropdown.innerHTML = "";

  if (items.length === 0) {
    dropdown.style.display = "none";
    return;
  }

  items.forEach((city) => {
    const div = document.createElement("div");
    div.className = "drop-item";
    div.textContent = city;

    div.addEventListener("click", () => {
      input.value = city;
      dropdown.style.display = "none";
    });

    dropdown.appendChild(div);
  });

  dropdown.style.display = "block";
}

if (input && dropdown) {

  input.addEventListener("focus", () => {
    renderDropdown(suggestions);
  });

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase();
    const filtered = suggestions.filter((c) => c.toLowerCase().includes(val));
    renderDropdown(filtered);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".homigo-search")) {
      dropdown.style.display = "none";
    }
  });
}
