'use strict';

const matches = [
  { id: 'mumbai-chennai', home: 'Mumbai Indians', away: 'Chennai Super Kings', homeCode: 'MI', awayCode: 'CSK', date: '2026-04-04', time: '7:30 PM IST', venue: 'Wankhede Stadium, Mumbai', basePrice: 850 },
  { id: 'bengaluru-kolkata', home: 'Royal Challengers Bengaluru', away: 'Kolkata Knight Riders', homeCode: 'RCB', awayCode: 'KKR', date: '2026-04-06', time: '7:30 PM IST', venue: 'M. Chinnaswamy Stadium, Bengaluru', basePrice: 950 },
  { id: 'delhi-hyderabad', home: 'Delhi Capitals', away: 'Sunrisers Hyderabad', homeCode: 'DC', awayCode: 'SRH', date: '2026-04-08', time: '7:30 PM IST', venue: 'Arun Jaitley Stadium, Delhi', basePrice: 750 },
  { id: 'rajasthan-gujarat', home: 'Rajasthan Royals', away: 'Gujarat Titans', homeCode: 'RR', awayCode: 'GT', date: '2026-04-10', time: '7:30 PM IST', venue: 'Sawai Mansingh Stadium, Jaipur', basePrice: 700 },
  { id: 'lucknow-punjab', home: 'Lucknow Super Giants', away: 'Punjab Kings', homeCode: 'LSG', awayCode: 'PBKS', date: '2026-04-12', time: '3:30 PM IST', venue: 'BRSABV Ekana Stadium, Lucknow', basePrice: 650 },
  { id: 'chennai-bengaluru', home: 'Chennai Super Kings', away: 'Royal Challengers Bengaluru', homeCode: 'CSK', awayCode: 'RCB', date: '2026-04-14', time: '7:30 PM IST', venue: 'M. A. Chidambaram Stadium, Chennai', basePrice: 900 },
  { id: 'kolkata-mumbai', home: 'Kolkata Knight Riders', away: 'Mumbai Indians', homeCode: 'KKR', awayCode: 'MI', date: '2026-04-16', time: '7:30 PM IST', venue: 'Eden Gardens, Kolkata', basePrice: 800 },
  { id: 'hyderabad-lucknow', home: 'Sunrisers Hyderabad', away: 'Lucknow Super Giants', homeCode: 'SRH', awayCode: 'LSG', date: '2026-04-18', time: '3:30 PM IST', venue: 'Rajiv Gandhi Intl. Cricket Stadium, Hyderabad', basePrice: 700 },
  { id: 'punjab-rajasthan', home: 'Punjab Kings', away: 'Rajasthan Royals', homeCode: 'PBKS', awayCode: 'RR', date: '2026-04-20', time: '7:30 PM IST', venue: 'PCA New International Cricket Stadium, New Chandigarh', basePrice: 750 },
  { id: 'gujarat-delhi', home: 'Gujarat Titans', away: 'Delhi Capitals', homeCode: 'GT', awayCode: 'DC', date: '2026-04-22', time: '7:30 PM IST', venue: 'Narendra Modi Stadium, Ahmedabad', basePrice: 850 }
];

const categories = {
  general: { label: 'General stand', multiplier: 1 },
  premium: { label: 'Premium stand', multiplier: 2.5 },
  vip: { label: 'VIP lounge', multiplier: 4 }
};

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const matchesBody = document.getElementById('matchesTableBody');
const matchesEmpty = document.getElementById('matchesEmpty');
const teamFilter = document.getElementById('teamFilter');
const matchSelect = document.getElementById('matchSelect');
const ticketCategory = document.getElementById('ticketCategory');
const ticketQuantity = document.getElementById('ticketQuantity');
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');
const bookingsBody = document.getElementById('bookingsTableBody');
const bookingsEmpty = document.getElementById('bookingsEmpty');

const bookings = [
  { id: 'DEMO-IPL26-001', matchId: 'mumbai-chennai', category: 'premium', quantity: 2 },
  { id: 'DEMO-IPL26-002', matchId: 'bengaluru-kolkata', category: 'general', quantity: 1 }
].map((booking) => {
  const match = matches.find((item) => item.id === booking.matchId);
  return { ...booking, total: match.basePrice * categories[booking.category].multiplier * booking.quantity };
});

function priceText(amount) {
  return currency.format(amount);
}

