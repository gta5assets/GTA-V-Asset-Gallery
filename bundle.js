// GTA V Asset Gallery - Category Wise Loader (Ashu Mods Version)

const owner = "gta5assets"; // <== apna GitHub username
const repo = "GTA-V-Asset-Gallery"; // <== apna repo name
const baseFolder = "public/thumbnails";
const genders = ["male", "female"];
const groups = [
  "ALL", "ACCS", "BERD", "DECL", "FEET", "HAIR",
  "HAND", "HEAD", "JBIB", "LOWR", "TASK", "TEEF", "UPPR"
];
const maxImages = 3000; // safe limit

// inject gallery UI
document.body.insertAdjacentHTML("beforeend", `
<div id="galleryContainer" style="padding:20px;text-align:center;margin-top:140px;">
  <h2>GTA V Asset Gallery</h2>
  <div style="margin-bottom:20px;">
    <select id="genderSelect" style="padding:6px 10px;">
      ${genders.map(g => `<option value="${g}">${g}</option>`).join("")}
    </select>
    <select id="groupSelect" style="padding:6px 10px;">
      ${groups.map(g => `<option value="${g}">${g}</option>`).join("")}
    </select>
    <button id="loadBtn" style="padding:6px 14px;cursor:pointer;">Load Images</button>
  </div>
  <div id="status" style="color:#ccc;margin-bottom:10px;"></div>
  <div id="gallery" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;"></div>
</div>
`);

// GitHub API se folder listing fetch
async function fetchFolderImages(path) {
  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  try {
    const res = await fetch(api);
    if (!res.ok) return [];
    const data = await res.json();
    return data
      .filter(f => f.type === "file" && f.name.toLowerCase().endsWith(".png"))
      .map(f => f.download_url);
  } catch (err) {
    console.error("fetch error:", err);
    return [];
  }
}

// Load button click handler
async function loadImages() {
  const gender = document.getElementById("genderSelect").value;
  const group = document.getElementById("groupSelect").value;
  const gallery = document.getElementById("gallery");
  const status = document.getElementById("status");
  gallery.innerHTML = "";
  status.textContent = "Loading...";

  let folders = [];
  if (group === "ALL") {
    folders = groups.filter(g => g !== "ALL");
  } else {
    folders = [group];
  }

  let count = 0;
  for (const g of folders) {
    const path = `${baseFolder}/${gender}/${g}`;
    status.textContent = `Loading ${path}...`;
    const urls = await fetchFolderImages(path);
    for (let i = 0; i < Math.min(urls.length, maxImages); i++) {
      const img = document.createElement("img");
      img.src = urls[i];
      img.loading = "lazy";
      img.style.width = "128px";
      img.style.height = "128px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "8px";
      img.style.boxShadow = "0 0 4px rgba(0,0,0,0.4)";
      img.onclick = () => window.open(urls[i], "_blank");
      gallery.appendChild(img);
      count++;
    }
  }

  status.textContent = count > 0 ? `Loaded ${count} images.` : "No images found.";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loadBtn").addEventListener("click", loadImages);
});
