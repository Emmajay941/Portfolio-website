document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => { setTimeout(() => { preloader.classList.add('hide'); }, 800); });

    // Custom cursor
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
        cursorFollower.style.left = mouseX + 'px'; cursorFollower.style.top = mouseY + 'px';
    });
    document.querySelectorAll('a, button, .work-card, .service-card, .hero-image-card, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '30px'; cursor.style.height = '30px'; cursor.style.background = 'rgba(108,92,231,0.4)';
            cursorFollower.style.borderColor = 'rgba(212,168,83,0.8)'; cursorFollower.style.width = '60px'; cursorFollower.style.height = '60px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '8px'; cursor.style.height = '8px'; cursor.style.background = '#6C5CE7';
            cursorFollower.style.borderColor = 'rgba(108,92,231,0.4)'; cursorFollower.style.width = '40px'; cursorFollower.style.height = '40px';
        });
    });

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            btn.style.transform = `translate(${x*0.25}px, ${y*0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });

    // Hero 3D tilt
    const heroCard = document.getElementById('heroCard');
    if (heroCard) {
        heroCard.addEventListener('mousemove', (e) => {
            const rect = heroCard.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const rotateX = ((y - rect.height/2) / (rect.height/2)) * -12;
            const rotateY = ((x - rect.width/2) / (rect.width/2)) * 12;
            heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        heroCard.addEventListener('mouseleave', () => { heroCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; });
    }

    // Particle Canvas
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height;
            this.size = Math.random()*1.5+0.5; this.speedX = (Math.random()-0.5)*0.5; this.speedY = (Math.random()-0.5)*0.5;
            this.opacity = Math.random()*0.5+0.2;
        }
        update() { this.x+=this.speedX; this.y+=this.speedY; if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height) this.reset(); }
        draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle=`rgba(108,92,231,${this.opacity})`; ctx.fill(); }
    }
    for(let i=0;i<80;i++) particles.push(new Particle());
    function animateParticles() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p=>{p.update();p.draw();});
        for(let i=0;i<particles.length;i++){
            for(let j=i+1;j<particles.length;j++){
                const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<100){ctx.beginPath();ctx.strokeStyle=`rgba(108,92,231,${0.08*(1-dist/100)})`;ctx.lineWidth=0.5;ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();}
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                const el=entry.target, target=+el.getAttribute('data-target'), duration=2000, step=target/(duration/16);
                let current=0;
                const update=()=>{ current+=step; if(current<target){ el.textContent=Math.floor(current); requestAnimationFrame(update); } else el.textContent=target; };
                update(); counterObserver.unobserve(el);
            }
        });
    },{threshold:0.5});
    counters.forEach(c=>counterObserver.observe(c));

    // Scroll reveal
    document.querySelectorAll('[data-reveal]').forEach(el=>{
        new IntersectionObserver((entries,obs)=>{ entries.forEach(entry=>{ if(entry.isIntersecting){entry.target.classList.add('revealed');obs.unobserve(entry.target);}})},{threshold:0.15}).observe(el);
    });

    // Navbar & mobile menu
    const navbar=document.getElementById('navbar'), navLinks=document.getElementById('navLinks'), hamburger=document.getElementById('hamburger');
    window.addEventListener('scroll', ()=>{ if(window.scrollY>40) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled'); });
    hamburger.addEventListener('click', ()=>{ navLinks.classList.toggle('open'); hamburger.classList.toggle('active'); });
    document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');hamburger.classList.remove('active');}));

    // Form handling
    const form=document.getElementById('contactForm'), feedback=document.getElementById('formFeedback');
    if(form){
        form.addEventListener('submit',(e)=>{
            e.preventDefault();
            const name=document.getElementById('name').value.trim(), email=document.getElementById('email').value.trim(), message=document.getElementById('message').value.trim();
            if(!name||!email||!message){ feedback.textContent='Please fill in all fields.'; feedback.className='form-feedback error'; return; }
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ feedback.textContent='Enter a valid email.'; feedback.className='form-feedback error'; return; }
            const btn=form.querySelector('.form-submit'), orig=btn.textContent;
            btn.textContent='Sending...'; btn.disabled=true;
            setTimeout(()=>{
                feedback.textContent=`Thanks, ${name}! I'll be in touch soon.`; feedback.className='form-feedback success';
                form.reset(); btn.textContent=orig; btn.disabled=false;
                setTimeout(()=>{feedback.textContent='';feedback.className='form-feedback';},5000);
            },1500);
        });
    }

    // Footer year
    const yearSpan=document.getElementById('currentYear'); if(yearSpan) yearSpan.textContent=new Date().getFullYear();

    // Scroll indicator hide
    const indicator=document.getElementById('scrollIndicator');
    if(indicator){ window.addEventListener('scroll',()=>{ indicator.style.opacity=window.scrollY>100?'0':'1'; }); }
});