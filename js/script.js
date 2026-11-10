$(function () {
  initRegistration();
  initMenuFilter();
  initGallery();
  initReservationCrud();
});

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