/* Reception Ready – learning engine */
(function(){
'use strict';
var KEY='sign_ready_v1', INT=[1,1,2,4,7,14], PASS=80;
var QS={},LES={},UNI={},SIGNCARD={};
COURSE.forEach(function(u,ui){u.i=ui;UNI[u.id]=u;u.lessons.forEach(function(l,li){l.u=u;l.i=li;LES[l.id]=l;var teach=null;
 l.cards.forEach(function(c){if(c.t==='read'){teach=c;if(c.sign)SIGNCARD[c.sign]=c;}else QS[c.id]={c:c,u:u,l:l,teach:(c.sg&&SIGNCARD[c.sg])||teach};});});});
function uq(u){var a=[];u.lessons.forEach(function(l){l.cards.forEach(function(c){if(c.t!=='read')a.push(c.id);});});return a;}

/* ---------- saving ---------- */
function blank(){return {v:1,name:'',done:{},box:{},ut:{},fin:{best:0,passed:false},missed:{},days:{},cur:null,best:0,push:null,
 set:{size:1,theme:'auto',auto:false,open:false,sound:true}};}
var S=load();
function load(){try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.v===1){var b=blank();for(var k in b)if(!(k in s))s[k]=b[k];for(k in b.set)if(!(k in s.set))s.set[k]=b.set[k];return s;}}catch(e){}return blank();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
document.addEventListener('visibilitychange',function(){if(document.hidden)save();});
window.addEventListener('pagehide',save);
setInterval(save,60000);
function today(){var d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000);}
function markDay(){S.days[today()]=1;}
function streak(){var d=today(),n=0;if(!S.days[d])d--;while(S.days[d]){n++;d--;}return n;}

/* ---------- helpers ---------- */
var $=function(s,r){return (r||document).querySelector(s);};
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function btn(cls,html,fn){var b=el('button',cls,html);b.type='button';b.addEventListener('click',fn);return b;}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function range(n){var a=[];for(var i=0;i<n;i++)a.push(i);return a;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function strip(h){var d=document.createElement('div');d.innerHTML=h;return (d.textContent||'').replace(/\s+/g,' ').trim();}
function plural(n,w){return n+' '+w+(n===1?'':'s');}
var main=$('#main');
function scrollTop(){try{window.scrollTo(0,0);}catch(e){}}

/* ---------- speech ---------- */
var voice=null;
function pickVoice(){try{var v=speechSynthesis.getVoices();voice=v.filter(function(x){return /en-GB/i.test(x.lang);})[0]||v.filter(function(x){return /^en/i.test(x.lang);})[0]||null;}catch(e){}}
if('speechSynthesis' in window){pickVoice();try{speechSynthesis.onvoiceschanged=pickVoice;}catch(e){}}
function speak(text){if(!('speechSynthesis' in window))return;try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.rate=0.9;if(voice){u.voice=voice;u.lang=voice.lang;}else u.lang='en-GB';speechSynthesis.speak(u);}catch(e){}}
function hush(){try{speechSynthesis.cancel();}catch(e){}}
function sayBtn(getText){if(!('speechSynthesis' in window))return el('span');return btn('say','<span aria-hidden="true">🔊</span> Read it to me',function(){speak(getText());});}

/* ---------- settings ---------- */
function applySet(){var r=document.documentElement;r.style.fontSize=[17,19,22,25][S.set.size]+'px';
 if(S.set.theme==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',S.set.theme);}
applySet();

/* ---------- unlocking ---------- */
function unitPassed(u){return !!(S.ut[u.id]&&S.ut[u.id].passed);}
function unitOpen(u){return S.set.open||u.i===0||unitPassed(COURSE[u.i-1]);}
function lessonOpen(l){return unitOpen(l.u)&&(S.set.open||l.i===0||!!S.done[l.u.lessons[l.i-1].id]);}
function lessonsDone(u){return u.lessons.every(function(l){return S.done[l.id];});}
function allPassed(){return COURSE.every(unitPassed);}
function learned(){return Object.keys(S.box).filter(function(id){return QS[id];});}
function due(){var t=today();return learned().filter(function(id){return S.box[id].due<=t;})
 .sort(function(a,b){return S.box[a].b-S.box[b].b||S.box[a].due-S.box[b].due;});}
function tricky(){return learned().filter(function(id){var r=S.box[id];return r.w>0&&r.b<3;});}

/* ---------- navigation ---------- */
var tabs=$('#tabs');
function setTab(name){Array.prototype.forEach.call(tabs.querySelectorAll('button'),function(b){b.setAttribute('aria-current',b.dataset.t===name?'page':'false');});}
tabs.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
 if(S.cur&&!confirmLeave(function(){go(b.dataset.t);}))return; go(b.dataset.t);});
function go(t){hush();({home:home,goal:goalView,look:lookView,set:setView})[t]();}
var leaveOK=false;
function confirmLeave(then){ /* inside a session: pausing is safe, progress is kept */
 if(!$('.sess'))return true; save(); then(); return false;}
function shell(tab,isSession){hush();main.innerHTML='';document.body.classList.toggle('insess',!!isSession);setTab(tab);scrollTop();}


