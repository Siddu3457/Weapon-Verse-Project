/* ================================================================
   ★ AUTH GUARD — redirect to login.html if not logged in
   Runs on every page EXCEPT login.html itself
================================================================ */
(function(){
  var page = window.location.pathname.split('/').pop() || 'index.html';
  /* Pages that don't need auth */
  var openPages = ['login.html', 'register.html'];
  if (openPages.indexOf(page) === -1) {
    /* Not on an open page — check session */
    try {
      var session = JSON.parse(localStorage.getItem('wv_session') || 'null');
      if (!session) {
        window.location.replace('login.html');
      }
    } catch(e) {
      window.location.replace('login.html');
    }
  }
})();

/* ================================================================
   WEAPON VERSE — script.js  (Final — Fixed Version)
   ----------------------------------------------------------------
   1.  Active nav highlight
   2.  Welcome banner (after login)
   3.  Account icon + dropdown (far right)
   4.  Login modal
   5.  Sign Up modal
   6.  Profile modal — per-user favourites
   7.  ★ FIXED: Favourites are PER ACCOUNT (wv_favs_<username>)
   8.  ★ NEW:   Clicking gun card image → redirect to gun detail page
   ================================================================ */

/* ── SVG Icons ── */
var CAT_ICONS = {
  pistols:  '<svg viewBox="0 0 32 32" fill="currentColor"><rect x="2" y="13" width="18" height="6" rx="2"/><path d="M20 14 L29 11 L29 19 L20 16 Z"/><rect x="5" y="19" width="4" height="6" rx="1.5"/><rect x="4" y="13" width="2.5" height="3" rx="0.5"/><circle cx="8" cy="14.5" r="1"/></svg>',
  rifles:   '<svg viewBox="0 0 32 32" fill="currentColor"><rect x="1" y="14" width="22" height="4" rx="1.5"/><path d="M23 14.5 L31 12 L31 20 L23 17.5 Z"/><rect x="6" y="14" width="2" height="7" rx="1"/><rect x="10" y="11" width="5" height="3" rx="1"/><rect x="3" y="18" width="7" height="3" rx="1.5"/></svg>',
  shotguns: '<svg viewBox="0 0 32 32" fill="currentColor"><rect x="1" y="14" width="20" height="5" rx="2"/><path d="M21 14.5 L30 12 L30 19 L21 18.5 Z"/><rect x="4" y="19" width="5" height="5" rx="2"/><circle cx="6" cy="14.5" r="1"/><circle cx="10" cy="14.5" r="1"/></svg>',
  snipers:  '<svg viewBox="0 0 32 32" fill="currentColor"><rect x="1" y="15" width="24" height="3" rx="1"/><path d="M25 15.5 L31 14 L31 18 L25 16.5 Z"/><rect x="10" y="10" width="7" height="5" rx="1.5"/><rect x="4" y="18" width="6" height="2" rx="1"/></svg>',
  smg:      '<svg viewBox="0 0 32 32" fill="currentColor"><rect x="1" y="13" width="15" height="5" rx="1.5"/><path d="M16 13.5 L26 11 L26 18 L16 17.5 Z"/><rect x="4" y="18" width="3.5" height="5" rx="1.5"/><rect x="10" y="11" width="4" height="2" rx="0.5"/></svg>'
};

