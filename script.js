
const STAFF = ["Ravi Kumar","Suresh","Anil","Priya Sharma"];

const SEED_COMPLAINTS = [
  {id:"GHMC20260001",citizenId:"citizen1",category:"Drainage",title:"Overflowing drain near main road",description:"Drain water is overflowing onto the road and making the area difficult for pedestrians.",location:"Kukatpally",landmark:"Near main road",priority:"High",submitted:"08-Aug-2026",status:"In Progress",assigned:"Ravi Kumar",verified:true,remarks:"Field team is clearing the blockage.",history:[["Submitted","08-Aug-2026"],["Under Review","09-Aug-2026"],["Assigned","10-Aug-2026"],["In Progress","11-Aug-2026"]]},
  {id:"GHMC20260002",citizenId:"citizen1",category:"Garbage",title:"Garbage not collected",description:"Waste has not been collected for two days near the community area.",location:"Madhapur",landmark:"Community park",priority:"Medium",submitted:"10-Aug-2026",status:"Resolved",assigned:"Suresh",verified:true,remarks:"Collection completed.",feedback:5,history:[["Submitted","10-Aug-2026"],["Under Review","10-Aug-2026"],["Assigned","11-Aug-2026"],["In Progress","11-Aug-2026"],["Resolved","12-Aug-2026"]]},
  {id:"GHMC20260003",citizenId:"citizen2",category:"Street Light",title:"Street light not working",description:"Street light is not switching on at night, leaving the road poorly lit.",location:"Banjara Hills",landmark:"Road No. 12",priority:"Low",submitted:"12-Aug-2026",status:"Under Review",assigned:"Anil",verified:false,remarks:"Inspection scheduled.",history:[["Submitted","12-Aug-2026"],["Under Review","13-Aug-2026"]]},
  {id:"GHMC20260004",citizenId:"citizen2",category:"Water Leakage",title:"Water pipe leakage",description:"Water is leaking continuously from a roadside pipe.",location:"Gachibowli",landmark:"Near bus stop",priority:"Critical",submitted:"14-Aug-2026",status:"Submitted",assigned:"Not assigned",verified:false,remarks:"",history:[["Submitted","14-Aug-2026"]]}
];

let complaints = JSON.parse(localStorage.getItem("smartGhmcComplaints") || "null") || SEED_COMPLAINTS;
let currentPage = "home";
let toastTimer = null;

function save(){ localStorage.setItem("smartGhmcComplaints", JSON.stringify(complaints)); }
function role(){ return localStorage.getItem("smartGhmcRole") || ""; }
function userName(){ return localStorage.getItem("smartGhmcUserName") || ""; }
function isLogged(){ return !!role(); }

