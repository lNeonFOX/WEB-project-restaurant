$(function () {
  initRegistration();
  initMenuFilter();
  initGallery();
  initReservationCrud(); 
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

function deleteReservation(id) {
    if (confirm("Are you sure you want to cancel this reservation?")) {
        let reservations = JSON.parse(localStorage.getItem("olive_reservations")) || [];
        reservations = reservations.filter(r => r.id !== id);
        localStorage.setItem("olive_reservations", JSON.stringify(reservations));
        renderReservationsTable();
    }
}




//  Form Validation (register.html)

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

  $form.on('submit', function (e) {
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
    $alert.removeClass('d-none alert-danger').addClass('alert-success')
      .text('Registration successful.');
    $form[0].reset();
    $form.find('.form-control').removeClass('is-valid is-invalid');
    updateStrength('');
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

$(document).ready(function () {
  initReservationCrud();
  initRegisterValidation();
  initMenuFilter();
  initGallery();
});