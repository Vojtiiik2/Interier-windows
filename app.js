const menu=document.querySelector('.menu');const hamb=document.querySelector('.hamb');if(hamb){hamb.addEventListener('click',()=>menu.classList.toggle('open'))}
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.reveal,.section,.card,.service-tile,.feature').forEach(el=>io.observe(el));
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{const f=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('[data-cat]').forEach(card=>{card.style.display=(f==='all'||card.dataset.cat===f)?'block':'none'})}));
const form=document.querySelector('form[data-demo]');if(form){form.addEventListener('submit',e=>{e.preventDefault();alert('Formulář je připravený pro napojení na Make webhook. Zatím se data nikam neodesílají.');})}

// v10: decentní hero slider bez ovládacích prvků
const heroSlides=document.querySelectorAll('.hero-slider .hero-bg');
if(heroSlides.length>1){
  let heroIndex=0;
  setInterval(()=>{
    heroSlides[heroIndex].classList.remove('is-active');
    heroIndex=(heroIndex+1)%heroSlides.length;
    heroSlides[heroIndex].classList.add('is-active');
  },9000);
}