/* ── Gun descriptions (used on detail page) ── */
var GUN_DESC = {
  'glock 17':          'Designed in Austria (1982), the Glock 17 is the world\'s most widely used service pistol. Its polymer frame and striker-fired mechanism set a new standard for reliability and lightweight design.',
  'beretta m9':        'Italian-designed semi-auto pistol (1975) that served as the U.S. military\'s standard sidearm for over 30 years. Known for its 15-round capacity and smooth double/single-action trigger system.',
  'colt m1911':        'Designed by John Browning and adopted in 1911, this legendary pistol served U.S. forces across two World Wars, Korea, and Vietnam — a total of 74 years of active service.',
  'sig sauer p320':    'Current U.S. Army standard sidearm (M17/M18) adopted in 2017. Its revolutionary modular chassis lets soldiers swap calibers and grip sizes in the field in minutes.',
  'desert eagle':      'One of the most powerful semi-automatic pistols ever built, the Desert Eagle fires a massive .50 AE round via a gas-operated mechanism normally found on rifles, not handguns.',
  'walther ppk':       'A German compact pistol (1931) famous worldwide as the weapon of choice for fictional spy James Bond. Widely used by European law enforcement and plainclothes officers.',
  'hk usp':            'German polymer-framed pistol (1993) with a patented recoil reduction system. Used by German police, FBI HRT, and special forces across NATO member nations.',
  'ruger sr9':         'American striker-fired pistol (2007) noted for its flat profile and ambidextrous controls. A favourite among U.S. concealed-carry permit holders for its reliability and capacity.',
  'cz 75':             'Czech masterpiece (1975) widely considered one of the finest service pistols ever made. Its all-steel frame and double-action trigger deliver outstanding accuracy and balance.',
  'browning hi-power': 'Designed by John Browning (1935). The first widely adopted 13-round pistol — used by both Allied and Axis forces during World War II across dozens of nations.',
  'ak-47':             'Designed by Mikhail Kalashnikov (1947). Over 100 million produced — the most manufactured firearm in history. Legendary for operating reliably in mud, sand, and extreme cold weather.',
  'm16':               'America\'s standard assault rifle since Vietnam (1964), designed by Eugene Stoner. Its lightweight aluminium and polymer construction was revolutionary and set the template for modern assault rifles.',
  'hk416':             'German piston-driven assault rifle (2004). Chosen by U.S. Delta Force, Norwegian Army, and French GIGN for its exceptional reliability under adverse combat conditions.',
  'insas rifle':       'India\'s indigenous assault rifle (1998) developed by the Ordnance Factories Board. Blends design concepts from the AK-47 and FN FAL — the standard infantry weapon of the Indian Armed Forces.',
  'fn scar-l':         'Belgian modular assault rifle (2004) developed specifically for U.S. SOCOM. Available in light (5.56mm) and heavy (7.62mm) variants — highly adaptable to different mission profiles.',
  'hk g36':            'German assault rifle (1997) adopted by the Bundeswehr. Features a translucent magazine and built-in optical rail. Used by German police and armed forces across 30+ countries.',
  'steyr aug':         'Austrian bullpup assault rifle (1978) — one of the first widely adopted bullpup designs. Its compact length and built-in optical sight were decades ahead of their time.',
  'l85a2 (sa80)':      'British bullpup assault rifle (1985), the standard individual weapon of the British Army. Significantly improved by H&K in 2002, now considered highly reliable across all environments.',
  'famas':             'French bullpup assault rifle (1978) known as "Le Clairon." Served as the standard rifle of the French Foreign Legion until replacement by the HK416 in 2017.',
  'tavor tar-21':      'Israeli bullpup assault rifle (2001) designed for armoured vehicle crews. Used extensively by the Israel Defense Forces and exported to over 30 countries worldwide.',
  'remington 870':     'The best-selling shotgun in American history (1950) with over 11 million units produced. A pump-action classic used by hunters, U.S. military, FBI, and local police forces.',
  'mossberg 500':      'American pump-action shotgun (1961) — the first shotgun to pass U.S. military combat specifications. Praised for its ambidextrous controls and extreme durability in all environments.',
  'benelli m4':        'Italian semi-automatic combat shotgun (1998) selected by the U.S. Marine Corps (M1014). Its ARGO gas system reliably cycles diverse ammunition types without any manual adjustment.',
  'winchester 1897':   'Designed by John Browning (1897) and dubbed the "Trench Gun" for its devastating close-quarters use in WWI. The first widely successful repeating pump-action shotgun design.',
  'saiga-12':          'Russian AK-platform semi-automatic shotgun (1997) built at the Izhmash factory. Accepts detachable box or drum magazines. Widely used by Russian security forces and sport shooters.',
  'franchi spas-12':   'Italian dual-mode combat shotgun (1979) capable of pump or semi-auto operation. Gained iconic status through numerous Hollywood films including Jurassic Park and Terminator 2.',
  'mossberg 590':      'Heavy-duty American pump-action shotgun (1987) with a metal trigger group and thicker barrel. The preferred choice of U.S. military and law enforcement for serious combat use.',
  'browning auto-5':   'Designed by John Browning (1902) — the world\'s first successful semi-automatic shotgun. Its distinctive humpback receiver is instantly recognisable, produced for over 50 years.',
  'kel-tec ksg':       'American bullpup pump-action shotgun (2011) with a dual-tube magazine. Its compact length and 14+1 round capacity make it unique among shotguns for military and civilian use alike.',
  'aa-12':             'American fully-automatic combat shotgun (1972) capable of 300 rounds per minute with a 20-round drum. Designed to absorb recoil so completely it can be fired one-handed.',
  'barrett m82':       'American anti-materiel rifle (1982) chambered in .50 BMG. Capable of disabling vehicles and aircraft from 1,800+ metres. The most powerful semi-automatic production sniper rifle ever built.',
  'dragunov svd':      'Soviet semi-automatic sniper rifle (1963) designed to bridge the gap between assault rifles and dedicated sniper weapons. Still in active service with over 20 countries worldwide.',
  'cheytac m200':      'American extreme long-range bolt-action system (2001). Includes a built-in ballistic computer and weather measurement system. Holds multiple world records for precision at 2,000+ metres.',
  'ai axmc':           'British multi-calibre precision rifle that converts between three calibres in the field by swapping barrel, bolt, and magazine. Standard with UK SAS and U.S. Special Forces.',
  'ai awm':            'British sniper rifle (1996) holding the confirmed long-range kill record at 2,475 metres set by a British sniper in Afghanistan in 2009. Widely used across NATO special forces.',
  'm24 sws':           'U.S. Army sniper weapon system (1988) based on the Remington 700 action. A bolt-action workhorse that served in every U.S. conflict from the Gulf War through Afghanistan.',
  'sako trg-42':       'Finnish precision bolt-action rifle (2000) from Sako Ltd. Its chassis design and match-grade trigger give sub-MOA accuracy at 1,500 metres. Adopted by Finnish military snipers.',
  'pgm hecate ii':     'French .50 BMG anti-materiel rifle (1993) used by French special forces. Its bolt-action design and muzzle brake keep recoil manageable while delivering 1,800 metre effective range.',
  'mk 13 mod 5':       'U.S. Navy SEAL sniper rifle in .300 Win Mag. Provides greater range than 7.62mm NATO. Gained fame from its use in Operation Red Wings in Afghanistan.',
  'dsr-1':             'German bullpup precision rifle (2000) used by GSG-9 and German police. Its chassis places the action behind the trigger for a compact length without sacrificing barrel length.',
  'hk mp5':            'Germany\'s most iconic SMG (1966) — the gold standard of law enforcement submachine guns. Used by SAS, Navy SEALs, and SWAT in 40+ countries. Exceptionally accurate for an SMG.',
  'uzi':               'Israeli SMG designed by Major Uziel Gal (1954). Used by military and security in 90+ countries — over 10 million units manufactured worldwide since its introduction.',
  'thompson m1a1':     'The legendary "Tommy Gun" (1919) designed by General Thompson. Saw heavy use in WWII by U.S. Army and Marines. Equally famous for its role in 1920s Prohibition-era crime.',
  'fn p90':            'Belgian bullpup PDW (1990) with a top-mounted 50-round magazine. Fires armour-piercing 5.7mm rounds. Used by NATO special forces and the U.S. Secret Service.',
  'mp40':              'German WWII SMG (1940). Over 1 million produced. Its folding stock and all-metal construction made it reliable and fast to manufacture at wartime industrial scale.',
  'hk mp7':            'German PDW (2001) firing 4.6mm armour-piercing rounds. Used by German KSK, British SAS, and numerous special forces who need both extreme compactness and armour penetration.',
  'steyr tmp':         'Austrian machine pistol (1992) with a rotating barrel lock and built-in front grip. Its compact polymer frame and 30-round magazine made it popular with Austrian and Bavarian police.',
  'pp-19 bizon':       'Russian SMG (1996) with a 64-round helical magazine wrapped under the barrel. Eliminates the need for a separate magazine well, keeping the weapon extremely compact and balanced.',
  'kriss vector':      'American SMG (2009) using a patented "Super V" mechanism that redirects recoil downward rather than backward. Dramatically reduces muzzle climb for faster accurate follow-up shots.',
  'vz. 61 škorpion':   'Czechoslovak machine pistol (1961) so compact it can be holstered like a pistol. Issued to vehicle crews and officers across Warsaw Pact countries during the Cold War.'
};

