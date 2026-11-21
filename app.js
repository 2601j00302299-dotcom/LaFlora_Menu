/* ==========================================================================
   ARECA DIGITAL QR MENU CONTROLLER
   Clean, authentic digital menu matching DOC-20261026-WA0031.pdf
   Includes: Live Search, ScrollSpy, QR Generator, and "My Selection" Shortlist
   ========================================================================== */

(function () {
  'use strict';

  const state = {
    searchQuery: '',
    activeSectionId: 'breakfast-menu',
    selection: {} // { [dishName]: { name, price, priceNum, qty } }
  };

  const DOM = {
    appHeader: document.getElementById('appHeader'),
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
    closeSelectionFooterBtn: document.getElementById('closeSelectionFooterBtn'),

    // Slide-out Drawer Controls (3-Line Luxury Menu)
    menuDrawerBtn: document.getElementById('menuDrawerBtn'),
    menuDrawer: document.getElementById('menuDrawer'),
    closeDrawerBtn: document.getElementById('closeDrawerBtn'),
    drawerSelectionBtn: document.getElementById('drawerSelectionBtn'),
    drawerSelectionBadge: document.getElementById('drawerSelectionBadge'),
    drawerSelectionDesc: document.getElementById('drawerSelectionDesc'),
    drawerTimingsBtn: document.getElementById('drawerTimingsBtn')
  };

  const MENU_PERMANENT_URL = 'https://menu.lafloraclub.com';

  let qrInstance = null;

  function init() {
    initSplashScreen();
    loadSelection();
    renderCategoryNav();
    renderMenu();
    initQrCode();
    setupEventListeners();
    setupScrollSpy();
    setupHeaderScroll();
    updateSelectionUI();
  }

  // Luxury Brand Intro Splash Screen (La-Flora & Areca)
  function initSplashScreen() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    let dismissed = false;
    function dismissSplash() {
      if (dismissed) return;
      dismissed = true;
      splash.classList.add('splash-hidden');
      setTimeout(() => {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 500);
    }

    // Instant skip on tap/click
    splash.addEventListener('click', dismissSplash);
    splash.addEventListener('touchstart', dismissSplash, { passive: true });

    // Smooth automatic reveal after 1.25s
    setTimeout(dismissSplash, 1250);
  }

  // Micro-haptic tactile feedback for mobile taps
  function triggerHaptic() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(12); } catch (e) { }
    }
  }

  // Auto-compact header on downward scroll (frees up viewing area on mobile)
  function setupHeaderScroll() {
    if (!DOM.appHeader) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 90) {
        DOM.appHeader.classList.add('header-compact');
      } else {
        DOM.appHeader.classList.remove('header-compact');
      }
    }, { passive: true });
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
    } catch (e) { }
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

    // Drawer Selection Badge & Description
    if (DOM.drawerSelectionBadge) {
      if (totalItems > 0) {
        DOM.drawerSelectionBadge.textContent = totalItems;
        DOM.drawerSelectionBadge.removeAttribute('hidden');
      } else {
        DOM.drawerSelectionBadge.setAttribute('hidden', '');
      }
    }
    if (DOM.drawerSelectionDesc) {
      if (totalItems > 0) {
        DOM.drawerSelectionDesc.textContent = `${totalItems} ${totalItems === 1 ? 'dish' : 'dishes'} • ₹${totalPrice.toLocaleString('en-IN')}`;
      } else {
        DOM.drawerSelectionDesc.textContent = 'View shortlisted dishes & total';
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
    triggerHaptic();
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
    triggerHaptic();
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


  const SWIRL_SVG_HTML = `<svg class="swirl-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.39 315.58" preserveAspectRatio="none">
    <path d="M 38.55 315.01 C 34.18 310.43, 32.24 304.32, 32.01 298.08 C 31.75 291.52, 33.11 284.95, 35.00 278.70 C 37.06 271.84, 39.87 265.23, 41.71 258.30 C 43.52 251.49, 44.64 244.21, 43.07 237.24 C 41.75 231.39, 38.46 226.45, 34.03 222.49 C 29.96 218.85, 25.26 216.02, 20.66 213.11 C 16.14 210.25, 11.55 207.30, 7.89 203.36 C 3.81 198.98, 1.33 193.39, 1.43 187.35 C 1.53 180.24, 4.88 173.59, 8.88 167.90 C 13.13 161.86, 18.37 156.40, 23.91 151.54 C 28.97 147.11, 35.36 143.30, 42.31 145.10 C 45.16 145.84, 47.79 147.53, 49.19 150.17 C 50.56 152.75, 50.35 155.79, 49.08 158.37 C 47.80 160.98, 45.58 163.13, 42.98 164.41 C 40.19 165.79, 37.12 165.91, 34.17 165.00 C 28.03 163.09, 23.66 157.30, 21.87 151.32 C 19.48 143.36, 21.10 134.81, 22.67 126.86 C 24.34 118.37, 26.03 109.88, 27.72 101.39 C 29.40 92.93, 31.20 84.48, 32.72 75.99 C 34.08 68.36, 34.91 60.26, 32.32 52.79 C 30.31 46.99, 26.29 41.57, 20.41 39.30 C 15.51 37.41, 9.51 38.42, 5.43 41.72 C 3.49 43.30, 2.06 45.43, 1.47 47.87 C 1.43 48.02, 1.54 48.18, 1.70 48.18 C 10.17 47.85, 18.21 43.29, 23.12 36.42 C 28.17 29.35, 29.19 20.17, 26.38 12.00 C 24.81 7.47, 22.11 3.33, 18.47 0.20 C 18.23 0.00, 17.89 0.34, 18.13 0.54 C 24.52 6.03, 27.92 14.58, 27.41 22.96 C 26.88 31.44, 22.00 39.04, 14.86 43.54 C 10.92 46.03, 6.37 47.52, 1.70 47.70 C 1.77 47.80, 1.85 47.90, 1.93 48.00 C 3.30 42.38, 9.01 39.10, 14.51 38.86 C 21.03 38.57, 26.54 42.80, 29.71 48.23 C 33.64 54.93, 34.00 62.82, 33.10 70.36 C 32.57 74.73, 31.66 79.05, 30.81 83.36 C 29.95 87.69, 29.09 92.03, 28.23 96.36 C 26.52 104.98, 24.81 113.60, 23.10 122.23 C 21.48 130.39, 19.40 138.82, 20.52 147.19 C 21.36 153.53, 24.46 159.76, 29.86 163.42 C 32.29 165.07, 35.24 166.15, 38.20 166.10 C 41.03 166.04, 43.74 164.86, 45.91 163.09 C 50.15 159.60, 52.39 153.35, 48.76 148.62 C 45.12 143.87, 38.10 143.25, 32.83 145.24 C 29.46 146.52, 26.51 148.65, 23.81 150.99 C 21.05 153.40, 18.42 155.98, 15.91 158.65 C 10.90 163.97, 6.22 169.89, 3.36 176.67 C 0.74 182.89, 0.00 189.83, 2.62 196.18 C 4.62 201.03, 8.28 204.87, 12.38 208.04 C 16.77 211.44, 21.62 214.19, 26.25 217.24 C 30.81 220.25, 35.31 223.62, 38.51 228.12 C 42.63 233.93, 43.80 241.03, 43.15 248.02 C 42.45 255.62, 39.96 262.97, 37.41 270.12 C 35.15 276.48, 32.99 282.85, 32.03 289.56 C 31.15 295.71, 31.16 302.23, 33.52 308.07 C 34.61 310.78, 36.20 313.24, 38.21 315.35 Z" fill="#1A1A17" stroke="#1A1A17" stroke-width="0.75"/>
  </svg>`;
  const SEARCH_SYNONYMS = {
    'dessert': ['sweet and dessert', 'sweet-and-dessert', 'dessert', 'desserts', 'ice cream', 'gulab jamun', 'brownie', 'halwa', 'kulfi', 'tiramisu'],
    'desserts': ['sweet and dessert', 'sweet-and-dessert', 'dessert', 'desserts', 'ice cream', 'gulab jamun', 'brownie', 'halwa', 'kulfi', 'tiramisu'],
    'sweet': ['sweet and dessert', 'sweet-and-dessert', 'dessert', 'halwa', 'gulab jamun', 'brownie', 'kulfi'],
    'sweets': ['sweet and dessert', 'sweet-and-dessert', 'dessert', 'desserts', 'halwa', 'gulab jamun', 'brownie', 'kulfi'],
    'soup': ['soup & shorba', 'shorba', 'soup', 'thukpa', 'manchow', 'hot & sour'],
    'soups': ['soup & shorba', 'shorba', 'soup', 'thukpa', 'manchow', 'hot & sour'],
    'starter': ['starters', 'oriental-starters', 'western-starters', 'tikka', 'kebab', 'manchurian'],
    'starters': ['starters', 'oriental-starters', 'western-starters', 'tikka', 'kebab', 'manchurian'],
    'drinks': ['refreshing-beverages', 'refreshing beverages', 'beverage', 'mocktail', 'shake', 'cold coffee', 'smoothie', 'mojito', 'cooler', 'soda'],
    'drink': ['refreshing-beverages', 'refreshing beverages', 'beverage', 'mocktail', 'shake', 'cold coffee', 'smoothie', 'mojito', 'cooler', 'soda'],
    'beverage': ['refreshing-beverages', 'refreshing beverages', 'beverage', 'mocktail', 'shake'],
    'beverages': ['refreshing-beverages', 'refreshing beverages', 'beverages', 'mocktail', 'shake'],
    'chinese': ['oriental-express', 'oriental express', 'oriental-starters', 'oriental starters', 'noodles', 'fried rice', 'manchurian', 'spring roll'],
    'italian': ['italian delicious', 'pasta', 'pizza', 'bruschetta'],
    'bread': ['tandoor delights', 'roti', 'naan', 'kulcha', 'paratha'],
    'breads': ['tandoor delights', 'roti', 'naan', 'kulcha', 'paratha'],
    'rice': ['shahi handi chawal', 'biryani', 'pulao', 'steamed rice', 'jeera rice', 'curd rice', 'fried rice']
  };

  function termMatchesBlob(blob, term) {
    if (term.length <= 3) {
      const reg = new RegExp('\\b' + term + '\\b', 'i');
      return reg.test(blob);
    }
    return blob.includes(term);
  }

  function highlightSearchTerms(text, tokens) {
    if (!text) return '';
    let escaped = escapeHtml(text);
    if (!tokens || tokens.length === 0) return escaped;
    tokens.forEach(tok => {
      if (tok.length < 2) return;
      const safeTok = escapeHtml(tok).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp(`(${safeTok})`, 'gi');
      escaped = escaped.replace(reg, '<mark class="search-highlight">$1</mark>');
    });
    return escaped;
  }

  function renderMenu() {
    const q = state.searchQuery.toLowerCase().trim();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    let totalMatches = 0;
    let html = '';

    // Hide hero cover when searching so matches appear immediately at the top
    const coverHeroEl = document.querySelector('.cover-hero');
    if (coverHeroEl) {
      coverHeroEl.style.display = q ? 'none' : '';
    }

    MENU_SECTIONS.forEach(sec => {
      const matchingItems = sec.items.filter(item => {
        if (!q) return true;

        const searchBlob = [
          item.name,
          item.desc || '',
          item.subheading || '',
          sec.title,
          sec.parentTitle || '',
          sec.gutterLabel || sec.categoryNote || '',
          sec.id
        ].join(' ').toLowerCase();

        return tokens.every(token => {
          if (termMatchesBlob(searchBlob, token)) return true;
          if (token.endsWith('s') && termMatchesBlob(searchBlob, token.slice(0, -1))) return true;
          if (token.endsWith('es') && termMatchesBlob(searchBlob, token.slice(0, -2))) return true;
          const syns = SEARCH_SYNONYMS[token];
          if (syns && syns.some(s => termMatchesBlob(searchBlob, s))) return true;
          return false;
        });
      });

      if (matchingItems.length > 0) {
        totalMatches += matchingItems.length;

        html += `
          <section class="menu-section-block" id="sec-${sec.id}">
            <div class="section-header-wrap">
              <h2 class="section-script-title">${escapeHtml(sec.parentTitle || sec.title)}</h2>
              ${sec.timing ? `<div class="section-timing">${escapeHtml(sec.timing).replace(/\n/g, '<br>')}</div>` : ''}
            </div>

            <div class="section-page-body">
              ${sec.gutterTop && sec.gutterBottom ? `
                <div class="section-left-gutter gutter-split" aria-hidden="true">
                  <div class="rotated-side-label gutter-label-top">${escapeHtml(sec.gutterTop)}</div>
                  <div class="gutter-swirl">${SWIRL_SVG_HTML}</div>
                  <div class="rotated-side-label gutter-label-bottom">${escapeHtml(sec.gutterBottom)}</div>
                </div>
              ` : `
                <div class="section-left-gutter gutter-single" aria-hidden="true">
                  <div class="gutter-swirl">${SWIRL_SVG_HTML}</div>
                  <div class="rotated-side-label gutter-label-bottom">${escapeHtml(sec.gutterLabel || sec.categoryNote || sec.title)}</div>
                </div>
              `}

              <div class="section-items-col">
                <div class="dishes-list">
                  ${matchingItems.map(item => `
                    ${item.subheading ? `<div class="dishes-subheading" ${item.subheadingId ? `id="${item.subheadingId}"` : ''}>${escapeHtml(item.subheading)}</div>` : ''}
                    <article class="dish-item" data-item-name="${escapeHtml(item.name)}">
                      <div class="dish-header-row">
                        <h3 class="dish-title">${highlightSearchTerms(item.name, tokens)}</h3>
                        <div class="dish-price-action">
                          <span class="dish-price">${escapeHtml(item.price)}</span>
                          ${renderDishSelectAction(item)}
                        </div>
                      </div>
                      ${item.desc ? `<p class="dish-description">${highlightSearchTerms(item.desc, tokens).replace(/\n/g, '<br>')}</p>` : ''}
                    </article>
                  `).join('')}
                </div>
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
      DOM.searchCount.innerHTML = `Showing <strong>${totalMatches}</strong> dish${totalMatches === 1 ? '' : 'es'} matching "<strong>${escapeHtml(q)}</strong>"`;
    } else {
      DOM.searchFeedback.style.display = 'none';
    }

    if (totalMatches === 0) {
      DOM.emptyState.style.display = 'block';
      const emptyQueryEl = document.getElementById('emptySearchQuery');
      if (emptyQueryEl) emptyQueryEl.textContent = q;
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
    if (!DOM.qrCanvas) return;
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
      ctx.fillStyle = '#F4F4EA';
      ctx.fillRect(0, 0, w, h);

      // 2. Double Luxury Gold Border
      ctx.strokeStyle = '#A37433';
      ctx.lineWidth = 8;
      ctx.strokeRect(50, 50, w - 100, h - 100);

      ctx.lineWidth = 3;
      ctx.strokeRect(70, 70, w - 140, h - 140);

      // 3. Brand Logo (Areca)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1A1816';
      ctx.font = 'bold 160px "High Empathy", cursive';
      ctx.fillText('Areca', w / 2, 270);

      // 4. Subtitles
      ctx.fillStyle = '#A37433';
      ctx.font = 'bold 36px "Laila", serif';
      ctx.fillText('THE CULINARY DESTINATION', w / 2, 345);

      ctx.fillStyle = '#3E3A33';
      ctx.font = '600 28px "Laila", serif';
      ctx.fillText('BY LA-FLORA', w / 2, 395);

      // 5. Divider Line
      ctx.strokeStyle = '#A37433';
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
      ctx.strokeStyle = '#A37433';
      ctx.lineWidth = 3;
      ctx.strokeRect(qrCardX, qrCardY, qrCardSize, qrCardSize);

      const qrImgSize = 560;
      const qrImgX = (w - qrImgSize) / 2;
      const qrImgY = qrCardY + (qrCardSize - qrImgSize) / 2;
      ctx.drawImage(qrEl, qrImgX, qrImgY, qrImgSize, qrImgSize);

      // 7. Instruction text
      ctx.fillStyle = '#1A1816';
      ctx.font = 'bold 38px "Laila", serif';
      ctx.fillText('Scan with phone camera to view menu', w / 2, 1200);

      // 8. Divider Line
      ctx.beginPath();
      ctx.moveTo(250, 1260);
      ctx.lineTo(w - 250, 1260);
      ctx.stroke();

      // 9. Contact Info
      ctx.fillStyle = '#2C2A26';
      ctx.font = '600 34px "Laila", serif';
      ctx.fillText('Areca, La Flora, Ville Flora', w / 2, 1340);

      ctx.fillStyle = '#A37433';
      ctx.font = 'bold 40px "Laila", serif';
      ctx.fillText('Enquiries: 97379 82028', w / 2, 1410);

      // 10. Thank You Script Logo
      ctx.fillStyle = '#1A1816';
      ctx.font = 'bold 96px "High Empathy", cursive';
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
    DOM.menuSearchInput.addEventListener('focus', () => {
      if (window.scrollY > 80) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    DOM.menuSearchInput.addEventListener('input', (e) => {
      const prevQuery = state.searchQuery;
      state.searchQuery = e.target.value;
      DOM.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderMenu();

      // If user starts searching from middle/end of the page, smoothly scroll to top
      if (state.searchQuery && (!prevQuery || window.scrollY > 100)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    DOM.clearSearchBtn.addEventListener('click', () => {
      clearSearch();
      DOM.menuSearchInput.focus();
    });

    DOM.resetSearchBtn.addEventListener('click', clearSearch);
    if (DOM.emptyClearBtn) DOM.emptyClearBtn.addEventListener('click', clearSearch);

    // Category Nav Click
    DOM.categoryNavScroll.addEventListener('click', (e) => {
      const link = e.target.closest('.cat-nav-link');
      if (!link) return;

      const targetId = link.getAttribute('data-target');

      // If user clicks a category while search is active, clear search to show category
      if (state.searchQuery) {
        clearSearch();
      }

      DOM.categoryNavScroll.querySelectorAll('.cat-nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

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

    // Slide-out 3-Line Luxury Drawer Controls
    if (DOM.menuDrawerBtn && DOM.menuDrawer) {
      DOM.menuDrawerBtn.addEventListener('click', () => {
        triggerHaptic();
        DOM.menuDrawer.removeAttribute('hidden');
      });
    }
    if (DOM.closeDrawerBtn && DOM.menuDrawer) {
      DOM.closeDrawerBtn.addEventListener('click', () => {
        DOM.menuDrawer.setAttribute('hidden', '');
      });
    }
    if (DOM.menuDrawer) {
      DOM.menuDrawer.addEventListener('click', (e) => {
        if (e.target === DOM.menuDrawer) DOM.menuDrawer.setAttribute('hidden', '');
      });
    }
    if (DOM.drawerSelectionBtn) {
      DOM.drawerSelectionBtn.addEventListener('click', () => {
        if (DOM.menuDrawer) DOM.menuDrawer.setAttribute('hidden', '');
        openSelectionModal();
      });
    }
    if (DOM.drawerTimingsBtn) {
      DOM.drawerTimingsBtn.addEventListener('click', () => {
        if (DOM.menuDrawer) DOM.menuDrawer.setAttribute('hidden', '');
        if (DOM.infoModal) DOM.infoModal.removeAttribute('hidden');
      });
    }

    // Info Modal
    if (DOM.infoModalBtn && DOM.infoModal) {
      DOM.infoModalBtn.addEventListener('click', () => DOM.infoModal.removeAttribute('hidden'));
    }
    if (DOM.closeInfoBtn && DOM.infoModal) {
      DOM.closeInfoBtn.addEventListener('click', () => DOM.infoModal.setAttribute('hidden', ''));
    }
    if (DOM.infoModal) {
      DOM.infoModal.addEventListener('click', (e) => {
        if (e.target === DOM.infoModal) DOM.infoModal.setAttribute('hidden', '');
      });
    }

    // Optional Table QR Modal (staff/admin)
    if (DOM.qrModalBtn && DOM.qrModal) {
      DOM.qrModalBtn.addEventListener('click', () => DOM.qrModal.removeAttribute('hidden'));
    }
    if (DOM.closeQrBtn && DOM.qrModal) {
      DOM.closeQrBtn.addEventListener('click', () => DOM.qrModal.setAttribute('hidden', ''));
    }
    if (DOM.qrModal) {
      DOM.qrModal.addEventListener('click', (e) => {
        if (e.target === DOM.qrModal) DOM.qrModal.setAttribute('hidden', '');
      });
    }
    if (DOM.printStandBtn) {
      DOM.printStandBtn.addEventListener('click', printStand);
    }
    if (DOM.downloadStandImgBtn) {
      DOM.downloadStandImgBtn.addEventListener('click', downloadStandImage);
    }

    // Keyboard ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (DOM.infoModal) DOM.infoModal.setAttribute('hidden', '');
        if (DOM.qrModal) DOM.qrModal.setAttribute('hidden', '');
        if (DOM.menuDrawer) DOM.menuDrawer.setAttribute('hidden', '');
        if (DOM.selectionModal) closeSelectionModal();
      }
    });
  }

  function setSearchQuery(q) {
    DOM.menuSearchInput.value = q;
    state.searchQuery = q;
    DOM.clearSearchBtn.style.display = 'block';
    renderMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearSearch() {
    DOM.menuSearchInput.value = '';
    state.searchQuery = '';
    DOM.clearSearchBtn.style.display = 'none';
    renderMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
