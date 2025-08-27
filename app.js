const PRICES = [25, 50, 75, 100, 125, 150, 200, 250, 500, 1000];

function byId(id) { return document.getElementById(id); }

// Storage helpers for simulated sold tickets and last purchase
const STORAGE_KEYS = {
  sold: 'tbe_sold',
  lastPurchase: 'tbe_last_purchase'
};

function readSold() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.sold) || '{}'); }
  catch { return {}; }
}
function writeSold(data) {
  localStorage.setItem(STORAGE_KEYS.sold, JSON.stringify(data));
}
function getSoldForPrice(price) {
  const map = readSold();
  const arr = Array.isArray(map[price]) ? map[price] : [];
  return new Set(arr);
}
function saveSoldForPrice(price, soldSet) {
  const map = readSold();
  map[price] = Array.from(soldSet.values()).sort((a,b)=>a-b);
  writeSold(map);
}
function saveLastPurchase(payload) {
  localStorage.setItem(STORAGE_KEYS.lastPurchase, JSON.stringify(payload));
}
function readLastPurchase() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.lastPurchase) || 'null'); }
  catch { return null; }
}

function initIndex() {
  const grid = byId('priceGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PRICES.forEach((amount) => {
    const a = document.createElement('a');
    const variant = 1 + Math.floor(Math.random() * 6);
    a.className = `price-card card-g${variant}`;
    a.href = `tickets.html?price=${encodeURIComponent(amount)}`;

    const badge = document.createElement('div');
    badge.className = 'card-badge';
    badge.textContent = 'Popular';

    const content = document.createElement('div');
    content.className = 'card-content';
    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `₹${amount}`;
    const sub = document.createElement('div');
    sub.className = 'sub';
    sub.textContent = 'Tap to view tickets';
    content.appendChild(price);
    content.appendChild(sub);

    a.appendChild(badge);
    a.appendChild(content);
    grid.appendChild(a);
  });

  const buyBtn = byId('buyBtn');
  const drawBtn = byId('drawBtn');
  if (buyBtn) buyBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
  if (drawBtn) drawBtn.addEventListener('click', () => { window.location.href = 'draw.html'; });
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function initTickets() {
  const price = getQueryParam('price');
  const priceNum = price ? Number(price) : null;
  const title = byId('ticketsTitle');
  const grid = byId('ticketsGrid');
  if (!title || !grid) return;
  title.textContent = priceNum ? `Tickets for ₹${priceNum}` : 'Tickets';

  // Determine ticket count by price
  const counts = [
    { list: [25,50,75], count: 100 },
    { list: [100,125,150], count: 50 },
    { list: [200,250], count: 25 },
    { list: [500], count: 10 },
    { list: [1000], count: 5 }
  ];
  let totalTickets = 5;
  for (const c of counts) {
    if (c.list.includes(priceNum)) { totalTickets = c.count; break; }
  }

  const soldSet = getSoldForPrice(priceNum);
  const selectionSet = new Set();

  function renderGrid() {
    grid.innerHTML = '';
    for (let i = 1; i <= totalTickets; i++) {
      const variant = 1 + Math.floor(Math.random() * 6);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `price-card card-g${variant}`;
      card.setAttribute('data-idx', String(i));
      const content = document.createElement('div');
      content.className = 'card-content';
      const title = document.createElement('div');
      title.className = 'price';
      title.textContent = `Ticket ${i}`;
      const sub = document.createElement('div');
      sub.className = 'sub';
      sub.textContent = `₹${priceNum}`;
      content.appendChild(title);
      content.appendChild(sub);
      card.appendChild(content);

      if (soldSet.has(i)) {
        card.classList.add('ticket-sold');
        const badge = document.createElement('div');
        badge.className = 'sold-badge';
        badge.textContent = 'SOLD';
        card.appendChild(badge);
      } else {
        card.addEventListener('click', () => {
          if (selectionSet.has(i)) selectionSet.delete(i); else selectionSet.add(i);
          updateSelectionUI();
          card.classList.toggle('ticket-selected');
        });
      }

      grid.appendChild(card);
    }
  }

  function updateSelectionUI() {
    const wrap = byId('currentSelection');
    if (!wrap) return;
    wrap.innerHTML = '';
    Array.from(selectionSet).sort((a,b)=>a-b).forEach(n => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = `Ticket ${n}`;
      wrap.appendChild(chip);
    });
    updateSoldSummaryUI();
  }

  function updateSoldSummaryUI() {
    const area = byId('soldSummary');
    if (!area) return;
    area.innerHTML = '';
    const soldCount = soldSet.size;
    const totalAmount = soldCount * priceNum;
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = `${priceNum} rupees = ${soldCount} tickets sold • Total ₹${totalAmount}`;
    area.appendChild(chip);
  }

  renderGrid();
  updateSelectionUI();

  const backBtn = byId('backBtn');
  if (backBtn) backBtn.addEventListener('click', () => { window.location.href = 'index.html'; });

  const goDrawBtn = byId('goDrawBtn');
  if (goDrawBtn) goDrawBtn.addEventListener('click', () => { window.location.href = 'draw.html'; });

  const homeBtn = byId('homeBtn');
  if (homeBtn) homeBtn.addEventListener('click', () => { window.location.href = 'index.html'; });

  const checkoutBtn = byId('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    const tickets = Array.from(selectionSet).sort((a,b)=>a-b);
    if (tickets.length === 0) { alert('Please select at least one ticket for checkout.'); return; }
    const total = tickets.length * priceNum;
    // Do not mark sold yet; just carry to checkout. Finalize on Pay.
    localStorage.setItem('tbe_checkout', JSON.stringify({ price: priceNum, tickets, total }));
    window.location.href = 'checkout.html';
  });
}

