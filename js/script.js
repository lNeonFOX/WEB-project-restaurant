function initReservationCrud() {
  const $body = $('#res-body');
  if (!$body.length) return;

  const KEY = 'oe_reservations';
  const SEED = [
    { id: 1, name: 'Aigerim S.', date: '2026-11-20', time: '18:00', guests: 2 },
    { id: 2, name: 'Daniyar K.', date: '2026-11-22', time: '20:00', guests: 4 }
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || SEED.slice(); }
    catch (e) { return SEED.slice(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* ignore */ }
  }
  const esc = s => $('<div>').text(s).html();

  let items = load();
  const modal = new bootstrap.Modal('#res-modal');
  const $form = $('#res-form');
  $('#res-date').attr('min', new Date().toISOString().slice(0, 10));

  function render() {
    if (!items.length) {
      $body.html('<tr><td colspan="5" class="text-center">No reservations yet.</td></tr>');
      return;
    }
    $body.html(items.map(r => `
      <tr data-id="${r.id}">
        <td>${esc(r.name)}</td>
        <td>${esc(r.date)}</td>
        <td>${esc(r.time)}</td>
        <td>${Number(r.guests)}</td>
        <td class="text-end">
          <button type="button" class="btn btn-sm btn-outline-secondary edit-btn">Edit</button>
          <button type="button" class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
        </td>
      </tr>`).join(''));
  }

  $('#add-res-btn').on('click', function () {
    $form[0].reset();
    $form.removeClass('was-validated');
    $('#res-id').val('');
    $('#res-modal-title').text('Add reservation');
    modal.show();
  });

  $body.on('click', '.edit-btn', function () {
    const id = Number($(this).closest('tr').data('id'));
    const r = items.find(x => x.id === id);
    $form.removeClass('was-validated');
    $('#res-id').val(r.id);
    $('#res-name').val(r.name);
    $('#res-date').val(r.date);
    $('#res-time').val(r.time);
    $('#res-guests').val(r.guests);
    $('#res-modal-title').text('Edit reservation');
    modal.show();
  });

  $form.on('submit', function (e) {
    e.preventDefault();
    if (!this.checkValidity()) { $form.addClass('was-validated'); return; }
    const id = $('#res-id').val();
    const data = {
      name: $('#res-name').val().trim(),
      date: $('#res-date').val(),
      time: $('#res-time').val(),
      guests: Number($('#res-guests').val())
    };
    if (id) {
      Object.assign(items.find(x => x.id === Number(id)), data);
    } else {
      const nextId = items.reduce((m, x) => Math.max(m, x.id), 0) + 1;
      items.push({ id: nextId, ...data });
    }
    save(); render(); modal.hide();
  });

  $body.on('click', '.delete-btn', function () {
    const $row = $(this).closest('tr');
    const id = Number($row.data('id'));
    const r = items.find(x => x.id === id);
    if (!confirm('Delete the reservation for "' + r.name + '"?')) return;
    $row.fadeOut(200, function () {
      items = items.filter(x => x.id !== id);
      save(); render();
    });
  });

  render();
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