function esc(v){
  return String(v ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function toast(message){
  const el=document.getElementById("toast"); if(!el)return;
  el.textContent=message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
}
function statusClass(s){
  return s==="Resolved"?"resolved":s==="In Progress"?"progress":s==="Under Review"?"review":s==="Assigned"?"assigned":"submitted";
}
function badge(s){ return `<span class="status ${statusClass(s)}">${esc(s)}</span>`; }
function titleBlock(k,t,p){ return `<div class="page-title"><span class="eyebrow">${k}</span><h1>${t}</h1><p>${p}</p></div>`; }

function go(page){
  currentPage=page;
  const nav=document.getElementById("nav"); if(nav)nav.classList.remove("open");
  render();
  window.scrollTo({top:0,behavior:"smooth"});
}

function visibleComplaints(){
  const r=role();
  if(r==="admin") return complaints;
  if(r==="field") return complaints.filter(c=>c.assigned===userName());
  if(r==="citizen") return complaints.filter(c=>c.citizenId==="citizen1");
  return [];
}

function requireRole(allowed,page="login"){
  if(!allowed.includes(role())){ go(page); return false; }
  return true;
}

function home(){
  const total=12455+complaints.length;
  const progress=2312+complaints.filter(c=>c.status==="In Progress").length;
  const resolved=8953+complaints.filter(c=>c.status==="Resolved").length;
  return `<section class="hero"><div class="hero-content"><div class="hero-layout"><div>
    <div class="hero-kicker"><span class="pulse"></span> Smart civic services for Hyderabad</div>
    <h1>A city that listens.<br><em>A city that responds.</em></h1>
    <p class="hero-description">Report civic issues in your neighbourhood, follow every update and help the concerned GHMC team keep Hyderabad cleaner, safer and better.</p>
    <div class="hero-actions"><button class="btn btn-primary" data-page="login" data-role="Citizen">＋ Report a problem</button><button class="btn btn-secondary" data-page="track">⌕ Track complaint</button></div>
    <div class="hero-mini-stats"><div><strong>24 × 7</strong><span>Digital reporting</span></div><div><strong>${complaints.length}+</strong><span>Demo reports</span></div><div><strong>4</strong><span>Resolution stages</span></div></div>
  </div><div class="hero-side"><div class="civic-card"><span class="mini-label">CIVIC NOTE / 01</span><h3>Small reports.<br>Visible change.</h3><p>One clear complaint gives the right team a place, a problem and a starting point.</p><div class="card-line"></div><div class="card-bottom"><div><strong>GHMC</strong>Hyderabad</div><span>2026</span></div></div></div></div></div></section>
  <section class="container"><div class="section-head"><div class="section-title"><span class="eyebrow">QUICK REPORTING</span><h2>What needs attention?</h2></div></div>
  <div class="category-grid">${[["🗑","Garbage","Waste collection"],["⌁","Public / Roads","Roads & public spaces"],["☼","Street Light","Lighting"],["◒","Water Leakage","Water supply"],["≈","Drainage","Storm water & drains"],["♧","Fallen Tree","Trees & obstructions"],["⌂","Public Toilet","Public sanitation"],["＋","Others","Other civic issues"]].map(x=>`<button class="category" data-page="login" data-role="Citizen"><div class="cat-icon">${x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></button>`).join("")}</div>
  <div class="stats"><div class="stat"><div class="stat-icon">▤</div><div><strong>${total.toLocaleString()}</strong><small>Total complaints</small></div></div><div class="stat"><div class="stat-icon">◷</div><div><strong>${progress.toLocaleString()}</strong><small>In progress</small></div></div><div class="stat"><div class="stat-icon">✓</div><div><strong>${resolved.toLocaleString()}</strong><small>Resolved</small></div></div><div class="stat"><div class="stat-icon">!</div><div><strong>${(total-resolved).toLocaleString()}</strong><small>Open</small></div></div></div>
  <div class="home-grid"><div class="panel"><span class="eyebrow">SIMPLE PROCESS</span><h2>From report to resolution</h2><div class="steps"><div class="step"><div class="step-no">01</div><strong>Report</strong><p>Tell us what happened and where.</p></div><div class="step-arrow">→</div><div class="step"><div class="step-no">02</div><strong>Track</strong><p>Follow the status of your complaint.</p></div><div class="step-arrow">→</div><div class="step"><div class="step-no">03</div><strong>Resolve</strong><p>The concerned team works on it.</p></div></div></div>
  <div class="panel"><span class="eyebrow">CITY DESK</span><div class="announcement"><div class="symbol">!</div><div><strong>Keep your city clean and green</strong><p>Use Smart GHMC to report civic issues quickly and clearly.</p></div></div><div class="announcement"><div class="symbol">✓</div><div><strong>Every report counts</strong><p>Your complaint gives the right team a starting point for action.</p></div></div></div></div>
  <div class="role-box"><div><span class="eyebrow">DEMO ACCESS</span><h2>Choose your workspace</h2><p>Each role has a different dashboard and different permissions.</p></div><div class="role-buttons"><button data-page="login" data-role="Citizen">Citizen Portal</button><button data-page="login" data-role="Admin / Officer">Admin / Officer</button><button data-page="login" data-role="Field Staff">Field Staff</button></div></div></section>`;
}

function loginPage(){
  return `<section class="auth-page"><div class="auth-card"><div class="auth-logo">GHMC</div><span class="eyebrow">ROLE-BASED ACCESS</span><h1>Choose your portal</h1><p>Login to a dedicated workspace. The information and actions shown after login depend on your role.</p>
  <form class="auth-form" id="loginForm">
    <label class="field"><span>Login as</span><select id="roleSelect"><option value="citizen">Citizen</option><option value="admin">Admin / Officer</option><option value="field">Field Staff</option></select></label>
    <div id="fieldMemberWrap" style="display:none"><label class="field"><span>Field Staff Member</span><select id="fieldMember">${STAFF.map(s=>`<option>${s}</option>`).join("")}</select></label></div>
    <label class="field"><span>Email / User ID</span><input id="loginEmail" required></label>
    <label class="field"><span>Password</span><input id="loginPassword" type="password" required></label>
    <button class="btn btn-primary" type="submit">Login to my portal ↗</button>
  </form>
  <div class="auth-demo"><b>Demo credentials</b><br>Citizen: citizen@ghmc.demo / citizen123<br>Admin: admin@ghmc.demo / admin123<br>Field Staff: field@ghmc.demo / field123</div>
  <button class="back" data-page="home">← Back to home</button></div></section>`;
}

function citizenDashboard(){
  const mine=complaints.filter(c=>c.citizenId==="citizen1");
  const open=mine.filter(c=>c.status!=="Resolved").length, resolved=mine.filter(c=>c.status==="Resolved").length;
  return `<section class="container">${titleBlock("CITIZEN DASHBOARD","Welcome back, Citizen","This is your personal civic workspace. Only complaints submitted by this citizen appear here.")}
  <div class="portal-hero"><span class="eyebrow" style="color:var(--sage)">CITIZEN • PERSONAL VIEW</span><h2>Your complaints, your updates.</h2><p>Report a new issue, follow existing complaints and share feedback after resolution.</p>
  <div class="portal-kpis"><div class="portal-kpi"><strong>${mine.length}</strong><span>My complaints</span></div><div class="portal-kpi"><strong>${open}</strong><span>Still open</span></div><div class="portal-kpi"><strong>${resolved}</strong><span>Resolved</span></div><div class="portal-kpi"><strong>${mine.filter(c=>c.feedback).length}</strong><span>Feedback given</span></div></div></div>
  <div class="quick-actions"><button class="quick-action" data-page="report"><div class="qa-icon">＋</div><strong>Report a problem</strong><span>Create a new complaint with category, location, priority and image.</span></button>
  <button class="quick-action" data-page="complaints"><div class="qa-icon">▤</div><strong>My complaints</strong><span>See only the complaints submitted by you.</span></button>
  <button class="quick-action" data-page="track"><div class="qa-icon">⌕</div><strong>Track complaint</strong><span>Enter a Complaint ID to view its progress.</span></button>
  <button class="quick-action" data-page="feedback"><div class="qa-icon">★</div><strong>Give feedback</strong><span>Rate a resolved complaint or reopen it if the issue remains.</span></button></div></section>`;
}

function adminPage(){
  const total=complaints.length,res=complaints.filter(c=>c.status==="Resolved").length,open=total-res,critical=complaints.filter(c=>c.priority==="Critical").length;
  return `<section class="container">${titleBlock("GHMC ADMIN / OFFICER","Command Centre","A management workspace for viewing every complaint, verifying reports, assigning staff and controlling status.")}
  <div class="portal-hero"><span class="eyebrow" style="color:var(--sage)">ADMIN • ALL COMPLAINTS</span><h2>City-wide complaint control room.</h2><p>Unlike the citizen portal, the Admin sees every complaint and has management controls for verification, assignment and status updates.</p>
  <div class="portal-kpis"><div class="portal-kpi"><strong>${total}</strong><span>Total complaints</span></div><div class="portal-kpi"><strong>${open}</strong><span>Open</span></div><div class="portal-kpi"><strong>${res}</strong><span>Resolved</span></div><div class="portal-kpi"><strong>${critical}</strong><span>Critical</span></div></div></div>
  <div class="chart-grid"><div class="chart-card"><h3>Complaint categories</h3>${categoryBars()}</div><div class="chart-card"><h3>Status overview</h3><div class="mini-pie"><div class="pie"></div><div class="legend">${["Submitted","Under Review","Assigned","In Progress","Resolved"].map(s=>`<div><i></i>${s}: ${complaints.filter(c=>c.status===s).length}</div>`).join("")}</div></div></div></div>
  <div class="admin-toolbar"><input id="adminSearch" placeholder="Search ID, title, category or location"><select id="adminStatus"><option>All statuses</option><option>Submitted</option><option>Under Review</option><option>Assigned</option><option>In Progress</option><option>Resolved</option></select><select id="adminPriority"><option>All priorities</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
  <div class="admin-card" id="adminTable"></div></section>`;
}

function categoryBars(){
  const cats=["Garbage","Public / Roads","Street Light","Water Leakage","Drainage","Fallen Tree","Public Toilet","Others"];
  const vals=cats.map(x=>[x,complaints.filter(c=>c.category===x).length]).filter(x=>x[1]);
  const max=Math.max(1,...vals.map(x=>x[1]));
  return vals.length?vals.map(x=>`<div class="bar-row"><span>${x[0]}</span><div class="bar-track"><div class="bar-fill" style="width:${x[1]/max*100}%"></div></div><b>${x[1]}</b></div>`).join(""):"<p>No complaint data yet.</p>";
}

function fillAdmin(){
  const q=(document.getElementById("adminSearch")?.value||"").toLowerCase();
  const st=document.getElementById("adminStatus")?.value||"All statuses";
  const pr=document.getElementById("adminPriority")?.value||"All priorities";
  const arr=complaints.filter(c=>(st==="All statuses"||c.status===st)&&(pr==="All priorities"||c.priority===pr)&&(`${c.id} ${c.title} ${c.category} ${c.location}`).toLowerCase().includes(q));
  const rows=arr.map(c=>`<div class="trow">
    <div><strong>${esc(c.id)}</strong><small>${esc(c.title)}</small></div>
    <span>${esc(c.category)}</span><span>${esc(c.location)}</span>${badge(c.status)}
    <div class="admin-controls">
      <label class="verify-line"><input type="checkbox" data-verify="${c.id}" ${c.verified?"checked":""}> Verified</label>
      <select data-assign="${c.id}"><option>Not assigned</option>${STAFF.map(s=>`<option ${c.assigned===s?"selected":""}>${s}</option>`).join("")}</select>
      <select data-status="${c.id}">${["Submitted","Under Review","Assigned","In Progress","Resolved"].map(s=>`<option ${c.status===s?"selected":""}>${s}</option>`).join("")}</select>
      <button class="text-btn" data-view="${c.id}">Open details →</button>
    </div></div>`).join("");
  document.getElementById("adminTable").innerHTML=`<div class="thead"><span>ID / COMPLAINT</span><span>CATEGORY</span><span>LOCATION</span><span>STATUS</span><span>VERIFY • ASSIGN • UPDATE</span></div>${rows||`<div class="empty"><h3>No matching complaints</h3><p>Try changing the search or filters.</p></div>`}`;
  bindDetailButtons();
  document.querySelectorAll("[data-verify]").forEach(el=>el.onchange=()=>{const c=complaints.find(x=>x.id===el.dataset.verify);c.verified=el.checked;save();toast(c.verified?"Complaint verified":"Verification removed");});
  document.querySelectorAll("[data-assign]").forEach(el=>el.onchange=()=>{const c=complaints.find(x=>x.id===el.dataset.assign);c.assigned=el.value;if(el.value!=="Not assigned"&&c.status==="Submitted")c.status="Assigned";save();toast(`${c.id} assigned to ${el.value}`);render();});
  document.querySelectorAll("[data-status]").forEach(el=>el.onchange=()=>{const c=complaints.find(x=>x.id===el.dataset.status),old=c.status;c.status=el.value;c.history=c.history||[];if(old!==c.status)c.history.push([c.status,new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})]);save();toast(`${c.id} is now ${c.status}`);render();});
}

function fieldPage(){
  const staffName=userName();
  const assigned=complaints.filter(c=>c.assigned===staffName);
  const active=assigned.filter(c=>c.status!=="Resolved").length,res=assigned.filter(c=>c.status==="Resolved").length;
  return `<section class="container">${titleBlock("FIELD STAFF PORTAL",staffName+"'s Work Queue","This workspace shows only complaints assigned to this field staff member.")}
  <div class="portal-hero"><span class="eyebrow" style="color:var(--sage)">FIELD STAFF • ${esc(staffName.toUpperCase())}</span><h2>Work on what is assigned to you.</h2><p>You do not see the city-wide complaint list. Your job queue contains only the complaints assigned to your staff account.</p>
  <div class="portal-kpis"><div class="portal-kpi"><strong>${assigned.length}</strong><span>Assigned to me</span></div><div class="portal-kpi"><strong>${active}</strong><span>Active work</span></div><div class="portal-kpi"><strong>${res}</strong><span>Completed</span></div><div class="portal-kpi"><strong>${assigned.filter(c=>c.priority==="Critical").length}</strong><span>Critical</span></div></div></div>
  <div class="field-list">${assigned.length?assigned.map(c=>`<div class="field-card"><div class="field-top"><div><span class="eyebrow">${esc(c.id)}</span><h3>${esc(c.title)}</h3></div>${badge(c.status)}</div>
  <div class="details"><div><small>Category</small><b>${esc(c.category)}</b></div><div><small>Location</small><b>${esc(c.location)}</b></div><div><small>Priority</small><b>${esc(c.priority)}</b></div><div><small>Assigned to</small><b>${esc(c.assigned)}</b></div></div>
  <p>${esc(c.description)}</p><div class="role-lock">Field action: add your work remark, then update the work status. Admin controls are not available in this portal.</div>
  <label class="field"><span>Work remarks</span><input data-remark="${c.id}" value="${esc(c.remarks||"")}" placeholder="Example: Blockage cleared and area cleaned"></label>
  <div class="field-actions"><button class="btn btn-secondary" data-work="${c.id}" data-value="In Progress">Mark In Progress</button><button class="btn btn-primary" data-work="${c.id}" data-value="Resolved">✓ Mark Resolved</button></div></div>`).join(""):`<div class="empty"><h3>No complaints assigned to ${esc(staffName)}</h3><p>The Admin / Officer must assign a complaint to this field staff member first.</p></div>`}</div></section>`;
}

function setupField(){
  document.querySelectorAll("[data-work]").forEach(b=>b.onclick=()=>{
    const c=complaints.find(x=>x.id===b.dataset.work), r=document.querySelector(`[data-remark="${b.dataset.work}"]`);
    if(!c)return;c.remarks=r?r.value:c.remarks;c.status=b.dataset.value;c.history=c.history||[];c.history.push([c.status,new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})]);save();toast(`${c.id} updated to ${c.status}`);render();
  });
}

