$(function () {
  initThemeToggle();
  initAuth();
  initPasswordToggle();
  initRegistration();
  initMenuFilter();
  initGallery();
  initFaq();
  initRecipeExplorer();
});

document.addEventListener("DOMContentLoaded", () => {
    function showFeedback(input, isValid, message = "") {
        input.classList.toggle("is-valid", isValid);
        input.classList.toggle("is-invalid", !isValid);
        let feedback = input.parentElement.querySelector(".invalid-feedback");
        if (!feedback) {
            feedback = document.createElement("div");
            feedback.className = "invalid-feedback text-danger small mt-1";
            input.parentElement.appendChild(feedback);
        }
        feedback.textContent = isValid ? "" : message;
        return isValid;
    }

    function attachValidation(input, validateFn) {
        if (!input) return;
        const handler = () => validateFn(input);
        input.addEventListener("input", handler);
        input.addEventListener("blur", handler);
    }

    const rules = {
        name: (input) => showFeedback(input, input.value.trim().length >= 2, "Enter at least 2 characters."),
        email: (input) => showFeedback(input, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()), "Enter a valid email address."),
        phone: (input) => showFeedback(input, /^[+0-9() .\-]{7,25}$/.test(input.value.trim()), "Enter a valid phone number (7–25 chars)."),
        address: (input) => showFeedback(input, input.value.trim().length >= 5, "Enter at least 5 characters."),
        required: (input, msg) => showFeedback(input, Boolean(input.value), msg)
    };

    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
        const submitBtn = bookingForm.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.removeAttribute("disabled");
            submitBtn.textContent = "Reserve Table";
        }

        const bName = document.getElementById("booking-name");
        const bEmail = document.getElementById("booking-email");
        const bDate = document.getElementById("booking-date");
        const bTime = document.getElementById("booking-time");
        const bGuests = document.getElementById("booking-guests");

        attachValidation(bName, rules.name);
        attachValidation(bEmail, rules.email);
        attachValidation(bDate, (el) => rules.required(el, "Select a date."));
        attachValidation(bTime, (el) => rules.required(el, "Select a time."));
        attachValidation(bGuests, (el) => rules.required(el, "Select party size."));

        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const valid = rules.name(bName) & rules.email(bEmail) & rules.required(bDate, "Select a date.") &
                          rules.required(bTime, "Select a time.") & rules.required(bGuests, "Select party size.");

            if (!valid) return alert("Please correct the highlighted errors.");

            let reservations = JSON.parse(localStorage.getItem("olive_reservations")) || [];
            reservations.push({
                id: Date.now(),
                name: bName.value.trim(),
                date: bDate.value,
                time: bTime.value,
                guests: bGuests.value + " guests"
            });
            localStorage.setItem("olive_reservations", JSON.stringify(reservations));

            alert("Table reserved successfully!");
            bookingForm.reset();
            [bName, bEmail, bDate, bTime, bGuests].forEach(el => el.classList.remove("is-valid", "is-invalid"));
            renderReservationsTable();
        });
    }

    const resForm = document.getElementById("res-form");
    if (resForm) {
        resForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const idInput = document.getElementById("res-id").value;
            const name = document.getElementById("res-name").value.trim();
            const date = document.getElementById("res-date").value;
            const time = document.getElementById("res-time").value;
            const guests = document.getElementById("res-guests").value;

            if (!name || !date || !time || !guests) return resForm.classList.add("was-validated");

            let reservations = JSON.parse(localStorage.getItem("olive_reservations")) || [];
            if (idInput) {
                let item = reservations.find(r => r.id == idInput);
                if (item) Object.assign(item, { name, date, time, guests: guests + " guests" });
            } else {
                reservations.push({ id: Date.now(), name, date, time, guests: guests + " guests" });
            }

            localStorage.setItem("olive_reservations", JSON.stringify(reservations));
            renderReservationsTable();

            const modalEl = document.getElementById("res-modal");
            if (modalEl && window.bootstrap) {
                (bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)).hide();
            }
            resForm.reset();
            document.getElementById("res-id").value = "";
            resForm.classList.remove("was-validated");
        });
    }

    const deliveryForm = document.getElementById("delivery-form");
    if (deliveryForm) {
        const submitBtn = deliveryForm.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.removeAttribute("disabled");
            submitBtn.textContent = "Place Order";
        }

        const dName = document.getElementById("delivery-name");
        const dPhone = document.getElementById("delivery-phone");
        const dAddress = document.getElementById("delivery-address");

        attachValidation(dName, rules.name);
        attachValidation(dPhone, rules.phone);
        attachValidation(dAddress, rules.address);

        deliveryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const totalItems = Array.from(deliveryForm.querySelectorAll(".quantity-input"))
                                   .reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);

            if (totalItems <= 0) return alert("Please select at least one dish quantity.");

            const valid = rules.name(dName) & rules.phone(dPhone) & rules.address(dAddress);
            if (!valid) return alert("Please correct the highlighted errors.");

            alert(`Success! Your delivery order has been placed. Total items: ${totalItems}`);
            deliveryForm.reset();
            [dName, dPhone, dAddress].forEach(el => el.classList.remove("is-valid", "is-invalid"));
        });
    }

    renderReservationsTable();
});

