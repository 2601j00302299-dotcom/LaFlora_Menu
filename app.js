/* ==========================================================================
   ARECA DIGITAL QR MENU CONTROLLER
   Clean, authentic digital menu matching DOC-20261026-WA0031.pdf
   Includes: Live Search, ScrollSpy, QR Generator, and "My Selection" Shortlist
   ========================================================================== */

(function () {
  'use strict';

  const SELECTION_STORAGE_KEY = 'areca_my_selection';

  const state = {
    searchQuery: '',
    activeSectionId: 'breakfast-menu',
    selection: {} // { [dishName]: { name, price, priceNum, qty } }
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
    downloadStandImgBtn: document.getElementById('downloadStandImgBtn'),
    
    // My Selection Controls
    headerSelectionBtn: document.getElementById('headerSelectionBtn'),
    headerSelectionBadge: document.getElementById('headerSelectionBadge'),
    selectionFloatingBar: document.getElementById('selectionFloatingBar'),
    selectionBadge: document.getElementById('selectionBadge'),
    selectionTotal: document.getElementById('selectionTotal'),
    openSelectionBtn: document.getElementById('openSelectionBtn'),
    selectionModal: document.getElementById('selectionModal'),
    closeSelectionBtn: document.getElementById('closeSelectionBtn'),
    selectionItemsList: document.getElementById('selectionItemsList'),
    selectionEmptyNotice: document.getElementById('selectionEmptyNotice'),
    selectionModalFooter: document.getElementById('selectionModalFooter'),
    selectionFooterTotal: document.getElementById('selectionFooterTotal'),
    clearSelectionBtn: document.getElementById('clearSelectionBtn'),
    closeSelectionFooterBtn: document.getElementById('closeSelectionFooterBtn')
  };

  const MENU_PERMANENT_URL = 'https://menu.lafloraclub.com';

  let qrInstance = null;

  function init() {
    loadSelection();
    renderCategoryNav();
    renderMenu();
    initQrCode();
    setupEventListeners();
    setupScrollSpy();
    updateSelectionUI();
  }

  // Parse numeric price from string (e.g. "₹ 350" -> 350)
  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const clean = String(priceStr).replace(/[^\d]/g, '');
    return parseInt(clean, 10) || 0;
  }

  const SELECTION_STORAGE_KEY = 'areca_my_selection_v2';
  const SELECTION_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours dining session window

  // Load selection from persistent localStorage (survives tab close, phone restart, etc.)
  function loadSelection() {
    try {
      const raw = localStorage.getItem(SELECTION_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        // Verify selection was created within last 6 hours
        if (data && data.timestamp && (Date.now() - data.timestamp < SELECTION_TTL_MS)) {
          state.selection = data.items || {};
        } else {
          // Cleared if older than 6 hours (previous dining session)
          localStorage.removeItem(SELECTION_STORAGE_KEY);
          state.selection = {};
        }
      } else {
        // Fallback check for any legacy session
        const legacy = sessionStorage.getItem('areca_my_selection');
        if (legacy) {
          state.selection = JSON.parse(legacy);
          sessionStorage.removeItem('areca_my_selection');
        }
      }
    } catch (e) {
      state.selection = {};
    }
  }

  // Save selection to persistent localStorage
  function saveSelection() {
    try {
      if (Object.keys(state.selection).length > 0) {
        localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify({
          timestamp: Date.now(),
          items: state.selection
        }));
      } else {
        localStorage.removeItem(SELECTION_STORAGE_KEY);
      }
    } catch (e) {}
    updateSelectionUI();
  }

  function getSelectionStats() {
    let totalItems = 0;
    let totalPrice = 0;
    Object.values(state.selection).forEach(item => {
      totalItems += item.qty;
      totalPrice += (item.priceNum * item.qty);
    });
    return { totalItems, totalPrice };
  }

  function updateSelectionUI() {
    const { totalItems, totalPrice } = getSelectionStats();

    // Header Badge
    if (DOM.headerSelectionBadge) {
      if (totalItems > 0) {
        DOM.headerSelectionBadge.textContent = totalItems;
        DOM.headerSelectionBadge.removeAttribute('hidden');
      } else {
        DOM.headerSelectionBadge.setAttribute('hidden', '');
      }
    }

    // Floating Bottom Bar
    if (DOM.selectionFloatingBar) {
      if (totalItems > 0) {
        DOM.selectionBadge.textContent = totalItems;
        DOM.selectionTotal.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
        DOM.selectionFloatingBar.removeAttribute('hidden');
      } else {
        DOM.selectionFloatingBar.setAttribute('hidden', '');
      }
    }

    // Modal Footer Total
    if (DOM.selectionFooterTotal) {
      DOM.selectionFooterTotal.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
    }
  }

  function addItemToSelection(name, priceStr) {
    if (!state.selection[name]) {
      state.selection[name] = {
        name: name,
        price: priceStr,
        priceNum: parsePrice(priceStr),
        qty: 1
      };
    } else {
      state.selection[name].qty += 1;
    }
    saveSelection();
    renderMenu();
  }

  function updateItemQty(name, delta) {
    if (!state.selection[name]) return;
    state.selection[name].qty += delta;
    if (state.selection[name].qty <= 0) {
      delete state.selection[name];
    }
    saveSelection();
    renderMenu();
    renderSelectionModal();
  }

  function removeItemFromSelection(name) {
    if (state.selection[name]) {
      delete state.selection[name];
      saveSelection();
      renderMenu();
      renderSelectionModal();
    }
  }

  function clearAllSelection() {
    state.selection = {};
    saveSelection();
    renderMenu();
    renderSelectionModal();
  }

  function renderDishSelectAction(item) {
    const sel = state.selection[item.name];
    const qty = sel ? sel.qty : 0;
    if (qty > 0) {
      return `
        <div class="dish-qty-control">
          <button type="button" class="btn-qty-minus" data-action="minus" data-name="${escapeHtml(item.name)}" aria-label="Decrease quantity">−</button>
          <span class="qty-num">${qty}</span>
          <button type="button" class="btn-qty-plus" data-action="plus" data-name="${escapeHtml(item.name)}" aria-label="Increase quantity">+</button>
        </div>
      `;
    }
    return `
      <button type="button" class="btn-add-select" data-action="add" data-name="${escapeHtml(item.name)}" data-price="${escapeHtml(item.price)}" title="Add to My Selection" aria-label="Add ${escapeHtml(item.name)} to My Selection">
        <i class="fa-solid fa-plus"></i>
      </button>
    `;
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
                  <article class="dish-item" data-item-name="${escapeHtml(item.name)}">
                    <div class="dish-header-row">
                      <h3 class="dish-title">${escapeHtml(item.name)}</h3>
                      <div class="dish-price-action">
                        <span class="dish-price">${escapeHtml(item.price)}</span>
                        ${renderDishSelectAction(item)}
                      </div>
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

  function renderSelectionModal() {
    const items = Object.values(state.selection);
    const listEl = DOM.selectionItemsList;
    const emptyNotice = DOM.selectionEmptyNotice;
    const footerEl = DOM.selectionModalFooter;

    if (!listEl) return;

    if (items.length === 0) {
      listEl.innerHTML = '';
      emptyNotice.removeAttribute('hidden');
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    emptyNotice.setAttribute('hidden', '');
    if (footerEl) footerEl.style.display = 'flex';

    listEl.innerHTML = items.map(item => {
      const lineTotal = item.priceNum * item.qty;
      return `
        <div class="selection-item-row">
          <div class="selection-item-info">
            <div class="selection-item-name">${escapeHtml(item.name)}</div>
            <div class="selection-item-rate">${escapeHtml(item.price)} each</div>
          </div>
          <div class="selection-item-right">
            <div class="dish-qty-control">
              <button type="button" class="btn-qty-minus" data-action="minus" data-name="${escapeHtml(item.name)}" aria-label="Decrease quantity">−</button>
              <span class="qty-num">${item.qty}</span>
              <button type="button" class="btn-qty-plus" data-action="plus" data-name="${escapeHtml(item.name)}" aria-label="Increase quantity">+</button>
            </div>
            <span class="selection-item-total">₹${lineTotal.toLocaleString('en-IN')}</span>
            <button type="button" class="btn-remove-item" data-action="remove" data-name="${escapeHtml(item.name)}" title="Remove dish" aria-label="Remove ${escapeHtml(item.name)}">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function openSelectionModal() {
    renderSelectionModal();
    DOM.selectionModal.removeAttribute('hidden');
  }

  function closeSelectionModal() {
    DOM.selectionModal.setAttribute('hidden', '');
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

  // Pure JavaScript Client-Side High-Res Stand Image Download
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
      ctx.strokeStyle = '#9F7B3F';
      ctx.lineWidth = 8;
      ctx.strokeRect(50, 50, w - 100, h - 100);

      ctx.lineWidth = 3;
      ctx.strokeRect(70, 70, w - 140, h - 140);

      // 3. Brand Logo (Areca)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1A1816';
      ctx.font = 'bold 150px "Caveat", "Alex Brush", cursive';
      ctx.fillText('Areca', w / 2, 270);

      // 4. Subtitles
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

      const qrImgSize = 560;
      const qrImgX = (w - qrImgSize) / 2;
      const qrImgY = qrCardY + (qrCardSize - qrImgSize) / 2;
      ctx.drawImage(qrEl, qrImgX, qrImgY, qrImgSize, qrImgSize);

      // 7. Instruction text
      ctx.fillStyle = '#1A1816';
      ctx.font = 'bold 38px "Montserrat", sans-serif';
      ctx.fillText('Scan with phone camera to view menu', w / 2, 1200);

      // 8. Divider Line
      ctx.beginPath();
      ctx.moveTo(250, 1260);
      ctx.lineTo(w - 250, 1260);
      ctx.stroke();

      // 9. Contact Info
      ctx.fillStyle = '#2C2A26';
      ctx.font = '600 34px "Montserrat", sans-serif';
      ctx.fillText('Areca, La Flora, Ville Flora', w / 2, 1340);

      ctx.fillStyle = '#7A551E';
      ctx.font = 'bold 40px "Montserrat", sans-serif';
      ctx.fillText('Enquiries: 97379 82028', w / 2, 1410);

      // 10. Thank You Script Logo
      ctx.fillStyle = '#1A1816';
      ctx.font = 'bold 90px "Caveat", "Alex Brush", cursive';
      ctx.fillText('Thank you for dining with us', w / 2, 1550);

      // 11. Trigger Download
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

    // Delegated Clicks for Dish Add/Minus/Plus in Menu Container
    DOM.menuSectionsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');

      if (action === 'add') {
        addItemToSelection(name, price);
      } else if (action === 'plus') {
        updateItemQty(name, 1);
      } else if (action === 'minus') {
        updateItemQty(name, -1);
      }
    });

    // Delegated Clicks inside My Selection Modal list
    if (DOM.selectionItemsList) {
      DOM.selectionItemsList.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const name = btn.getAttribute('data-name');

        if (action === 'plus') {
          updateItemQty(name, 1);
        } else if (action === 'minus') {
          updateItemQty(name, -1);
        } else if (action === 'remove') {
          removeItemFromSelection(name);
        }
      });
    }

    // Header Selection button & Floating bar button
    if (DOM.headerSelectionBtn) {
      DOM.headerSelectionBtn.addEventListener('click', openSelectionModal);
    }
    if (DOM.openSelectionBtn) {
      DOM.openSelectionBtn.addEventListener('click', openSelectionModal);
    }

    // Selection Modal close & clear actions
    if (DOM.closeSelectionBtn) {
      DOM.closeSelectionBtn.addEventListener('click', closeSelectionModal);
    }
    if (DOM.closeSelectionFooterBtn) {
      DOM.closeSelectionFooterBtn.addEventListener('click', closeSelectionModal);
    }
    if (DOM.clearSelectionBtn) {
      DOM.clearSelectionBtn.addEventListener('click', clearAllSelection);
    }
    if (DOM.selectionModal) {
      DOM.selectionModal.addEventListener('click', (e) => {
        if (e.target === DOM.selectionModal) closeSelectionModal();
      });
    }

    // Info & QR Modals
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
        if (DOM.selectionModal) closeSelectionModal();
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
