import express from 'express';
import { NSE, BSE } from 'nse-bse-api';

const app = express();
const PORT = process.env.PORT || 3000;

let nse, bse;

// Initialize with retry
async function init() {
  try {
    nse = new NSE();
    bse = new BSE();
    console.log('✅ NSE & BSE clients ready');
  } catch (e) {
    console.error('Init failed, retrying in 5s...', e.message);
    setTimeout(init, 5000);
  }
}
init();

const today = () => new Date();
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'NSE/BSE API running' });
});

// ── NSE Routes ──────────────────────────────────────

app.get('/nse/market-status', async (req, res) => {
  try { res.json(await nse.market.getStatus()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/nse/corporate-actions', async (req, res) => {
  try {
    res.json(await nse.corporate.getActions({
      from_date: daysAgo(7),
      to_date: today()
    }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/nse/gainers', async (req, res) => {
  try { res.json(await nse.market.getGainers()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/nse/losers', async (req, res) => {
  try { res.json(await nse.market.getLosers()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/nse/results-calendar', async (req, res) => {
  try { res.json(await nse.market.getEventCalendar()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/nse/ipos', async (req, res) => {
  try { res.json(await nse.ipo.listCurrentIPO()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/nse/quote/:symbol', async (req, res) => {
  try { res.json(await nse.equityQuote(req.params.symbol.toUpperCase())); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/nse/options/:symbol', async (req, res) => {
  try { res.json(await nse.options.getOptionChain(req.params.symbol.toUpperCase())); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── BSE Routes ──────────────────────────────────────

app.get('/bse/corporate-actions', async (req, res) => {
  try {
    res.json(await bse.actions({
      fromDate: daysAgo(7),
      toDate: today()
    }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/bse/gainers', async (req, res) => {
  try { res.json(await bse.gainers()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/bse/losers', async (req, res) => {
  try { res.json(await bse.losers()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/bse/announcements', async (req, res) => {
  try {
    res.json(await bse.announcements({
      fromDate: daysAgo(1),
      toDate: today()
    }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/bse/results-calendar', async (req, res) => {
  try { res.json(await bse.resultCalendar()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/bse/quote/:scripcode', async (req, res) => {
  try { res.json(await bse.quote(req.params.scripcode)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

**`.gitignore`**
```
node_modules/
downloads/
.env
