// === GTA V Asset Gallery - Category Wise Image Loader ===
// Author: Ashu Mods optimized edition

const baseFolder = "public/thumbnails";
const genders = ["male", "female"];
const groups = ["ALL", "ACCS", "BERD", "DECL", "FEET", "HAIR", "HAND", "HEAD", "JBIB", "LOWR", "TASK", "TEEF", "UPPR"];
const maxImagesPerFolder = 5000; // safe limit
const imageExt = ".png";

// UI references
const gallery = document.getElementById("gallery");
const statusEl = document.getElementById("status");
const loadBtn = document.getElementById("loadButton");

// Function to load images from GitHub folder
async function fetchFolderImages(path) {
  try {
    const apiUrl = `https://api.github.com/repos/gta5assets/GTA-V-Asset-Gallery/contents/${path}`;
    const res = await fetch(apiUrl);
    if (!res.ok) return [];
    const data = await res.json();
    return data
      .filter(item => item.type === "file" && item.name.toLowerCase().endsWith(imageExt))
      .map(item => item.download_url);
  } catch (e) {
    console.error("Fetch error:", e);
    return [];
  }
}

// Main loader
async function loadImages() {
  gallery.innerHTML = "";
  statusEl.textContent = "Loading images...";

  const maleChecked = document.getElementById("gender_male").checked;
  const femaleChecked = document.getElementById("gender_female").checked;

  // get all checked groups
  const groupCheckboxes = document.querySelectorAll("#groupsList input[type=checkbox]");
  const selectedGroups = Array.from(groupCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

  const gendersToLoad = [];
  if (maleChecked) gendersToLoad.push("male");
  if (femaleChecked) gendersToLoad.push("female");

  if (gendersToLoad.length === 0 || selectedGroups.length === 0) {
    statusEl.textContent = "Select at least one gender and one group.";
    return;
  }

  let totalImages = 0;
  for (const gender of gendersToLoad) {
    const genderPath = `${baseFolder}/${gender}`;

    let targetGroups = selectedGroups.includes("ALL") ? groups.filter(g => g !== "ALL") : selectedGroups;

    for (const group of targetGroups) {
      const folderPath = `${genderPath}/${group}`;
      statusEl.textContent = `Loading: ${folderPath}`;
      const images = await fetchFolderImages(folderPath);

      for (let i = 0; i < Math.min(images.length, maxImagesPerFolder); i++) {
        const img = document.createElement("img");
        img.src = images[i];
        img.className = "thumb";
        img.loading = "lazy";
        img.alt = `${gender}-${group}-${i}`;
        img.onclick = () => window.open(images[i], "_blank");
        gallery.appendChild(img);
        totalImages++;
      }
    }
  }

  statusEl.textContent = totalImages > 0 ? `Loaded ${totalImages} images successfully.` : "No images found.";
}

// Attach event
if (loadBtn) {
  loadBtn.addEventListener("click", loadImages);
}

console.log("✅ Bundle.js loaded successfully | Ashu Mods Edition");