function report(){
  if(!requireRole(["citizen"]))return "";
  return `<section class="container">${titleBlock("CITIZEN • NEW COMPLAINT","Report a Complaint","Submit a civic issue with enough detail for GHMC to verify, assign and resolve it.")}<div class="notice">✓ Your complaint will appear only in your Citizen portal. The Admin can see it and assign it to Field Staff.</div>
  <div class="map-card"><div style="position:relative;z-index:2"><span class="eyebrow" style="color:var(--sage)">LOCATION VISUALIZER</span><h3 style="font:600 30px 'Playfair Display',Georgia,serif;margin:7px 0">Pin the neighbourhood</h3><p style="font-size:15px;color:#d8d0c7;max-width:420px">Use the map-style graphic as a visual reference while entering your locality.</p></div><div class="map-canvas"></div><div class="map-road road1"></div><div class="map-road road2"></div><div class="map-road road3"></div><div class="map-point point1"></div><div class="map-point point2"></div><div class="map-point point3"></div><div class="map-label label1">Kukatpally</div><div class="map-label label2">Madhapur</div><div class="map-label label3">Banjara Hills</div></div>
  <form class="form-card" id="complaintForm"><div class="form-head"><h3>Complaint details</h3><p>Fields marked with * are required.</p></div><div class="fields">
  <label class="field"><span>Complaint Category <b>*</b></span><select name="category" required>${["Garbage","Public / Roads","Street Light","Water Leakage","Drainage","Fallen Tree","Public Toilet","Others"].map(x=>`<option>${x}</option>`).join("")}</select></label>
  <label class="field"><span>Priority <b>*</b></span><select name="priority" required><option>Low</option><option selected>Medium</option><option>High</option><option>Critical</option></select></label>
  <label class="field full"><span>Complaint Title <b>*</b></span><input name="title" required placeholder="e.g. Garbage not collected"></label>
  <label class="field"><span>Location <b>*</b></span><input name="location" required placeholder="Area / locality"></label>
  <label class="field"><span>Landmark</span><input name="landmark" placeholder="Nearby landmark"></label>
  <label class="field"><span>Image / evidence</span><div class="file-input"><input id="imageInput" type="file" name="image" accept="image/*"></div><div id="imagePreview" class="image-preview"></div></label>
  <label class="field full"><span>Description <b>*</b></span><textarea name="description" required placeholder="Describe what happened, where it is and how long the issue has existed..."></textarea></label></div>
  <div class="form-actions"><button type="button" class="btn btn-secondary" data-page="citizen">Cancel</button><button class="btn btn-primary" type="submit">Submit complaint →</button></div></form></section>`;
}

