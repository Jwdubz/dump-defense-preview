/* Dump Defense preview. Motion always on (no reduced-motion branch); one Pause control (WCAG 2.2.2). */
(function(){
var D=document,H=D.documentElement,W=window;
if(!W.gsap){return;} /* no JS libs: page stays in plain readable flow */
H.classList.add('js');
var g=W.gsap, E='expo.out';
var beats=[].slice.call(D.querySelectorAll('.beat'));
var stages=beats.map(function(b){return b.querySelector('.stage');});
var LEN=[1.0,1.5,1.8,1.8,1.5,1.7,1.7,1.5,1.2]; /* scroll per beat, in screens */
var vh=0,starts=[],ends=[],total=0,W_=0,lenis=null,paused=false,lastW=0;
function $(s,r){return (r||D).querySelector(s);} function $$(s,r){return [].slice.call((r||D).querySelectorAll(s));}
function clamp(v){return v<0?0:v>1?1:v;} function sm(t){t=clamp(t);return t*t*(3-2*t);}

/* ---------- build generated parts ---------- */
var grid=$('.grid100'); var lostIdx=[];
(function(){var order=[];for(var i=0;i<100;i++)order.push(i);var seed=7;function r(){seed=(seed*9301+49297)%233280;return seed/233280;}
 for(i=99;i>0;i--){var j=Math.floor(r()*(i+1));var t=order[i];order[i]=order[j];order[j]=t;}
 lostIdx=order.slice(0,48);
 for(i=0;i<100;i++){grid.appendChild(D.createElement('i'));}})();
var gridDots=$$('i',grid); var lostDots=lostIdx.map(function(i){return gridDots[i];});

var dotsBox=$('.b4 .dots'); var NDOT=11;
/* loose cadence then tightened cadence (x positions, 0..1) */
var looseX=[],tightX=[];for(var k=0;k<NDOT;k++){looseX.push(.03+k*.094);}
(function(){var x=.03,gap=.155;for(var k=0;k<NDOT;k++){tightX.push(x);x+=gap;gap*=.84;}})();
var cadDots=[];for(k=0;k<NDOT;k++){var d=D.createElement('i');if(k===0||k===NDOT-1)d.className='f';d.style.left=(looseX[k]*100)+'%';dotsBox.appendChild(d);cadDots.push(d);}

var cal=$('.cal'),days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],appt={0:'PT 9:30',2:'Chiro 2:00',4:'PT 9:30',7:'PT 9:30',9:'Ortho 10:15',11:'PT 9:30'},visits=[0,2,4,7,9,11],miss=7,calCells=[];
for(k=0;k<14;k++){var c=D.createElement('div');c.innerHTML='<span><span>'+days[k%7]+'</span><span class="dn">'+(k+1)+'</span></span>'+(appt[k]?'<b>'+appt[k]+'</b>':'');
 if(k%7>4)c.className='we';if(k===miss){c.className='miss';c.insertAdjacentHTML('beforeend','<span class="flag">Gap flagged</span>');}cal.appendChild(c);calCells.push(c);}

/* split Monday lines into characters (screen readers keep the full text via aria-label) */
$$('.mon .t').forEach(function(t){var s=t.textContent;t.setAttribute('aria-label',s);t.innerHTML=s.split('').map(function(ch){return '<span class="c" aria-hidden="true">'+(ch===' '?' ':ch)+'</span>';}).join('');});

/* ---------- hero: three-ring loss (time based, loops) ---------- */
var rings=$$('.b1 .r');
var heroTl=g.timeline({repeat:-1,repeatDelay:.6});
[0,1,2].forEach(function(i){
  var r=rings[i], t=i*1.15, last=i===2;
  if(!last){heroTl.fromTo(r,{attr:{r:60,'stroke-dasharray':'2000 0'},opacity:1},{attr:{r:560},opacity:0,duration:2.8,ease:'power1.out'},t);}
  else{ /* the third ring breaks up and dies before it reaches anyone */
    heroTl.fromTo(r,{attr:{r:60,'stroke-dasharray':'2000 0'},opacity:.95},{attr:{r:300},duration:2.2,ease:'power2.out'},t)
          .to(r,{attr:{'stroke-dasharray':'1 22'},duration:1.3,ease:'power1.in'},t+.35)
          .to(r,{opacity:0,duration:1.2,ease:'power1.in'},t+.9);}
});
heroTl.to({},{duration:1.4});
/* the call card follows the rings: Ringing 1, 2, 3, then No answer */
var callEl=$('.call'),cs=$$('.cs');
heroTl.call(function(){callEl.classList.remove('dead');},null,0);
[0,1,2].forEach(function(i){heroTl.set(cs,{opacity:0},i*1.15).set(cs[i],{opacity:1},i*1.15);});
heroTl.set(cs,{opacity:0},3.75).set(cs[3],{opacity:1},3.75).call(function(){callEl.classList.add('dead');},null,3.75);
var heroIn=g.timeline({delay:.15});
heroIn.from('.h1 .w',{yPercent:110,duration:1.2,ease:E,stagger:.12})
      .from('.call',{y:30,opacity:0,duration:1.2,ease:E},.35)
      .from('.cue',{opacity:0,duration:1,ease:E},.9);

/* ---------- per-beat scroll timelines (duration normalized to 1) ---------- */
var tls=[];
function T(){var t=g.timeline({paused:true,defaults:{ease:'power2.out'}});tls.push(t);return t;}
/* 1 hero: lines drift apart slightly on the way out */
T().to('.b1 .h1',{y:-30,duration:1},0).to('.b1 .rings',{scale:1.15,duration:1},0);
/* 2 stat */
var nEl=$('.b2 .n'),cnt={v:0};
T().from('.b2 .big',{y:60,opacity:0,duration:.18},0)
   .to(cnt,{v:48,duration:.5,ease:'power1.inOut',onUpdate:function(){nEl.textContent=Math.round(cnt.v);}},.08)
   .from(gridDots,{scale:0,opacity:0,duration:.18,stagger:{each:.0012,from:'start'}},0)
   .to(lostDots,{backgroundColor:'#7d97b3',opacity:.28,scale:.7,duration:.06,stagger:.5/48},.08)
   .from('.b2 .h2',{y:40,opacity:0,duration:.2},.42)
   .from('.b2 .src',{opacity:0,duration:.15},.55)
   .to({},{duration:.3});
/* 3 two rings, the gold line catches the call */
T().from('.b3 .phone',{scale:0,duration:.06},0)
   .to('.b3 .ct1',{opacity:1,duration:.03},.04).fromTo('.b3 .cr1',{width:40,height:40,opacity:1},{width:620,height:620,opacity:0,duration:.22,ease:'power1.out'},.04)
   .to('.b3 .ct1',{opacity:0,duration:.03},.2)
   .to('.b3 .ct2',{opacity:1,duration:.03},.22).fromTo('.b3 .cr2',{width:40,height:40,opacity:1},{width:620,height:620,opacity:0,duration:.22,ease:'power1.out'},.22)
   .to('.b3 .catch .gline',{scaleX:1,duration:.16,ease:'power3.inOut'},.3)
   .to('.b3 .ct2',{opacity:0,duration:.03},.4)
   .to('.b3 .node',{opacity:1,scale:1.25,duration:.05},.45).to('.b3 .node',{scale:1,duration:.06},.5)
   .to('.b3 .ct3',{opacity:1,duration:.05},.47)
   .from('.b3 .h2',{y:50,opacity:0,duration:.16},.5)
   .from('.b3 .sub',{y:24,opacity:0,duration:.12},.62)
   .from('.b3 .note',{opacity:0,duration:.1},.7)
   .to({},{duration:.2});
/* 4 records cadence tightens */
var t4=T().from('#h4',{y:40,opacity:0,duration:.14},0)
   .to('.b4 .cad .gline',{scaleX:1,duration:.24,ease:'power2.inOut'},.08)
   .from(cadDots,{scale:0,duration:.05,stagger:.016},.12)
   .from('.b4 .cad-k li',{y:20,opacity:0,duration:.08,stagger:.04},.2);
cadDots.forEach(function(d,k){t4.to(d,{left:(tightX[k]*100)+'%',duration:.26,ease:'power3.inOut'},.42);});
t4.from('.b4 .land',{y:40,opacity:0,duration:.14},.66).to({},{duration:.2});
/* 5 calendar, missed visit flashes and gets flagged */
var vb=visits.map(function(v){return calCells[v].querySelector('b');});
T().from('.b5 .h2',{y:40,opacity:0,duration:.14},0)
   .from(calCells,{y:30,opacity:0,duration:.1,stagger:.012},.06)
   .from('.cal-h',{opacity:0,duration:.08},.04)
   .to(vb.filter(function(b,i){return visits[i]!==miss;}),{opacity:1,duration:.04,stagger:.04},.25)
   .to(calCells[miss].querySelector('b'),{opacity:1,duration:.03},.45)
   .to(calCells[miss],{borderColor:'#7d97b3',duration:.03,repeat:3,yoyo:true},.48)
   .to(calCells[miss],{borderColor:'#d4ae5a',duration:.04},.62)
   .fromTo(calCells[miss].querySelector('.flag'),{opacity:0,y:8},{opacity:1,y:0,duration:.06},.64)
   .to('.cal-log',{opacity:1,duration:.06},.68)
   .from('.b5 .sub',{y:24,opacity:0,duration:.12},.72)
   .to({},{duration:.18});
/* 6 Monday list writes itself, statute line first */
var t6=T().from('.b6 .h2',{y:40,opacity:0,duration:.12},0).from('.b6 .sub',{opacity:0,duration:.1},.06)
   .to('.b6 .mon-l',{scaleY:1,duration:.72,ease:'none'},.12);
$$('.mon li').forEach(function(li,i){var cs=$$('.c',li),st=.16+i*.13;
  t6.from(li,{borderTopColor:'rgba(238,232,221,0)',duration:.03},st).to($('.k',li),{opacity:1,duration:.02},st).fromTo(li,{'--d':0},{'--d':1,duration:.04,ease:'back.out(3)'},st)
    .to(cs,{opacity:1,duration:.001,stagger:.1/cs.length},st+.01);});
t6.set($$('.mon .k'),{opacity:.0},0).to({},{duration:.1});
/* 7 three readers agree, then the update goes out */
var t7=T().from('.b7 .h2',{y:40,opacity:0,duration:.12},0).from('.rd',{y:40,opacity:0,duration:.1,stagger:.04},.06);
var speeds=[[.2,.05],[.24,.02],[.17,.08]];
$$('.rd').forEach(function(rd,i){var bars=$$('.dt span',rd),chk=$$('.chk li',rd),dur=speeds[i][0],st=.2+speeds[i][1];
  t7.fromTo(bars,{'--s':0},{'--s':1,duration:dur/bars.length,stagger:dur/bars.length,ease:'none'},st)
    .to(chk,{opacity:1,duration:.02,stagger:.02},st+dur*.5)
    .to($('.ok',rd),{opacity:1,duration:.03},st+dur+.01);});
t7.to('.b7 .join',{scaleX:1,duration:.12,ease:'power2.inOut'},.56)
  .from('.b7 .sub',{opacity:0,y:20,duration:.1},.62)
  .to('.b7 .sent',{opacity:1,duration:.06},.7).to({},{duration:.2});
/* 8 lines it never crosses */
var t8=T().from('.b8 .h2',{y:40,opacity:0,duration:.14},0);
$$('.lines li').forEach(function(li,i){t8.fromTo(li,{'--s':0},{'--s':1,duration:.1,ease:'power2.inOut'},.14+i*.1).from(li,{opacity:0,x:-20,duration:.08},.17+i*.1);});
t8.to({},{duration:.2});
/* 9 ask: the gold line draws the button outline */
var rect=$('.cta-r'),svg=$('.cta-svg'),btn=$('#cta'),rlen=1;
function sizeCta(){var w=btn.offsetWidth+14,h=btn.offsetHeight+14;svg.setAttribute('width',w);svg.setAttribute('height',h);svg.setAttribute('viewBox','0 0 '+w+' '+h);
 rect.setAttribute('x',.8);rect.setAttribute('y',.8);rect.setAttribute('width',w-1.6);rect.setAttribute('height',h-1.6);rect.setAttribute('rx',(h-1.6)/2);
 rlen=rect.getTotalLength?rect.getTotalLength():2*(w+h);rect.style.strokeDasharray=rlen;}
sizeCta();
var t9=T().from('.b9 .h2',{y:50,opacity:0,duration:.2},0)
   .fromTo(rect,{strokeDashoffset:function(){return rlen;}},{strokeDashoffset:0,duration:.35,ease:'power2.inOut'},.18)
   .from(btn,{opacity:0,scale:.96,duration:.15},.45)
   .from('.ftr',{opacity:0,duration:.15},.55).to({},{duration:.2});

/* ---------- layout + render ---------- */
var track=$('#track');
function layout(){vh=H.clientHeight;W_=.42*vh;var y=0;starts=[];ends=[];
  LEN.forEach(function(l){starts.push(y);y+=l*vh;ends.push(y);});total=y;
  track.style.height=(total+vh)+'px';}
var cur=-1,lastNav=-2,navA=$$('.nav a');
function render(y){if(paused)return;
  var n=stages.length;
  for(var i=0;i<n;i++){
    var h2=W_/2, en=i===0?1:sm((y-starts[i])/h2), ex=i===n-1?1:1-sm((y-(ends[i]-h2))/h2); /* out fully, then in: two beats never share the screen */
    var o=Math.min(en,ex), s=en<1?.94+.06*en:(ex<1?1+.06*(1-ex):1);
    var st=stages[i];
    if(o<=.001){if(st._v!==0){st.style.visibility='hidden';st.style.opacity=0;st._v=0;}continue;}
    st.style.visibility='visible';st.style.opacity=o;st.style.transform=s===1?'':'scale('+s+')';st._v=1;
    var p=(y-starts[i])/((ends[i]-starts[i])*.86);
    tls[i].progress(clamp(p));
    if(o>.5)cur=i;
  }
  if(cur!==lastNav){lastNav=cur;var bid=beats[cur]&&beats[cur].id;navA.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+bid);});}
}
/* the last beat's timeline ends at max scroll: max scroll = track height - vh */
function fixLast(){}

