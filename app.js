/* ==========================================================================
   ARECA DIGITAL QR MENU CONTROLLER
   Clean, authentic digital menu matching DOC-20261026-WA0031.pdf
   Pure frontend implementation (Zero Python dependency)
   ========================================================================== */

(function () {
  'use strict';

  const state = {
    searchQuery: '',
    activeSectionId: 'breakfast-menu'
  };

  const DOM = {
    menuSearchInput: document.getElementById('menuSearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    categoryNavScroll: document.getElementById('categoryNavScroll'),
    menuSectionsContainer: document.getElementById('menuSectionsContainer'),
    searchFeedback: document.getElementById('searchFeedback'),
    searchCount: document.getElementById('searchCount'),
    resetSearchBtn: document.getElementById('resetSearchBtn'),
    emptyState: document.getElementById('emptyState'),
    emptyClearBtn: document.getElementById('emptyClearBtn'),
    infoModalBtn: document.getElementById('infoModalBtn'),
    infoModal: document.getElementById('infoModal'),
    closeInfoBtn: document.getElementById('closeInfoBtn'),
    qrModalBtn: document.getElementById('qrModalBtn'),
    qrModal: document.getElementById('qrModal'),
    closeQrBtn: document.getElementById('closeQrBtn'),
    qrCanvas: document.getElementById('qrCanvas'),
    printStandBtn: document.getElementById('printStandBtn'),
    downloadStandImgBtn: document.getElementById('downloadStandImgBtn')
  };

  const MENU_PERMANENT_URL = 'https://menu.lafloraclub.com';

  let qrInstance = null;

  function init() {
    renderCategoryNav();
    renderMenu();
    initQrCode();
    setupEventListeners();
    setupScrollSpy();
  }

  // ScrollSpy: Automatically highlight and center active category while scrolling
  function setupScrollSpy() {
    const sections = document.querySelectorAll('.menu-section-block');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('sec-', '');
          DOM.categoryNavScroll.querySelectorAll('.cat-nav-link').forEach(link => {
            const isActive = link.getAttribute('data-target') === id;
            link.classList.toggle('active', isActive);
            if (isActive) {
              link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          });
        }
      });
    }, {
      rootMargin: '-130px 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
  }

  function renderCategoryNav() {
    let html = '';
    MENU_SECTIONS.forEach((sec, idx) => {
      const activeClass = idx === 0 ? 'active' : '';
      html += `
        <button class="cat-nav-link ${activeClass}" data-target="${sec.id}" type="button">
          ${escapeHtml(sec.title)}
        </button>
      `;
    });
    DOM.categoryNavScroll.innerHTML = html;
  }

  function renderMenu() {
    const q = state.searchQuery.toLowerCase().trim();
    let totalMatches = 0;
    let html = '';

    MENU_SECTIONS.forEach(sec => {
      const matchingItems = sec.items.filter(item => {
        if (!q) return true;
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.desc ? item.desc.toLowerCase().includes(q) : false;
        return matchName || matchDesc;
      });

      if (matchingItems.length > 0) {
        totalMatches += matchingItems.length;

        html += `
          <section class="menu-section-block" id="sec-${sec.id}">
            <div class="section-header-wrap">
              <h2 class="section-script-title">${escapeHtml(sec.title)}</h2>
              ${sec.timing ? `<div class="section-timing">${escapeHtml(sec.timing)}</div>` : ''}
            </div>

            <div class="section-content-layout">
              <div class="dishes-list">
                ${matchingItems.map(item => `
                  <article class="dish-item">
                    <div class="dish-header-row">
                      <h3 class="dish-title">${escapeHtml(item.name)}</h3>
                      <span class="dish-price">${escapeHtml(item.price)}</span>
                    </div>
                    ${item.desc ? `<p class="dish-description">${escapeHtml(item.desc)}</p>` : ''}
                  </article>
                `).join('')}
              </div>
            </div>
          </section>
        `;
      }
    });

    DOM.menuSectionsContainer.innerHTML = html;

    // Handle Search Feedback
    if (q) {
      DOM.searchFeedback.style.display = 'flex';
      DOM.searchCount.textContent = `Showing ${totalMatches} item${totalMatches === 1 ? '' : 's'} matching "${q}"`;
    } else {
      DOM.searchFeedback.style.display = 'none';
    }

    if (totalMatches === 0) {
      DOM.emptyState.style.display = 'block';
    } else {
      DOM.emptyState.style.display = 'none';
    }

    setupScrollSpy();
  }

  // Generate QR Code Linking to Menu (Hardcoded Permanent Link)
  function initQrCode() {
    DOM.qrCanvas.innerHTML = '';
    if (window.QRCode) {
      qrInstance = new QRCode(DOM.qrCanvas, {
        text: MENU_PERMANENT_URL,
        width: 155,
        height: 155,
        colorDark: "#1A1816",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  }

  function printStand() {
    window.print();
  }

  // Pure JavaScript Client-Side High-Res Stand Image Download (Zero Python dependency)
  function downloadStandImage() {
    try {
      const qrEl = DOM.qrCanvas.querySelector('img') || DOM.qrCanvas.querySelector('canvas');
      if (!qrEl) {
        alert('QR code is still preparing. Please try again in a second.');
        return;
      }

      // High-resolution canvas for crisp print quality (300 DPI)
      const canvas = document.createElement('canvas');
      const w = 1200;
      const h = 1800;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      // 1. Background (Authentic warm ivory)
      ctx.fillStyle = '#FAF8F2';
      ctx.fillRect(0, 0, w, h);

      // 2. Double Luxury Gold Border
      // Outer border
      ctx.strokeStyle = '#9F7B3F';
      ctx.lineWidth = 8;
      ctx.strokeRect(50, 50, w - 100, h - 100);

      // Inner border
      ctx.lineWidth = 3;
      ctx.strokeRect(70, 70, w - 140, h - 140);

      // 3. Brand Logo (Areca) - Dark charcoal, cursive
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1A1816';
      ctx.font = 'bold 150px "Caveat", "Alex Brush", cursive';
      ctx.fillText('Areca', w / 2, 270);

      // 4. Subtitles (High contrast bold)
      ctx.fillStyle = '#7A551E';
      ctx.font = 'bold 36px "Montserrat", sans-serif';
      ctx.fillText('THE CULINARY DESTINATION', w / 2, 345);

      ctx.fillStyle = '#3E3A33';
      ctx.font = '600 28px "Montserrat", sans-serif';
      ctx.fillText('BY LA-FLORA', w / 2, 395);

      // 5. Divider Line
      ctx.strokeStyle = '#9F7B3F';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(250, 440);
      ctx.lineTo(w - 250, 440);
      ctx.stroke();

      // 6. QR Code Card Container
      const qrCardSize = 640;
      const qrCardX = (w - qrCardSize) / 2;
      const qrCardY = 480;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(qrCardX, qrCardY, qrCardSize, qrCardSize);
      ctx.strokeStyle = '#9F7B3F';
      ctx.lineWidth = 3;
      ctx.strokeRect(qrCardX, qrCardY, qrCardSize, qrCardSize);

      // Draw QR image centered
      const qrImgSize = 560;
      const qrImgX = (w - qrImgSize) / 2;
      const qrImgY = qrCardY + (qrCardSize - qrImgSize) / 2;
      ctx.drawImage(qrEl, qrImgX, qrImgY, qrImgSize, qrImgSize);

      // 7. Instruction text (Bold dark charcoal)
      ctx.fillStyle = '#1A1816';
      ctx.font = 'bold 38px "Montserrat", sans-serif';
      ctx.fillText('Scan with phone camera to view menu', w / 2, 1200);

      // 8. Divider Line
      ctx.beginPath();
      ctx.moveTo(250, 1260);
      ctx.lineTo(w - 250, 1260);
      ctx.stroke();

      // 9. Contact Info (Crisp bold)
      ctx.fillStyle = '#2C2A26';
      ctx.font = '600 34px "Montserrat", sans-serif';
      ctx.fillText('Areca, La Flora, Ville Flora', w / 2, 1340);

      ctx.fillStyle = '#7A551E';
      ctx.font = 'bold 40px "Montserrat", sans-serif';
      ctx.fillText('Enquiries: 97379 82028', w / 2, 1410);

      // 10. Thank You Script Logo (Cursive)
      ctx.fillStyle = '#1A1816';
      ctx.font = 'bold 90px "Caveat", "Alex Brush", cursive';
      ctx.fillText('Thank you for dining with us', w / 2, 1550);

      // 11. Trigger Download directly in browser
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Areca_Table_Stand_HD.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, 'image/png');

    } catch (err) {
      console.error('Error generating stand image:', err);
      // Fallback to print
      window.print();
    }
  }

  function setupEventListeners() {
    // Search Input
    DOM.menuSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      DOM.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderMenu();
    });

    DOM.clearSearchBtn.addEventListener('click', () => {
      DOM.menuSearchInput.value = '';
      state.searchQuery = '';
      DOM.clearSearchBtn.style.display = 'none';
      renderMenu();
    });

    DOM.resetSearchBtn.addEventListener('click', clearSearch);
    DOM.emptyClearBtn.addEventListener('click', clearSearch);

    // Category Nav Click
    DOM.categoryNavScroll.addEventListener('click', (e) => {
      const link = e.target.closest('.cat-nav-link');
      if (!link) return;

      DOM.categoryNavScroll.querySelectorAll('.cat-nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetId = link.getAttribute('data-target');
      const targetEl = document.getElementById(`sec-${targetId}`);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Modals
    DOM.infoModalBtn.addEventListener('click', () => DOM.infoModal.removeAttribute('hidden'));
    DOM.closeInfoBtn.addEventListener('click', () => DOM.infoModal.setAttribute('hidden', ''));
    DOM.infoModal.addEventListener('click', (e) => {
      if (e.target === DOM.infoModal) DOM.infoModal.setAttribute('hidden', '');
    });

    DOM.qrModalBtn.addEventListener('click', () => DOM.qrModal.removeAttribute('hidden'));
    DOM.closeQrBtn.addEventListener('click', () => DOM.qrModal.setAttribute('hidden', ''));
    DOM.qrModal.addEventListener('click', (e) => {
      if (e.target === DOM.qrModal) DOM.qrModal.setAttribute('hidden', '');
    });

    if (DOM.printStandBtn) {
      DOM.printStandBtn.addEventListener('click', printStand);
    }
    if (DOM.downloadStandImgBtn) {
      DOM.downloadStandImgBtn.addEventListener('click', downloadStandImage);
    }

    // Keyboard ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        DOM.infoModal.setAttribute('hidden', '');
        DOM.qrModal.setAttribute('hidden', '');
      }
    });
  }

  function clearSearch() {
    DOM.menuSearchInput.value = '';
    state.searchQuery = '';
    DOM.clearSearchBtn.style.display = 'none';
    renderMenu();
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