function submitComplaint(e){
  e.preventDefault();
  const fd=new FormData(e.target), file=document.getElementById("imageInput")?.files[0];
  const date=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
  const id="GHMC"+new Date().getFullYear()+String(Date.now()).slice(-6);
  const create=image=>{
    complaints.unshift({id,citizenId:"citizen1",category:fd.get("category"),title:fd.get("title"),description:fd.get("description"),location:fd.get("location"),landmark:fd.get("landmark"),priority:fd.get("priority"),submitted:date,status:"Submitted",assigned:"Not assigned",verified:false,remarks:"",image:image||"",history:[["Submitted",date]]});
    save();toast(`Complaint ${id} submitted successfully`);go("complaints");
  };
  if(file){const reader=new FileReader();reader.onload=()=>create(reader.result);reader.readAsDataURL(file);}else create("");
}

function complaintsPage(){
  if(!requireRole(["citizen"]))return "";
  return `<section class="container">${titleBlock("CITIZEN • MY COMPLAINTS","My Complaints","This page contains only complaints submitted by the logged-in citizen.")}<div class="filters"><div class="searchbox">⌕<input id="complaintSearch" placeholder="Search my complaints"></div><select class="filter-select" id="statusFilter"><option>All</option><option>Submitted</option><option>Under Review</option><option>Assigned</option><option>In Progress</option><option>Resolved</option></select><button class="btn btn-primary" data-page="report">＋ New Complaint</button></div><div class="complaints-list" id="complaintsList"></div></section>`;
}
function fillComplaints(){
  const q=(document.getElementById("complaintSearch")?.value||"").toLowerCase(), f=document.getElementById("statusFilter")?.value||"All";
  const arr=complaints.filter(c=>c.citizenId==="citizen1"&&(f==="All"||c.status===f)&&(`${c.id} ${c.title} ${c.location} ${c.category}`).toLowerCase().includes(q));
  document.getElementById("complaintsList").innerHTML=arr.length?arr.map(c=>`<div class="complaint-row"><div class="complaint-main"><div class="complaint-icon">${c.category==="Garbage"?"♻":c.category==="Street Light"?"☼":c.category==="Drainage"?"≈":"＋"}</div><div><strong>${esc(c.title)}</strong><small>${esc(c.id)} • ${esc(c.category)} • ${esc(c.location)} • ${esc(c.priority)} priority</small></div></div>${badge(c.status)}<button class="arrow-btn" data-view="${c.id}">→</button></div>`).join(""):`<div class="empty"><h3>No complaints found</h3><p>Try another search or status filter.</p></div>`;
  bindDetailButtons();
}

