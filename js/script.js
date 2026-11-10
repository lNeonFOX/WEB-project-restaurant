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