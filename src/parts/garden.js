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