function track(){
  return `<section class="container">${titleBlock("COMPLAINT TRACKING","Track Your Complaint","Enter a Complaint ID to see its current status, location, priority and progress.")}<div class="search-row"><input id="trackInput" placeholder="GHMC20260001"><button class="btn btn-primary" id="trackBtn">⌕ Track</button></div><div id="trackResult"></div><p style="max-width:760px;margin:14px auto;font-size:14px;color:var(--muted)">Try sample ID <b>GHMC20260001</b></p></section>`;
}
function trackComplaint(){
  const id=document.getElementById("trackInput")?.value.trim().toLowerCase(), c=complaints.find(x=>x.id.toLowerCase()===id);
  document.getElementById("trackResult").innerHTML=c?trackingCard(c):`<div class="empty"><h3>Complaint not found</h3><p>Please check the Complaint ID and try again.</p></div>`;
  bindDetailButtons();
}
function trackingCard(c){
  const states=["Submitted","Under Review","Assigned","In Progress","Resolved"],active=states.indexOf(c.status), pct=Math.max(20,Math.round(((active+1)/5)*100));
  return `<div class="track-card"><div class="track-head"><div><span class="eyebrow">COMPLAINT ID</span><h2>${esc(c.id)}</h2></div>${badge(c.status)}</div><div class="details"><div><small>Category</small><b>${esc(c.category)}</b></div><div><small>Location</small><b>${esc(c.location)}</b></div><div><small>Submitted</small><b>${esc(c.submitted)}</b></div><div><small>Priority</small><b>${esc(c.priority)}</b></div></div><div class="timeline">${states.map((s,i)=>`<div class="timeline-step ${i<=active?"done":""}"><div class="timeline-dot">${i<=active?"✓":i+1}</div><div>${s}</div></div>`).join("")}</div><div class="progress-area"><div class="progress-ring" style="--progress:${pct}"><strong>${pct}%</strong></div><div class="progress-copy"><span class="eyebrow">CURRENT PROGRESS</span><h3>${c.status==="Resolved"?"Issue resolved":"Complaint is being processed"}</h3><p>${esc(c.remarks||"The concerned GHMC team is processing this complaint.")}</p></div></div><div class="modal-actions"><button class="btn btn-secondary" data-view="${c.id}">View full details</button></div></div>`;
}

