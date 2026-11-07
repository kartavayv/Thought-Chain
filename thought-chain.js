const TC_CSS = `
.tc{--thought-font:"Lora",Georgia,serif;--bg:#e8f5e9;--line:#1b5e20;--dot:#8d948e;--text:#16301a;--muted:#4f6b53;--card:#f4fbf5;--edge:#c5e0c8;
  background:var(--bg);color:var(--text);padding:16px;border-radius:12px;box-sizing:border-box;font:16px/1.5 system-ui,sans-serif}
@media (prefers-color-scheme:dark){.tc{--bg:#0f1f14;--line:#6fcf8a;--dot:#9aa39c;--text:#e6f2e8;--muted:#92b097;--card:#16301c;--edge:#27452d}}
.tc *{box-sizing:border-box}
.tc .day{margin-top:28px}
.tc .day h3{margin:0;font-size:15px;color:var(--muted);font-weight:600}
.tc .chain{position:relative;padding:20px 0 28px}
.tc .chain::before{content:"";position:absolute;left:11px;top:0;bottom:0;width:4px;border-radius:2px;background:var(--line)}
.tc .node{position:relative;padding-left:44px}
.tc .dot{position:absolute;left:0;top:6px;width:26px;height:26px;border-radius:50%;background:var(--dot)}
.tc .node::before{content:"";position:absolute;left:26px;top:18px;width:14px;height:2px;background:var(--line)}
.tc .thought{background:var(--card);border:1px solid var(--edge);border-radius:10px;padding:8px 12px;overflow-wrap:anywhere;font-family:var(--thought-font);font-size:17px;line-height:1.55}
.tc .time{display:block;font-family:system-ui,sans-serif;font-size:12px;color:var(--muted)}
.tc .empty{color:var(--muted)}
`;

(function () {
  const style = document.createElement("style");
  style.textContent = TC_CSS;
  document.head.appendChild(style);

  const font = document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&display=swap";
  document.head.appendChild(font);
})();


/* ---- core: copy parse() and renderChain() into your blog to embed ---- */
function parse(md){
  var days=[],cur=null;
  md.split(/\r?\n/).forEach(function(l){
    var m=l.match(/^##\s+(\d{4}-\d{2}-\d{2})/);
    if(m){cur={date:m[1],items:[]};days.push(cur);return;}
    m=l.match(/^[-*]\s+(\d{1,2}):(\d{2})\s*[|–-]?\s*(.+)$/);
    if(m&&cur)cur.items.push({h:+m[1],m:+m[2],t:m[3]});
  });
  days.forEach(function(d){d.items.sort(function(a,b){return a.h*60+a.m-b.h*60-b.m;});});
  return days.sort(function(a,b){return b.date.localeCompare(a.date);});
}
function renderChain(md,el){
  el.textContent="";
  var days=parse(md);
  if(!days.length){var e=document.createElement("p");e.className="empty";e.textContent="No thoughts yet. Add a “## YYYY-MM-DD” heading and “- HH:MM | thought” lines.";el.appendChild(e);return;}
  days.forEach(function(d){
    var sec=document.createElement("section");sec.className="day";
    var h=document.createElement("h3");
    h.textContent=new Date(d.date+"T00:00:00").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    var chain=document.createElement("div");chain.className="chain";
    var prev=null;
    d.items.forEach(function(it){
      var mins=it.h*60+it.m,n=document.createElement("div");n.className="node";
      if(prev!==null){var gap=Math.min(120,Math.max(24,24+((mins-prev)/60)*14));n.style.marginTop=gap+"px";}
      prev=mins;
      var dot=document.createElement("span");dot.className="dot";
      var box=document.createElement("div");box.className="thought";
      var t=document.createElement("span");t.className="time";
      t.textContent=String(it.h).padStart(2,"0")+":"+String(it.m).padStart(2,"0");
      box.appendChild(t);box.appendChild(document.createTextNode(it.t));
      n.appendChild(dot);n.appendChild(box);chain.appendChild(n);
    });
    sec.appendChild(h);sec.appendChild(chain);el.appendChild(sec);
  });
}
/* ---- end core ---- */