/* ---------- grow the garden ---------- */
function F(c){return 'style="fill:var(--'+c+')"';}
var PARTS=[
 ['the lawn','<rect x="0" y="150" width="360" height="70" '+F('grass')+'/><rect x="0" y="150" width="360" height="6" '+F('grass2')+'/>'],
 ['the garden path','<path d="M168 220C172 200 150 186 176 160h16c-22 26 6 40 4 60z" '+F('path')+'/>'],
 ['the fence','<g '+F('wood')+'>'+[8,40,72,104,136,214,246,278,310,342].map(function(x){return '<rect x="'+x+'" y="128" width="8" height="26" rx="2"/>';}).join('')+'<rect x="0" y="134" width="150" height="4"/><rect x="0" y="146" width="150" height="4"/><rect x="210" y="134" width="150" height="4"/><rect x="210" y="146" width="150" height="4"/></g>'],
 ['a bench','<g '+F('wood')+'><rect x="226" y="164" width="44" height="5" rx="1"/><rect x="226" y="156" width="44" height="4" rx="1"/><rect x="230" y="169" width="3" height="10"/><rect x="263" y="169" width="3" height="10"/></g>'],
 ['a young tree','<rect x="58" y="128" width="5" height="34" '+F('trunk')+'/><circle cx="60" cy="118" r="17" '+F('tree')+'/>'],
 ['the pink flowers','<g>'+[92,104,116,128,140].map(function(x,i){return '<rect x="'+(x-.75)+'" y="'+(172+i%2*3)+'" width="1.5" height="10" '+F('tree')+'/><circle cx="'+x+'" cy="'+(170+i%2*3)+'" r="4.5" '+F('petal')+'/><circle cx="'+x+'" cy="'+(170+i%2*3)+'" r="1.6" '+F('sun')+'/>';}).join('')+'</g>'],
 ['the yellow flowers','<g>'+[206,218,230,242,254,266].map(function(x,i){return '<rect x="'+(x-.75)+'" y="'+(192+i%2*3)+'" width="1.5" height="10" '+F('tree')+'/><circle cx="'+x+'" cy="'+(190+i%2*3)+'" r="4" '+F('petal2')+'/>';}).join('')+'</g>'],
 ['the pond','<ellipse cx="306" cy="196" rx="40" ry="13" '+F('water')+'/><ellipse cx="296" cy="193" rx="12" ry="2.5" '+F('cloud')+' opacity=".5"/>'],
 ['the ducks','<g><ellipse cx="292" cy="196" rx="7" ry="4" '+F('cloud')+'/><circle cx="297" cy="191" r="3" '+F('cloud')+'/><path d="M299.5 191l4 1-4 1z" '+F('sun')+'/><ellipse cx="318" cy="199" rx="6" ry="3.5" '+F('cloud')+'/><circle cx="322" cy="194.5" r="2.6" '+F('cloud')+'/><path d="M324 194.5l3.5 1-3.5 1z" '+F('sun')+'/></g>'],
 ['the sunflowers','<g>'+[16,30].map(function(x,i){var y=100+i*10;return '<rect x="'+(x-1)+'" y="'+y+'" width="2" height="'+(60-i*10)+'" '+F('tree')+'/><circle cx="'+x+'" cy="'+y+'" r="8" '+F('petal2')+'/><circle cx="'+x+'" cy="'+y+'" r="3.5" '+F('trunk')+'/>';}).join('')+'</g>'],
 ['the big oak tree','<rect x="318" y="96" width="10" height="56" '+F('trunk')+'/><circle cx="323" cy="82" r="28" '+F('tree')+'/><circle cx="302" cy="96" r="16" '+F('tree')+'/><circle cx="342" cy="98" r="15" '+F('tree')+'/>'],
 ['the bird box','<rect x="316" y="104" width="14" height="14" '+F('wood')+'/><path d="M314 105l9-8 9 8z" '+F('trunk')+'/><circle cx="323" cy="111" r="2.5" '+F('trunk')+'/>'],
 ['the bushes','<ellipse cx="160" cy="152" rx="16" ry="10" '+F('tree')+'/><ellipse cx="200" cy="152" rx="14" ry="9" '+F('tree')+'/><ellipse cx="110" cy="154" rx="12" ry="7" '+F('grass2')+'/>'],
 ['the butterflies','<g '+F('petal')+'><path d="M120 92c-6-8-12-2-6 3 6 4 6-3 6-3zm0 0c6-8 12-2 6 3-6 4-6-3-6-3z"/><path d="M200 110c-5-6-10-1-5 2 5 3 5-2 5-2zm0 0c5-6 10-1 5 2-5 3-5-2-5-2z" '+F('petal2')+'/></g>'],
 ['the sunshine','<circle cx="44" cy="40" r="18" '+F('sun')+'/><g style="stroke:var(--sun);stroke-width:3;stroke-linecap:round">'+[0,45,90,135,180,225,270,315].map(function(a){var r=a*Math.PI/180;return '<line x1="'+(44+Math.cos(r)*24).toFixed(1)+'" y1="'+(40+Math.sin(r)*24).toFixed(1)+'" x2="'+(44+Math.cos(r)*31).toFixed(1)+'" y2="'+(40+Math.sin(r)*31).toFixed(1)+'"/>';}).join('')+'</g>'],
 ['the clouds','<g '+F('cloud')+'><ellipse cx="160" cy="40" rx="22" ry="10"/><ellipse cx="176" cy="34" rx="15" ry="10"/><ellipse cx="248" cy="58" rx="18" ry="8"/><ellipse cx="260" cy="53" rx="12" ry="8"/></g>'],
 ['the rainbow','<g fill="none" stroke-width="5" opacity=".85"><path d="M110 150a90 90 0 0 1 180 0" style="stroke:var(--petal)"/><path d="M116 150a84 84 0 0 1 168 0" style="stroke:var(--petal2)"/><path d="M122 150a78 78 0 0 1 156 0" style="stroke:var(--grass)"/><path d="M128 150a72 72 0 0 1 144 0" style="stroke:var(--water)"/></g>'],
 ['the celebration bunting','<path d="M0 8Q180 34 360 8" fill="none" style="stroke:var(--edge);stroke-width:1.2"/>'+[20,50,80,110,140,170,200,230,260,290,320,346].map(function(x,i){var y=8+26*(1-Math.pow((x-180)/180,2));return '<path d="M'+(x-8)+' '+(y-1).toFixed(1)+'h16l-8 13z" '+F(['petal','petal2','water','grass'][i%4])+'/>';}).join('')]
];
function buildPts(){var p=0;COURSE.forEach(function(u){u.lessons.forEach(function(l){if(S.done[l.id])p++;});if(unitPassed(u))p++;});return p;}
var BUILD_MAX=(function(){var n=0;COURSE.forEach(function(u){n+=u.lessons.length+1;});return n;})();
function builtCount(){var n=Math.min(PARTS.length-1,Math.ceil(buildPts()*(PARTS.length-1)/BUILD_MAX));return n+(S.fin.passed?1:0);}
function hospitalSVG(n,fresh){var g='';PARTS.forEach(function(p,i){var cls=i<n?(fresh&&i>=fresh[0]&&i<fresh[1]?'p new':'p'):'p ghost';g+='<g class="'+cls+'">'+p[1]+'</g>';});
 return '<svg class="hs" viewBox="0 0 360 220" role="img" aria-label="Your garden: '+n+' of '+PARTS.length+' things planted">'+g+'</svg>';}
function nextPieceText(n){if(n>=PARTS.length)return 'Your garden is finished. Well done!';
 if(n===PARTS.length-1)return 'Last thing: <b>'+PARTS[n][0]+'</b>. Pass the final test to put it up.';
 var need=Math.floor(n*BUILD_MAX/(PARTS.length-1))+1,have=buildPts(),left=Math.max(1,need-have);
 return 'Next: <b>'+PARTS[n][0]+'</b>, after '+(left===1?'1 more lesson or test':left+' more lessons or tests')+'.';}
function buildCard(){var n=builtCount();var c=el('section','card build');
 c.innerHTML='<span class="eyebrow">Grow your garden</span><b class="bt">'+(n===0?'Every lesson plants something new':n>=PARTS.length?'Your garden is in full bloom':n+' of '+PARTS.length+' things planted')+'</b>'+hospitalSVG(n)+'<small>'+nextPieceText(n)+'</small>';
 return c;}
function newPieceBox(before){var n=builtCount();if(n<=before)return null;var names=PARTS.slice(before,n).map(function(p){return p[0];});
 var b=el('div','newpiece','<p><b>New in your garden:</b> '+names.join(' and ')+'.</p>'+hospitalSVG(n,[before,n]));return b;}

/* ---------- sound effects (made in the browser, no files) ---------- */
var AC=null;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}}if(AC.state==='suspended'){try{AC.resume();}catch(e){}}return AC;}
function tone(f,t0,dur,type,vol){var a=ac();if(!a)return;var t=a.currentTime+t0,o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||0.18,t+0.015);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+0.05);}
var SFX={right:[[659,0,.14],[988,.09,.32]],wrong:[[247,0,.22,'triangle',.16],[196,.13,.34,'triangle',.16]],tap:[[880,0,.07,'sine',.07]],soft:[[740,0,.06,'sine',.05]],pop:[[1046,0,.06,'sine',.08]],
 done:[[523,0,.14],[659,.12,.14],[784,.24,.14],[1047,.36,.55]],streak:[[392,0,.1,'triangle'],[523,.09,.1,'triangle'],[659,.18,.1,'triangle'],[1047,.28,.5,'triangle',.14]]};
function sfx(n){if(!S.set.sound)return;(SFX[n]||[]).forEach(function(x){tone(x[0],x[1],x[2],x[3],x[4]);});}

