const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

document.querySelectorAll('.play-button').forEach(button => {
  button.addEventListener('click', () => {
    const mode = button.dataset.mode;
    document.getElementById('playNotice').textContent =
      `${mode} selected. This is a matchmaking preview; connect a game server to enable live multiplayer.`;
    showToast(`${mode} selected — multiplayer server not connected yet.`);
  });
});

// Safe math parser: evaluates only numeric literals and a small allowlist of operators/functions.
function tokenize(input) {
  const cleaned = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/√/g, 'sqrt');
  const tokens = [];
  const regex = /\s*(?:(\d+(?:\.\d*)?|\.\d+)|([a-zA-Z]+)|(\*\*|[+\-*/^(),]))/gy;
  let pos = 0;
  while (pos < cleaned.length) {
    regex.lastIndex = pos;
    const match = regex.exec(cleaned);
    if (!match) throw new Error(`Unexpected character near "${cleaned.slice(pos, pos + 8)}".`);
    tokens.push(match[1] ?? match[2]?.toLowerCase() ?? match[3]);
    pos = regex.lastIndex;
  }
  return tokens;
}
function parseMath(input) {
  const tokens = tokenize(input);
  let index = 0;
  const peek = () => tokens[index];
  const take = () => tokens[index++];
  function primary() {
    const token = take();
    if (token === undefined) throw new Error('Expression is incomplete.');
    if (token === '+') return primary();
    if (token === '-') return -primary();
    if (token === '(') {
      const value = expression();
      if (take() !== ')') throw new Error('Missing closing bracket.');
      return value;
    }
    if (typeof token === 'string' && /^\d/.test(token) || typeof token === 'string' && /^\.\d/.test(token)) return Number(token);
    if (token === 'pi') return Math.PI;
    if (token === 'e') return Math.E;
    if (token === 'sqrt' || token === 'abs' || token === 'sin' || token === 'cos' || token === 'tan' || token === 'log' || token === 'ln') {
      if (take() !== '(') throw new Error(`${token} must be followed by parentheses.`);
      const arg = expression();
      if (take() !== ')') throw new Error('Missing closing bracket.');
      if (token === 'sqrt') { if (arg < 0) throw new Error('Square root of a negative number is not a real result.'); return Math.sqrt(arg); }
      if (token === 'abs') return Math.abs(arg);
      if (token === 'sin') return Math.sin(arg);
      if (token === 'cos') return Math.cos(arg);
      if (token === 'tan') return Math.tan(arg);
      if (token === 'log') return Math.log10(arg);
      return Math.log(arg);
    }
    throw new Error(`Unknown value or function: ${token}`);
  }
  function power() {
    let value = primary();
    if (peek() === '^' || peek() === '**') { take(); value = value ** unary(); }
    return value;
  }
  function unary() {
    if (peek() === '+' || peek() === '-') return primary();
    return power();
  }
  function term() {
    let value = unary();
    while (peek() === '*' || peek() === '/') {
      const op = take(), right = unary();
      if (op === '/' && right === 0) throw new Error('Cannot divide by zero.');
      value = op === '*' ? value * right : value / right;
    }
    return value;
  }
  function expression() {
    let value = term();
    while (peek() === '+' || peek() === '-') {
      const op = take(), right = term();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }
  if (!tokens.length) throw new Error('Enter an expression first.');
  const result = expression();
  if (index !== tokens.length) throw new Error(`Unexpected token: ${tokens[index]}`);
  if (!Number.isFinite(result)) throw new Error('The result is not a finite number.');
  return result;
}
function solve() {
  const input = document.getElementById('mathInput').value.trim();
  const box = document.getElementById('solutionBox');
  try {
    if (!input) throw new Error('Enter a math expression first.');
    const result = parseMath(input);
    const formatted = Number.isInteger(result) ? result.toLocaleString('en-US') : Number(result.toPrecision(10)).toLocaleString('en-US');
    box.innerHTML = `<div class="result-label">FINAL ANSWER</div><div class="result-value">${formatted}</div><div class="steps-title">HOW TO READ IT</div><ol class="steps-list"><li>Follow brackets first, then powers and roots.</li><li>Complete multiplication and division from left to right.</li><li>Complete addition and subtraction from left to right.</li><li>The expression evaluates to <strong>${formatted}</strong>.</li></ol>`;
  } catch (error) {
    box.innerHTML = `<p class="error-text">${error.message.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}</p>`;
  }
}
document.getElementById('solveButton').addEventListener('click', solve);
document.getElementById('mathInput').addEventListener('keydown', event => { if (event.key === 'Enter') solve(); });
document.querySelectorAll('[data-expression]').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('mathInput').value = button.dataset.expression;
    solve();
  });
});

let coins = 0;
let rewardClaimed = false;
function renderCoins() {
  document.getElementById('coinBalance').innerHTML = `${coins.toLocaleString('en-US')} <em>COINS</em>`;
}
document.getElementById('dailyReward').addEventListener('click', () => {
  if (rewardClaimed) return showToast('Daily reward already claimed in this session.');
  rewardClaimed = true;
  coins += 150;
  renderCoins();
  document.getElementById('dailyReward').textContent = 'REWARD CLAIMED';
  showToast('Daily reward claimed: +150 coins.');
});
document.querySelectorAll('.buy-button').forEach(button => {
  button.addEventListener('click', () => {
    const cost = Number(button.dataset.cost);
    const item = button.dataset.item;
    if (coins < cost) return showToast('Not enough coins for this item.');
    coins -= cost;
    renderCoins();
    document.getElementById('shopNotice').textContent = `${item} unlocked in this demo session. Inventory and payments are not connected.`;
    showToast(`${item} unlocked. ${cost} coins used.`);
  });
});
document.getElementById('profileButton').addEventListener('click', () => showToast('Guest profile preview. Account login is not connected.'));