function feedbackPage(){
  if(!requireRole(["citizen"]))return "";
  const resolved=complaints.filter(c=>c.citizenId==="citizen1"&&c.status==="Resolved");
  return `<section class="container">${titleBlock("CITIZEN • FEEDBACK","Help us improve","Give feedback on a resolved complaint. If the issue remains, you can reopen it for follow-up.")}<div class="feedback-card"><label class="field"><span>Complaint ID</span><select id="feedbackComplaint">${resolved.length?resolved.map(c=>`<option value="${c.id}">${esc(c.id)} — ${esc(c.title)}</option>`).join(""):`<option value="">No resolved complaints yet</option>`}</select></label><div style="margin-top:22px"><span class="field"><span>Rating</span></span><div class="stars">${[1,2,3,4,5].map(n=>`<button class="star" data-star="${n}">★</button>`).join("")}</div></div><div style="display:flex;gap:12px;flex-wrap:wrap;margin:15px 0"><button class="btn btn-secondary" id="resolvedYes">✓ Yes, issue resolved</button><button class="btn btn-secondary" id="resolvedNo">↻ No, issue still exists</button></div><label class="field"><span>Comments</span><textarea id="feedbackText" rows="5" placeholder="Tell us about your experience..."></textarea></label><div style="display:flex;justify-content:flex-end;margin-top:20px"><button class="btn btn-primary" id="feedbackBtn">Submit feedback →</button></div></div></section>`;
}