/* ---------- practise taps on sign cards ---------- */
function practiseDots(box,onDone){var n=3,got=0;
 var sg=box.parentNode&&box.parentNode.querySelector('.signword');box.innerHTML='<p class="lab">'+(sg?'Now copy it':'Now have a go')+'</p><p class="how2">'+(sg?'Make the sign yourself. Tap a circle each time you do it.':'Practise it yourself. Tap a circle each time you have a go.')+'</p>';
 var row=el('div','dots');for(var i=0;i<n;i++){(function(i){var d=btn('dot','<span class="sr">Practice '+(i+1)+'</span>',function(){if(d.classList.contains('on')||i!==got)return;d.classList.add('on');d.innerHTML='✓';got++;sfx(got===n?'right':'pop');if(got===n){msg.textContent='Lovely. You’ve made it three times.';onDone();}});row.appendChild(d);})(i);}
 box.appendChild(row);var msg=el('p','dotmsg','');box.appendChild(msg);}

/* ---------- vowel hand picture ---------- */
function vowelSVG(){var f=[['A',62,118,-50],['E',96,52,-14],['I',126,40,0],['O',156,48,12],['U',182,72,26]];
 var g='<svg viewBox="0 0 240 230" class="hand" role="img" aria-label="An open hand, palm facing you. Thumb A, index finger E, middle finger I, ring finger O, little finger U."><path d="M78 214c-14-30-18-62-12-96 6-34 28-56 62-56s58 20 62 56c4 34-2 66-16 96z" class="palm"/>';
 f.forEach(function(x){var L=x[0]==='A'?50:x[0]==='U'?52:72;g+='<g transform="translate('+(x[0]==='A'?78:x[1])+' '+(x[0]==='A'?150:118)+') rotate('+x[3]+')"><rect x="-11" y="'+(-L)+'" width="22" height="'+(L+14)+'" rx="11" class="palm"/></g>';});
 f.forEach(function(x){var r=x[3]*Math.PI/180,L=x[0]==='A'?50:x[0]==='U'?52:72,bx=x[0]==='A'?78:x[1],by=x[0]==='A'?150:118;var tx=bx+Math.sin(r)*(L-6),ty=by-Math.cos(r)*(L-6);
  g+='<circle cx="'+tx.toFixed(1)+'" cy="'+ty.toFixed(1)+'" r="13" class="tipc"/><text x="'+tx.toFixed(1)+'" y="'+(ty+5.5).toFixed(1)+'" text-anchor="middle" class="tipt">'+x[0]+'</text>';});
 return g+'</svg>';}