/* ================================================================
   ★ STORAGE HELPERS — PER-USER FAVOURITES
   Key: wv_favs_<username>  → each account has its own favourites
================================================================ */
function getUsers()   { try { return JSON.parse(localStorage.getItem('wv_users')  || '[]');   } catch(e) { return []; } }
function saveUsers(u) { localStorage.setItem('wv_users', JSON.stringify(u)); }
function getSession() { try { return JSON.parse(localStorage.getItem('wv_session') || 'null'); } catch(e) { return null; } }
function setSession(u){ localStorage.setItem('wv_session', JSON.stringify(u)); }
function clearSession(){ localStorage.removeItem('wv_session'); }

/* Per-user key — DIFFERENT for every account */
function favsKey() {
  var u = getSession();
  return u ? 'wv_favs_' + u.username : 'wv_favs_guest';
}
function getFavs()    { try { return JSON.parse(localStorage.getItem(favsKey()) || '[]'); } catch(e) { return []; } }
function saveFavs(f)  { localStorage.setItem(favsKey(), JSON.stringify(f)); }
function isFav(id)    { return getFavs().some(function(f){ return f.id === id; }); }

/* ================================================================
   1. ACTIVE NAV LINK
================================================================ */
(function(){
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-center a').forEach(function(a){
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

/* ================================================================
   2. WELCOME BANNER
================================================================ */
function refreshWelcome() {
  var el   = document.getElementById('wv-welcome');
  var user = getSession();
  if (!el) return;
  if (user) { el.textContent = '👋 Welcome, ' + user.username; el.style.display = 'block'; }
  else      { el.style.display = 'none'; }
}

/* ================================================================
   3. ACCOUNT DROPDOWN (top-right)
================================================================ */
function buildNavbar() {
  var auth = document.querySelector('.navbar-auth');
  if (!auth) return;
  auth.innerHTML = '';

  /* Insert welcome badge next to logo */
  if (!document.getElementById('wv-welcome')) {
    var logo = document.querySelector('.navbar-logo');
    if (logo) {
      var wb = document.createElement('span');
      wb.id = 'wv-welcome'; wb.className = 'wv-welcome';
      logo.parentNode.insertBefore(wb, logo.nextSibling);
    }
  }
  refreshWelcome();

  /* ★ FAVOURITES HEART ICON (goes into .navbar-auth, left of account btn) */
  var favBtn = document.createElement('a');
  favBtn.href      = 'favourites.html';
  favBtn.className = 'nav-fav-btn';
  favBtn.id        = 'navFavBtn';
  favBtn.title     = 'My Favourites';
  favBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">' +
      '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
    '</svg>' +
    '<span class="nav-fav-count" id="navFavCount" style="display:none">0</span>';
  auth.appendChild(favBtn);
  refreshFavBadge();  /* update count badge */

  /* Account icon button + dropdown */
  var widget = document.createElement('div');
  widget.className = 'acct-widget';
  widget.innerHTML =
    '<button class="acct-btn" id="acctBtn" title="Account">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">' +
        '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' +
      '</svg>' +
    '</button>' +
    '<div class="acct-dd" id="acctDd"></div>';
  auth.appendChild(widget);
  refreshDropdown();

  document.getElementById('acctBtn').addEventListener('click', function(e){
    e.stopPropagation();
    document.getElementById('acctDd').classList.toggle('open');
  });
  document.addEventListener('click', function(){
    var dd = document.getElementById('acctDd');
    if (dd) dd.classList.remove('open');
  });
}

/* Update the red badge count on the heart icon */
function refreshFavBadge() {
  var badge = document.getElementById('navFavCount');
  if (!badge) return;
  var count = getFavs().length;
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function refreshDropdown() {
  var dd  = document.getElementById('acctDd');
  var btn = document.getElementById('acctBtn');
  if (!dd) return;
  var user = getSession();
  if (user) {
    btn.classList.add('is-logged');
    dd.innerHTML =
      '<div class="dd-head">' +
        '<div class="dd-av">' + user.username[0].toUpperCase() + '</div>' +
        '<div><div class="dd-uname">' + user.username + '</div><div class="dd-email">' + user.email + '</div></div>' +
      '</div>' +
      '<div class="dd-sep"></div>' +
      '<button class="dd-row" onclick="openProfile()">⚙ My Account &amp; Favourites</button>' +
      '<div class="dd-sep"></div>' +
      '<button class="dd-row dd-out" onclick="doLogout()">⏻ Logout</button>';
  } else {
    btn.classList.remove('is-logged');
    dd.innerHTML =
      '<div class="dd-title">WEAPON VERSE</div>' +
      '<button class="dd-row" onclick="openLoginModal()">→ Login</button>' +
      '<button class="dd-row" onclick="openSignupModal()">+ Sign Up</button>';
  }
}

/* ================================================================
   4. LOGIN MODAL
================================================================ */
function openLoginModal() {
  closeModals(); closeDd();
  var m = mkModal('LOGIN',
    '<div class="mg"><label>Username</label><input id="lUser" placeholder="Your username"/><p class="merr" id="lUerr"></p></div>' +
    '<div class="mg"><label>Password</label><input type="password" id="lPass" placeholder="Your password"/><p class="merr" id="lPerr"></p></div>' +
    '<button class="mbtn" onclick="submitLoginModal()">LOGIN</button>' +
    '<p class="mlink">No account? <a href="#" onclick="openSignupModal();return false;">Sign Up here</a></p>'
  );
  document.body.appendChild(m);
  m.addEventListener('click', function(e){ if(e.target===m) closeModals(); });
}
function submitLoginModal() {
  var u = val('lUser'), p = val('lPass');
  clearErrs(['lUerr','lPerr']);
  var ok = true;
  if (!u || u.length < 3) { showErr('lUerr','Username must be at least 3 characters.'); ok=false; }
  if (!p || p.length < 6) { showErr('lPerr','Password must be at least 6 characters.'); ok=false; }
  if (!ok) return;
  var found = getUsers().find(function(x){ return x.username===u && x.password===p; });
  if (!found) { showErr('lUerr','Incorrect username or password.'); return; }
  setSession(found);
  closeModals(); refreshDropdown(); refreshWelcome();
  initFavButtons(); /* ← redraw hearts for THIS user's favourites */
  refreshFavBadge();
}

/* ================================================================
   5. SIGN UP MODAL
================================================================ */
function openSignupModal() {
  closeModals(); closeDd();
  var m = mkModal('SIGN UP',
    '<div class="mg"><label>Username</label><input id="sUser" placeholder="Choose a username (min 3 chars)"/><p class="merr" id="sUerr"></p></div>' +
    '<div class="mg"><label>Email</label><input type="email" id="sEmail" placeholder="Your email address"/><p class="merr" id="sEerr"></p></div>' +
    '<div class="mg"><label>Date of Birth</label><input type="date" id="sDob"/><p class="merr" id="sDerr"></p></div>' +
    '<div class="mg"><label>Password</label><input type="password" id="sPass" placeholder="Min 6 characters"/><p class="merr" id="sPwderr"></p></div>' +
    '<div class="mg"><label>Confirm Password</label><input type="password" id="sConf" placeholder="Re-enter password"/><p class="merr" id="sCerr"></p></div>' +
    '<button class="mbtn" onclick="submitSignupModal()">CREATE ACCOUNT</button>' +
    '<p class="mlink">Have an account? <a href="#" onclick="openLoginModal();return false;">Login here</a></p>'
  );
  document.body.appendChild(m);
  m.addEventListener('click', function(e){ if(e.target===m) closeModals(); });
}
function submitSignupModal() {
  var u=val('sUser'),e=val('sEmail'),d=val('sDob'),p=val('sPass'),c=val('sConf');
  clearErrs(['sUerr','sEerr','sDerr','sPwderr','sCerr']);
  var ok=true;
  if (!u||u.length<3)       { showErr('sUerr','Min 3 characters required.'); ok=false; }
  if (!e||!e.includes('@')) { showErr('sEerr','Valid email required.'); ok=false; }
  if (!d)                   { showErr('sDerr','Date of birth required.'); ok=false; }
  if (!p||p.length<6)       { showErr('sPwderr','Min 6 characters required.'); ok=false; }
  if (!c||c!==p)            { showErr('sCerr','Passwords do not match.'); ok=false; }
  if (!ok) return;
  var users = getUsers();
  if (users.find(function(x){ return x.username===u; })) { showErr('sUerr','Username already taken.'); return; }
  var newUser = { username:u, email:e, dob:d, password:p };
  users.push(newUser); saveUsers(users); setSession(newUser);
  closeModals(); refreshDropdown(); refreshWelcome();
  initFavButtons(); /* ← new account starts with empty favourites */
  refreshFavBadge();
}

/* ================================================================
   6. PROFILE MODAL — shows ONLY this user's favourites
================================================================ */
function openProfile() {
  closeModals(); closeDd();
  var user = getSession();
  if (!user) { openLoginModal(); return; }
  var dobStr = 'N/A';
  if (user.dob) {
    try { dobStr = new Date(user.dob+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}); } catch(e){}
  }
  var favs   = getFavs(); /* ← reads from wv_favs_<username> */
  var ORDER  = ['pistol','rifle','shotgun','sniper','smg'];
  var LABELS = { pistol:'Pistols', rifle:'Rifles', shotgun:'Shotguns', sniper:'Snipers', smg:'SMGs' };
  var IMAP   = { pistol:'pistols', rifle:'rifles', shotgun:'shotguns', sniper:'snipers', smg:'smg' };
  var groups = {};
  favs.forEach(function(g){
    var cat = g.category.toLowerCase().replace(/s$/,'');
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(g);
  });
  var favsHtml = '';
  ORDER.forEach(function(cat){
    if (!groups[cat]||!groups[cat].length) return;
    favsHtml += '<div class="pf-cat"><div class="pf-cat-hd"><span class="pf-cat-icon">'+(CAT_ICONS[IMAP[cat]]||'')+'</span>'+LABELS[cat]+' <span class="pf-cat-ct">('+groups[cat].length+')</span></div>';
    groups[cat].forEach(function(g){
      favsHtml += '<div class="pf-fav-row" id="pfrow_'+g.id+'">'+
        '<img src="'+g.img+'" alt="'+g.name+'" onerror="this.style.opacity=\'0.2\'"/>'+
        '<div class="pf-fav-info"><div class="pf-fav-name">'+g.name+'</div><div class="pf-fav-cat">'+g.category.toUpperCase()+'</div></div>'+
        '<button class="pf-fav-rm" onclick="removeFavProfile(\''+g.id+'\')">✕</button></div>';
    });
    favsHtml += '</div>';
  });
  if (!favsHtml) {
    favsHtml = '<div class="pf-no-fav"><svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" style="margin:0 auto 10px;display:block;opacity:.25;color:#6ab04c"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><p>No favourites yet.<br>Browse the arsenal and tap ♥ on any gun.</p></div>';
  }
  var html =
    '<div class="pf-head"><div class="pf-av">'+user.username[0].toUpperCase()+'</div>'+
    '<div class="pf-head-info"><h2>'+user.username+'</h2><span class="pf-badge">⚔ OPERATIVE</span></div></div>'+
    '<div class="pf-stats">'+
      '<div class="pf-stat"><span class="pf-stat-n">'+favs.length+'</span><span class="pf-stat-l">FAVOURITES</span></div>'+
      '<div class="pf-stat-div"></div>'+
      '<div class="pf-stat"><span class="pf-stat-n">5</span><span class="pf-stat-l">CATEGORIES</span></div>'+
    '</div>'+
    '<div class="pf-info-grid">'+
      '<div class="pf-info-box"><div class="pf-info-lbl">USERNAME</div><div class="pf-info-val">'+user.username+'</div></div>'+
      '<div class="pf-info-box"><div class="pf-info-lbl">EMAIL</div><div class="pf-info-val">'+user.email+'</div></div>'+
      '<div class="pf-info-box pf-info-full"><div class="pf-info-lbl">DATE OF BIRTH</div><div class="pf-info-val">'+dobStr+'</div></div>'+
    '</div>'+
    '<div class="pf-sec-title">♥ MY FAVOURITE ARSENAL</div>'+
    '<div class="pf-favs" id="pfFavs">'+favsHtml+'</div>'+
    '<button class="pf-logout" onclick="doLogout()">⏻ LOGOUT</button>';
  var overlay = document.createElement('div');
  overlay.className = 'mo-overlay'; overlay.id = 'profileModal';
  overlay.innerHTML = '<div class="mo mo-profile"><button class="mo-x" onclick="closeModals()">✕</button>'+html+'</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModals(); });
}

function removeFavProfile(id) {
  var favs = getFavs().filter(function(f){ return f.id!==id; });
  saveFavs(favs);
  document.querySelectorAll('[data-fav-id="'+id+'"]').forEach(function(b){ b.classList.remove('active'); });
  var row = document.getElementById('pfrow_'+id);
  if (row) {
    row.style.opacity='0'; row.style.transition='opacity .2s';
    setTimeout(function(){
      row.remove();
      var n = getFavs().length;
      var el = document.querySelector('.pf-stat-n'); if(el) el.textContent=n;
      refreshFavBadge();
      var pf = document.getElementById('pfFavs');
      if (pf && !pf.querySelector('.pf-fav-row')) pf.innerHTML='<div class="pf-no-fav"><p>No favourites remaining.</p></div>';
    }, 220);
  }
}

function doLogout() {
  clearSession(); closeModals();
  window.location.href = 'login.html';
}

/* ================================================================
   7. ★ FAVOURITES — PER ACCOUNT
   Hearts read/write to wv_favs_<username> only
================================================================ */
function initFavButtons() {
  /* Remove existing buttons first (avoid duplicates on re-init) */
  document.querySelectorAll('.fav-btn').forEach(function(b){ b.remove(); });

  document.querySelectorAll('.gun-card').forEach(function(card){
    var nameEl  = card.querySelector('.card-body h3');
    var badgeEl = card.querySelector('.gun-badge');
    var imgEl   = card.querySelector('.card-img img');
    if (!nameEl) return;

    var name     = nameEl.textContent.trim();
    var category = badgeEl ? badgeEl.textContent.trim().toLowerCase() : 'unknown';
    var img      = imgEl ? imgEl.getAttribute('src') : '';
    var specs    = {};
    card.querySelectorAll('.gun-table tr').forEach(function(r){
      var tds = r.querySelectorAll('td');
      if (tds.length===2) specs[tds[0].textContent.trim()] = tds[1].textContent.trim();
    });
    var id = (category+'_'+name).replace(/\s+/g,'_').toLowerCase();

    var btn = document.createElement('button');
    /* isFav() reads from THIS user's storage key */
    btn.className = 'fav-btn' + (isFav(id) ? ' active' : '');
    btn.title = 'Toggle Favourite';
    btn.setAttribute('data-fav-id', id);
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

    var cardImg = card.querySelector('.card-img');
    if (cardImg) cardImg.appendChild(btn);

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      if (!getSession()) { openLoginModal(); return; } /* must be logged in */
      var favs = getFavs(); /* reads THIS user's list */
      var idx  = favs.findIndex(function(f){ return f.id===id; });
      if (idx > -1) { favs.splice(idx,1); btn.classList.remove('active'); }
      else          { favs.push({id:id,name:name,category:category,img:img,specs:specs}); btn.classList.add('active'); }
      saveFavs(favs); /* saves to THIS user's list */
      refreshFavBadge(); /* update heart count in navbar */
      btn.style.transform='scale(1.4)';
      setTimeout(function(){ btn.style.transform=''; },200);
    });
  });
}

