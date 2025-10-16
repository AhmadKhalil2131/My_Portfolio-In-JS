

    document.addEventListener('DOMContentLoaded', function(){

      // set year
      const yearEl = document.getElementById('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

      // mobile hamburger
      const hamburger = document.getElementById('hamburger');
      const navLinks = document.querySelector('.nav-links');
      hamburger && hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        if(navLinks){
          if(navLinks.style.display === 'flex'){ navLinks.style.display = ''; }
          else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.right = '18px';
            navLinks.style.top = '64px';
            navLinks.style.background = 'var(--card)';
            navLinks.style.padding = '10px';
            navLinks.style.borderRadius = '12px';
            navLinks.style.border = '1px solid var(--border)';
            navLinks.style.boxShadow = '0 12px 34px var(--shadow)';
          }
        }
      });
      document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', ()=> {
        if(window.innerWidth <= 780 && navLinks){ navLinks.style.display = ''; hamburger.classList.remove('active'); }
      }));

      // theme toggle
      const darkToggle = document.getElementById('darkModeToggle');
      const htmlEl = document.documentElement;
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      if(savedTheme === 'dark' || (!savedTheme && prefersDark)){
        htmlEl.setAttribute('data-theme','dark');
        darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        htmlEl.removeAttribute('data-theme');
        darkToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }

      darkToggle.addEventListener('click', () => {
        if(htmlEl.getAttribute('data-theme') === 'dark'){
          htmlEl.removeAttribute('data-theme');
          localStorage.setItem('theme','light');
          darkToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
          htmlEl.setAttribute('data-theme','dark');
          localStorage.setItem('theme','dark');
          darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
      });

      // typewriter
      const roles = ["Creative Web Developer","UI/UX Designer","Frontend Enthusiast"];
      let roleIdx = 0, charIdx = 0, deleting = false;
      const typeEl = document.getElementById('typewriter');

      function typeLoop(){
        if(!typeEl) return;
        const current = roles[roleIdx % roles.length];
        if(!deleting) typeEl.textContent = current.slice(0, ++charIdx);
        else typeEl.textContent = current.slice(0, charIdx--);

        let delay = deleting ? 35 : 95; // faster typing as requested
        if(!deleting && charIdx === current.length){ delay = 900; deleting = true; }
        else if(deleting && charIdx === 0){ deleting = false; roleIdx++; delay = 250; }
        setTimeout(typeLoop, delay);
      }
      typeLoop();

      // profile tilt and float interaction
      const profileCard = document.getElementById('profileCard');
      const photoWrap = document.getElementById('photoWrap');
      if(profileCard && photoWrap){
        profileCard.addEventListener('mousemove', function(e){
          const rect = profileCard.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width/2;
          const y = e.clientY - rect.top - rect.height/2;
          const rotateX = (y / (rect.height/2)) * -6;
          const rotateY = (x / (rect.width/2)) * 6;
          photoWrap.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
          photoWrap.classList.add('glow');
        });
        profileCard.addEventListener('mouseleave', function(){
          photoWrap.style.transform = '';
          photoWrap.classList.remove('glow');
        });
      }

      // portfolio filter
      const filterBtns = document.querySelectorAll('.filter-btn');
      const items = document.querySelectorAll('.portfolio-item');
      filterBtns.forEach(btn => btn.addEventListener('click', function(){
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const f = this.dataset.filter;
        items.forEach(it => it.style.display = (f==='all' || it.dataset.category===f) ? 'block' : 'none');
      }));

      // reveal on scroll
      const revealEls = document.querySelectorAll('.reveal');
      function revealOnScroll(){
        const trigger = window.innerHeight * 0.85;
        revealEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          if(rect.top < trigger) el.classList.add('visible');
        });
      }
      window.addEventListener('scroll', revealOnScroll);
      revealOnScroll();

      // animate skill bars when visible (use IntersectionObserver with graceful fallback)
      const skillBars = document.querySelectorAll('.skill-bar > i');

      function runBarAnimation(bar){
        if(bar.dataset.animated) return;
        const target = bar.getAttribute('data-width') || bar.getAttribute('data-percent') || '0%';
        // set initial width to 0 then animate to target
        bar.style.width = '0';
        // also set aria attributes for accessibility
        bar.setAttribute('role','progressbar');
        bar.setAttribute('aria-valuenow', target.replace('%',''));
        setTimeout(() => {
          bar.style.width = target;
          // reveal percent text if present
          const percentEl = bar.querySelector('.percent');
          if(percentEl) percentEl.style.opacity = '1';
          bar.dataset.animated = '1';
        }, 50);
      }

      if('IntersectionObserver' in window){
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if(entry.isIntersecting){
              runBarAnimation(entry.target);
              obs.unobserve(entry.target);
            }
          });
        }, {root: null, rootMargin: '0px 0px -80px 0px', threshold: 0});
        skillBars.forEach(b => io.observe(b));
      } else {
        // fallback: simple on-scroll check
        function fallbackAnimate(){
          skillBars.forEach(b => {
            const rect = b.getBoundingClientRect();
            if(rect.top < window.innerHeight - 80) runBarAnimation(b);
          });
        }
        window.addEventListener('scroll', fallbackAnimate);
        fallbackAnimate();
      }

      // back to top
      const backToTop = document.getElementById('backToTop');
      window.addEventListener('scroll', () => {
        if(window.pageYOffset > 300) backToTop.style.display = 'flex';
        else backToTop.style.display = 'none';
      });
      backToTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

      // smooth internal links
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e){
          const target = this.getAttribute('href');
          if(target && target.startsWith('#') && document.querySelector(target)){
            e.preventDefault();
            const offset = 78;
            const top = document.querySelector(target).getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({top,behavior:'smooth'});
          }
        });
      });

      // basic client-side form validation (FormSubmit handles sending)
      const contactForm = document.getElementById('contactForm');
      if(contactForm){
        contactForm.addEventListener('submit', function(e){
          const name = document.getElementById('name').value.trim();
          const email = document.getElementById('email').value.trim();
          const msg = document.getElementById('message').value.trim();
          if(!name || !email || !msg){
            e.preventDefault();
            alert('Please fill Name, Email and Message');
          }
        });
      }
    });