function setupFeedback(){
  let rating=0,resolved=true;
  document.querySelectorAll("[data-star]").forEach(b=>b.onclick=()=>{rating=+b.dataset.star;document.querySelectorAll("[data-star]").forEach(x=>x.classList.toggle("selected",+x.dataset.star<=rating));});
  document.getElementById("resolvedYes").onclick=()=>{resolved=true;toast("Marked as resolved");};
  document.getElementById("resolvedNo").onclick=()=>{resolved=false;toast("Complaint will be reopened");};
  document.getElementById("feedbackBtn").onclick=()=>{
    if(!rating)return toast("Please choose a rating");
    const id=document.getElementById("feedbackComplaint").value,c=complaints.find(x=>x.id===id);if(!c)return toast("No resolved complaint available");
    c.feedback=rating;c.feedbackText=document.getElementById("feedbackText").value;
    if(!resolved){c.status="Under Review";c.remarks="Citizen reported that the issue still exists.";c.history=c.history||[];c.history.push(["Reopened",new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})]);}
    save();toast("Feedback saved successfully");go("complaints");
  };
}

function contactPage(){
  return `<section class="container">${titleBlock("SMART GHMC","Contact Us","Demo contact information for the academic frontend.")}<div class="contact-grid"><div class="contact-card"><div class="contact-icon">⌖</div><h3>GHMC Office</h3><p>Hyderabad, Telangana</p></div><div class="contact-card"><div class="contact-icon">▱</div><h3>Citizen Support</h3><p>support@smartghmc.demo</p></div><div class="contact-card"><div class="contact-icon">◷</div><h3>Working Hours</h3><p>Monday to Saturday, 9 AM – 6 PM</p></div></div></section>`;
}

function openDetails(id){
  const c=complaints.find(x=>x.id===id);if(!c)return;
  const hist=(c.history||[]).map(h=>`<div style="display:flex;gap:14px;padding:10px 0;border-bottom:1px solid var(--line);font-size:15px"><b>${esc(h[0])}</b><span style="color:var(--muted)">${esc(h[1])}</span></div>`).join("");
  document.getElementById("modal").innerHTML=`<button class="modal-close" id="modalClose">×</button><span class="eyebrow">COMPLETE COMPLAINT RECORD</span><h2>${esc(c.title)}</h2><p style="color:var(--muted);font-size:15px">${esc(c.id)} · ${esc(c.category)} · ${badge(c.status)}</p>${c.image?`<img class="modal-image" src="${c.image}" alt="Complaint evidence">`:""}<div class="modal-grid"><div><small>Location</small><strong>${esc(c.location)}</strong></div><div><small>Landmark</small><strong>${esc(c.landmark||"Not provided")}</strong></div><div><small>Priority</small><strong>${esc(c.priority)}</strong></div><div><small>Assigned staff</small><strong>${esc(c.assigned||"Not assigned")}</strong></div><div><small>Submitted</small><strong>${esc(c.submitted)}</strong></div><div><small>Verification</small><strong>${c.verified?"Verified":"Not verified"}</strong></div></div><div style="margin-top:22px"><span class="eyebrow">DESCRIPTION</span><p style="font-size:15px;color:var(--muted);line-height:1.8">${esc(c.description)}</p></div><div style="margin-top:22px"><span class="eyebrow">STATUS HISTORY</span>${hist}</div>${c.remarks?`<div class="notice" style="margin-top:20px"><strong>Latest field remark:</strong> ${esc(c.remarks)}</div>`:""}`;
  document.getElementById("modalBackdrop").classList.add("open");
  document.getElementById("modalClose").onclick=()=>document.getElementById("modalBackdrop").classList.remove("open");
}
function bindDetailButtons(){document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>openDetails(b.dataset.view));}

function setupLogin(){
  const r=document.getElementById("roleSelect"),wrap=document.getElementById("fieldMemberWrap");
  const email=document.getElementById("loginEmail"),pass=document.getElementById("loginPassword");
  function update(){
    const field=r.value==="field";wrap.style.display=field?"block":"none";
    const d={citizen:["citizen@ghmc.demo","citizen123"],admin:["admin@ghmc.demo","admin123"],field:["field@ghmc.demo","field123"]}[r.value];
    email.placeholder=d[0];pass.placeholder=d[1];
  }
  r.onchange=update;update();
  document.getElementById("loginForm").onsubmit=e=>{
    e.preventDefault();
    const d={citizen:["citizen@ghmc.demo","citizen123"],admin:["admin@ghmc.demo","admin123"],field:["field@ghmc.demo","field123"]}[r.value];
    if(email.value.trim()!==d[0]||pass.value!==d[1])return toast("Invalid demo login details");
    localStorage.setItem("smartGhmcRole",r.value);
    localStorage.setItem("smartGhmcUserName",r.value==="field"?document.getElementById("fieldMember").value:r.value==="admin"?"Admin / Officer":"Citizen");
    go(r.value==="citizen"?"citizen":r.value);
  };
}