/* ================================================================
   8. ★ GUN CARD CLICK → REDIRECT TO DEDICATED GUN DETAIL PAGE
   - Clicking anywhere on the card (except heart) opens gun-detail.html
   - Gun data is passed via sessionStorage so the detail page can read it
================================================================ */
function initGunCardRedirect() {
  document.querySelectorAll('.gun-card').forEach(function(card){
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e){
      /* Don't redirect when clicking the heart button */
      if (e.target.closest('.fav-btn')) return;

      /* Collect all gun data from the card */
      var nameEl  = card.querySelector('.card-body h3');
      var badgeEl = card.querySelector('.gun-badge');
      var imgEl   = card.querySelector('.card-img img');
      if (!nameEl) return;

      var name     = nameEl.textContent.trim();
      var category = badgeEl ? badgeEl.textContent.trim() : '';
      var img      = imgEl ? imgEl.getAttribute('src') : '';

      var specs = {};
      card.querySelectorAll('.gun-table tr').forEach(function(r){
        var tds = r.querySelectorAll('td');
        if (tds.length===2) specs[tds[0].textContent.trim()] = tds[1].textContent.trim();
      });

      /* Store gun data in sessionStorage for the detail page to read */
      var gunData = {
        name:     name,
        category: category,
        img:      img,
        specs:    specs,
        desc:     GUN_DESC[name.toLowerCase()] || 'A notable firearm used by military and law enforcement worldwide. See the specifications below for detailed technical data.'
      };
      sessionStorage.setItem('wv_gun', JSON.stringify(gunData));

      /* Navigate to the gun detail page */
      window.location.href = 'gun-detail.html';
    });
  });
}

