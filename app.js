(() => {
  const app = document.querySelector('#app');

  const copy = {
    en: {
      pumpReady: 'Pump ready', help: 'Need help? Press the assistance button',
      selectLanguage: 'Choose Language / भाषा चुनें', languageSub: 'Select the language you would like to continue in.',
      selectFuel: 'Select Fuel', fuelSub: 'Choose the fuel for your vehicle.',
      fillBy: 'How would you like to fill?', fillSub: 'Choose an amount, litres, or fill the tank completely.',
      amount: 'Amount / ₹', litres: 'Litres / L', fullTank: 'Full Tank',
      enterAmount: 'Enter Amount', enterLitres: 'Enter Litres', chooseAmount: 'Choose an amount', customAmount: 'Enter custom amount',
      payment: 'Mode of Transaction', paymentSub: 'Choose how you would like to pay.',
      upi: 'UPI', card: 'Card Transaction', scanPay: 'Scan to Pay', scanSub: 'Use any UPI app to scan this QR code.',
      insertCard: 'Tap or insert your card', cardSub: 'Follow the instructions on the card terminal beside the screen.',
      verifying: 'Verifying payment…', paymentVerified: 'Payment Verified', paymentComplete: 'Your payment was successful.',
      getSms: 'Get SMS', printBill: 'Print Bill', tutorial: 'Tutorial', tutorialSub: 'A quick guide before you begin.',
      chooseNozzle: 'Choose the nozzle', nozzleSub: 'Take the highlighted nozzle from the pump.',
      petrolNozzle: 'PETROL nozzle', dieselNozzle: 'DIESEL nozzle',
      fuelling: 'Fuelling in progress', placeNozzle: 'Place the nozzle in your tank and press the clutch.',
      complete: 'Fuelling complete', replaceNozzle: 'Please place the nozzle back on the pump.', done: 'Done', restart: 'Start another transaction',
      back: 'Back', next: 'Next', skip: 'Skip tutorial', continue: 'Continue', step: 'Step'
    },
    hi: {
      pumpReady: 'पंप तैयार है', help: 'मदद चाहिए? सहायता बटन दबाएँ',
      selectLanguage: 'भाषा चुनें / Choose Language', languageSub: 'आगे बढ़ने के लिए अपनी भाषा चुनें।',
      selectFuel: 'ईंधन चुनें', fuelSub: 'अपने वाहन के लिए ईंधन चुनें।',
      fillBy: 'आप कितना भरना चाहते हैं?', fillSub: 'राशि, लीटर या पूरा टैंक चुनें।',
      amount: 'राशि / ₹', litres: 'लीटर / L', fullTank: 'पूरा टैंक',
      enterAmount: 'राशि दर्ज करें', enterLitres: 'लीटर दर्ज करें', chooseAmount: 'राशि चुनें', customAmount: 'अन्य राशि दर्ज करें',
      payment: 'भुगतान का तरीका', paymentSub: 'भुगतान करने का तरीका चुनें।',
      upi: 'यूपीआई', card: 'कार्ड भुगतान', scanPay: 'स्कैन करके भुगतान करें', scanSub: 'किसी भी UPI ऐप से QR कोड स्कैन करें।',
      insertCard: 'कार्ड टैप या डालें', cardSub: 'स्क्रीन के पास कार्ड मशीन के निर्देशों का पालन करें।',
      verifying: 'भुगतान जाँचा जा रहा है…', paymentVerified: 'भुगतान सफल', paymentComplete: 'आपका भुगतान सफल रहा।',
      getSms: 'SMS पाएँ', printBill: 'बिल प्रिंट करें', tutorial: 'ट्यूटोरियल', tutorialSub: 'शुरू करने से पहले छोटा सा निर्देश।',
      chooseNozzle: 'नोज़ल चुनें', nozzleSub: 'पंप से चमकता हुआ नोज़ल उठाएँ।',
      petrolNozzle: 'पेट्रोल नोज़ल', dieselNozzle: 'डीज़ल नोज़ल',
      fuelling: 'ईंधन भरा जा रहा है', placeNozzle: 'नोज़ल टैंक में रखें और लीवर दबाएँ।',
      complete: 'ईंधन भर गया', replaceNozzle: 'कृपया नोज़ल वापस पंप पर रखें।', done: 'पूरा हुआ', restart: 'नया लेन-देन',
      back: 'पीछे', next: 'आगे', skip: 'ट्यूटोरियल छोड़ें', continue: 'जारी रखें', step: 'चरण'
    }
  };

  const steps = ['language','fuel','fill','value','payment','pay','verified','tutorial','nozzle','fuelling','complete'];
  const state = { step: 'language', lang: null, fuel: null, fill: null, value: '', payment: null, tutorialIndex: 0, currentAmount: 0, timer: null };
  const t = key => copy[state.lang || 'en'][key] || copy.en[key] || key;
  const fuelLabel = () => state.fuel === 'diesel' ? (state.lang === 'hi' ? 'डीज़ल' : 'Diesel') : (state.lang === 'hi' ? 'पेट्रोल' : 'Petrol');
  const targetAmount = () => {
    if (state.fill === 'amount') return Number(state.value || 0);
    if (state.fill === 'litres') return Math.round(Number(state.value || 0) * (state.fuel === 'diesel' ? 89 : 97));
    return 3500;
  };
  const targetLitres = () => state.fill === 'litres' ? Number(state.value || 0) : targetAmount() / (state.fuel === 'diesel' ? 89 : 97);
  const currency = n => `₹${Math.round(Number(n || 0)).toLocaleString('en-IN')}`;
  const head = title => `<div class="screen-head"><h1>${title}</h1></div>`;
  const actions = (nextDisabled = false, nextLabel = t('next')) => `<div class="action-row"><button class="nav-button" data-action="back" aria-label="${t('back')}" ${state.step === 'language' ? 'disabled' : ''}>‹</button><button class="primary-button" data-action="next" ${nextDisabled ? 'disabled' : ''}>${nextLabel}</button></div>`;

  function render() {
    clearInterval(state.timer);
    document.documentElement.lang = state.lang === 'hi' ? 'hi' : 'en';
    const views = { language, fuel, fill, value, payment, pay, verified, tutorial, nozzle, fuelling, complete };
    app.innerHTML = `<div class="screen">${views[state.step]()}</div>`;
    app.focus({preventScroll:true});
    if (state.step === 'pay') runPaymentTimer();
    if (state.step === 'fuelling') runFuelling();
  }

  function language() {
    return `${head(t('selectLanguage'))}<div class="choices language-grid">
      <button class="choice-button ${state.lang === 'en' ? 'selected' : ''}" data-select="lang" data-value="en"><strong>English</strong></button>
      <button class="choice-button lime ${state.lang === 'hi' ? 'selected' : ''}" data-select="lang" data-value="hi"><strong>हिन्दी</strong></button>
    </div>${actions(!state.lang)}`;
  }

  function fuel() {
    return `${head(t('selectFuel'))}<div class="choices">
      <button class="choice-button petrol ${state.fuel === 'petrol' ? 'selected' : ''}" data-select="fuel" data-value="petrol"><strong>Petrol</strong></button>
      <button class="choice-button diesel ${state.fuel === 'diesel' ? 'selected' : ''}" data-select="fuel" data-value="diesel"><strong>Diesel</strong></button>
    </div>${actions(!state.fuel)}`;
  }

  function fill() {
    return `${head(t('fillBy'))}<div class="choices">
      ${[['amount',t('amount')],['litres',t('litres')],['full',t('fullTank')]].map(([v,label]) => `<button class="choice-button ${state.fill === v ? 'selected' : ''}" data-select="fill" data-value="${v}">${label}</button>`).join('')}
    </div>${actions(!state.fill)}`;
  }

  function value() {
    if (state.fill === 'full') return payment();
    if (!state.value) {
      const presets = state.fill === 'amount' ? [100,200,500,1000,2000,3000] : [1,2,5,10,20,30];
      const label = state.fill === 'amount' ? t('chooseAmount') : t('enterLitres');
      return `${head(label)}<div class="choices amount-presets">
        ${presets.map(v => `<button class="choice-button" data-action="preset" data-value="${v}">${state.fill === 'amount' ? currency(v) : `${v} L`}</button>`).join('')}
        <button class="choice-button lime" data-action="custom">${t('customAmount')}</button>
      </div><div class="action-row"><button class="nav-button" data-action="back" aria-label="${t('back')}">‹</button></div>`;
    }
    const displayValue = state.fill === 'amount' ? currency(state.value) : `${state.value || '0'} L`;
    return `${head(state.fill === 'amount' ? t('enterAmount') : t('enterLitres'))}<div class="display"><strong>${displayValue}</strong></div>
      <div class="keypad">${[1,2,3,4,5,6,7,8,9].map(v => `<button class="key" data-action="key" data-value="${v}">${v}</button>`).join('')}<button class="key erase" data-action="erase" aria-label="Delete">⌫</button><button class="key zero" data-action="key" data-value="0">0</button></div>
      ${actions(Number(state.value) <= 0 || (state.fill === 'amount' && Number(state.value) < 50),t('continue'))}`;
  }

  function payment() {
    return `${head(t('payment'))}<div class="choices">
      <button class="choice-button ${state.payment === 'upi' ? 'selected' : ''}" data-select="payment" data-value="upi"><strong>${t('upi')}</strong></button>
      <button class="choice-button ${state.payment === 'card' ? 'selected' : ''}" data-select="payment" data-value="card"><strong>${t('card')}</strong></button>
    </div>${actions(!state.payment,t('continue'))}`;
  }

  function qrMarkup() {
    let cells = '';
    for (let i = 0; i < 121; i++) {
      const x = i % 11, y = Math.floor(i / 11);
      const finder = ((x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7));
      const on = finder ? (x % 2 === 0 || y % 2 === 0) : ((i * 7 + x * 3 + y) % 5 < 2);
      cells += `<i class="${on ? 'on' : ''}"></i>`;
    }
    return `<div class="qr-code" aria-label="Demo QR code">${cells}</div>`;
  }

  function pay() {
    const amount = currency(targetAmount());
    const paymentVisual = state.payment === 'upi'
      ? `<div class="qr-panel"><div class="timer-line"><span>Time remaining · <strong id="timeLeft">4:59</strong></span><span class="timer-track"><span class="timer-fill" id="timerFill"></span></span></div>${qrMarkup()}</div>`
      : `<div class="card-panel"><div class="card-icon pulse"></div><h2>${t('insertCard')}</h2><button class="primary-button dark" data-action="simulate-payment">Simulate card approved</button></div>`;
    return `${head(state.payment === 'upi' ? t('scanPay') : t('insertCard'))}<div class="payment-layout">${paymentVisual}<div class="summary-box"><h2>${amount}</h2><p>${fuelLabel()}</p>${state.payment === 'upi' ? '<button class="primary-button dark" data-action="simulate-payment">Simulate payment received</button>' : ''}<p class="subhead" id="paymentStatus"></p></div></div><div class="action-row"><button class="nav-button" data-action="back" aria-label="${t('back')}">‹</button></div>`;
  }

  function verified() {
    return `<div class="success-screen"><div class="success-badge"><span>✓</span></div><h1>${t('paymentVerified')}</h1><p class="subhead">${currency(targetAmount())} · ${fuelLabel()}<br>${t('paymentComplete')}</p><div class="receipt-actions"><button class="primary-button" data-action="sms">${t('getSms')}</button><button class="primary-button" data-action="print">${t('printBill')}</button></div><button class="primary-button" style="margin-top:18px" data-action="next">${t('continue')}</button></div>`;
  }

  const tutorialSlides = [
    ['⛽','Choose the highlighted nozzle','The correct nozzle will blink on the pump.'],
    ['↘','Insert the nozzle fully','Push it into your vehicle tank until secure.'],
    ['✋','Press and hold the lever','Fuelling stops automatically at your selected value.']
  ];
  function tutorial() {
    const [icon,title,body] = tutorialSlides[state.tutorialIndex];
    return `${head(t('tutorial'))}<div class="tutorial-panel"><div class="tutorial-visual"><div><div class="pump-symbol">${icon}</div><strong>${title}</strong></div></div><div class="tutorial-copy"><strong>${state.tutorialIndex + 1}. ${title}</strong><p>${body}</p><div class="tutorial-dots">${tutorialSlides.map((_,i)=>`<i class="${i===state.tutorialIndex?'active':''}"></i>`).join('')}</div></div></div><div class="action-row"><button class="link-button" data-action="skip">${t('skip')}</button><button class="primary-button" data-action="tutorial-next">${state.tutorialIndex === 2 ? t('continue') : t('next')}</button></div>`;
  }

  function nozzle() {
    return `${head(t('chooseNozzle'))}<div class="nozzle-grid"><div class="nozzle ${state.fuel === 'petrol' ? 'active' : ''}"><div><span class="nozzle-icon">⛽</span><strong>${t('petrolNozzle')}</strong></div></div><div class="nozzle ${state.fuel === 'diesel' ? 'active' : ''}"><div><span class="nozzle-icon">⛽</span><strong>${t('dieselNozzle')}</strong></div></div></div><div class="action-row"><button class="primary-button dark" data-action="next">Nozzle lifted</button></div>`;
  }

  function fuelling() {
    return `${head(t('fuelling'))}<div class="fuel-panel"><div class="live-amount" id="liveAmount">₹0</div><div class="live-litres" id="liveLitres">0.00 L</div><div class="progress-shell"><div class="progress-bar" id="fuelBar" style="--progress:0%"></div></div><p class="instruction">${t('placeNozzle')}</p></div>`;
  }

  function complete() {
    return `<div class="complete-screen"><div class="complete-card"><div class="check-circle">✓</div><h1>${t('complete')}</h1><p class="subhead">${t('replaceNozzle')}</p><div class="final-amount">${currency(targetAmount())}</div><strong>${targetLitres().toFixed(2)} L · ${fuelLabel()}</strong><br><button class="primary-button dark" data-action="restart">${t('done')}</button></div><button class="link-button" style="margin-top:24px" data-action="restart">${t('restart')}</button></div>`;
  }

  function next() {
    const map = { language:'fuel', fuel:'fill', fill: state.fill === 'full' ? 'payment' : 'value', value:'payment', payment:'pay', verified:'tutorial', nozzle:'fuelling' };
    if (map[state.step]) { state.step = map[state.step]; render(); }
  }

  function back() {
    const map = { fuel:'language', fill:'fuel', value:'fill', payment: state.fill === 'full' ? 'fill' : 'value', pay:'payment', tutorial:'verified', nozzle:'tutorial' };
    if (map[state.step]) { state.step = map[state.step]; if (state.step === 'value' && state.value === '__custom') state.value=''; render(); }
  }

  function runPaymentTimer() {
    if (state.payment !== 'upi') return;
    let seconds = 299;
    state.timer = setInterval(() => {
      seconds--;
      const label = document.querySelector('#timeLeft');
      const fill = document.querySelector('#timerFill');
      if (label) label.textContent = `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
      if (fill) fill.style.width = `${seconds/299*100}%`;
    },1000);
  }

  function verifyPayment() {
    const status = document.querySelector('#paymentStatus');
    if (status) status.textContent = t('verifying');
    document.querySelectorAll('[data-action="simulate-payment"]').forEach(b => b.disabled = true);
    setTimeout(() => { state.step = 'verified'; render(); }, 1100);
  }

  function runFuelling() {
    const total = targetAmount();
    const litres = targetLitres();
    const start = performance.now();
    const duration = 5200;
    function tick(now) {
      if (state.step !== 'fuelling') return;
      const pct = Math.min(1,(now-start)/duration);
      const eased = 1 - Math.pow(1-pct,3);
      const a = total * eased, l = litres * eased;
      const amountEl = document.querySelector('#liveAmount');
      const litreEl = document.querySelector('#liveLitres');
      const bar = document.querySelector('#fuelBar');
      if (amountEl) amountEl.textContent = currency(a);
      if (litreEl) litreEl.textContent = `${l.toFixed(2)} L`;
      if (bar) bar.style.setProperty('--progress',`${eased*100}%`);
      if (pct < 1) requestAnimationFrame(tick);
      else setTimeout(() => { if (state.step === 'fuelling') { state.step='complete'; render(); } },700);
    }
    requestAnimationFrame(tick);
  }

  function toast(message) {
    document.querySelector('.toast')?.remove();
    const el = document.createElement('div'); el.className='toast'; el.textContent=message; document.body.append(el);
    setTimeout(()=>el.remove(),2400);
  }

  function restart() {
    Object.assign(state,{step:'language',lang:null,fuel:null,fill:null,value:'',payment:null,tutorialIndex:0,currentAmount:0});
    render();
  }

  document.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.dataset.select) {
      state[button.dataset.select] = button.dataset.value;
      if (button.dataset.select === 'fill') state.value = '';
      render(); return;
    }
    const action = button.dataset.action;
    if (action === 'next') next();
    if (action === 'back') back();
    if (action === 'preset') { state.value=button.dataset.value; render(); }
    if (action === 'custom') { state.value='0'; render(); }
    if (action === 'key') { state.value = state.value === '0' ? button.dataset.value : `${state.value}${button.dataset.value}`.slice(0,5); render(); }
    if (action === 'erase') { state.value = state.value.slice(0,-1) || '0'; render(); }
    if (action === 'simulate-payment') verifyPayment();
    if (action === 'sms') toast(state.lang === 'hi' ? 'रसीद SMS भेज दिया गया' : 'Receipt sent by SMS');
    if (action === 'print') toast(state.lang === 'hi' ? 'बिल प्रिंट हो रहा है' : 'Printing receipt');
    if (action === 'tutorial-next') { if (state.tutorialIndex < 2) { state.tutorialIndex++; render(); } else { state.step='nozzle'; render(); } }
    if (action === 'skip') { state.step='nozzle'; render(); }
    if (action === 'restart') restart();
  });

  window.fuelFlow = {
    startTransaction: ({language='en', fuel='petrol', fillBy='amount', value=500, payment='upi'}={}) => {
      Object.assign(state,{lang:language,fuel,fill:fillBy,value:String(value),payment,step:'pay'}); render();
      return {status:'ready_for_payment', amount:targetAmount(), fuel};
    },
    reset: restart,
    getState: () => ({...state, timer:undefined})
  };

  const modelContext = document.modelContext;
  if (modelContext?.registerTool) {
    const valid = {
      language: ['en','hi'], fuel: ['petrol','diesel'],
      fillBy: ['amount','litres','full'], payment: ['upi','card']
    };
    Promise.resolve(modelContext.registerTool({
      name: 'start_fuel_transaction',
      title: 'Start fuel transaction',
      description: 'Configure a fuel purchase and open the matching payment screen in the kiosk.',
      inputSchema: {
        type: 'object',
        properties: {
          language: {type:'string',enum:valid.language},
          fuel: {type:'string',enum:valid.fuel},
          fillBy: {type:'string',enum:valid.fillBy},
          value: {type:'number',minimum:0},
          payment: {type:'string',enum:valid.payment}
        },
        required: ['language','fuel','fillBy','payment'],
        additionalProperties: false
      },
      annotations: {readOnlyHint:false,untrustedContentHint:false},
      execute(input) {
        if (!input || !valid.language.includes(input.language) || !valid.fuel.includes(input.fuel) || !valid.fillBy.includes(input.fillBy) || !valid.payment.includes(input.payment)) throw new Error('Invalid transaction options.');
        if (input.fillBy !== 'full' && !(Number(input.value) > 0)) throw new Error('A positive value is required for amount or litres.');
        return window.fuelFlow.startTransaction(input);
      }
    })).catch(()=>{});
    Promise.resolve(modelContext.registerTool({
      name: 'read_fuel_transaction',
      title: 'Read fuel transaction',
      description: 'Read the current kiosk step and selected transaction options.',
      inputSchema: {type:'object',properties:{},additionalProperties:false},
      annotations: {readOnlyHint:true,untrustedContentHint:false},
      execute() { return window.fuelFlow.getState(); }
    })).catch(()=>{});
    Promise.resolve(modelContext.registerTool({
      name: 'reset_fuel_transaction',
      title: 'Reset fuel transaction',
      description: 'Clear the current choices and return the kiosk to language selection.',
      inputSchema: {type:'object',properties:{},additionalProperties:false},
      annotations: {readOnlyHint:false,untrustedContentHint:false},
      execute() { window.fuelFlow.reset(); return {status:'reset'}; }
    })).catch(()=>{});
  }

  render();
})();
