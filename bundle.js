// === Ashu Mods - Final Bundle ===
// Works with CAPITAL folders and shows filenames below images

const owner = "gta5assets";              // your GitHub username
const repo = "GTA-V-Asset-Gallery";      // repo name
const baseFolder = "public/thumbnails";
const genders = ["male", "female"];
const groups = ["ALL","ACCS","BERD","DECL","FEET","HAIR","HAND","HEAD","JBIB","LOWR","TASK","TEEF","UPPR"];
const maxImages = 1000;

document.getElementById("loadBtn").addEventListener("click", loadImages);

async function fetchFolderImages(path) {
  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  try {
    const res = await fetch(api);
    if (!res.ok) return [];
    const data = await res.json();
    return data.filter(f => f.type === "file" && f.name.toLowerCase().endsWith(".png"))
               .map(f => ({ name: f.name, url: f.download_url }));
  } catch (err) {
    console.error("fetch error:", err);
    return [];
  }
}

async function loadImages() {
  const gender = document.getElementById("genderSelect").value;
  const group = document.getElementById("groupSelect").value;
  const gallery = document.getElementById("gallery");
  const status = document.getElementById("status");

  gallery.innerHTML = "";
  status.textContent = "Loading images...";

  let folders = [];
  if (group === "ALL") folders = groups.filter(g => g !== "ALL");
  else folders = [group];

  let count = 0;
  for (const g of folders) {
    const path = `${baseFolder}/${gender}/${g.toUpperCase()}`;
    const imgs = await fetchFolderImages(path);

    for (const file of imgs) {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.style.alignItems = "center";

      const img = document.createElement("img");
      img.src = file.url;
      img.loading = "lazy";
      img.style.width = "128px";
      img.style.height = "128px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "8px";
      img.style.boxShadow = "0 0 4px rgba(0,0,0,0.4)";
      img.onclick = () => window.open(file.url, "_blank");

      const label = document.createElement("span");
      label.textContent = file.name;
      label.style.fontSize = "11px";
      label.style.color = "#aaa";
      label.style.marginTop = "4px";

      div.appendChild(img);
      div.appendChild(label);
      gallery.appendChild(div);
      count++;
    }
  }

  status.textContent = count > 0 ? `✅ Loaded ${count} images.` : "❌ No images found in any folder.";
}