/* ================================================================
   GUN DETAIL PAGE — init (only runs on gun-detail.html)
================================================================ */
function initGunDetailPage() {
  var data = null;
  try { data = JSON.parse(sessionStorage.getItem('wv_gun') || 'null'); } catch(e){}
  if (!data) { window.location.href = 'index.html'; return; }

  var CAT_CLR = { PISTOL:'#6ab04c', RIFLE:'#c8a84b', SHOTGUN:'#e05555', SNIPER:'#4ab0d0', SMG:'#b04ce8' };
  var clr = CAT_CLR[data.category.toUpperCase()] || '#6ab04c';

  /* Set page title */
  document.title = data.name + ' — WEAPON VERSE';

  /* Badge */
  var badge = document.getElementById('gd-badge');
  if (badge) { badge.textContent = data.category.toUpperCase(); badge.style.color = clr; badge.style.borderColor = clr+'55'; badge.style.background = clr+'18'; }

  /* Name */
  var nameEl = document.getElementById('gd-name');
  if (nameEl) nameEl.textContent = data.name.toUpperCase();

  /* Accent line */
  var line = document.getElementById('gd-line');
  if (line) line.style.background = clr;

  /* Description */
  var descEl = document.getElementById('gd-desc');
  if (descEl) descEl.textContent = data.desc;

  /* Image */
  var imgEl = document.getElementById('gd-img');
  if (imgEl) { imgEl.src = data.img; imgEl.alt = data.name; }

  /* Specs table */
  var specsEl = document.getElementById('gd-specs');
  if (specsEl) {
    specsEl.innerHTML = '';
    Object.keys(data.specs).forEach(function(key){
      var row = document.createElement('div');
      row.className = 'gd-row';
      row.innerHTML = '<span class="gd-key">'+key+'</span><span class="gd-val">'+data.specs[key]+'</span>';
      specsEl.appendChild(row);
    });
  }

  /* Favourite button on detail page */
  var id  = (data.category.toLowerCase()+'_'+data.name).replace(/\s+/g,'_').toLowerCase();
  var fav = document.getElementById('gd-fav');
  if (fav) {
    if (isFav(id)) fav.classList.add('active');
    fav.addEventListener('click', function(){
      if (!getSession()) { alert('Please login to save favourites.'); return; }
      var favs = getFavs();
      var idx  = favs.findIndex(function(f){ return f.id===id; });
      if (idx > -1) { favs.splice(idx,1); fav.classList.remove('active'); fav.querySelector('span').textContent='♡ Add to Favourites'; }
      else          { favs.push({id:id,name:data.name,category:data.category.toLowerCase(),img:data.img,specs:data.specs}); fav.classList.add('active'); fav.querySelector('span').textContent='♥ Saved to Favourites'; }
      saveFavs(favs);
    });
    fav.querySelector('span').textContent = isFav(id) ? '♥ Saved to Favourites' : '♡ Add to Favourites';
  }
}

