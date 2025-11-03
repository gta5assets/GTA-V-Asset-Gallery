// GTA V Asset Gallery – debug build (temporary)

const basePath = "public/thumbnails";
const genders = ["male", "female"];
const groups = ["ALL","ACCS","BERD","DECL","FEET","HAIR","HAND","HEAD","JBIB","LOWR","TASK","TEEF","UPPR"];

document.addEventListener("DOMContentLoaded",()=>{
  // UI draw
  document.body.insertAdjacentHTML("beforeend",`
    <div id="galleryContainer" style="padding:20px;text-align:center;margin-top:140px;">
      <h2>GTA V Asset Gallery (debug)</h2>
      <div style="margin-bottom:20px;">
        <select id="genderSelect">${genders.map(g=>`<option>${g}</option>`).join("")}</select>
        <select id="groupSelect">${groups.map(g=>`<option>${g}</option>`).join("")}</select>
        <button id="loadBtn">Load Images</button>
      </div>
      <div id="status" style="color:#ccc;margin-bottom:10px;"></div>
      <div id="gallery" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;"></div>
    </div>`);

  document.getElementById("loadBtn").addEventListener("click",loadImages);
});

async function loadImages(){
  const gender=document.getElementById("genderSelect").value;
  const group=document.getElementById("groupSelect").value;
  const path=`${basePath}/${gender}/${group}`;
  const api=`https://api.github.com/repos/gta5assets/GTA-V-Asset-Gallery/contents/${path}`;
  const status=document.getElementById("status");
  const gallery=document.getElementById("gallery");
  status.textContent=`Fetching → ${api}`;
  gallery.innerHTML="";

  try{
    const res=await fetch(api);
    const data=await res.json();
    console.log("GitHub API data for",path,":",data);
    if(!Array.isArray(data)){status.textContent="No list received";return;}
    let ok=0;
    for(const f of data.filter(f=>f.name.toLowerCase().endsWith(".png"))){
      const raw=f.download_url?.replace("https://github.com/","https://raw.githubusercontent.com/").replace("/blob/","/");
      const img=document.createElement("img");
      img.src=raw;
      img.width=128;img.height=128;img.style.margin="4px";
      gallery.appendChild(img);
      ok++;
    }
    status.textContent=ok?`Loaded ${ok} images from ${path}`:"No images found";
  }catch(e){
    status.textContent="Error → "+e;
    console.error(e);
  }
}
