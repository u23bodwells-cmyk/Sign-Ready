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
