/* Sign Ready – BSL course content.
   Sign descriptions are written from the British-Sign.co.uk BSL dictionary, which has an
   illustration and video for every sign (linked from each card). */
var DICT='https://www.british-sign.co.uk/bsl-dictionary/';
var SIGNS={};
function R(h){return {t:'read',h:h}}
/* a sign card: word, how to make it, a memory tip, dictionary page */
function G(key,word,how,tip,slug){SIGNS[key]={w:word,how:how,tip:tip||'',slug:slug||key};
 return {t:'read',sign:key,h:'<p class="signword">'+word+'</p><div class="how"><p class="lab">How to sign it</p><p>'+how+'</p></div>'+(tip?'<p class="tip">'+tip+'</p>':'')+
 '<p><a class="watch" href="'+DICT+(slug||key)+'" target="_blank" rel="noopener">▶ Watch “'+word+'” being signed</a></p><div class="practise"></div>'}}
function M(id,q,o,a,why){return {t:'mc',id:id,q:q,o:o,a:a,why:why}}
function TF(id,q,a,why){return {t:'tf',id:id,q:q,a:a,why:why}}
function S(id,q,bins,items,why){return {t:'sort',id:id,q:q,bins:bins,items:items,why:why}}
function O(id,q,items,why){return {t:'order',id:id,q:q,items:items,why:why}}
function P(id,q,pairs,why){return {t:'match',id:id,q:q,pairs:pairs,why:why}}

