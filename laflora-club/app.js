/**
 * LA FLORA CLUB - OFFICIAL JAVASCRIPT CONTROLLER
 * Timeless Memories • Ville Flora
 */

document.addEventListener('DOMContentLoaded', () => {
  const CLUB_PHONE = '919737982028';

  // 1. Footer Year
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Scroll Effect
  const siteHeader = document.getElementById('siteHeader');
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileDrawer.hidden = isExpanded;
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.hidden = true;
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Inquiry Modal Controller
  const inquiryModal = document.getElementById('inquiryModal');
  const openInquiryModalBtn = document.getElementById('openInquiryModalBtn');
  const closeInquiryModalBtn = document.getElementById('closeInquiryModalBtn');
  const modalServiceSelect = document.getElementById('mService');

  const openModal = (serviceName) => {
    if (!inquiryModal) return;
    if (modalServiceSelect && serviceName) {
      for (let i = 0; i < modalServiceSelect.options.length; i++) {
        if (modalServiceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
            modalServiceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
          modalServiceSelect.selectedIndex = i;
          break;
        }
      }
    }
    inquiryModal.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!inquiryModal) return;
    inquiryModal.hidden = true;
    document.body.style.overflow = '';
  };

  if (openInquiryModalBtn) {
    openInquiryModalBtn.addEventListener('click', () => openModal());
  }

  if (closeInquiryModalBtn) {
    closeInquiryModalBtn.addEventListener('click', closeModal);
  }

  // Cards inquiry triggers
  const triggerInquiryBtns = document.querySelectorAll('.trigger-inquiry');
  triggerInquiryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const service = e.currentTarget.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (inquiryModal) {
    inquiryModal.addEventListener('click', (e) => {
      if (e.target === inquiryModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && inquiryModal && !inquiryModal.hidden) {
      closeModal();
    }
  });

  // 5. Main Contact Page Inquiry Form -> Direct WhatsApp Concierge
  const contactForm = document.getElementById('contactInquiryForm');
  const formStatusMsg = document.getElementById('formStatusMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName').value.trim();
      const phone = document.getElementById('cPhone').value.trim();
      const service = document.getElementById('cService').value;
      const notes = document.getElementById('cNotes').value.trim();

      if (!name || !phone) {
        showStatus(formStatusMsg, 'Please enter your name and phone number.', false);
        return;
      }

      const messageText = `*La Flora Club - Inquiry*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Service:* ${encodeURIComponent(service)}%0A` +
        (notes ? `*Notes:* ${encodeURIComponent(notes)}%0A` : '') +
        `%0A_Sent via lafloraclub.com_`;

      showStatus(formStatusMsg, 'Connecting you to our concierge on WhatsApp...', true);

      setTimeout(() => {
        window.open(`https://wa.me/${CLUB_PHONE}?text=${messageText}`, '_blank');
        contactForm.reset();
      }, 600);
    });
  }

  // 6. Modal Inquiry Form
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mName').value.trim();
      const phone = document.getElementById('mPhone').value.trim();
      const service = document.getElementById('mService').value;
      const notes = document.getElementById('mNotes').value.trim();

      if (!name || !phone) {
        alert('Please fill in your name and phone number.');
        return;
      }

      const messageText = `*La Flora Club - Booking Request*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Service:* ${encodeURIComponent(service)}%0A` +
        (notes ? `*Notes:* ${encodeURIComponent(notes)}%0A` : '') +
        `%0A_Sent via lafloraclub.com_`;

      closeModal();
      window.open(`https://wa.me/${CLUB_PHONE}?text=${messageText}`, '_blank');
      modalForm.reset();
    });
  }

  function showStatus(el, msg, isSuccess) {
    if (!el) return;
    el.hidden = false;
    el.className = `form-status-msg ${isSuccess ? 'success' : 'error'}`;
    el.textContent = msg;
  }
});