function startLenis(){lenis=new Lenis({lerp:.1,smoothWheel:true,wheelMultiplier:1});
  lenis.on('scroll',function(e){render(e.scroll);hdr(e.direction,e.scroll);});}
var hd=$('#hdr');function hdr(dir,y){if(y<40){hd.classList.remove('up');return;}if(dir===1)hd.classList.add('up');else if(dir===-1)hd.classList.remove('up');}
g.ticker.add(function(t){if(lenis)lenis.raf(t*1000);});g.ticker.lagSmoothing(0);

layout();startLenis();fixLast();render(W.scrollY||0);
W.addEventListener('resize',function(){var w=W.innerWidth;if(w===lastW&&Math.abs(H.clientHeight-vh)<120)return;lastW=w;if(paused)return;layout();fixLast();sizeCta();render(lenis?lenis.scroll:W.scrollY);});
lastW=W.innerWidth;

/* in-page jumps (skip link, wordmark) */
function goBeat(i){if(paused){beats[i].scrollIntoView();return;}var y=i===0?0:starts[i]+.55*(ends[i]-starts[i]);if(i===beats.length-1)y=total;lenis.scrollTo(y,{duration:1.6,easing:function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}});}
$$('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href').slice(1),el=id==='top'?beats[0]:D.getElementById(id);var i=beats.indexOf(el&&el.closest('.beat'));if(i<0)return;e.preventDefault();goBeat(i);if(id==='ask')setTimeout(function(){btn.focus({preventScroll:true});},1700);});});