function displayDate(dateString) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${dateString}T12:00:00`));
}

function matchName(match) {
  return `${match.home} vs ${match.away}`;
}

function populateSelects() {
  const teamNames = new Map();
  matches.forEach((match) => {
    teamNames.set(match.homeCode, match.home);
    teamNames.set(match.awayCode, match.away);
  });
  [...teamNames.entries()].sort((a, b) => a[1].localeCompare(b[1])).forEach(([code, name]) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    teamFilter.append(option);
  });
  matches.forEach((match) => {
    const option = document.createElement('option');
    option.value = match.id;
    option.textContent = `${matchName(match)} — ${displayDate(match.date)}`;
    matchSelect.append(option);
  });
}

function renderMatches() {
  const team = teamFilter.value;
  const filteredMatches = matches.filter((match) => team === 'all' || match.homeCode === team || match.awayCode === team);
  matchesBody.replaceChildren();
  matchesEmpty.hidden = filteredMatches.length > 0;
  filteredMatches.forEach((match) => {
    const row = document.createElement('tr');
    const matchCell = document.createElement('td');
    const matchInfo = document.createElement('div');
    const badge = document.createElement('span');
    const name = document.createElement('span');
    const dateCell = document.createElement('td');
    const venueCell = document.createElement('td');
    const priceCell = document.createElement('td');
    const actionCell = document.createElement('td');
    const bookButton = document.createElement('button');

    matchInfo.className = 'match-cell';
    badge.className = 'team-badge';
    badge.textContent = `${match.homeCode} · ${match.awayCode}`;
    badge.setAttribute('aria-hidden', 'true');
    name.className = 'match-names';
    name.textContent = matchName(match);
    matchInfo.append(badge, name);
    matchCell.append(matchInfo);
    dateCell.textContent = `${displayDate(match.date)} · ${match.time}`;
    venueCell.className = 'match-venue';
    venueCell.textContent = match.venue;
    priceCell.className = 'price-cell';
    priceCell.textContent = priceText(match.basePrice);
    bookButton.className = 'table-book-button';
    bookButton.type = 'button';
    bookButton.textContent = 'Book';
    bookButton.setAttribute('aria-label', `Book ${matchName(match)}`);
    bookButton.addEventListener('click', () => {
      matchSelect.value = match.id;
      updateSummary();
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('customerName').focus({ preventScroll: true });
    });
    actionCell.append(bookButton);
    row.append(matchCell, dateCell, venueCell, priceCell, actionCell);
    matchesBody.append(row);
  });
}

function selectedMatch() {
  return matches.find((match) => match.id === matchSelect.value);
}

function selectedUnitPrice() {
  const match = selectedMatch();
  const category = categories[ticketCategory.value];
  return match && category ? Math.round(match.basePrice * category.multiplier) : null;
}

function updateSummary() {
  const match = selectedMatch();
  const category = categories[ticketCategory.value];
  const quantityNumber = Number(ticketQuantity.value);
  const quantity = Number.isInteger(quantityNumber) && quantityNumber > 0 ? quantityNumber : 0;
  const unitPrice = selectedUnitPrice();
  document.getElementById('summaryMatch').textContent = match ? `${matchName(match)} · ${displayDate(match.date)}` : 'Select a match to get started';
  document.getElementById('summaryCategory').textContent = category ? category.label : '—';
  document.getElementById('summaryPrice').textContent = unitPrice === null ? '—' : priceText(unitPrice);
  document.getElementById('summaryQuantity').textContent = String(quantity);
  document.getElementById('summaryTotal').textContent = unitPrice === null || quantity === 0 ? '—' : priceText(unitPrice * quantity);
}

function renderBookings() {
  bookingsBody.replaceChildren();
  bookings.forEach((booking) => {
    const match = matches.find((item) => item.id === booking.matchId);
    const category = categories[booking.category];
    if (!match || !category) return;
    const row = document.createElement('tr');
    const id = document.createElement('td');
    const matchCell = document.createElement('td');
    const categoryCell = document.createElement('td');
    const quantityCell = document.createElement('td');
    const totalCell = document.createElement('td');
    id.className = 'booking-id';
    id.textContent = booking.id;
    matchCell.textContent = matchName(match);
    categoryCell.textContent = category.label;
    quantityCell.textContent = String(booking.quantity);
    totalCell.className = 'price-cell';
    totalCell.textContent = priceText(booking.total);
    row.append(id, matchCell, categoryCell, quantityCell, totalCell);
    bookingsBody.append(row);
  });
  bookingsEmpty.hidden = bookingsBody.children.length > 0;
}

function setMessage(message, success = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle('success', success);
}

function newBookingId() {
  return `DEMO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

teamFilter.addEventListener('change', renderMatches);
matchSelect.addEventListener('change', updateSummary);
ticketCategory.addEventListener('change', updateSummary);
ticketQuantity.addEventListener('input', updateSummary);

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  setMessage('');
  if (!bookingForm.reportValidity()) {
    setMessage('Please check the highlighted fields and enter valid details.');
    return;
  }
  const match = selectedMatch();
  const category = categories[ticketCategory.value];
  const quantity = Number(ticketQuantity.value);
  const phone = document.getElementById('customerPhone').value.trim();
  const unitPrice = selectedUnitPrice();
  if (!match || !category) {
    setMessage('Please select a valid match and ticket category.');
    return;
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    setMessage('Ticket quantity must be a whole number between 1 and 10.');
    ticketQuantity.focus();
    return;
  }
  if (!/^[0-9+ .-]{7,20}$/.test(phone)) {
    setMessage('Please enter a valid phone number using 7 to 20 digits or phone symbols.');
    document.getElementById('customerPhone').focus();
    return;
  }
  if (unitPrice === null) {
    setMessage('The selected price could not be calculated. Please choose the match again.');
    return;
  }
  const booking = { id: newBookingId(), matchId: match.id, category: ticketCategory.value, quantity, total: unitPrice * quantity };
  bookings.unshift(booking);
  renderBookings();
  setMessage(`Demo booking created successfully. Your booking ID is ${booking.id}.`, true);
  document.getElementById('my-bookings').scrollIntoView({ behavior: 'smooth' });
});

const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  primaryNav.classList.toggle('open', !expanded);
});
primaryNav.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    primaryNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

populateSelects();
renderMatches();
renderBookings();
updateSummary();
