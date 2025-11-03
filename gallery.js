// === CONFIGURATION ===
const basePath = "public/thumbnails";
const genders = ["male", "female", "groups"];
const groups = ["ALL", "ACCS", "BERD", "DECL", "FEET", "HAIR", "HAND", "HEAD", "JBIB", "LOWR", "TASK", "TEEF", "UPPR"];
const maxImagesToLoad = 500; // limit per load, avoid browser freeze

// === HTML injection ===
document.body.innerHTML = `
  <div style="padding:20px;text-align:center;">
    <h2 style="font-family:sans-serif;">GTA V Asset Gallery</h2>
    <div>
      <select id="genderSelect">${genders.map(g => `<option value="${g}">${g}</option>`).join('')}</select>
      <select id="groupSelect">${groups.map(g => `<option value="${g}">${g}</option>`).join('')}</select>
      <button id="loadBtn">Load Images</button>
    </div>
    <div id="gallery" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:20px;"></div>
  </div>
`;

async function fetchFolderImages(path) {
  try {
    const res = await fetch(path);
    const text = await res.text();
    const matches = [...text.matchAll(/href="([^"?]+\\.(png|jpg|jpeg|webp))"/gi)];
    return matches.map(m => path + m[1]);
  } catch (e) {
    console.error("Folder fetch error:", e);
    return [];
  }
}

async function loadImages() {
  const gender = document.getElementById("genderSelect").value;
  const group = document.getElementById("groupSelect").value;
  const folderPath = `${basePath}/${gender}/${group}/`;
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = `<p style="font-family:sans-serif;">Loading ${folderPath}...</p>`;

  const imgs = await fetchFolderImages(folderPath);
  gallery.innerHTML = "";
  if (imgs.length === 0) {
    gallery.innerHTML = `<p>No images found in ${folderPath}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < Math.min(imgs.length, maxImagesToLoad); i++) {
    const img = document.createElement("img");
    img.src = imgs[i];
    img.loading = "lazy";
    img.style.width = "128px";
    img.style.height = "128px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
    fragment.appendChild(img);
  }
  gallery.appendChild(fragment);
}

document.getElementById("loadBtn").addEventListener("click", loadImages);