/* ================================================================
   MODAL HELPERS
================================================================ */
function mkModal(title, body) {
  var d = document.createElement('div');
  d.className = 'mo-overlay';
  d.innerHTML = '<div class="mo mo-form"><button class="mo-x" onclick="closeModals()">✕</button><h2 class="mo-title">'+title+'</h2>'+body+'</div>';
  return d;
}
function closeModals() { document.querySelectorAll('.mo-overlay').forEach(function(m){ m.remove(); }); }
function closeDd()     { var dd=document.getElementById('acctDd'); if(dd) dd.classList.remove('open'); }
function val(id)       { var el=document.getElementById(id); return el ? el.value.trim() : ''; }
function showErr(id,m) { var el=document.getElementById(id); if(el){el.textContent='⚠ '+m;el.style.display='block';} }
function clearErrs(a)  { a.forEach(function(id){ var el=document.getElementById(id); if(el){el.textContent='';el.style.display='none';} }); }

/* Escape key */
document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ closeModals(); } });

/* ================================================================
   STANDALONE FORM PAGES (login.html / register.html)
================================================================ */
var _lf = document.getElementById('loginForm');
if (_lf) {
  _lf.addEventListener('submit', function(e){
    e.preventDefault();
    var u=val('loginUsername'), p=val('loginPassword');
    var ue=document.getElementById('loginUsernameError'), pe=document.getElementById('loginPasswordError');
    ue.style.display='none'; pe.style.display='none';
    var ok=true;
    if(!u||u.length<3){ ue.textContent='⚠ Min 3 characters.'; ue.style.display='block'; ok=false; }
    if(!p||p.length<6){ pe.textContent='⚠ Min 6 characters.'; pe.style.display='block'; ok=false; }
    if(!ok) return;
    var found=getUsers().find(function(x){ return x.username===u&&x.password===p; });
    if(!found){ ue.textContent='⚠ Invalid credentials.'; ue.style.display='block'; return; }
    setSession(found);
    alert('✅ Login successful! Welcome back, '+u+'!');
    window.location.href='index.html';
  });
}
var _rf = document.getElementById('registerForm');
if (_rf) {
  _rf.addEventListener('submit', function(e){
    e.preventDefault();
    var u=val('regUsername'),em=val('regEmail'),p=val('regPassword'),c=val('regConfirm');
    ['regUsernameError','regEmailError','regPasswordError','regConfirmError'].forEach(function(id){
      var el=document.getElementById(id); if(el) el.style.display='none';
    });
    var ok=true;
    function fe(id,msg){ var el=document.getElementById(id); if(el){el.textContent='⚠ '+msg;el.style.display='block';} ok=false; }
    if(!u||u.length<3)       fe('regUsernameError','Min 3 characters.');
    if(!em||!em.includes('@'))fe('regEmailError','Valid email required.');
    if(!p||p.length<6)        fe('regPasswordError','Min 6 characters.');
    if(!c||c!==p)             fe('regConfirmError','Passwords do not match.');
    if(!ok) return;
    var users=getUsers();
    if(users.find(function(x){ return x.username===u; })){ fe('regUsernameError','Username taken.'); return; }
    var nu={username:u,email:em,dob:'',password:p};
    users.push(nu); saveUsers(users); setSession(nu);
    alert('✅ Account created! Welcome to WEAPON VERSE, '+u+'!');
    window.location.href='index.html';
  });
}

/* ================================================================
   INIT
================================================================ */
document.addEventListener('DOMContentLoaded', function(){
  buildNavbar();   /* also calls refreshFavBadge() */

  /* Gun detail page has its own init */
  if (document.getElementById('gd-name')) {
    initGunDetailPage();
  } else {
    /* All other pages get fav buttons + card redirect */
    initFavButtons();
    initGunCardRedirect();
  }
});