function renderReservationsTable() {
    const tableBody = document.getElementById("res-body");
    if (!tableBody) return;

    let reservations = JSON.parse(localStorage.getItem("olive_reservations")) || [
        { id: 1, name: "Aigerim Kasymova", date: "2026-06-10", time: "18:00", guests: "2 guests" },
        { id: 2, name: "Timur Bekmambetov", date: "2026-06-12", time: "20:00", guests: "4 guests" }
    ];

    if (!localStorage.getItem("olive_reservations")) {
        localStorage.setItem("olive_reservations", JSON.stringify(reservations));
    }

    if (reservations.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No active reservations found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = reservations.map(res => `
        <tr>
            <td>${escapeHtml(res.name)}</td>
            <td>${escapeHtml(res.date)}</td>
            <td>${escapeHtml(res.time)}</td>
            <td>${escapeHtml(res.guests)}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteReservation(${res.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

function deleteReservation(id) {
    if (confirm("Are you sure you want to cancel this reservation?")) {
        let reservations = JSON.parse(localStorage.getItem("olive_reservations")) || [];
        reservations = reservations.filter(r => r.id !== id);
        localStorage.setItem("olive_reservations", JSON.stringify(reservations));
        renderReservationsTable();
    }
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}




//Form Validation (register.html)

function initRegistration() {
  const $form = $('#register-form');
  if (!$form.length) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function strength(pw) {
    if (!pw) return { width: 0, cls: '', text: '' };
    const score = [
      pw.length >= 8,
      /[a-z]/.test(pw) && /[A-Z]/.test(pw),
      /\d/.test(pw),
      /[^A-Za-z0-9]/.test(pw)
    ].filter(Boolean).length;
    if (score <= 1) return { width: 33, cls: 'bg-danger', text: 'Weak' };
    if (score <= 3) return { width: 66, cls: 'bg-warning', text: 'Medium' };
    return { width: 100, cls: 'bg-success', text: 'Strong' };
  }

  function updateStrength(pw) {
    const s = strength(pw);
    $('#strength-bar')
      .removeClass('bg-danger bg-warning bg-success')
      .addClass(s.cls)
      .css('width', s.width + '%');
    $('#strength-text').text(s.text ? 'Password strength: ' + s.text : '');
  }

  const rules = {
    'reg-name': v => v.trim().length >= 2 ? '' : 'Name is required (at least 2 characters).',
    'reg-email': v => !v.trim() ? 'Email is required.'
      : EMAIL_RE.test(v.trim()) ? '' : 'Enter a valid email, e.g. name@example.com.',
    'reg-password': v => !v ? 'Password is required.'
      : v.length < 8 ? 'Use at least 8 characters.'
      : strength(v).text === 'Weak' ? 'Too weak. Add uppercase letters, numbers or symbols.' : '',
    'reg-confirm': v => !v ? 'Please confirm your password.'
      : v !== $('#reg-password').val() ? 'Passwords do not match.' : ''
  };

  function check($input) {
    const msg = rules[$input.attr('id')]($input.val());
    $input.toggleClass('is-invalid', !!msg).toggleClass('is-valid', !msg);
    $input.siblings('.invalid-feedback').text(msg);
    return !msg;
  }


  $form.on('input focusout', '.form-control', function () {
    check($(this));
    if (this.id === 'reg-password') {
      updateStrength($(this).val());
      if ($('#reg-confirm').val()) check($('#reg-confirm'));
    }
  });

  $form.on('submit', async function (e) {
    e.preventDefault();
    let ok = true, $first = null;
    $form.find('.form-control').each(function () {
      if (!check($(this))) { ok = false; $first = $first || $(this); }
    });
    const $alert = $('#form-alert');
    if (!ok) {
      $alert.removeClass('d-none alert-success').addClass('alert-danger')
        .text('Please fix the highlighted fields.');
      $first.trigger('focus');
      return;
    }

    const result = await registerUser($('#reg-name').val(), $('#reg-email').val(), $('#reg-password').val());
    if (!result.ok) {
      $alert.removeClass('d-none alert-success').addClass('alert-danger').text(result.error);
      $('#reg-email').removeClass('is-valid').addClass('is-invalid')
        .siblings('.invalid-feedback').text(result.error);
      $('#reg-email').trigger('focus');
      return;
    }

    const email = $('#reg-email').val().trim();
    $alert.addClass('d-none').removeClass('alert-success alert-danger').text('');
    $form[0].reset();
    $form.find('.form-control').removeClass('is-valid is-invalid');
    updateStrength('');
    showSignInTab(email, 'Account created. Please sign in.');
  });
}


  // 2.2 Live search + category filter (menu.html)

function initMenuFilter(){
  const $cards = $('#dish-grid .dish-card');
  if (!$cards.length) return;
  $cards.each(function (){
    const $c = $(this);
    $c.data('search', ($c.find('h3').text() + ' ' + $c.find('p:not(.eyebrow)').text()).toLowerCase());
  });

  function applyFilter(){
    const query = $('#menu-search').val().toLowerCase().trim();
    const category = $('.filter-btn.active').data('category') || 'all';
    let visible = 0;

    $cards.each(function (){
      const $c = $(this);
      const match = (category === 'all' || $c.data('category') === category) && $c.data('search').includes(query);
      if (match) {
        visible++;
        $c.stop(true, true).fadeIn(150);
      } else {
        $c.stop(true, true).hide();
      }
    });
    $('#no-results').toggleClass('d-none', visible > 0);
  }

  $('#menu-search').on('input', applyFilter);

  $('.filter-btn').on('click', function () {
    $('.filter-btn').removeClass('active').attr('aria-pressed', 'false');
    $(this).addClass('active').attr('aria-pressed', 'true');
    applyFilter();
  });
}


  // 2.4 Gallery + lightbox (menu.html)

function initGallery(){
  const $items = $('.gallery-item');
  if (!$items.length) return;

  $items.css('opacity', 0).each(function (i){
    $(this).delay(i * 80).animate({ opacity: 1 }, 400);
  });

  const $lb = $(`
    <div id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
      <button type="button" class="lb-btn lb-close" aria-label="Close">&times;</button>
      <button type="button" class="lb-btn lb-prev" aria-label="Previous image">&#10094;</button>
      <div class="lb-stage">
        <figure><img class="lb-img" alt=""><figcaption class="lb-caption"></figcaption></figure>
      </div>
      <button type="button" class="lb-btn lb-next" aria-label="Next image">&#10095;</button>
    </div>`).appendTo('body');

  const $img = $lb.find('.lb-img');
  let current = 0;
  let $trigger = null;

  function show(index){
    current = (index + $items.length) % $items.length; // листание по кругу
    const $a = $items.eq(current);
    const src = $a.attr('href');
    const alt = $a.find('img').attr('alt') || '';

    $img.stop(true, true).fadeOut(150, function (){
      $img.one('load error', function () { $img.fadeIn(250); });
      $img.attr({ src: src, alt: alt });
      $lb.find('.lb-caption').text(alt + ' (' + (current + 1) + '/' + $items.length + ')');
    });
  }

  function open(index){
    $('body').css('overflow', 'hidden');
    $lb.stop(true, true).fadeIn(200);
    show(index);
    $lb.find('.lb-close').trigger('focus');
  }

  function close(){
    $lb.stop(true, true).fadeOut(200);
    $('body').css('overflow', '');
    if ($trigger) $trigger.trigger('focus');
  }
  $items.on('click', function (e){
    e.preventDefault();
    $trigger = $(this);
    open($items.index(this));
  });

  $lb.on('click', '.lb-close', close);
  $lb.on('click', '.lb-prev', function (){ show(current - 1); });
  $lb.on('click', '.lb-next', function (){ show(current + 1); });
  $lb.on('click', function (e){
    if (e.target === this || $(e.target).hasClass('lb-stage')) close();
  });

  $(document).on('keydown', function (e){
    if (!$lb.is(':visible')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  
  $('#toggle-gallery-btn').on('click', function () {
    $('#gallery').fadeToggle(400);
  });
}

function initFaq() {
  $(document).on('click', '.faq-question', function () {
    const $btn = $(this);
    const $item = $btn.closest('.faq-item');
    const $answer = $btn.next('.faq-answer');
    const $icon = $btn.find('.faq-icon');
    const isOpening = !$item.hasClass('open');

    $('.faq-item.open').not($item).each(function () {
      $(this).removeClass('open');
      $(this).find('.faq-question').attr('aria-expanded', 'false');
      $(this).find('.faq-icon').text('+');
      $(this).find('.faq-answer').stop(true, true).slideUp(250);
    });

    $item.toggleClass('open', isOpening);
    $btn.attr('aria-expanded', String(isOpening));
    $icon.text(isOpening ? '−' : '+');
    $answer.stop(true, true).slideToggle(250);
  });
}

const AUTH_USERS_KEY = 'olive_users';
const AUTH_SESSION_KEY = 'olive_session';
const AUTH_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null || value === undefined ? fallback : value;
  } catch (err) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    return false;
  }
}

async function hashPassword(email, password) {
  const text = email.toLowerCase() + ':' + password;
  if (window.crypto && window.crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381;
  for (const ch of text) h = ((h << 5) + h + ch.charCodeAt(0)) | 0;
  return 'f' + (h >>> 0).toString(16);
}

async function registerUser(name, email, password) {
  email = email.trim().toLowerCase();
  const users = readStorage(AUTH_USERS_KEY, []);
  if (users.some(u => u.email === email)) {
    return { ok: false, error: 'An account with this email already exists. Please sign in.' };
  }
  users.push({ name: name.trim(), email: email, passwordHash: await hashPassword(email, password) });
  if (!writeStorage(AUTH_USERS_KEY, users)) {
    return { ok: false, error: 'Could not save the account. Check that browser storage is enabled.' };
  }
  return { ok: true };
}

async function signIn(email, password) {
  email = email.trim().toLowerCase();
  const user = readStorage(AUTH_USERS_KEY, []).find(u => u.email === email);

  if (!user || user.passwordHash !== await hashPassword(email, password)) {
    return { ok: false, error: 'Invalid email or password.' };
  }
  const session = { name: user.name, email: user.email, signedInAt: new Date().toISOString() };
  if (!writeStorage(AUTH_SESSION_KEY, session)) {
    return { ok: false, error: 'Could not save the login state. Check that browser storage is enabled.' };
  }
  return { ok: true };
}

function getSession() {
  const s = readStorage(AUTH_SESSION_KEY, null);
  return s && typeof s.email === 'string' && typeof s.name === 'string' ? s : null;
}

function signOut() {
  try { localStorage.removeItem(AUTH_SESSION_KEY); } catch (err) {  }
}

function showSignInTab(email, message) {
  const tabBtn = document.getElementById('tab-signin-btn');
  if (!tabBtn) return;
  if (window.bootstrap) bootstrap.Tab.getOrCreateInstance(tabBtn).show();
  if (email) $('#si-email').val(email);
  const $alert = $('#signin-alert');
  if (message) $alert.removeClass('d-none alert-danger').addClass('alert-success').text(message);
  else $alert.addClass('d-none').text('');
}

function renderAuthUI() {
  const session = getSession();

  const $link = $('.site-nav a[href="register.html"]');
  $('#nav-signout').remove();
  if (session) {
    $link.text('Hi, ' + session.name.split(' ')[0]);
    $('<button type="button" id="nav-signout" class="nav-signout">Sign out</button>').insertAfter($link);
  } else {
    $link.text('Register');
  }

  if ($('#auth-guest').length) {
    $('#auth-guest').toggleClass('d-none', !!session);
    $('#auth-user').toggleClass('d-none', !session);
    if (session) {
      $('#auth-user-name').text(session.name);
      $('#auth-user-email').text(session.email);
      $('#auth-user-since').text(new Date(session.signedInAt).toLocaleString());
    }
  }
}

function initAuth() {
  renderAuthUI();

  $(document).on('click', '#nav-signout, #signout-btn', function () {
    signOut();
    renderAuthUI();
    showSignInTab('', '');
    $('#signin-alert').removeClass('d-none alert-danger').addClass('alert-success').text('You have been signed out.');
  });

  $(window).on('storage', function (e) {
    if (e.key === AUTH_SESSION_KEY || e.key === null) renderAuthUI();
  });

  const $form = $('#signin-form');
  if (!$form.length) return;

  const rules = {
    'si-email': v => !v.trim() ? 'Email is required.'
      : AUTH_EMAIL_RE.test(v.trim()) ? '' : 'Enter a valid email, e.g. name@example.com.',
    'si-password': v => !v ? 'Password is required.'
      : v.length < 8 ? 'Password must be at least 8 characters.' : ''
  };

  function check($input) {
    const msg = rules[$input.attr('id')]($input.val());
    $input.toggleClass('is-invalid', !!msg).toggleClass('is-valid', !msg);
    $input.siblings('.invalid-feedback').text(msg);
    return !msg;
  }

  $form.on('input focusout', '.form-control', function () { check($(this)); });

  $form.on('submit', async function (e) {
    e.preventDefault();
    let ok = true, $first = null;
    $form.find('.form-control').each(function () {
      if (!check($(this))) { ok = false; $first = $first || $(this); }
    });
    const $alert = $('#signin-alert');
    if (!ok) {
      $alert.removeClass('d-none alert-success').addClass('alert-danger')
        .text('Please fix the highlighted fields.');
      $first.trigger('focus');
      return;
    }

    const result = await signIn($('#si-email').val(), $('#si-password').val());
    if (!result.ok) {
      $alert.removeClass('d-none alert-success').addClass('alert-danger').text(result.error);
      $('#si-password').val('').removeClass('is-valid is-invalid').trigger('focus');
      return;
    }

    $form[0].reset();
    $form.find('.form-control').removeClass('is-valid is-invalid');
    $alert.addClass('d-none').text('');
    renderAuthUI();
  });

  if (window.location.hash === '#signin') showSignInTab('', '');
}

function initPasswordToggle() {
  $(document).on('click', '.toggle-password', function () {
    const $btn = $(this);
    const $input = $('#' + $btn.data('target'));
    const show = $input.attr('type') === 'password';
    $input.attr('type', show ? 'text' : 'password');
    $btn.text(show ? 'Hide' : 'Show').attr('aria-pressed', String(show));
  });

  $(document).on('reset', 'form', function () {
    $(this).find('.toggle-password').each(function () {
      $('#' + $(this).data('target')).attr('type', 'password');
      $(this).text('Show').attr('aria-pressed', 'false');
    });
  });
}

/*Dark / Light Theme Switcher with LocalStorage*/

function initThemeToggle(){
  const THEME_KEY = 'oe_theme_preference';
  const $toggleBtn = $('#theme-toggle');
  const $icon = $toggleBtn.find('.theme-icon');
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') {
    $('body').addClass('dark-theme');
    $icon.text('☀️');
    $toggleBtn.attr('aria-label', 'Switch to Light Theme');
  } else {
    $icon.text('🌙');
    $toggleBtn.attr('aria-label', 'Switch to Dark Theme');
  }

  $toggleBtn.on('click', function (){
    const isDark = $('body').toggleClass('dark-theme').hasClass('dark-theme');

    if (isDark) {
      $icon.text('☀️');
      localStorage.setItem(THEME_KEY, 'dark');
      $toggleBtn.attr('aria-label', 'Switch to Light Theme');
    } else {
      $icon.text('🌙');
      localStorage.setItem(THEME_KEY, 'light');
      $toggleBtn.attr('aria-label', 'Switch to Dark Theme');
    }
  });
}

//API
const MEALDB_URL = 'https://www.themealdb.com/api/json/v1/1/';

async function fetchJSON(endpoint, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(MEALDB_URL + endpoint, { signal: controller.signal });
    if (!response.ok) throw new Error('Server responded with status ' + response.status + '.');
    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('The request timed out.');
    if (err instanceof SyntaxError) throw new Error('The server returned invalid data.');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function initRecipeExplorer() {
  const $grid = $('#recipe-grid');
  if (!$grid.length) return;

  const $status = $('#recipe-status');
  const $search = $('#recipe-search');
  const $category = $('#recipe-category');
  const MAX_CARDS = 12;
  const SPINNER = '<div class="d-flex align-items-center gap-2"><div class="spinner-border spinner-border-sm" role="status"></div><span>Loading...</span></div>';

  let requestId = 0;
  let lastLoader = null;
  let typingTimer = null;

  function currentLoader() {
    const query = $search.val().trim();
    const category = $category.val();

    if (query) {
      return async () => {
        const data = await fetchJSON('search.php?s=' + encodeURIComponent(query));
        const meals = (data && data.meals) || [];
        return category ? meals.filter(m => m.strCategory === category) : meals;
      };
    }
    return async () => {
      const data = await fetchJSON('filter.php?c=' + encodeURIComponent(category || 'Pasta'));
      return (data && data.meals) || [];
    };
  }

  function showError(message) {
    $grid.empty();
    $status.html(
      '<div class="alert alert-danger d-flex justify-content-between align-items-center gap-3" role="alert">' +
      '<span>' + escapeHtml(message) + '</span>' +
      '<button type="button" class="btn btn-sm btn-outline-danger" id="recipe-retry">Try again</button></div>'
    );
  }

  function renderMeals(meals) {
    if (!meals.length) {
      $grid.empty();
      $status.html('<p class="mb-0">No recipes found. Try another search or category.</p>');
      return;
    }
    const shown = meals.slice(0, MAX_CARDS);
    $status.html('<p class="small text-muted mb-0">Showing ' + shown.length + ' of ' + meals.length + ' recipes</p>');
    $grid.html(shown.map(m => `
      <article class="recipe-card">
        <button type="button" class="recipe-card-btn" data-id="${escapeHtml(m.idMeal)}" aria-label="View recipe: ${escapeHtml(m.strMeal)}">
          <img src="${escapeHtml(m.strMealThumb)}" alt="${escapeHtml(m.strMeal)}" loading="lazy">
          <span class="recipe-card-body">
            ${m.strArea ? '<span class="eyebrow">' + escapeHtml(m.strArea) + '</span>' : ''}
            <h3>${escapeHtml(m.strMeal)}</h3>
          </span>
        </button>
      </article>`).join(''));
  }

  async function loadList(loader) {
    lastLoader = loader;
    const id = ++requestId;
    $grid.empty();
    $status.html(SPINNER);
    try {
      const meals = await loader();
      if (id !== requestId) return;
      renderMeals(meals);
    } catch (err) {
      if (id !== requestId) return;
      showError('Could not load recipes. ' + err.message);
    }
  }

  function renderRecipe(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const name = (meal['strIngredient' + i] || '').trim();
      if (name) ingredients.push('<li>' + escapeHtml(((meal['strMeasure' + i] || '').trim() + ' ' + name).trim()) + '</li>');
    }
    const steps = (meal.strInstructions || '').split(/\r?\n/).filter(l => l.trim())
      .map(l => '<p>' + escapeHtml(l) + '</p>').join('');
    const video = /^https?:\/\//.test(meal.strYoutube || '')
      ? '<a class="btn btn-brand btn-sm mt-2" href="' + escapeHtml(meal.strYoutube) + '" target="_blank" rel="noopener">Watch video</a>' : '';

    $('#recipe-modal-title').text(meal.strMeal);
    $('#recipe-modal-body').html(`
      <img class="recipe-modal-img mb-3" src="${escapeHtml(meal.strMealThumb)}" alt="${escapeHtml(meal.strMeal)}">
      <p class="eyebrow">${escapeHtml([meal.strCategory, meal.strArea].filter(Boolean).join(' · '))}</p>
      <h3 class="h5">Ingredients</h3>
      <ul class="recipe-ingredients">${ingredients.join('')}</ul>
      <h3 class="h5">Instructions</h3>
      ${steps}
      ${video}`);
  }

  async function openRecipe(loader) {
    $('#recipe-modal-title').text('Loading...');
    $('#recipe-modal-body').html(SPINNER);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('recipe-modal')).show();
    try {
      const meal = await loader();
      if (!meal) throw new Error('Recipe not found.');
      renderRecipe(meal);
    } catch (err) {
      $('#recipe-modal-title').text('Something went wrong');
      $('#recipe-modal-body').html('<div class="alert alert-danger mb-0" role="alert">' +
        escapeHtml('Could not load the recipe. ' + err.message) + '</div>');
    }
  }

  async function loadCategories() {
    try {
      const data = await fetchJSON('categories.php');
      ((data && data.categories) || []).forEach(c => {
        $('<option>').val(c.strCategory).text(c.strCategory).appendTo($category);
      });
    } catch (err) {
      console.warn('Categories unavailable:', err.message);
    }
  }

  $search.on('input', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => loadList(currentLoader()), 400);
  });
  $category.on('change', () => loadList(currentLoader()));
  $('#recipe-form').on('submit', e => e.preventDefault());
  $('#recipe-reload').on('click', () => loadList(lastLoader || currentLoader()));
  $('#recipe-random').on('click', () => openRecipe(async () => {
    const data = await fetchJSON('random.php');
    return ((data && data.meals) || [])[0];
  }));
  $grid.on('click', '.recipe-card-btn', function () {
    const id = $(this).data('id');
    openRecipe(async () => {
      const data = await fetchJSON('lookup.php?i=' + encodeURIComponent(id));
      return ((data && data.meals) || [])[0];
    });
  });
  $status.on('click', '#recipe-retry', () => loadList(lastLoader || currentLoader()));

  loadCategories();
  loadList(currentLoader());
}