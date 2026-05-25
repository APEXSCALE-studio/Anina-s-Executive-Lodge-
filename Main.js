/* ============================================================
   KAZAAR LODGE — main.js
   Note: Mobile nav open/close is handled inline in index.html
   ============================================================ */

/* ── NAVBAR SCROLL EFFECT ── */
window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── LIVE PRICE ESTIMATE ── */
var ROOM_RATES = {
  'Standard Room':    606,
  'Twin Room':        700,
  'Garden View Room': 650,
  'Deluxe Room':      800,
  'Executive Room':   950,
  'Luxury Suite':    1200
};

function updateEstimate() {
  var ci = document.getElementById('checkIn')  ? document.getElementById('checkIn').value  : '';
  var co = document.getElementById('checkOut') ? document.getElementById('checkOut').value : '';
  var rv = document.getElementById('roomType') ? document.getElementById('roomType').value : '';
  var el = document.getElementById('priceEstimate');
  var amountEl = document.getElementById('estimateAmount');

  if (!el || !amountEl || !ci || !co || !rv) {
    if (el) el.classList.remove('show');
    return;
  }

  var nights   = Math.max(1, Math.round((new Date(co) - new Date(ci)) / 86400000));
  var roomName = rv.split('|')[0];
  var rate     = ROOM_RATES[roomName] || 0;
  var total    = rate * nights;

  amountEl.textContent = 'K' + total.toLocaleString() + ' total (' + nights + ' night' + (nights > 1 ? 's' : '') + ')';
  el.classList.add('show');
}

/* ── DATE PICKERS ── */
window.addEventListener('load', function () {
  var today    = new Date().toISOString().split('T')[0];
  var checkIn  = document.getElementById('checkIn');
  var checkOut = document.getElementById('checkOut');

  if (checkIn)  checkIn.min  = today;
  if (checkOut) checkOut.min = today;

  if (checkIn) {
    checkIn.addEventListener('change', function () {
      if (checkOut) checkOut.min = this.value;
      updateEstimate();
    });
  }
  if (checkOut) checkOut.addEventListener('change', updateEstimate);

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.parentElement;
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });
});

/* ── PRE-FILL ROOM FROM CARDS ── */
function prefillRoom(name) {
  var select = document.getElementById('roomType');
  if (!select) return;
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value.indexOf(name) === 0) {
      select.value = select.options[i].value;
      break;
    }
  }
  updateEstimate();
  var section = document.getElementById('booking');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

/* ── SEND VIA WHATSAPP ── */
function sendWhatsApp(e) {
  e.preventDefault();
  var d    = getFormData();
  var name = (d.first + ' ' + d.last).trim() || 'Guest';
  var est  = getEstimateText();

  var msg = '🏨 *Anina's Executive Lodge – Booking Request*\n\n'
    + '👤 *Name:*      ' + name + '\n'
    + '📧 *Email:*     ' + (d.email  || 'N/A') + '\n'
    + '📞 *Phone:*     ' + (d.phone  || 'N/A') + '\n'
    + '🛏  *Room:*      ' + d.room + '\n'
    + '👥 *Guests:*    ' + d.guests + '\n'
    + '📅 *Check-In:*  ' + (d.checkIn  || 'Flexible') + '\n'
    + '📅 *Check-Out:* ' + (d.checkOut || 'Flexible') + '\n'
    + '💰 *Estimate:*  ' + est + '\n'
    + '📝 *Requests:*  ' + (d.message || 'None') + '\n\n'
    + 'Kindly confirm availability. Thank you!';

  window.open('https://wa.me/260775690659?text=' + encodeURIComponent(msg), '_blank');
}

/* ── SEND VIA EMAIL ── */
function sendEmail(e) {
  e.preventDefault();
  var d    = getFormData();
  var name = (d.first + ' ' + d.last).trim() || 'Guest';
  var est  = getEstimateText();

  var subject = 'Booking Request – ' + name + ' | ' + d.room + ' | ' + (d.checkIn || 'Flexible');
  var body    = 'Dear Anina's Executive Lodge Team,\n\n'
    + 'I would like to request a booking.\n\n'
    + 'BOOKING DETAILS\n───────────────\n'
    + 'Name:      ' + name + '\n'
    + 'Email:     ' + (d.email  || 'N/A') + '\n'
    + 'Phone:     ' + (d.phone  || 'N/A') + '\n'
    + 'Room:      ' + d.room + '\n'
    + 'Guests:    ' + d.guests + '\n'
    + 'Check-In:  ' + (d.checkIn  || 'Flexible') + '\n'
    + 'Check-Out: ' + (d.checkOut || 'Flexible') + '\n'
    + 'Estimate:  ' + est + '\n'
    + 'Requests:  ' + (d.message || 'None') + '\n\n'
    + 'Please confirm availability.\n\nKind regards,\n' + name;

  window.location.href = 'mailto:tommylungu39@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

/* ── HELPERS ── */
function getFormData() {
  return {
    first:    document.getElementById('firstName') ? document.getElementById('firstName').value.trim() : '',
    last:     document.getElementById('lastName')  ? document.getElementById('lastName').value.trim()  : '',
    email:    document.getElementById('email')     ? document.getElementById('email').value.trim()     : '',
    phone:    document.getElementById('phone')     ? document.getElementById('phone').value.trim()     : '',
    checkIn:  document.getElementById('checkIn')   ? document.getElementById('checkIn').value          : '',
    checkOut: document.getElementById('checkOut')  ? document.getElementById('checkOut').value         : '',
    room:     document.getElementById('roomType')  ? (document.getElementById('roomType').value.split('|')[0] || 'Not specified') : 'Not specified',
    guests:   document.getElementById('guests')    ? document.getElementById('guests').value            : '2',
    message:  document.getElementById('message')   ? document.getElementById('message').value.trim()    : ''
  };
}

function getEstimateText() {
  var el       = document.getElementById('priceEstimate');
  var amountEl = document.getElementById('estimateAmount');
  return (el && el.classList.contains('show') && amountEl && amountEl.textContent)
    ? amountEl.textContent : 'To be quoted';
}