var COURSE=[

/* ------------------------------------------------ 1 */
{id:'start',title:'Getting started',icon:'👋',color:'#2f6fb5',stage:'Know how BSL works',lessons:[
 {id:'st1',title:'What BSL is',cards:[
  R('<h3>A language of its own</h3><p><b>British Sign Language (BSL)</b> is the language of Deaf people in the UK. It has its <b>own grammar</b>. It isn’t English said with your hands.</p><p>It became a <b>legally recognised language</b> in Great Britain with the British Sign Language Act 2022.</p>'),
  TF('s1','BSL is just English words made with your hands, in the same order.',false,'BSL has its own grammar and word order. It’s a full language.'),
  R('<h3>Your hands and your face</h3><ul><li>Your <b>dominant hand</b> (the one you write with) does most of the moving. If you’re left-handed, just mirror the signs.</li><li>Your <b>face</b> is part of the language. When you ask a question, show it on your face: eyebrows up or down.</li><li>Many signs are made while <b>mouthing the English word</b> silently.</li></ul>'),
  M('s2','You’re left-handed. What should you do?',['Mirror the signs, so your left hand leads','Always use your right hand','Use both hands for everything','Only fingerspell'],0,'Your dominant hand leads, so a left-hander mirrors each sign.'),
  TF('s3','Facial expression is part of BSL, for example when asking a question.',true,'Yes. Your face shows whether it’s a question, and how strongly you mean something.'),
  R('<h3>Signs vary around the country</h3><p>Like accents, some signs (especially <b>numbers and days</b>) are different in different parts of the UK.</p><p>This course teaches common versions. If a Deaf person signs something differently, <b>copy them</b>. They’ll be glad you tried.</p>'),
  TF('s4','If a Deaf patient uses a different sign from the one you learned, you should follow theirs.',true,'Yes. Signs vary by region, and copying theirs is respectful.')
 ]},
 {id:'st2',title:'Being Deaf aware at the desk',cards:[
  R('<h3>Getting someone’s attention</h3><p>If a Deaf person isn’t looking at you, <b>wave</b> where they can see it, or <b>gently tap their shoulder</b>.</p><p>Calling their name from across the waiting room won’t work.</p>'),
  M('da1','A Deaf patient is reading a magazine and it’s their turn. What do you do?',['Wave where they can see, or tap their shoulder gently','Call their name louder','Wait until they look up by chance','Ask another patient to shout'],0,'Get attention visually or with a gentle tap.'),
  R('<h3>Help them see you</h3><ul><li><b>Face them</b> and keep your <b>mouth uncovered</b> (no hand, pen or mask in the way if you can).</li><li>Stand where there’s <b>good light on your face</b>, not with a bright window behind you.</li><li>Speak clearly at a normal pace. <b>Don’t shout</b> or exaggerate your lip patterns.</li><li>If they don’t understand, <b>say it a different way</b> rather than repeating the same words.</li></ul>'),
  S('da2','Helpful or not helpful?',['Helpful','Not helpful'],[['Facing them',0],['Good light on your face',0],['Shouting',1],['Covering your mouth',1],['Saying it a different way',0],['Standing with a bright window behind you',1]],'Face them, light on your face, mouth clear, and rephrase.'),
  R('<h3>Pen, paper and interpreters</h3><ul><li>Keep a <b>pen and paper</b> handy. Keep written English short and simple, because English may be their second language.</li><li>For appointments, the patient may need a <b>BSL interpreter</b>. Don’t rely on family members to interpret.</li><li>The NHS <b>Accessible Information Standard</b> means practices should record and meet a patient’s communication needs.</li></ul>'),
  TF('da3','A patient’s teenage son can always act as their interpreter at a doctor’s appointment.',false,'Family members shouldn’t be relied on. A qualified BSL interpreter should be booked.'),
  M('da4','You write a note for a Deaf patient. How should you write it?',['Short and simple','Long and detailed','Using medical abbreviations','In capitals only'],0,'Keep it short and simple. English may be their second language.')
 ]},
 {id:'st3',title:'Fingerspelling: the vowels',cards:[
  R('<h3>Spelling with two hands</h3><p>When there’s no sign for something (like a name), you <b>fingerspell</b> it. BSL fingerspelling uses <b>two hands</b>. (American Sign Language uses one.)</p><div class="vowels" aria-label="Vowels: thumb A, index E, middle I, ring O, little finger U"></div><p>The <b>vowels</b> are easiest. Hold your other hand up, palm towards you, fingers spread. Touch a fingertip with your <b>index finger</b>:</p><ul><li>Thumb = <b>A</b></li><li>Index finger = <b>E</b></li><li>Middle finger = <b>I</b></li><li>Ring finger = <b>O</b></li><li>Little finger = <b>U</b></li></ul><div class="practise"></div>'),
  P('fv1','Match each finger to its vowel.',[['Thumb','A'],['Index finger','E'],['Middle finger','I'],['Ring finger','O'],['Little finger','U']],'Thumb A, index E, middle I, ring O, little U: in alphabet order from the thumb.'),
  M('fv2','You touch the ring finger. Which letter is that?',['O','I','U','E'],0,'Ring finger = O.'),
  TF('fv3','BSL fingerspelling uses two hands.',true,'Yes. That’s one way it differs from American Sign Language.'),
  R('<h3>The whole alphabet</h3><p>The consonants each have their own shape. They’re much easier to learn from pictures, so open the chart and the fingerspelling player and practise <b>your own name</b> first.</p><p><a class="watch" href="https://www.british-sign.co.uk/bsl-fingerspelling-alphabet-chart" target="_blank" rel="noopener">▶ Open the fingerspelling chart</a></p><p><a class="watch" href="https://www.british-sign.co.uk/fingerspell" target="_blank" rel="noopener">▶ Open the fingerspelling player</a></p><div class="practise"></div>'),
  M('fv4','When would you fingerspell?',['For a name, or a word you don’t know the sign for','For every single word','Only for numbers','Never at work'],0,'Fingerspelling fills the gaps: names, places, and words you don’t know yet.')
 ]}
]},

/* ------------------------------------------------ 2 */
{id:'greet',title:'Hello and manners',icon:'🙂',color:'#1f8a70',stage:'Greet people politely',lessons:[
 {id:'gr1',title:'Hello, goodbye and how are you?',cards:[
  G('hello','Hello','Wave your hand near the side of your head.','The same wave means <b>hello</b>, <b>hi</b> and <b>goodbye</b>.','goodbye'),
  TF('g1','In BSL, hello and goodbye can use the same wave.',true,'Yes. A wave near the side of the head works for both.'),
  G('howareyou','How are you?','Fingertips of both flat hands brush up your chest, then both hands move forward with <b>thumbs up</b>. Use a questioning face.','Think: “how is everything in here?” (your chest), then “good?” (thumbs up).','how-are-you'),
  M('g2','Which sign is “How are you?”',['Flat hands brush up the chest, then move forward with thumbs up','A wave near the side of the head','A fist circles on the chest','Index finger taps the wrist'],0,'Brush up the chest, then thumbs up and forward, with a questioning face.'),
  G('good','Good','Closed hand with the <b>thumb up</b>, making a short forward movement. You can use one hand or both.','Answering “How are you?” with this means “I’m good.”'),
  M('g3','Someone signs “How are you?” What could you sign back?',['Good (thumb up, short forward movement)','Sorry','Toilet','Monday'],0,'Thumb up with a little forward push means good.'),
  TF('g4','To ask a question in BSL, your face should look like you’re asking.',true,'Yes, the questioning face is part of the sign.')
 ]},
 {id:'gr2',title:'Please, thank you and sorry',cards:[
  G('thanks','Please / Thank you','Flat hand, fingertips start on your <b>chin</b>, then the hand moves <b>down and away</b> from you.','Please and thank you use the <b>same sign</b>. <b>Mouth</b> the word so they know which one you mean.','thanks'),
  TF('m1','In BSL, please and thank you share the same sign.',true,'Yes. Mouthing the word tells them which one you mean.'),
  M('m2','How does someone tell your “please” apart from “thank you”?',['From the word you mouth','From which hand you use','From how fast you sign','They can’t'],0,'Mouth the English word silently as you sign.'),
  G('sorry','Sorry','A <b>closed hand</b> (fist) makes a <b>circle on your chest</b>.','Like rubbing your heart: “I feel bad.”'),
  M('m3','Which sign is “Sorry”?',['A fist makes a circle on your chest','Fingertips from chin, moving down and away','A wave near your head','Thumbs up coming together'],0,'Sorry: a fist circles on your chest.'),
  G('welcome','Welcome / You’re welcome','Both open hands, palms facing you, <b>bend at the knuckles</b> in small repeated movements, as if beckoning someone in.','Use it to welcome someone, or to reply to “thank you”.','youre-welcome'),
  P('m4','Match the meaning to the sign.',[['Thank you','Fingertips from chin, down and away'],['Sorry','Fist circles on chest'],['You’re welcome','Open hands beckon, bending at the knuckles'],['Hello','Wave near the side of the head']],'Four polite signs you’ll use every day.')
 ]}
]},

/* ------------------------------------------------ 3 */
{id:'ask',title:'Asking questions',icon:'❓',color:'#6c4fb3',stage:'Ask simple questions',lessons:[
 {id:'q1',title:'What, where and who',cards:[
  R('<h3>Question signs</h3><p>Question words usually come at the <b>end</b> of a BSL sentence, and your <b>eyebrows</b> help show it’s a question.</p><p>For example, “What’s your name?” is signed <b>NAME, YOUR, WHAT?</b></p>'),
  G('what','What?','Hold your <b>index finger</b> up in front of you and shake it in small side-to-side movements, with a questioning face.','A little “wagging” finger asks “what?”'),
  G('where','Where?','Both <b>flat hands, palms up</b>, make small circles in front of you, with a questioning face.','Like looking around for something with your palms open.'),
  G('who','Who?','Hold your <b>index finger upright</b> at the side of your head and make <b>small circles</b>.','The finger stays by your head, unlike “what?”, which shakes in front of you.'),
  P('q1a','Match the question to its sign.',[['What?','Index finger shakes side to side in front of you'],['Where?','Palms up, small circles'],['Who?','Index finger circles at the side of your head']],'What = shake, where = palms up circling, who = finger circling by your head.'),
  TF('q1b','In BSL, question words often come at the end of the sentence.',true,'Yes, e.g. NAME YOUR WHAT?'),
  M('q1c','Which question uses both palms facing up?',['Where?','Who?','What?','How old?'],0,'Where? Palms up, small circles.')
 ]},
 {id:'q2',title:'Asking someone’s name',cards:[
  G('name','Name','Tips of your <b>index and middle fingers</b> touch your <b>forehead</b>, then your wrist twists so the fingers point forward, out in front of your face.','Two fingers from the forehead: your name comes from your head.'),
  G('your','Your','Closed hand makes a small movement <b>out towards the person</b> you mean.','Point the movement at whoever “your” is.'),
  O('q2a','Put “What’s your name?” in BSL order.',['NAME','YOUR','WHAT?'],'In BSL it’s NAME, YOUR, WHAT? The question word goes last.'),
  M('q2b','Which sign is “Name”?',['Two fingertips touch your forehead, then twist forward','Fist circles on your chest','Index finger taps your wrist','Wave by your head'],0,'Name: index and middle fingers from the forehead, twisting forward.'),
  G('howold','How old are you?','Open hand facing your face, <b>fingers wiggle in front of your nose</b>, then <b>point</b> with your index finger at the person.','Handy at the desk when you need someone’s age.','how-old-are-you'),
  TF('q2c','To ask “How old are you?”, you wiggle your fingers in front of your nose and then point at the person.',true,'Yes, that’s the sign.')
 ]}
]},

/* ------------------------------------------------ 4 */
{id:'nums',title:'Numbers 1 to 10',icon:'🔢',color:'#b5651d',stage:'Sign numbers',lessons:[
 {id:'n1',title:'One to five',cards:[
  R('<h3>Counting on one hand</h3><p>Numbers <b>1 to 5</b> are made by holding up fingers, palm facing you. Numbers are one of the signs that <b>vary most by region</b>, so if a patient uses a different one, follow theirs.</p>'),
  G('one','1','Index finger up.'),
  G('two','2','Index and middle fingers up.'),
  G('three','3','Index, middle and ring fingers up.','Not the thumb: 3 uses the three middle fingers.'),
  G('four','4','Index, middle, ring and little fingers up. Thumb tucked in.'),
  G('five','5','All four fingers <b>and</b> the thumb up.'),
  S('n1a','Which fingers?',['Uses the thumb','No thumb'],[['5',0],['4',1],['3',1],['2',1]],'Only 5 uses the thumb. 1 to 4 count up from the index finger.'),
  M('n1b','Index, middle and ring fingers up. Which number?',['3','2','4','8'],0,'Three fingers, no thumb: 3.')
 ]},
 {id:'n2',title:'Six to ten',cards:[
  R('<h3>Six to nine: the thumb leads</h3><p>From 6, the <b>thumb</b> comes in, and the hand is held <b>sideways</b> (horizontal).</p>'),
  G('six','6','Closed hand with the <b>thumb up</b>.','Careful: <b>good</b> is also a thumb up, but it moves forward. 6 just stays still.'),
  G('seven','7','<b>Thumb and index finger</b> out, hand held sideways.'),
  G('eight','8','<b>Thumb, index and middle</b> fingers out, hand held sideways.'),
  G('nine','9','<b>Thumb, index, middle and ring</b> fingers out, hand held sideways.'),
  G('ten','10','Open hand with a <b>small twist</b> in front of you.'),
  O('n2a','Put these in order from smallest to biggest.',['Thumb up, still (6)','Thumb and index sideways (7)','Thumb, index and middle sideways (8)','Thumb and three fingers sideways (9)','Open hand with a twist (10)'],'6 is the thumb, then add one finger each time, then 10 twists.'),
  M('n2b','Thumb, index and middle fingers out, held sideways. Which number?',['8','3','7','9'],0,'Thumb + 2 fingers sideways = 8.'),
  TF('n2c','A still thumb-up means 6, but a thumb-up moving forward means “good”.',true,'Yes, the movement makes the difference.'),
  G('number','Number','Knuckles of a closed hand <b>tap your chin twice</b>.','Useful for “phone number” or “NHS number”.')
 ]}
]},

/* ------------------------------------------------ 5 */
{id:'time',title:'Days and times',icon:'📅',color:'#d35400',stage:'Talk about days and times',lessons:[
 {id:'t1',title:'Day, morning and afternoon',cards:[
  G('time','Time','Index finger <b>taps the top of your other wrist</b> twice, where a watch would be.','Tap your “watch”.'),
  G('day','Day','Both open hands, palms facing you, start <b>crossed</b> and move <b>up and apart</b> in an arc.','Like the sun coming up.'),
  G('morning','Morning','Bent hand: fingertips <b>tap the far side of your chest, then the near side</b>.'),
  G('afternoon','Afternoon','Tips of <b>index and middle fingers touch your chin</b>, then the wrist twists so they point forward.'),
  P('t1a','Match the word to its sign.',[['Time','Tap the top of your wrist'],['Day','Crossed hands rise and open in an arc'],['Morning','Bent hand taps across your chest'],['Afternoon','Two fingers from the chin, twisting forward']],'Time, day, morning, afternoon.'),
  M('t1b','Which one is like tapping your watch?',['Time','Day','Morning','Name'],0,'Time: tap the top of your wrist.'),
  TF('t1c','Afternoon and name both use two fingers, but name starts at the forehead and afternoon starts at the chin.',true,'Yes, the starting place changes the meaning.')
 ]},
 {id:'t2',title:'Yesterday, next and birthday',cards:[
  G('yesterday','Yesterday','Index finger makes <b>one small movement backwards</b> from the corner of your mouth.','Backwards = the past.'),
  G('next','Next','Hand in front of you with the <b>thumb out</b>, small twist at the wrist.','Combine with a day: “next Monday”.'),
  G('birthday','Birthday','Flat hands, <b>palms up</b>, start near your waist, move forward, then up in an arc.','Useful for date of birth checks at the desk.'),
  M('t2a','Which sign moves backwards from the corner of your mouth?',['Yesterday','Next','Birthday','Sorry'],0,'Yesterday moves backwards, into the past.'),
  M('t2b','A patient needs to give their date of birth. Which sign would help you ask?',['Birthday','Toilet','Sorry','Friend'],0,'Birthday, with a questioning face, or ask them to write it down.')
 ]},
 {id:'t3',title:'Days of the week',cards:[
  R('<h3>Days can vary</h3><p>Days of the week vary a lot around the UK. Here are some common versions. Several use <b>fingerspelling</b>.</p>'),
  G('monday','Monday','Fingerspell <b>M twice</b>.','M = three fingers of your dominant hand laid on the palm of your other hand.'),
  G('friday','Friday','Start with a fingerspelled <b>F</b> (two fingers across two fingers), then the top fingers make <b>small circles</b> on the still ones.'),
  G('saturday','Saturday','Flat hand, palm up, <b>taps your other arm twice</b> just above the elbow.'),
  G('sunday','Sunday','Both open hands <b>tap palm to palm twice</b> in front of you.','Like hands together for church.'),
  G('weekend','Weekend','Interlock your fingers to make a fingerspelled <b>W</b>, then close both hands together.'),
  P('t3a','Match the day to its sign.',[['Monday','Fingerspell M twice'],['Friday','F shape, top fingers circle'],['Saturday','Palm taps the arm above the elbow'],['Sunday','Palms tap together twice']],'Monday M-M, Friday F, Saturday arm tap, Sunday palms together.'),
  TF('t3b','Every Deaf person in the UK signs the days of the week the same way.',false,'Days vary a lot by region. Follow the person you’re talking to.')
 ]}
]},

/* ------------------------------------------------ 6 */
{id:'surgery',title:'At the surgery',icon:'🩺',color:'#c0392b',stage:'Help Deaf patients at the desk',lessons:[
 {id:'su1',title:'Deaf, sign and interpreter',cards:[
  G('deaf','Deaf','Index and middle fingers touch your <b>ear</b>.'),
  G('sign','Sign (language)','Both open hands, palms facing each other, make <b>forward circles</b> in front of you.','“Do you sign?” = SIGN, YOU? with a questioning face.'),
  G('interpreter','Interpreter','Both hands make a <b>V</b> (index and middle fingers) and move <b>backwards and forwards alternately</b> in front of your chest.','Two Vs passing the message back and forth.'),
  M('su1a','Which sign is “Interpreter”?',['Two V hands moving back and forth alternately','Two fingers touching the ear','Open hands circling forward','Fist circling on the chest'],0,'Interpreter: two Vs moving back and forth.'),
  M('su1b','Two fingers touching the ear means…',['Deaf','Hear','Name','Phone'],0,'Deaf: index and middle fingers touch the ear.'),
  TF('su1c','“Sign” is made with both open hands circling forward.',true,'Yes.')
 ]},
 {id:'su2',title:'Help, sit and toilet',cards:[
  G('help','Help','Closed hand with the <b>thumb up</b> rests on the <b>palm of your other flat, upturned hand</b>.','“Can I help?” = HELP, with a questioning face.'),
  G('sit','Sit (down)','Both flat hands, palms down, one on top of the other, make <b>one downward movement</b>.','Point to the chairs first, then sign SIT.'),
  G('toilet','Toilet','Index finger <b>taps the inside edge of your other palm</b> twice.'),
  P('su2a','Match the word to its sign.',[['Help','Thumb-up fist resting on the other palm'],['Sit','Flat hands, one on the other, move down once'],['Toilet','Index finger taps the edge of the other palm']],'Help, sit, toilet.'),
  M('su2b','A patient has checked in. You want them to take a seat. Which sign?',['Sit','Toilet','Help','Deaf'],0,'Point to the seats, then sign SIT.')
 ]},
 {id:'su3',title:'Ill, pain and nurse',cards:[
  G('ill','Ill / Sick','<b>Little fingers</b> of both hands <b>brush down your chest</b>.','','sick'),
  G('pain','Pain','Both open hands, palms facing you, move <b>up and down alternately</b> in front of you.','Your face shows how bad: a big grimace means a lot of pain.'),
  R('<h3>Where does it hurt?</h3><p>Sign <b>PAIN</b>, then <b>WHERE?</b> with a questioning face.</p><p>BSL often shows things <b>where they are on the body</b>, so the patient may sign pain right at the place it hurts.</p>'),
  O('su3a','Put “Where does it hurt?” in order.',['PAIN','WHERE?'],'PAIN, then WHERE? with a questioning face.'),
  G('nurse','Nurse','Your <b>thumb draws a cross</b> on your other shoulder.','Think of a red cross on a sleeve.'),
  M('su3b','Which sign is “Nurse”?',['Thumb draws a cross on your shoulder','Little fingers brush down the chest','Index finger taps the wrist','Open hands move up and down'],0,'Nurse: thumb draws a cross on the shoulder.'),
  TF('su3c','In BSL your facial expression can show how bad the pain is.',true,'Yes, a grimace shows a lot of pain.'),
  G('health','Health / Healthy','Both open hands start on your <b>chest</b>, then move forward, closing into <b>thumbs up</b>.','Same start as “How are you?”, but the hands start still on the chest.','healthy')
 ]},
 {id:'su4',title:'Person and number',cards:[
  G('person','Person','Index finger and thumb held slightly apart, <b>move down</b> in front of you.'),
  R('<h3>Putting it together at the desk</h3><ul><li><b>Can I help?</b> → HELP? (questioning face)</li><li><b>What’s your name?</b> → NAME, YOUR, WHAT?</li><li><b>Date of birth?</b> → BIRTHDAY? then let them write it</li><li><b>Please sit.</b> → point to the chairs, PLEASE, SIT</li><li><b>Do you need an interpreter?</b> → INTERPRETER, WANT? (WANT is in the next unit)</li></ul><p>And always have <b>pen and paper</b> ready.</p>'),
  O('su4a','Order the signs for “Please sit.”',['Point to the chairs','PLEASE','SIT'],'Point, please, sit.'),
  M('su4b','Which sign would you use to ask for someone’s phone number?',['Number (knuckles tap the chin)','Time','Birthday','Nurse'],0,'Number: knuckles tap the chin twice.')
 ]}
]},

/* ------------------------------------------------ 7 */
{id:'chat',title:'Keeping the conversation going',icon:'💬',color:'#0e7c86',stage:'Keep a conversation going',lessons:[
 {id:'c1',title:'Again, slow and want',cards:[
  G('again','Again','Make a <b>V</b> with index and middle fingers, then twist your wrist in small back-and-forth movements.','“Again, please?” when you didn’t catch it.'),
  G('slow','Slow','Flat hand starts on top of your other wrist and <b>brushes slowly up the forearm</b>.','“Slower, please” is really useful as a learner.'),
  G('want','Want','Flat hand moves <b>down your chest</b>, then twists out.'),
  P('c1a','Match the word to its sign.',[['Again','V shape twisting back and forth'],['Slow','Hand brushes slowly up the forearm'],['Want','Hand moves down the chest then twists out']],'Again, slow, want.'),
  M('c1b','You didn’t understand. Which two signs help most?',['Again and slow','Monday and Sunday','Nurse and toilet','Six and seven'],0,'“Again, slow, please” helps any learner.')
 ]},
 {id:'c2',title:'Agree, learn, read and friend',cards:[
  G('agree','Agree','Both hands with <b>thumbs up come together</b>.'),
  G('learn','Learn','Hand at the side of your head moves <b>back slightly while the fingers close together</b>.','Like putting knowledge into your head.'),
  G('read','Read','Other hand open, palm towards you; your <b>V fingers zig-zag</b> above it like eyes reading a page.'),
  G('friend','Friend','<b>Clasp your hands together</b> and move them up and down a little.'),
  P('c2a','Match the word to its sign.',[['Agree','Two thumbs-up come together'],['Learn','Fingers close at the side of the head'],['Read','V fingers zig-zag over the other palm'],['Friend','Hands clasped, small up and down']],'Agree, learn, read, friend.'),
  M('c2b','How would you tell someone “I’m learning to sign”?',['LEARN, SIGN (pointing to yourself)','TOILET, NURSE','MONDAY, AGAIN','PAIN, WHERE'],0,'Point to yourself, LEARN, SIGN. Deaf people usually love it when you try.')
 ]}
]},

/* ------------------------------------------------ 8 */
{id:'together',title:'Putting it all together',icon:'🤝',color:'#34495e',stage:'Hold a short conversation',lessons:[
 {id:'p1',title:'A conversation at the desk',cards:[
  R('<h3>Practise a whole conversation</h3><p>Here is a short exchange at reception. Sign each line out loud to yourself (or in a mirror):</p><ol><li><b>You:</b> HELLO. HELP? (questioning face)</li><li><b>Patient:</b> (fingerspells their name)</li><li><b>You:</b> BIRTHDAY? (then pen and paper)</li><li><b>You:</b> THANK YOU. PLEASE SIT. (point to the chairs)</li><li><b>You:</b> NURSE … (point to the corridor when it’s time)</li></ol><div class="practise"></div>'),
  O('p1a','Put the conversation in a sensible order.',['HELLO. HELP?','NAME, YOUR, WHAT?','BIRTHDAY?','THANK YOU. PLEASE SIT.'],'Greet, ask name, check birthday, thank and seat.'),
  M('p1b','A patient signs very fast and you lose track. What do you do?',['Sign SORRY, AGAIN, SLOW, PLEASE','Pretend you understood','Shout','Walk away'],0,'Asking for it again, slowly, is completely normal.'),
  TF('p1c','If a conversation gets too hard, it’s fine to switch to pen and paper or book an interpreter.',true,'Yes. The goal is clear communication, not perfect signing.')
 ]},
 {id:'p2',title:'Mixed practice',cards:[
  R('<h3>Mixed practice</h3><p>These questions mix everything you’ve learned. If one trips you up, you’ll see the sign again.</p>'),
  P('p2a','Match the sign to the meaning.',[['Fist circles on the chest','Sorry'],['Fingertips from chin, down and away','Thank you'],['Thumb draws a cross on the shoulder','Nurse'],['Two fingers touch the ear','Deaf'],['Palms up, small circles','Where?']],'Sorry, thank you, nurse, deaf, where.'),
  M('p2b','Which sign uses knuckles tapping the chin?',['Number','Afternoon','Name','Thank you'],0,'Number.'),
  M('p2c','Which number is a still thumb up?',['6','1','5','10'],0,'6. Moving forward would be “good”.'),
  S('p2d','Is it a question sign?',['Question sign','Not a question'],[['What?',0],['Where?',0],['Who?',0],['Sorry',1],['Toilet',1]],'What, where and who are question signs.'),
  TF('p2e','Hello and goodbye can both be a wave near the side of your head.',true,'Yes.')
 ]}
]}
];

