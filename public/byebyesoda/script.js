// Interactive Calculator & Beta Form Logic for ByeBye Soda
document.addEventListener('DOMContentLoaded', () => {
  // Elements for Calculator
  const cansSlider = document.getElementById('calc-cans');
  const priceSlider = document.getElementById('calc-price');
  const cansValText = document.getElementById('calc-cans-val');
  const priceValText = document.getElementById('calc-price-val');
  const yearlyMoneyText = document.getElementById('calc-yearly-money');
  const yearlySugarText = document.getElementById('calc-yearly-sugar');
  const cubesCountText = document.getElementById('calc-cubes-count');
  const rewardItemText = document.getElementById('calc-reward-item');

  // Grams of sugar in standard 12oz (355ml) soda can (average ~39g)
  const SUGAR_PER_CAN_GRAMS = 39;
  const GRAMS_PER_SUGAR_CUBE = 4; // 1 standard sugar cube = 4g

  // Dynamic reward milestones based on annual savings
  const getRewardEquivalent = (savings) => {
    if (savings < 400) {
      return "That's enough to cover 3 pairs of high-performance running shoes! 👟";
    } else if (savings < 800) {
      return "That pays for an entire year of premium gym membership & wellness classes! 🏋️";
    } else if (savings < 1400) {
      return "That covers a brand new Apple Watch Ultra or a weekend wellness spa getaway! 🏖️";
    } else if (savings < 2200) {
      return "That covers a round-trip vacation flight plus boutique hotel stays! ✈️";
    } else {
      return "That's enough for a state-of-the-art road bike or a full vacation adventure! 🚵";
    }
  };

  function updateCalculator() {
    if (!cansSlider || !priceSlider) return;

    const cans = parseInt(cansSlider.value, 10);
    const price = parseFloat(priceSlider.value);

    // Update slider label tags
    cansValText.textContent = `${cans} ${cans === 1 ? 'can' : 'cans'} / day`;
    priceValText.textContent = `$${price.toFixed(2)} / drink`;

    // Calculations
    const annualMoney = cans * price * 365;
    const annualSugarGrams = cans * SUGAR_PER_CAN_GRAMS * 365;
    const annualSugarKg = annualSugarGrams / 1000;
    const annualCubes = Math.round(annualSugarGrams / GRAMS_PER_SUGAR_CUBE);

    // Render formatted numbers
    yearlyMoneyText.textContent = `$${Math.round(annualMoney).toLocaleString()}`;
    yearlySugarText.textContent = `${annualSugarKg.toFixed(1)} kg`;
    cubesCountText.textContent = `~${annualCubes.toLocaleString()} sugar cubes avoided`;
    rewardItemText.textContent = getRewardEquivalent(annualMoney);
  }

  if (cansSlider && priceSlider) {
    cansSlider.addEventListener('input', updateCalculator);
    priceSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // Beta Waitlist Form Handling
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwEKalgf80Vu7ag71b5oyu8N7lLPjtb-qVUtyBPSgTRbKhYPrKcoRCzzMSvKWT-nnfAxA/exec';
  const waitlistForm = document.getElementById('beta-waitlist-form');
  const waitlistSuccess = document.getElementById('waitlist-success-msg');
  const waitlistInput = document.getElementById('waitlist-email-input');
  const waitlistBtn = waitlistForm ? waitlistForm.querySelector('.waitlist-submit') : null;

  if (waitlistForm && waitlistInput) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = waitlistInput.value.trim();
      if (!email) return;

      const originalBtnText = waitlistBtn ? waitlistBtn.textContent : 'Notify Me';
      if (waitlistBtn) {
        waitlistBtn.disabled = true;
        waitlistBtn.textContent = 'Saving...';
      }

      // 1. Always back up to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('byebyesoda_subscribers') || '[]');
        if (!existing.includes(email)) {
          existing.push(email);
          localStorage.setItem('byebyesoda_subscribers', JSON.stringify(existing));
        }
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }

      // 2. Post to Google Sheet via Apps Script Web App
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Apps Script requires no-cors when called from external origin
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            email: email,
            source: 'ByeBye Soda Website',
            submittedAt: new Date().toISOString()
          })
        });
      } catch (fetchErr) {
        console.warn('Network issue sending to Google Sheet:', fetchErr);
      }

      // 3. Show confirmed success state
      waitlistForm.style.display = 'none';
      if (waitlistSuccess) {
        waitlistSuccess.style.display = 'block';
        waitlistSuccess.innerHTML = `🎉 <strong>You're on the list!</strong> We've saved <em>${email}</em> for early beta access. Keep an eye on your inbox for our invite.`;
      }
    });
  }

  // FAQ Accordion Interaction
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isExpanded = item.classList.contains('active');

      // Close all items
      document.querySelectorAll('.faq-item').forEach((faq) => {
        faq.classList.remove('active');
        const qBtn = faq.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isExpanded) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Mobile navigation menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNavLinks = document.getElementById('main-nav-links');

  if (mobileMenuToggle && mainNavLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenuToggle.classList.toggle('active');
      mainNavLinks.classList.toggle('open');
      document.body.classList.toggle('nav-open', !isExpanded);
    });

    // Close menu when clicking outside or clicking any nav link
    mainNavLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.classList.remove('active');
        mainNavLinks.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // Smooth Scroll with exact gap below sticky header
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 70;
        const gap = 16;
        const elemPosition = targetElem.getBoundingClientRect().top + window.pageYOffset;
        const targetScrollTop = elemPosition - headerHeight - gap;

        window.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });

        history.pushState(null, '', targetId);
      }
    });
  });
});
