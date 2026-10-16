const wasteData = {
  wet: {
    name: "Wet Waste",
    badge: "Organic waste",
    icon: "🍃",
    description:
      "This item is generally organic waste and may be suitable for composting.",
    instructions: [
      "Place it in your designated wet-waste container.",
      "Keep it separate from paper, plastic, glass, and metals.",
      "Compost it if accepted by your local composting system.",
      "Follow local collection guidelines for meat, dairy, or oily food."
    ],
    examples: [
      "banana peel", "fruit peel", "vegetable scraps","onion peel",
      "food scraps", "leftover food", "tea leaves",
      "coffee grounds", "eggshell", "garden leaves",
      "flowers", "cooked rice" ,"banana", "orange", "mango"," watermelon",

 "potato peels", "onion skins", "carrot tops",

"rice", "bread", "cooked vegetables",

"Tea leaves", "coffee grounds",

"Eggshells",

"Flowers" , "wilted leaves",

"Small garden trimmings" , "grass clippings",
 ],
    note: "Avoid adding plastic wrappers or other non-compostable materials."
  },

  dry: {
    name: "Dry Waste",
    badge: "General dry waste",
    icon: "📦",
    description:
      "This item may belong in the dry-waste stream if it is not accepted for recycling.",
    instructions: [
      "Keep the item separate from wet and food waste.",
      "Check whether your local recycling program accepts this material.",
      "Keep dry waste clean and dry where practical.",
      "Use the appropriate residual-waste collection if recycling is unavailable."
    ],
    examples: [
      "dust", "sweepings", "used tissue",
      "dirty tissue", "sanitary pad", "diaper",
      "broken ceramic", "thermocol", "styrofoam",
      "multi layer packaging"
    ],
    note: "Some items require separate collection even when they appear to be ordinary dry waste."
  },

  recyclable: {
    name: "Recyclable Waste",
    badge: "Recoverable materials",
    icon: "♻️",
    description:
      "This material is commonly recyclable when it is accepted by your local facility and properly prepared.",
    instructions: [
      "Empty the item and remove food residue.",
      "Rinse containers when practical and let them dry.",
      "Separate paper, cardboard, metal, glass, and accepted plastics.",
      "Check local rules for caps, labels, cartons, and plastic types."
    ],
    examples: [
      "plastic bottle", "water bottle", "glass bottle",
      "glass jar", "newspaper", "paper",
      "cardboard", "aluminium can", "aluminum can",
      "metal can", "steel can", "clean cardboard box",
      "milk carton"
    ],
    note: "Recyclability depends on the material, contamination, and local collection facilities."
  },

  hazardous: {
    name: "Hazardous Waste",
    badge: "Special handling",
    icon: "⚠️",
    description:
      "This item may contain hazardous substances or require a dedicated collection channel.",
    instructions: [
      "Do not place it in ordinary wet- or dry-waste bins.",
      "Keep it away from children, pets, heat, and food.",
      "Use an authorized collection point or take-back program.",
      "Follow the product label and local hazardous-waste guidance."
    ],
    examples: [
      "battery", "lithium battery", "button cell",
      "paint", "pesticide", "chemical",
      "bleach", "cleaning chemical", "mercury thermometer",
      "fluorescent tube", "light bulb",
      "e-waste", "electronic waste", "mobile phone",
      "phone", "charger", "circuit board"
    ],
    note: "Do not puncture, burn, or dismantle batteries. If a battery is swollen, leaking, or hot, avoid handling it and seek specialist guidance."
  }
};

// Some common phrases should be checked before shorter keywords.
const rules = [
  {
    terms: ["lithium battery", "button cell", "car battery"],
    category: "hazardous"
  },
  {
    terms: ["plastic bottle", "water bottle", "milk carton"],
    category: "recyclable"
  },
  {
    terms: ["used tissue", "dirty tissue", "paper towel"],
    category: "dry"
  },
  {
    terms: ["fruit peel", "banana peel", "vegetable scraps"],
    category: "wet"
  },
  {
    terms: ["mobile phone", "electronic waste", "circuit board"],
    category: "hazardous"
  }
];

const searchForm = document.getElementById("searchForm");
const itemInput = document.getElementById("itemInput");
const resultSection = document.getElementById("resultSection");
const resultContent = document.getElementById("resultContent");

function normalize(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ");
}

function identifyWaste(input) {
  const item = normalize(input);

  if (!item) return null;

  // Check specific phrases first.
  for (const rule of rules) {
    if (rule.terms.some(term => item.includes(normalize(term)))) {
      return rule.category;
    }
  }

  // Then check the category example database.
  for (const [category, data] of Object.entries(wasteData)) {
    const match = data.examples.some(example => {
      const term = normalize(example);
      return item === term ||
        item.includes(term) ||
        term.includes(item);
    });

    if (match) return category;
  }

  return null;
}

// Escape user-provided text before inserting it into HTML.
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function showResult(item, category) {
  const safeItem = escapeHTML(item);
  const data = wasteData[category];

  resultSection.hidden = false;

  resultContent.innerHTML = `
    <article class="result-card">
      <span class="result-badge">
        ${data.icon} ${data.badge}
      </span>

      <h2>${safeItem}</h2>
      <p>${data.description}</p>

      <h3>Recommended disposal steps</h3>
      <ul>
        ${data.instructions.map(step =>
          `<li>${step}</li>`
        ).join("")}
      </ul>

      <p class="safety-note">
        <strong>Important:</strong>
        ${data.note}
      </p>

      <button class="result-close" id="closeResult" type="button">
        Close result
      </button>
    </article>
  `;

  document.getElementById("closeResult").addEventListener(
    "click",
    () => {
      resultSection.hidden = true;
      itemInput.focus();
    }
  );

  resultSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function showUnknown(item) {
  const safeItem = escapeHTML(item);

  resultSection.hidden = false;

  resultContent.innerHTML = `
    <article class="result-card">
      <span class="result-badge">🔎 More information needed</span>
      <h2>${safeItem}</h2>
      <p>
        We couldn't confidently identify this item from our
        built-in examples.
      </p>

      <h3>What should you do?</h3>
      <ul>
        <li>Check the material and product label.</li>
        <li>Look for local recycling or waste collection instructions.</li>
        <li>If it contains chemicals, electronics, or a battery,
            keep it out of ordinary waste bins until identified.</li>
        <li>Ask your local waste collection service if you are unsure.</li>
      </ul>

      <p class="safety-note">
        This tool uses example-based classification. An unknown
        result does not mean the item is safe or non-hazardous.
      </p>

      <button class="result-close" id="closeResult" type="button">
        Close result
      </button>
    </article>
  `;

  document.getElementById("closeResult").addEventListener(
    "click",
    () => {
      resultSection.hidden = true;
      itemInput.focus();
    }
  );

  resultSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();

  const item = itemInput.value.trim();
  if (!item) return;

  const category = identifyWaste(item);

  if (category) {
    showResult(item, category);
  } else {
    showUnknown(item);
  }
});

// Clicking a category shows its guidance directly.
document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    const data = wasteData[category];

    itemInput.value = "";
    showResult(data.name, category);
  });
});
