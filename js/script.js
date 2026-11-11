document.addEventListener("DOMContentLoaded", () => {
    const mainBookingForm = document.getElementById("booking-form");
    if (mainBookingForm) {
        const submitBtn = mainBookingForm.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.removeAttribute("disabled");
            submitBtn.textContent = "Reserve Table";
        }

        mainBookingForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("booking-name").value.trim();
            const email = document.getElementById("booking-email").value.trim();
            const date = document.getElementById("booking-date").value;
            const time = document.getElementById("booking-time").value;
            const guests = document.getElementById("booking-guests").value;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (name.length < 2) {
                alert("Please enter a valid full name (at least 2 characters).");
                document.getElementById("booking-name").focus();
                return;
            }
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                document.getElementById("booking-email").focus();
                return;
            }
            if (!date) {
                alert("Please select a reservation date.");
                document.getElementById("booking-date").focus();
                return;
            }
            if (!time) {
                alert("Please choose a time slot.");
                document.getElementById("booking-time").focus();
                return;
            }
            if (!guests) {
                alert("Please choose your party size.");
                document.getElementById("booking-guests").focus();
                return;
            }

            let reservations = JSON.parse(localStorage.getItem("olive_reservations")) || [];
            reservations.push({
                id: Date.now(),
                name: name,
                date: date,
                time: time,
                guests: guests + " guests"
            });
            localStorage.setItem("olive_reservations", JSON.stringify(reservations));

            alert("Table reserved successfully!");
            mainBookingForm.reset();
            renderReservationsTable();
        });
    }

    renderReservationsTable();

    const resForm = document.getElementById("res-form");
    if (resForm) {
        resForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const idInput = document.getElementById("res-id").value;
            const name = document.getElementById("res-name").value.trim();
            const date = document.getElementById("res-date").value;
            const time = document.getElementById("res-time").value;
            const guests = document.getElementById("res-guests").value;

            if (!name || !date || !time || !guests) {
                resForm.classList.add("was-validated");
                return;
            }

            let reservations = JSON.parse(localStorage.getItem("olive_reservations")) || [];

            if (idInput) {
                let item = reservations.find(r => r.id == idInput);
                if (item) {
                    item.name = name;
                    item.date = date;
                    item.time = time;
                    item.guests = guests + " guests";
                }
            } else {
                reservations.push({
                    id: Date.now(),
                    name: name,
                    date: date,
                    time: time,
                    guests: guests + " guests"
                });
            }

            localStorage.setItem("olive_reservations", JSON.stringify(reservations));
            renderReservationsTable();

            const modalEl = document.getElementById("res-modal");
            if (modalEl && window.bootstrap) {
                const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modalInstance.hide();
            }
            resForm.reset();
            document.getElementById("res-id").value = "";
            resForm.classList.remove("was-validated");
        });
    }
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

    tableBody.innerHTML = "";
    if (reservations.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No active reservations found.</td></tr>`;
        return;
    }

    reservations.forEach((res) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${escapeHtml(res.name)}</td>
            <td>${escapeHtml(res.date)}</td>
            <td>${escapeHtml(res.time)}</td>
            <td>${escapeHtml(res.guests)}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteReservation(${res.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const deliveryForm = document.getElementById("delivery-form");

    if (deliveryForm) {
        const submitBtn = deliveryForm.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.removeAttribute("disabled");
            submitBtn.textContent = "Place Order";
        }

        deliveryForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("delivery-name");
            const phoneInput = document.getElementById("delivery-phone");
            const addressInput = document.getElementById("delivery-address");
            const phoneRegex = /^[+0-9() .\-]{7,25}$/;

            const quantityInputs = deliveryForm.querySelectorAll(".quantity-input");
            let totalItems = 0;
            quantityInputs.forEach(input => {
                totalItems += parseInt(input.value) || 0;
            });

            if (totalItems <= 0) {
                alert("Please select at least one dish quantity before placing an order.");
                return;
            }

            if (!nameInput || nameInput.value.trim().length < 2) {
                alert("Please enter a valid full name (at least 2 characters).");
                nameInput.focus();
                return;
            }

            if (!phoneInput || !phoneRegex.test(phoneInput.value.trim())) {
                alert("Please enter a valid phone number (7–25 characters using digits, spaces, +, parentheses, periods, or hyphens).");
                phoneInput.focus();
                return;
            }

            if (!addressInput || addressInput.value.trim().length < 5) {
                alert("Please enter a valid delivery address (at least 5 characters).");
                addressInput.focus();
                return;
            }

            alert("Success! Your delivery order has been placed. Total items ordered: " + totalItems);
            deliveryForm.reset();
        });
    }
});

function deleteReservation(id) {
    if (confirm("Are you sure you want to cancel this reservation?")) {
        let reservations = JSON.parse(localStorage.getItem("olive_reservations")) || [];
        reservations = reservations.filter(r => r.id !== id);
        localStorage.setItem("olive_reservations", JSON.stringify(reservations));
        renderReservationsTable();
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// 2.1 Form Validation (register.html)

function initRegisterValidation() {
  const $form = $('#register-form');
  if (!$form.length) return;

  const $name = $('#reg-name');
  const $email = $('#reg-email');
  const $pass = $('#reg-password');
  const $confirm = $('#reg-confirm');
  const $bar = $('#strength-bar');
  const $strengthText = $('#strength-text');
  const $alert = $('#form-alert');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function checkPasswordStrength(val) {
    let score = 0;
    if (val.length >= 6) score++;
    if (/[0-9]/.test(val) && /[a-zA-Z]/.test(val)) score++;
    if (/[^a-zA-Z0-9]/.test(val) && val.length >= 8) score++;

    $bar.removeClass('bg-danger bg-warning bg-success');

    if (val.length === 0){
      $bar.css('width', '0%');
      $strengthText.text('');
    } else if (score === 1) {
      $bar.css('width', '33%').addClass('bg-danger');
      $strengthText.text('Weak password').css('color', '#dc3545');
    } else if (score === 2) {
      $bar.css('width', '66%').addClass('bg-warning');
      $strengthText.text('Medium password').css('color', '#ffc107');
    } else {
      $bar.css('width', '100%').addClass('bg-success');
      $strengthText.text('Strong password!').css('color', '#198754');
    }
  }

  function setFieldState($field, isValid, msg = ''){
    const $feedback = $field.siblings('.invalid-feedback');
    if (isValid) {
      $field.removeClass('is-invalid').addClass('is-valid');
    } else {
      $field.removeClass('is-valid').addClass('is-invalid');
      if (msg) $feedback.text(msg);
    }
  }

  $name.on('input', function (){
    setFieldState($(this), $(this).val().trim().length >= 2, 'Name must be at least 2 characters.');
  });

  $email.on('input', function (){
    setFieldState($(this), emailRegex.test($(this).val().trim()), 'Enter a valid email address.');
  });

  $pass.on('input', function (){
    const val = $(this).val();
    checkPasswordStrength(val);
    setFieldState($(this), val.length >= 6, 'Password must be at least 6 characters.');
    if ($confirm.val().length > 0) {
      setFieldState($confirm, $confirm.val() === val, 'Passwords do not match.');
    }
  });

  $confirm.on('input', function (){
    setFieldState($(this), $(this).val().length >= 6 && $(this).val() === $pass.val(), 'Passwords do not match.');
  });

  $form.on('submit', function (e){
    e.preventDefault();
    const isNameOk = $name.val().trim().length >= 2;
    const isEmailOk = emailRegex.test($email.val().trim());
    const isPassOk = $pass.val().length >= 6;
    const isConfirmOk = $confirm.val().length >= 6 && $confirm.val() === $pass.val();

    setFieldState($name, isNameOk, 'Name must be at least 2 characters.');
    setFieldState($email, isEmailOk, 'Enter a valid email address.');
    setFieldState($pass, isPassOk, 'Password must be at least 6 characters.');
    setFieldState($confirm, isConfirmOk, 'Passwords do not match.');

    if (isNameOk && isEmailOk && isPassOk && isConfirmOk) {
      $alert.removeClass('d-none alert-danger').addClass('alert-success').text('Registration successful!');
      $form[0].reset();
      $form.find('.is-valid').removeClass('is-valid');
      $bar.css('width', '0%');
      $strengthText.text('');
    } else {
      $alert.removeClass('d-none alert-success').addClass('alert-danger').text('Please correct errors before submitting.');
    }
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