// === GTA V Asset Gallery (Ashu Mods Final Fix) ===
// Works with CAPITAL folder names (TASK, HEAD, etc.)
// Layout & design remain unchanged.

const basePath = "public/thumbnails";
const genders = ["male", "female"];
const groups = ["ALL","ACCS","BERD","DECL","FEET","HAIR","HAND","HEAD","JBIB","LOWR","TASK","TEEF","UPPR"];
const maxImages = 3000;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loadBtn")?.addEventListener("click", loadImages);
});

async function fetchFolderImages(path) {
  const api = `https://api.github.com/repos/gta5assets/GTA-V-Asset-Gallery/contents/${path}`;
  try {
    const res = await fetch(api);
    if (!res.ok) return [];
    const data = await res.json();
    return data
      .filter(f => f.type === "file" && f.name.toLowerCase().endsWith(".png"))
      .map(f => ({
        name: f.name,
        url: f.download_url
      }));
  } catch (e) {
    console.error("fetch error:", e);
    return [];
  }
}

async function loadImages() {
  const gender = document.getElementById("genderSelect")?.value || "male";
  const group = document.getElementById("groupSelect")?.value || "ALL";
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  gallery.innerHTML = `<p>Loading images...</p>`;

  const folders = group === "ALL" ? groups.filter(g => g !== "ALL") : [group];
  let count = 0;
  const fragment = document.createDocumentFragment();

  for (const g of folders) {
    // Convert group to uppercase to match GitHub folders
    const path = `${basePath}/${gender}/${g.toUpperCase()}`;
    const imgs = await fetchFolderImages(path);

    for (let i = 0; i < Math.min(imgs.length, maxImages); i++) {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.style.alignItems = "center";
      div.style.margin = "6px";

      const img = document.createElement("img");
      img.src = imgs[i].url;
      img.loading = "lazy";
      img.style.width = "128px";
      img.style.height = "128px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "6px";
      img.style.boxShadow = "0 0 4px rgba(0,0,0,0.5)";
      img.onclick = () => window.open(imgs[i].url, "_blank");

      const label = document.createElement("span");
      label.textContent = imgs[i].name;
      label.style.fontSize = "11px";
      label.style.color = "#aaa";
      label.style.marginTop = "4px";

      div.appendChild(img);
      div.appendChild(label);
      fragment.appendChild(div);
      count++;
    }
  }

  gallery.innerHTML = "";
  gallery.appendChild(fragment);
  if (count === 0) gallery.innerHTML = `<p>No images found.</p>`;
}