function updateHeader(){
  const box=document.getElementById("portalUser"), name=document.getElementById("userName"), avatar=document.getElementById("userAvatar");
  if(!box)return;
  if(!isLogged()){box.classList.remove("show");return;}
  box.classList.add("show");const label=role()==="admin"?"Admin / Officer":role()==="field"?userName():"Citizen";name.textContent=label;avatar.textContent=label.charAt(0);
}
function logout(){localStorage.removeItem("smartGhmcRole");localStorage.removeItem("smartGhmcUserName");go("home");toast("Logged out successfully");}

function bindPageLinks(){
  document.querySelectorAll("[data-page]").forEach(el=>el.onclick=e=>{
    e.preventDefault();
    const page=el.dataset.page, targetRole=el.dataset.role;
    if(targetRole){go("login");setTimeout(()=>{const r=document.getElementById("roleSelect");if(r){r.value=targetRole==="Citizen"?"citizen":targetRole==="Admin / Officer"?"admin":"field";r.dispatchEvent(new Event("change"));}},0);return;}
    if(page==="report"&&!isLogged()){go("login");return;}
    if(page==="complaints"&&!isLogged()){go("login");return;}
    if(page==="feedback"&&!isLogged()){go("login");return;}
    if(page==="admin"&&role()!=="admin"){go("login");return;}
    if(page==="field"&&role()!=="field"){go("login");return;}
    go(page);
  });
}

function render(){
  const r=role();
  if(currentPage==="citizen"&&r!=="citizen")currentPage=r==="admin"?"admin":r==="field"?"field":"login";
  if(currentPage==="admin"&&r!=="admin")currentPage=r==="citizen"?"citizen":r==="field"?"field":"login";
  if(currentPage==="field"&&r!=="field")currentPage=r==="citizen"?"citizen":r==="admin"?"admin":"login";
  if(["report","complaints","feedback"].includes(currentPage)&&r!=="citizen")currentPage=r?"login":"login";

  const pages={home,login:loginPage,citizen:citizenDashboard,admin:adminPage,field:fieldPage,report,complaints:complaintsPage,track,feedback:feedbackPage,contact:contactPage};
  const app=document.getElementById("app");app.innerHTML=pages[currentPage]();
  bindPageLinks();
  if(currentPage==="login")setupLogin();
  if(currentPage==="report"){
    document.getElementById("complaintForm").onsubmit=submitComplaint;
    const image=document.getElementById("imageInput");if(image)image.onchange=()=>{const p=document.getElementById("imagePreview");if(image.files[0]){p.style.display="block";p.innerHTML=`<span>✓ ${esc(image.files[0].name)} selected</span>`;}};
  }
  if(currentPage==="complaints"){fillComplaints();document.getElementById("complaintSearch").oninput=fillComplaints;document.getElementById("statusFilter").onchange=fillComplaints;}
  if(currentPage==="track")document.getElementById("trackBtn").onclick=trackComplaint;
  if(currentPage==="admin"){fillAdmin();["adminSearch","adminStatus","adminPriority"].forEach(id=>document.getElementById(id).addEventListener(id==="adminSearch"?"input":"change",fillAdmin));}
  if(currentPage==="field")setupField();
  if(currentPage==="feedback")setupFeedback();
  updateHeader();
}

document.getElementById("menuBtn")?.addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
document.getElementById("logoutBtn")?.addEventListener("click",logout);
document.getElementById("notificationBtn")?.addEventListener("click",()=>document.getElementById("notificationPanel").classList.toggle("open"));
document.getElementById("clearNotifications")?.addEventListener("click",()=>{document.getElementById("notificationList").innerHTML='<div class="empty" style="padding:25px"><h3>No notifications</h3><p>You are all caught up.</p></div>';document.getElementById("notificationCount").textContent="0";});
document.getElementById("modalBackdrop")?.addEventListener("click",e=>{if(e.target.id==="modalBackdrop")document.getElementById("modalBackdrop").classList.remove("open");});
document.getElementById("themeBtn")?.addEventListener("click",()=>{document.documentElement.classList.toggle("dark");localStorage.setItem("smartGhmcDark",document.documentElement.classList.contains("dark"));});
if(localStorage.getItem("smartGhmcDark")==="true")document.documentElement.classList.add("dark");

render();