/* look-it-up: every sign, plus Deaf awareness tips */
var LOOKUP=[
 ['Deaf awareness at the desk',['Get attention with a wave they can see, or a gentle tap on the shoulder.','Face them, keep your mouth clear, and have good light on your face.','Speak clearly at a normal pace. Don’t shout or exaggerate.','If they don’t understand, say it a different way.','Keep pen and paper ready. Keep written English short and simple.','Book a BSL interpreter for appointments. Don’t rely on family members.','The NHS Accessible Information Standard means communication needs should be recorded and met.']],
 ['How BSL works',['BSL has its own grammar. Question words usually go at the end (NAME YOUR WHAT?).','Your dominant hand leads. Left-handers mirror the signs.','Your face is part of the language: eyebrows show questions, expressions show how much.','Many signs are made while mouthing the English word.','Signs (especially numbers and days) vary by region. Copy the person you’re talking to.']],
 ['Fingerspelling vowels',['Touch the fingertips of your other hand with your index finger:','Thumb = A · Index = E · Middle = I · Ring = O · Little = U','Full alphabet chart: british-sign.co.uk/bsl-fingerspelling-alphabet-chart']],
 ['Useful phrases',['Can I help? → HELP? (questioning face)','What’s your name? → NAME, YOUR, WHAT?','How old are you? → wiggle fingers in front of nose, point','Where does it hurt? → PAIN, WHERE?','Please sit → point to the chairs, PLEASE, SIT','Again, slowly please → AGAIN, SLOW, PLEASE','I’m learning to sign → point to yourself, LEARN, SIGN']]
];

/* A "quick check" at the end of each lesson: one question per sign taught, so every sign gets recalled. */
(function(){function plain(h){return h.replace(/<[^>]+>/g,'');}
 var keys=Object.keys(SIGNS);
 COURSE.forEach(function(u){u.lessons.forEach(function(l){var ex=[];
  l.cards.forEach(function(c){if(c.t!=='read'||!c.sign)return;var k=c.sign,x=SIGNS[k];
   var pool=keys.filter(function(o){return o!==k&&plain(SIGNS[o].how)!==plain(x.how);});
   for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
   ex.push({t:'mc',id:'w_'+k,sg:k,q:'Which is the sign for “'+plain(x.w)+'”?',o:[plain(x.how)].concat(pool.slice(0,3).map(function(o){return plain(SIGNS[o].how);})),a:0,why:'<b>'+x.w+'</b>: '+x.how});});
  if(ex.length)l.cards=l.cards.concat([R('<h3>Quick check</h3><p>Let’s see if you can remember how each sign from this lesson is made. If you’re not sure, take a guess. You’ll see the sign again.</p>')],ex);});});})();