function initDraw() {
  // Initialize all draw sections
  initUpcomingDraws();
  initActiveDraws();
  initCompletedDraws();
  initMyTickets();
  
  // Add event listeners
  const backBtn = byId('backBtn');
  const homeBtn = byId('homeBtn');
  const refreshBtn = byId('refreshBtn');
  
  if (backBtn) backBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
  if (homeBtn) homeBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
  if (refreshBtn) refreshBtn.addEventListener('click', () => { 
    initUpcomingDraws();
    initActiveDraws();
    initCompletedDraws();
    initMyTickets();
  });
}

function initUpcomingDraws() {
  const container = byId('upcomingDraws');
  if (!container) return;
  
  // Get upcoming draws from local data
  const draws = window.tickBuyEarnData.getUpcomingDraws();
  
  container.innerHTML = '';
  if (draws.length === 0) {
    container.innerHTML = '<p class="muted">No upcoming draws scheduled.</p>';
    return;
  }
  
  draws.forEach(draw => {
    const drawCard = createDrawCard(draw, 'upcoming');
    container.appendChild(drawCard);
  });
}

function initActiveDraws() {
  const container = byId('activeDraws');
  if (!container) return;
  
  // Get active draws from local data
  const draws = window.tickBuyEarnData.getActiveDraws();
  
  container.innerHTML = '';
  if (draws.length === 0) {
    container.innerHTML = '<p class="muted">No active draws at the moment.</p>';
    return;
  }
  
  draws.forEach(draw => {
    const drawCard = createDrawCard(draw, 'active');
    container.appendChild(drawCard);
  });
}

function initCompletedDraws() {
  const container = byId('completedDraws');
  if (!container) return;
  
  // Get completed draws from local data
  const draws = window.tickBuyEarnData.getCompletedDraws();
  
  container.innerHTML = '';
  if (draws.length === 0) {
    container.innerHTML = '<p class="muted">No completed draws yet.</p>';
    return;
  }
  
  draws.forEach(draw => {
    const drawCard = createCompletedDrawCard(draw);
    container.appendChild(drawCard);
  });
}

function initMyTickets() {
  const container = byId('myTickets');
  if (!container) return;
  
  // Get tickets from local data
  const tickets = window.tickBuyEarnData.getMyTickets();
  
  container.innerHTML = '';
  tickets.forEach(ticket => {
    const ticketItem = createTicketItem(ticket);
    container.appendChild(ticketItem);
  });
}

function createDrawCard(draw, type) {
  const card = document.createElement('div');
  card.className = 'draw-card';
  
  const statusClass = `status-${draw.status.toLowerCase().replace('_', '-')}`;
  const statusText = draw.status.replace('_', ' ').toUpperCase();
  
  card.innerHTML = `
    <h3>Draw #${draw.id}</h3>
    <div class="draw-date">${formatDateTime(draw.drawDate)}</div>
    <div class="draw-status ${statusClass}">${statusText}</div>
    <div class="draw-info">
      <div class="info-item">
        <div class="info-label">Total Amount</div>
        <div class="info-value">₹${draw.totalAmount || 0}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Tickets</div>
        <div class="info-value">${draw.totalTickets || 0}</div>
      </div>
    </div>
    <div class="draw-actions">
      ${type === 'active' ? `<button class="btn btn-small primary" onclick="participateInDraw(${draw.id})">Participate</button>` : ''}
      ${type === 'active' ? `<button class="btn btn-small secondary" onclick="startDraw(${draw.id})">Start Draw</button>` : ''}
    </div>
  `;
  
  return card;
}

function createCompletedDrawCard(draw) {
  const card = document.createElement('div');
  card.className = 'draw-card';
  
  card.innerHTML = `
    <h3>Draw #${draw.drawId} - COMPLETED</h3>
    <div class="draw-date">${formatDateTime(draw.drawDate)}</div>
    <div class="draw-status status-completed">COMPLETED</div>
    <div class="draw-info">
      <div class="info-item">
        <div class="info-label">Winner</div>
        <div class="info-value">${draw.winnerName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Ticket</div>
        <div class="info-value">${draw.ticketNumber}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Prize</div>
        <div class="info-value">₹${draw.prizeAmount}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Participants</div>
        <div class="info-value">${draw.totalParticipants}</div>
      </div>
    </div>
  `;
  
  return card;
}

function createTicketItem(ticket) {
  const item = document.createElement('div');
  item.className = 'ticket-item';
  
  item.innerHTML = `
    <div class="ticket-number">${ticket.number}</div>
    <div class="ticket-price">₹${ticket.price}</div>
    <div class="ticket-status">${ticket.status}</div>
  `;
  
  return item;
}

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function participateInDraw(drawId) {
  // Get selected tickets (in a real app, you'd have a way to select tickets)
  const ticketIds = [1, 2, 3]; // Sample ticket IDs
  
  if (window.tickBuyEarnData.participateInDraw(drawId, ticketIds)) {
    alert('Successfully participated in draw!');
    // Refresh the page to show updated data
    location.reload();
  } else {
    alert('Failed to participate in draw. Please try again.');
  }
}

function startDraw(drawId) {
  if (confirm(`Are you sure you want to start draw #${drawId}? This action cannot be undone.`)) {
    const winner = window.tickBuyEarnData.selectWinner(drawId);
    if (winner) {
      alert(`🎉 Draw completed! Winner: ${winner.winnerName} with ticket ${winner.ticketNumber}. Prize: ₹${winner.prizeAmount}`);
      // Refresh the page to show updated data
      location.reload();
    } else {
      alert('Failed to complete draw. Please try again.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initIndex();
  initTickets();
  initDraw();
});