/* phone menu */
var mb=$('#menuB'),menu=$('#menu');
function setMenu(open){mb.setAttribute('aria-expanded',open?'true':'false');H.classList.toggle('menu-open',open);
  if(open){menu.hidden=false;requestAnimationFrame(function(){menu.classList.add('open');});if(lenis)lenis.stop();}
  else{menu.classList.remove('open');menu.hidden=true;if(lenis)lenis.start();}}
mb.addEventListener('click',function(){setMenu(mb.getAttribute('aria-expanded')!=='true');});
$$('a',menu).forEach(function(a){a.addEventListener('click',function(){setMenu(false);},true);});
D.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden){setMenu(false);mb.focus();}});

/* placeholder CTA: does nothing (label and destination not approved) */
btn.addEventListener('click',function(e){e.preventDefault();});

/* ---------- Pause animations (WCAG 2.2.2) ---------- */
var pb=$('#pause');
pb.addEventListener('click',function(){
  if(!paused){var at=Math.max(cur,0);paused=true;H.classList.add('static');pb.setAttribute('aria-pressed','true');pb.textContent='Play animations';
    g.globalTimeline.pause();heroTl.progress(.12);tls.forEach(function(t){t.progress(1);});heroIn.progress(1);
    if(lenis){lenis.destroy();lenis=null;}
    stages.forEach(function(s){s.style.cssText='';});
    beats[at].scrollIntoView();cur=at;
  }else{var at2=0,y=W.scrollY;beats.forEach(function(b,i){if(b.offsetTop<=y+H.clientHeight/2)at2=i;});
    paused=false;H.classList.remove('static');pb.setAttribute('aria-pressed','false');pb.textContent='Pause animations';
    g.globalTimeline.resume();layout();startLenis();fixLast();var ty=at2===0?0:starts[at2]+.55*(ends[at2]-starts[at2]);
    W.scrollTo(0,ty);lenis.scrollTo(ty,{immediate:true});render(ty);}
});
W.__dd={render:render,starts:function(){return starts;},ends:function(){return ends;}};
})();