/* ---------- daily streak ---------- */
function ymd(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function weekDots(){var t=today(),now=new Date(),dow=(now.getDay()+6)%7,h='';for(var i=0;i<7;i++){var d=t-dow+i;var cls=S.days[d]?'on':d===t?'now':d>t?'future':'';h+='<span class="wd '+cls+'"><i>'+(S.days[d]?'✓':'')+'</i>'+'MTWTFSS'[i]+'</span>';}return h;}
function streakCard(){var st=streak(),doneToday=!!S.days[today()];var c=el('section','card streak'+(doneToday?' lit':''));
 c.innerHTML='<div class="sk"><span class="flame" aria-hidden="true">🔥</span><div><b>'+(st?st+'-day streak':'Start a streak today')+'</b><small>'+(doneToday?'Done for today. See you tomorrow!':st?'Do one lesson or the refresher today to keep it going.':'Finish one lesson today to light the flame.')+(S.best>1?' · Best: '+S.best+' days':'')+'</small></div></div><div class="week" aria-label="This week">'+weekDots()+'</div>';
 return c;}
function streakBox(st){var b=el('div','streakup','<span class="flame big" aria-hidden="true">🔥</span><div><b>'+(st===1?'Streak started!':st+'-day streak!')+'</b><p>'+(st===1?'Come back tomorrow to make it 2.':'You’ve practised '+st+' days in a row. Brilliant.')+'</p></div>');return b;}

/* ---------- daily reminder notifications (Web Push via the app’s own server) ---------- */
var API='api/';
function isIOS(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
function standalone(){return window.navigator.standalone===true||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches);}
function pushOK(){return !!window.SR_HOSTED&&'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window&&location.protocol==='https:';}
function b64u(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';var r=atob(s),a=new Uint8Array(r.length);for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a;}
function lastDay(){var ks=Object.keys(S.days).map(Number).sort(function(a,b){return a-b;});if(!ks.length)return null;var d=new Date(ks[ks.length-1]*86400000);return d.toISOString().slice(0,10);}
function post(path,body){return fetch(API+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),keepalive:true}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});}
function pushOn(time){return Notification.requestPermission().then(function(p){if(p!=='granted')throw new Error('denied');
  return navigator.serviceWorker.ready;}).then(function(reg){return fetch(API+'vapid').then(function(r){if(!r.ok)throw new Error('server');return r.json();}).then(function(k){
   return reg.pushManager.getSubscription().then(function(old){return old||reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(k.key)});});});})
  .then(function(sub){return post('subscribe',{sub:sub.toJSON(),time:time,tz:Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/London',last:lastDay(),streak:streak(),name:S.name||''});})
  .then(function(j){S.push={id:j.id,time:time};save();return j;});}
function pushOff(){var id=S.push&&S.push.id;S.push=null;save();
 return navigator.serviceWorker.ready.then(function(reg){return reg.pushManager.getSubscription();}).then(function(sub){if(sub)return sub.unsubscribe();}).catch(function(){}).then(function(){if(id)return post('unsubscribe',{id:id}).catch(function(){});});}
function pushPractised(){if(!S.push||!S.push.id)return;post('practised',{id:S.push.id,last:lastDay(),streak:streak(),name:S.name||''}).catch(function(){});}
function pushNudge(){if(S.push||!Object.keys(S.done).length)return null;if(!(pushOK()||isIOS()))return null;
 var c=el('section','card nudge');c.innerHTML='<h2>🔔 Get a daily reminder</h2><p>A gentle nudge on your phone each day, so your streak keeps going.</p>';
 c.appendChild(btn('ghost','Set up reminders',function(){go('set');setTimeout(function(){var r=$('#rem');if(r)r.scrollIntoView({behavior:'smooth'});},100);}));return c;}
function reminderCard(){var c=el('section','card');c.id='rem';
 var times=[];for(var h=7;h<=21;h++){times.push(String(h).padStart(2,'0')+':00');if(h<21)times.push(String(h).padStart(2,'0')+':30');}
 function label(t){var h=+t.slice(0,2),m=t.slice(3);return (h%12||12)+(m==='00'?'':':'+m)+(h<12?'am':'pm');}
 function paint(){c.innerHTML='<h2>Daily reminder</h2>';var msg=el('p','msg','');
  if(!pushOK()){c.appendChild(el('p','',isIOS()&&!standalone()?'To get reminders on an iPhone, first add Sign Ready to your Home Screen: tap the <b>Share</b> button in Safari, then <b>Add to Home Screen</b>. Then open it from the new icon and come back here. (Needs iOS 16.4 or newer.)':'Reminders work in the Sign Ready app on your phone. Open it from its own web address, add it to your Home Screen, and turn them on there.'));return;}
  if(S.push){c.appendChild(el('p','','<span class="okc">✓ On.</span> You’ll get a reminder at <b>'+label(S.push.time)+'</b> on days you haven’t practised yet, and a last nudge at 8:30pm if your streak is about to end.'));
   var row=el('div','row');row.appendChild(btn('ghost','Send a test reminder',function(){post('test',{id:S.push.id}).then(function(){msg.textContent='Sent. It should appear in a few seconds.';},function(){msg.textContent='Couldn’t reach the reminder server. Check you’re online.';});}));
   row.appendChild(btn('ghost danger','Turn off',function(){pushOff().then(paint);}));c.appendChild(row);c.appendChild(msg);return;}
  c.appendChild(el('p','','Pick a time and we’ll send a reminder on days you haven’t practised yet. If your streak is about to end, you’ll get one last nudge at 8:30pm.'));
  var f=el('div','field');f.innerHTML='<label for="rtime">Remind me at</label>';var sel=el('select');sel.id='rtime';sel.innerHTML=times.map(function(t){return '<option value="'+t+'"'+(t==='18:00'?' selected':'')+'>'+label(t)+'</option>';}).join('');f.appendChild(sel);c.appendChild(f);
  var b=btn('big','Turn on reminders',function(){b.disabled=true;msg.textContent='Asking your phone for permission…';pushOn(sel.value).then(function(){sfx('right');paint();},function(e){b.disabled=false;msg.textContent=String(e.message)==='denied'?'Notifications are blocked. On iPhone: Settings → Notifications → Sign Ready → Allow.':'That didn’t work. Check you’re online, then try again.';});});
  c.appendChild(b);c.appendChild(msg);}
 paint();return c;}

/* ================= HOME ================= */
function home(){shell('home');
 var h=el('section','hello');
 var hr=new Date().getHours(),g=hr<12?'Good morning':hr<18?'Good afternoon':'Good evening';
 h.innerHTML='<p class="eyebrow">British Sign Language · for beginners</p><h1>'+g+(S.name?', '+esc(S.name):'')+'</h1>';
 var st=streak();
 h.appendChild(el('p','sub','Learn a few signs a day. Nothing here is a race.'));
 main.appendChild(h);
 main.appendChild(streakCard());
 main.appendChild(buildCard());
 var pn=pushNudge();if(pn)main.appendChild(pn);

 if(S.cur){var c=el('section','card resume');c.innerHTML='<h2>Carry on where you left off</h2><p>'+esc(S.cur.title)+' · card '+(S.cur.pos+1)+' of '+S.cur.q.length+'</p>';
  var row=el('div','row');row.appendChild(btn('big',"Carry on",function(){runSession();}));
  row.appendChild(btn('ghost','Leave it for now',function(){S.cur=null;save();home();}));c.appendChild(row);main.appendChild(c);}

 var d=due();
 if(learned().length){var r=el('section','card fresh');
  if(d.length){var n=Math.min(10,d.length);r.innerHTML='<h2>Today’s refresher</h2><p>'+plural(n,'question')+' from things you’ve already learned. Going over them again is what makes them stick.</p>';
   r.appendChild(btn('big','Start the refresher',function(){startReview(d.slice(0,10),'Today’s refresher');}));}
  else{r.innerHTML='<h2>Today’s refresher</h2><p>All caught up. New questions will be ready tomorrow.</p>';
   r.appendChild(btn('ghost','Practise a few anyway',function(){startReview(shuffle(learned()).slice(0,8),'Extra practice');}));}
  main.appendChild(r);
  var tk=tricky();if(tk.length){var t=el('section','card tricky');t.innerHTML='<h2>Tricky ones</h2><p>'+plural(tk.length,'question')+' you’ve found hard before. We’ll go through them slowly.</p>';
   t.appendChild(btn('ghost','Practise the tricky ones',function(){startReview(shuffle(tk).slice(0,10),'Tricky ones');}));main.appendChild(t);}
 }

 main.appendChild(goalMini());

 var nx=nextStep();
 if(nx){var ns=el('section','card next');ns.innerHTML='<p class="eyebrow">Your next step</p><h2>'+esc(nx.label)+'</h2><p>'+esc(nx.sub)+'</p>';ns.appendChild(btn('big',nx.btn,nx.fn));main.appendChild(ns);}

 var list=el('section','units');list.appendChild(el('h2','sect','The units'));
 COURSE.forEach(function(u){list.appendChild(unitRow(u));});
 var f=el('button','unit final');f.type='button';
 var fOpen=S.set.open||allPassed();
 f.innerHTML='<span class="ic" aria-hidden="true">🎓</span><span class="ut"><b>Final test</b><small>'+(S.fin.passed?'Passed · best '+S.fin.best+'%':fOpen?'Ready when you are':'Opens when every unit test is passed')+'</small></span>'+(S.fin.passed?'<span class="tick">✓</span>':fOpen?'':'<span class="lock">🔒</span>');
 f.disabled=!fOpen;f.addEventListener('click',function(){finalIntro();});list.appendChild(f);
 main.appendChild(list);
}
function nextStep(){for(var i=0;i<COURSE.length;i++){var u=COURSE[i];if(!unitOpen(u))return null;
  for(var j=0;j<u.lessons.length;j++){var l=u.lessons[j];if(!S.done[l.id])return {label:l.title,sub:'Unit '+(i+1)+': '+u.title+' · lesson '+(j+1)+' of '+u.lessons.length,btn:'Start this lesson',fn:function(l){return function(){startLesson(l);};}(l)};}
  if(!unitPassed(u))return {label:'Unit '+(i+1)+' test',sub:u.title+'. Pass with '+PASS+'% to open the next unit.',btn:'Go to the test',fn:function(u){return function(){testIntro(u);};}(u)};}
 if(!S.fin.passed)return {label:'The final test',sub:'Questions from every unit. Pass with '+PASS+'% to reach your goal.',btn:'Go to the final test',fn:finalIntro};
 return null;}
function unitRow(u){var b=el('button','unit');b.type='button';var open=unitOpen(u);
 var dn=u.lessons.filter(function(l){return S.done[l.id];}).length;
 var status=unitPassed(u)?'Test passed · '+S.ut[u.id].best+'%':!open?'Opens after the unit '+u.i+' test':dn===u.lessons.length?'Lessons done · test next':dn+' of '+u.lessons.length+' lessons done';
 b.innerHTML='<span class="ic" aria-hidden="true" style="--uc:'+u.color+'">'+u.icon+'</span><span class="ut"><b>'+(u.i+1)+'. '+esc(u.title)+'</b><small>'+status+'</small><span class="bar"><i style="width:'+(dn/u.lessons.length*100)+'%"></i></span></span>'+(unitPassed(u)?'<span class="tick">✓</span>':open?'':'<span class="lock">🔒</span>');
 b.disabled=!open;b.addEventListener('click',function(){unitView(u);});return b;}

/* ================= UNIT ================= */
function unitView(u){shell('home');
 main.appendChild(btn('back','‹ Home',home));
 var h=el('section','uhead');h.style.setProperty('--uc',u.color);h.innerHTML='<span class="ic big" aria-hidden="true">'+u.icon+'</span><div><p class="eyebrow">Unit '+(u.i+1)+' of '+COURSE.length+'</p><h1>'+esc(u.title)+'</h1><p class="sub">Goal stage: '+esc(u.stage)+'</p></div>';main.appendChild(h);
 var ls=el('section','lessons');
 u.lessons.forEach(function(l){var open=lessonOpen(l);var nq=l.cards.filter(function(c){return c.t!=='read';}).length;
  var b=el('button','lesson'+(S.done[l.id]?' done':''));b.type='button';b.disabled=!open;
  b.innerHTML='<span class="num">'+(S.done[l.id]?'✓':l.i+1)+'</span><span class="ut"><b>'+esc(l.title)+'</b><small>'+(S.done[l.id]?'Done · tap to go through it again':open?l.cards.length+' cards · '+nq+' questions':'Finish the lesson before this one first')+'</small></span>'+(open?'':'<span class="lock">🔒</span>');
  b.addEventListener('click',function(){startLesson(l);});ls.appendChild(b);});
 main.appendChild(ls);
 var t=el('section','card');var ready=S.set.open||lessonsDone(u);var r=S.ut[u.id];
 t.innerHTML='<h2>Unit test</h2><p>'+(r?'Best score: <b>'+r.best+'%</b>. '+(r.passed?'Passed. You can take it again any time.':'You need '+PASS+'% to pass.'):ready?'Shows what you’ve learned in this unit. You need '+PASS+'% to pass.':'Opens once every lesson above is done.')+'</p>';
 var row=el('div','row');var tb=btn('big','Take the unit test',function(){testIntro(u);});tb.disabled=!ready;row.appendChild(tb);
 var ms=S.missed[u.id];if(ms&&ms.length)row.appendChild(btn('ghost','Practise the '+plural(ms.length,'one')+' I missed',function(){startPractice(ms,u.title+': missed questions','unit:'+u.id);}));
 t.appendChild(row);main.appendChild(t);}

/* ================= SESSIONS ================= */
/* item: {k:'read',h,again,recap} or {k:'q',id,again,recap} */
function startLesson(l){var q=[];
 var t=today(),earlier=learned().filter(function(id){return QS[id].l!==l&&S.box[id].due<=t;});
 var rec=shuffle(earlier).slice(0,2);
 if(rec.length){q.push({k:'intro',h:'<h3>Quick recap first</h3><p>Before we start, here '+(rec.length===1?'is a question':'are two questions')+' from something you’ve already learned.</p>'});
  rec.forEach(function(id){q.push({k:'q',id:id,recap:true});});
  q.push({k:'intro',h:'<h3>Now the new lesson</h3><p><b>'+esc(l.title)+'</b>. Read each card carefully. If you get a question wrong, we’ll go over it again.</p>'});}
 l.cards.forEach(function(c){q.push(c.t==='read'?{k:'read',h:c.h}:{k:'q',id:c.id});});
 begin({kind:'lesson',ref:l.id,title:l.title,mode:'learn',q:q});}
function startReview(ids,title){var q=ids.map(function(id){return {k:'q',id:id};});begin({kind:'review',title:title,mode:'learn',q:q});}
function startPractice(ids,title,ref){var q=[];ids.forEach(function(id){var t=QS[id]&&QS[id].teach;if(!QS[id])return;if(t)q.push({k:'read',h:t.h,again:true});q.push({k:'q',id:id});});
 begin({kind:'practice',ref:ref,title:title,mode:'learn',q:q});}
function startTest(u){var ids=shuffle(uq(u)).slice(0,20);begin({kind:'test',ref:u.id,title:'Unit '+(u.i+1)+' test: '+u.title,mode:'test',q:ids.map(function(id){return {k:'q',id:id};})});}
function startFinal(){var ids=[];var per=[3,4,4,4,5,5,3,3];COURSE.forEach(function(u,i){ids=ids.concat(shuffle(uq(u)).slice(0,per[i]||2));});
 begin({kind:'final',title:'Final test',mode:'test',q:shuffle(ids).map(function(id){return {k:'q',id:id};})});}
function begin(s){s.pos=0;s.first={};s.right=0;s.wrong=0;s.n0=s.q.filter(function(i){return i.k==='q';}).length;s.stage='show';S.cur=s;save();sfx('tap');runSession();}

function testIntro(u){shell('home');main.appendChild(btn('back','‹ '+u.title,function(){unitView(u);}));
 var c=el('section','card intro');c.innerHTML='<h1>Unit '+(u.i+1)+' test</h1><p>'+esc(u.title)+'</p><ul class="plain"><li>Up to 20 questions from this unit.</li><li>After each one you’ll see the right answer.</li><li>You need <b>'+PASS+'%</b> to pass.</li><li>Any you miss can be practised afterwards, as many times as you like.</li></ul><p>Take your time. There is no clock.</p>';
 c.appendChild(btn('big','Start the test',function(){startTest(u);}));main.appendChild(c);}
function finalIntro(){shell('home');main.appendChild(btn('back','‹ Home',home));
 var c=el('section','card intro');c.innerHTML='<h1>Final test</h1><p>31 questions from all '+COURSE.length+' units.</p><ul class="plain"><li>You’ll see the right answer after each one.</li><li>Pass with <b>'+PASS+'%</b> to reach your goal: <b>Signing with confidence</b>.</li><li>You can pause at any time and carry on later.</li></ul>';
 c.appendChild(btn('big','Start the final test',startFinal));main.appendChild(c);}

function runSession(){var s=S.cur;if(!s)return home();
 if(s.pos>=s.q.length)return finish();
 shell('home',true);
 var top=el('div','sess');
 var head=el('div','shead');
 head.appendChild(btn('ghost small','Pause',function(){save();home();}));
 var nQ=s.q.length;head.appendChild(el('span','count','Card '+(s.pos+1)+' of '+nQ));
 top.appendChild(head);
 top.appendChild(el('div','prog','<i style="width:'+(s.pos/nQ*100)+'%"></i>'));
 top.appendChild(el('p','stitle',esc(s.title)));
 main.appendChild(top);
 var it=s.q[s.pos];
 if(it.k==='q')showQ(it);else showRead(it);}

function next(){var s=S.cur;s.pos++;s.stage='show';save();runSession();}

function showRead(it){var c=el('article','card read'+(it.again?' again':''));
 if(it.again)c.appendChild(el('p','flag','Let’s look at this again'));
 var body=el('div','body',it.h);c.appendChild(body);
 var row=el('div','row');row.appendChild(sayBtn(function(){return strip(it.h);}));c.appendChild(row);
 var pr=body.querySelector('.practise'),isSign=/class="signword"/.test(it.h);var b=btn('big wait',pr?(isSign?'I’ve practised this sign':'I’ve practised this'):'I’ve read this',function(){sfx('soft');next();});
 var vw=body.querySelector('.vowels');if(vw)vw.innerHTML=vowelSVG();
 var len=strip(it.h).length;var ms=it.k==='intro'?800:Math.min(4000,1200+len*8);var timeOK=false,tapsOK=!pr;
 function gate(){b.disabled=!(timeOK&&tapsOK);if(!b.disabled)b.classList.add('ready');}
 if(pr)practiseDots(pr,function(){tapsOK=true;gate();});
 b.disabled=true;b.style.setProperty('--wait',ms+'ms');setTimeout(function(){timeOK=true;gate();},ms);
 c.appendChild(b);main.appendChild(c);
 if(S.set.auto)speak(strip(it.h));}

function showQ(it){var s=S.cur,info=QS[it.id];if(!info){return next();}var c=info.c;
 var card=el('article','card q');
 var lab=it.recap?'Recap':it.again?'Let’s try this one again':s.mode==='test'?'Question':'Check you’ve got it';
 card.appendChild(el('p','flag'+(it.again?' warm':''),lab));
 card.appendChild(el('h2','qtext',esc(c.q).replace(/“(.*?)”/g,'“$1”')));
 var hintRow=el('div','row');hintRow.appendChild(sayBtn(function(){return c.q+'. '+optionsText(c,it);}));card.appendChild(hintRow);
 var area=el('div','answers');card.appendChild(area);
 var fb=el('div','fb');fb.hidden=true;card.appendChild(fb);
 main.appendChild(card);
 var done=function(ok,answerHtml){onAnswer(it,ok,answerHtml,fb);};
 ({mc:qMC,tf:qTF,sort:qSort,order:qOrder,match:qMatch})[c.t](c,it,area,done);
 if(S.set.auto)speak(c.q);}
function optionsText(c,it){if(c.t==='mc')return (it.ord||range(c.o.length)).map(function(i){return c.o[i];}).join('. Or, ');if(c.t==='tf')return 'True or false?';return '';}

function qMC(c,it,area,done){if(!it.ord)it.ord=shuffle(range(c.o.length));
 it.ord.forEach(function(i,n){var b=btn('opt','<span class="key">'+'ABCD'[n]+'</span><span>'+esc(c.o[i])+'</span>',function(){
  lockAll(area);b.classList.add(i===c.a?'ok':'no');if(i!==c.a)area.querySelectorAll('.opt')[it.ord.indexOf(c.a)].classList.add('ok');
  done(i===c.a,esc(c.o[c.a]));});area.appendChild(b);});}
function qTF(c,it,area,done){var g=el('div','tf');[[true,'True'],[false,'False']].forEach(function(p){var b=btn('opt tfb','<span>'+p[1]+'</span>',function(){
  lockAll(area);b.classList.add(p[0]===c.a?'ok':'no');if(p[0]!==c.a)g.children[c.a?0:1].classList.add('ok');done(p[0]===c.a,c.a?'True':'False');});g.appendChild(b);});area.appendChild(g);}
function lockAll(a){Array.prototype.forEach.call(a.querySelectorAll('button,select'),function(b){b.disabled=true;});}
function checkBtn(area,fn){var b=btn('big','Check my answer',fn);b.disabled=true;area.appendChild(b);return b;}

function qSort(c,it,area,done){if(!it.ord)it.ord=shuffle(range(c.items.length));var sel={};
 area.appendChild(el('p','how','For each one, tap the group it belongs in.'));
 var rows=[];it.ord.forEach(function(i){var r=el('div','sortrow');r.appendChild(el('p','stxt',esc(c.items[i][0])));
  var ch=el('div','chips');c.bins.forEach(function(bn,bi){var b=btn('chip',esc(bn),function(){sel[i]=bi;Array.prototype.forEach.call(ch.children,function(x,xi){x.setAttribute('aria-pressed',xi===bi);});cb.disabled=Object.keys(sel).length<c.items.length;});b.setAttribute('aria-pressed','false');ch.appendChild(b);});
  r.appendChild(ch);area.appendChild(r);rows.push([i,r]);});
 var cb=checkBtn(area,function(){lockAll(area);cb.hidden=true;var ok=true;rows.forEach(function(p){var good=sel[p[0]]===c.items[p[0]][1];if(!good)ok=false;p[1].classList.add(good?'ok':'no');
   if(!good)p[1].appendChild(el('p','fix','Belongs in: <b>'+esc(c.bins[c.items[p[0]][1]])+'</b>'));});
  done(ok,'<ul>'+c.items.map(function(x){return '<li>'+esc(x[0])+' → <b>'+esc(c.bins[x[1]])+'</b></li>';}).join('')+'</ul>');});}

function qOrder(c,it,area,done){if(!it.ord){var o;do{o=shuffle(range(c.items.length));}while(c.items.length>1&&o.every(function(v,i){return v===i;}));it.ord=o;}
 var seq=[];area.appendChild(el('p','how','Tap them in the order they happen: first, then second, and so on.'));
 var list=el('div','olist');area.appendChild(list);
 var bs=it.ord.map(function(i){var b=btn('oitem','<span class="n"></span><span>'+esc(c.items[i])+'</span>',function(){if(seq.indexOf(i)>=0)return;seq.push(i);paint();});b.dataset.i=i;list.appendChild(b);return b;});
 var row=el('div','row');var rs=btn('ghost small','Start again',function(){seq=[];paint();});row.appendChild(rs);area.appendChild(row);
 var cb=checkBtn(area,function(){lockAll(area);cb.hidden=true;row.hidden=true;var ok=seq.every(function(v,k){return v===k;});
  bs.forEach(function(b){var i=+b.dataset.i;b.classList.add(seq.indexOf(i)===i?'ok':'no');});
  done(ok,'<ol>'+c.items.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol>');});
 function paint(){bs.forEach(function(b){var p=seq.indexOf(+b.dataset.i);b.querySelector('.n').textContent=p>=0?p+1:'';b.classList.toggle('picked',p>=0);});cb.disabled=seq.length<c.items.length;}}

function qMatch(c,it,area,done){if(!it.ord)it.ord=shuffle(range(c.pairs.length));var rights=shuffle(range(c.pairs.length));var sel={};
 area.appendChild(el('p','how','Choose the right answer for each one.'));
 var rows=[];it.ord.forEach(function(i,n){var r=el('div','mrow');var id='m_'+it.id+'_'+n;
  r.innerHTML='<label for="'+id+'">'+esc(c.pairs[i][0])+'</label>';var s=el('select');s.id=id;
  s.innerHTML='<option value="">Choose…</option>'+rights.map(function(j){return '<option value="'+j+'">'+esc(c.pairs[j][1])+'</option>';}).join('');
  s.addEventListener('change',function(){if(s.value==='')delete sel[i];else sel[i]=+s.value;cb.disabled=Object.keys(sel).length<c.pairs.length;});
  r.appendChild(s);area.appendChild(r);rows.push([i,r]);});
 var cb=checkBtn(area,function(){lockAll(area);cb.hidden=true;var ok=true;rows.forEach(function(p){var good=sel[p[0]]===p[0];if(!good)ok=false;p[1].classList.add(good?'ok':'no');
   if(!good)p[1].appendChild(el('p','fix','Answer: <b>'+esc(c.pairs[p[0]][1])+'</b>'));});
  done(ok,'<ul>'+c.pairs.map(function(x){return '<li>'+esc(x[0])+' → <b>'+esc(x[1])+'</b></li>';}).join('')+'</ul>');});}

var PRAISE=['That’s right!','Well done!','Spot on.','Yes, that’s it.','Good, you’ve got it.'];
function onAnswer(it,ok,answerHtml,fb){var s=S.cur,id=it.id,c=QS[id].c;
 var firstHere=!(id in s.first);
 if(firstHere){s.first[id]=ok;if(ok)s.right++;else s.wrong++;}
 /* memory boxes */
 if(firstHere){var r=S.box[id]||{b:0,w:0,r:0,due:today()};
  if(ok){r.r++;r.b=Math.min(r.b+1,5);}else{r.w++;r.b=0;}
  r.due=today()+INT[r.b];S.box[id]=r;}
 var learn=s.mode==='learn';
 if(!ok&&learn){var t=QS[id].teach,ins=[];if(t)ins.push({k:'read',h:t.h,again:true});
  s.q.splice.apply(s.q,[s.pos+1,0].concat(ins));var at=Math.min(s.pos+1+ins.length+2,s.q.length);s.q.splice(at,0,{k:'q',id:id,again:true});}
 s.stage='answered';save();sfx(ok?'right':'wrong');
 fb.hidden=false;fb.className='fb '+(ok?'good':'bad');
 var msg=ok?'<p class="verdict">✓ '+PRAISE[(s.pos+id.length)%PRAISE.length]+'</p>':
  '<p class="verdict">Not quite, and that’s fine.</p>'+(c.t==='mc'||c.t==='tf'?'<p>The right answer is: <b>'+answerHtml+'</b></p>':'<div class="ans"><p>The right answer:</p>'+answerHtml+'</div>');
 fb.innerHTML=msg+'<p class="why">'+c.why+'</p>'+(!ok&&learn?'<p class="note">We’ll read the card about this again, then try this question once more in a moment.</p>':'');
 var nb=btn('big',!ok&&learn?'Read it again':'Next',next);fb.appendChild(nb);
 if(S.set.auto)speak(strip(fb.innerHTML));
 setTimeout(function(){try{fb.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(e){}},60);}

/* ---------- end of a session ---------- */
function finish(){var s=S.cur;S.cur=null;var wasToday=!!S.days[today()];markDay();var stNow=streak();if(stNow>S.best)S.best=stNow;var b4=builtCount();pushPractised();
 var pct=s.n0?Math.round(s.right/s.n0*100):100;
 var wrongIds=Object.keys(s.first).filter(function(id){return !s.first[id];});
 shell('home');var c=el('section','card result');
 if(s.kind==='lesson'){var l=LES[s.ref];S.done[l.id]=true;save();
  var pts=l.cards.filter(function(x){return x.t==='read';}).map(function(x){var m=x.h.match(/<h3>(.*?)<\/h3>/)||x.h.match(/class="signword">(.*?)<\/p>/);return m?m[1]:'';}).filter(Boolean);
  c.innerHTML='<p class="eyebrow">Lesson complete</p><h1>'+esc(l.title)+'</h1>'+
   '<p>You answered every question correctly in the end.'+(wrongIds.length?' '+plural(wrongIds.length,'question')+' needed another go. That’s normal, and they’ll come back in your refresher so they stick.':' All right first time. Brilliant.')+'</p>'+
   '<h3>What this lesson covered</h3><ul class="plain ticks">'+pts.map(function(p){return '<li>'+p+'</li>';}).join('')+'</ul>';
  var u=l.u,nl=u.lessons[l.i+1],row=el('div','row');
  if(nl)row.appendChild(btn('big','Next lesson: '+esc(nl.title),function(){startLesson(nl);}));
  else row.appendChild(btn('big','Go to the unit test',function(){testIntro(u);}));
  row.appendChild(btn('ghost','Go through this lesson again',function(){startLesson(l);}));
  row.appendChild(btn('ghost','Home',home));c.appendChild(row);}
 else if(s.kind==='test'||s.kind==='final'){var passed=pct>=PASS;
  if(s.kind==='test'){var r=S.ut[s.ref]||{best:0,passed:false};r.best=Math.max(r.best,pct);r.passed=r.passed||passed;S.ut[s.ref]=r;S.missed[s.ref]=wrongIds;}
  else{S.fin.best=Math.max(S.fin.best,pct);S.fin.passed=S.fin.passed||passed;S.missed.final=wrongIds;}
  save();
  var u2=s.kind==='test'?UNI[s.ref]:null;
  c.innerHTML='<p class="eyebrow">'+esc(s.title)+'</p><div class="score '+(passed?'pass':'')+'"><b>'+pct+'%</b><span>'+s.right+' out of '+s.n0+' right</span></div>'+
   '<h1>'+(passed?(s.kind==='final'?'You did it. You’re signing with confidence!':'Passed! Well done.'):'Not quite there yet')+'</h1>'+
   '<p>'+(passed?(u2&&COURSE[u2.i+1]?'The next unit is now open: <b>'+esc(COURSE[u2.i+1].title)+'</b>.':s.kind==='test'?'That was the last unit. The final test is next.':'Keep using the daily refresher so it all stays fresh.'):'You need '+PASS+'%. Practise the ones you missed, then try again. Every go makes it stick a bit more.')+'</p>';
  if(wrongIds.length){var ul='<h3>The ones to go over</h3><ul class="plain missed">';wrongIds.forEach(function(id){var q=QS[id].c;ul+='<li><b>'+esc(q.q)+'</b><br>'+q.why+'</li>';});c.insertAdjacentHTML('beforeend',ul+'</ul>');}
  var row2=el('div','row');
  if(wrongIds.length)row2.appendChild(btn('big','Practise the '+plural(wrongIds.length,'one')+' I missed',function(){startPractice(wrongIds,'Practise what I missed',s.kind==='test'?'unit:'+s.ref:'final');}));
  if(!passed)row2.appendChild(btn('ghost','Take the test again',function(){u2?startTest(u2):startFinal();}));
  else if(u2&&COURSE[u2.i+1])row2.appendChild(btn(wrongIds.length?'ghost':'big','Start unit '+(u2.i+2),function(){unitView(COURSE[u2.i+1]);}));
  else if(u2)row2.appendChild(btn('ghost','Go to the final test',finalIntro));
  row2.appendChild(btn('ghost','Home',home));c.appendChild(row2);
  if(passed&&s.kind==='final')c.classList.add('celebrate');}
 else{save();
  if(s.kind==='practice'&&s.ref){var key=s.ref.indexOf('unit:')===0?s.ref.slice(5):s.ref;if(S.missed[key]){S.missed[key]=[];save();}}
  c.innerHTML='<p class="eyebrow">'+esc(s.title)+'</p><h1>All done</h1><p>'+(wrongIds.length?'You got '+s.right+' of '+s.n0+' right first time, and the rest right on the second go. The ones you found hard will come back again soon.':'Every one right first time. Lovely work.')+'</p>';
  var row3=el('div','row');
  if(s.kind==='practice'&&s.ref&&s.ref.indexOf('unit:')===0){var uu=UNI[s.ref.slice(5)];if(!unitPassed(uu))row3.appendChild(btn('big','Try the unit test again',function(){startTest(uu);}));}
  if(s.kind==='practice'&&s.ref==='final'&&!S.fin.passed)row3.appendChild(btn('big','Try the final test again',startFinal));
  row3.appendChild(btn(row3.children.length?'ghost':'big','Home',home));c.appendChild(row3);}
 var np=newPieceBox(b4);if(np){var fr=c.querySelector('.row');c.insertBefore(np,fr);}
 if(!wasToday){var sb=streakBox(stNow);c.insertBefore(sb,c.querySelector('.newpiece')||c.querySelector('.row'));}
 main.appendChild(c);
 sfx(c.classList.contains('celebrate')||/Passed|complete|All done/.test(c.textContent)?'done':'soft');if(!wasToday)setTimeout(function(){sfx('streak');},900);}

/* ================= GOAL ================= */
function stages(){var a=COURSE.map(function(u){return {t:u.stage,sub:'Pass the unit '+(u.i+1)+' test',done:unitPassed(u),u:u};});
 a.push({t:'Signing with confidence',sub:'Pass the final test',done:S.fin.passed,fin:true});return a;}
function goalMini(){var st=stages(),n=st.filter(function(x){return x.done;}).length;
 var c=el('button','card goalmini');c.type='button';
 c.innerHTML='<span class="eyebrow">Your goal</span><b class="gt">Signing with confidence</b><span class="gbar"><i style="width:'+(n/st.length*100)+'%"></i></span><small>'+n+' of '+st.length+' stages reached · tap to see the path</small>';
 c.addEventListener('click',goalView);return c;}
function goalView(){shell('goal');var st=stages(),n=st.filter(function(x){return x.done;}).length;
 var h=el('section','hello');h.innerHTML='<p class="eyebrow">Your goal</p><h1>Signing with confidence</h1><p class="sub">Each unit you pass moves you one stage along. Pass the final test and you’re there.</p>';main.appendChild(h);
 var p=el('ol','path');var curSet=false;
 st.forEach(function(x,i){var li=el('li',x.done?'done':!curSet?'now':'');if(!x.done&&!curSet)curSet=true;
  li.innerHTML='<span class="dot">'+(x.done?'✓':i+1)+'</span><div><b>'+esc(x.t)+'</b><small>'+esc(x.sub)+(x.done?' · done':li.className==='now'?' · you are here':'')+'</small></div>';
  if(li.className==='now'){li.appendChild(btn('ghost small','Go',function(){x.fin?finalIntro():unitView(x.u);}));}
  p.appendChild(li);});
 main.appendChild(p);
 if(n===st.length)main.appendChild(el('section','card celebrate','<h2>Goal reached 🎉</h2><p>Keep doing the daily refresher. A few questions a day keeps everything fresh.</p>'));}

/* ================= LOOK IT UP ================= */
function lookView(){shell('look');var h=el('section','hello');h.innerHTML='<p class="eyebrow">Look it up</p><h1>Quick reference</h1><p class="sub">Every sign in the course, plus Deaf awareness tips. Tap “Watch” to see a sign being made.</p>';main.appendChild(h);
 var sw=el('div','search');sw.innerHTML='<label for="q">Search</label><input id="q" type="search" placeholder="Try “thank”, “nurse” or “Monday”" autocomplete="off">';main.appendChild(sw);
 var box=el('div','look');main.appendChild(box);var inp=$('#q',sw);
 function paint(){var term=inp.value.trim().toLowerCase();box.innerHTML='';var any=false;
  LOOKUP.forEach(function(sec){var lines=sec[1].filter(function(t){return !term||t.toLowerCase().indexOf(term)>=0||sec[0].toLowerCase().indexOf(term)>=0;});if(!lines.length)return;any=true;
   var d=el('details','lk');if(term)d.open=true;d.innerHTML='<summary>'+esc(sec[0])+'<small>'+lines.length+'</small></summary>';
   var ul=el('ul');lines.forEach(function(t){var li=el('li');var e=esc(t);if(term){var re=new RegExp('('+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');e=e.replace(re,'<mark>$1</mark>');}li.innerHTML=e;ul.appendChild(li);});
   d.appendChild(ul);var sb=sayBtn(function(){return sec[0]+'. '+lines.join('. ');});d.appendChild(sb);box.appendChild(d);});
  var keys=Object.keys(SIGNS).filter(function(k){var x=SIGNS[k];return !term||(x.w+' '+strip(x.how)).toLowerCase().indexOf(term)>=0;}).sort(function(a,b){return SIGNS[a].w.localeCompare(SIGNS[b].w);});
  if(keys.length){any=true;var d2=el('details','lk');d2.open=!!term;d2.innerHTML='<summary>Every sign, A to Z<small>'+keys.length+'</small></summary>';var ul2=el('ul','az');keys.forEach(function(k){var x=SIGNS[k];var li=el('li');li.innerHTML='<b>'+x.w+'</b> '+strip(x.how)+' <a class="watch sm" href="'+DICT+x.slug+'" target="_blank" rel="noopener">Watch</a>';ul2.appendChild(li);});d2.appendChild(ul2);box.insertBefore(d2,box.firstChild);}
  if(!any)box.appendChild(el('p','empty','Nothing found for “'+esc(inp.value)+'”. Try a shorter word.'));}
 inp.addEventListener('input',paint);paint();}

/* ================= SETTINGS ================= */
function setView(){shell('set');var h=el('section','hello');h.innerHTML='<p class="eyebrow">Settings</p><h1>Make it comfortable</h1>';main.appendChild(h);
 var c=el('section','card sets');
 c.innerHTML='<div class="field"><label for="nm">Your name (for the greeting)</label><input id="nm" type="text" autocomplete="given-name"></div>'+
 '<div class="field"><p class="lab">Text size</p><div class="seg" id="sz"></div></div>'+
 '<div class="field"><p class="lab">Colours</p><div class="seg" id="th"></div></div>'+
 '<div class="field tog"><label for="snd">Sound effects</label><input id="snd" type="checkbox"></div>'+
 '<div class="field tog"><label for="au">Read every card out loud automatically</label><input id="au" type="checkbox"></div>'+
 '<div class="field tog"><label for="op">Let me open any unit, in any order</label><input id="op" type="checkbox"></div>';
 main.appendChild(c);
 var nm=$('#nm');nm.value=S.name;nm.addEventListener('input',function(){S.name=nm.value.trim().slice(0,30);save();});
 var sz=$('#sz');['Normal','Large','Larger','Largest'].forEach(function(t,i){var b=btn('chip',t,function(){S.set.size=i;applySet();save();setView();});b.setAttribute('aria-pressed',S.set.size===i);b.style.fontSize=(0.85+i*0.12)+'rem';sz.appendChild(b);});
 var th=$('#th');[['auto','Match my phone'],['light','Light'],['dark','Dark']].forEach(function(p){var b=btn('chip',p[1],function(){S.set.theme=p[0];applySet();save();setView();});b.setAttribute('aria-pressed',S.set.theme===p[0]);th.appendChild(b);});
 var au=$('#au');au.checked=S.set.auto;au.addEventListener('change',function(){S.set.auto=au.checked;save();if(au.checked)speak('Cards will now be read out loud.');});
 var op=$('#op');op.checked=S.set.open;op.addEventListener('change',function(){S.set.open=op.checked;save();});
 var snd=$('#snd');snd.checked=S.set.sound;snd.addEventListener('change',function(){S.set.sound=snd.checked;save();sfx('right');});
 main.appendChild(reminderCard());

 var sv=el('section','card');sv.innerHTML='<h2>Save code</h2><p>Your progress saves on this device by itself. To carry it to another phone or computer, copy this code there and paste it below.</p>';
 var code=el('textarea','code');code.id='code';code.readOnly=true;code.rows=3;code.value=exportCode();sv.appendChild(code);
 var r1=el('div','row');var msg=el('p','msg');
 r1.appendChild(btn('ghost','Copy my code',function(){code.select();try{navigator.clipboard.writeText(code.value).then(function(){msg.textContent='Copied.';},function(){msg.textContent='Selected. Now copy it with your phone’s Copy button.';});}catch(e){msg.textContent='Selected. Now copy it with your phone’s Copy button.';}}));
 sv.appendChild(r1);
 var inp=el('textarea','code');inp.id='paste';inp.rows=3;inp.placeholder='Paste a save code here';sv.appendChild(inp);
 var r2=el('div','row');r2.appendChild(btn('ghost','Load this code',function(){var s=importCode(inp.value);if(s){S=s;save();applySet();msg.textContent='Progress loaded.';setTimeout(home,700);}else msg.textContent='That code didn’t work. Check it was copied in full.';}));
 sv.appendChild(r2);sv.appendChild(msg);main.appendChild(sv);

 var rs=el('section','card');rs.innerHTML='<h2>Start again from scratch</h2><p>This clears all progress on this device.</p>';
 var r3=el('div','row');var b1=btn('ghost danger','Clear my progress',function(){b1.hidden=true;b2.hidden=false;b3.hidden=false;});
 var b2=btn('big danger','Yes, clear everything',function(){var keep=S.set,nm2=S.name;S=blank();S.set=keep;S.name=nm2;save();home();});
 var b3=btn('ghost','No, keep it',function(){b1.hidden=false;b2.hidden=true;b3.hidden=true;});b2.hidden=b3.hidden=true;
 r3.appendChild(b1);r3.appendChild(b2);r3.appendChild(b3);rs.appendChild(r3);main.appendChild(rs);}
function exportCode(){var o={v:1,name:S.name,done:S.done,box:S.box,ut:S.ut,fin:S.fin,missed:S.missed,days:S.days,best:S.best,set:S.set};
 try{return 'SR1-'+btoa(unescape(encodeURIComponent(JSON.stringify(o))));}catch(e){return '';}}
function importCode(t){try{t=t.trim().replace(/\s+/g,'');if(t.indexOf('SR1-')!==0)return null;var o=JSON.parse(decodeURIComponent(escape(atob(t.slice(4)))));if(o.v!==1)return null;var b=blank();for(var k in o)if(k in b)b[k]=o[k];return b;}catch(e){return null;}}

window.RR={S:function(){return S;},QS:QS,home:home,setView:setView};
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});
home();
})();
