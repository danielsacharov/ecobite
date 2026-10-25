import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2,
  Clock3, CreditCard, Headset, Leaf, LoaderCircle, MapPin, MessageCircle,
  PackageCheck, Send, ShieldCheck, Star, X,
} from 'lucide-react';

const scenarios = [
  { id: 'success', title: 'Successful order', description: 'Checkout, follow your delivery, and leave a quick rating.', icon: '↗', tone: 'green' },
  { id: 'payment', title: 'Payment failed', description: 'Recover from a payment issue without losing your details.', icon: '↻', tone: 'coral' },
  { id: 'payment-unavailable', title: 'Payment method unavailable', description: 'Switch to another payment method when one is unavailable.', icon: '⊘', tone: 'slate' },
  { id: 'network', title: 'Network problem', description: 'Recover from a connection interruption without losing your order details.', icon: '⌁', tone: 'blue' },
  { id: 'slow-network', title: 'Slow network', description: 'Stay on the checkout screen while a slow connection finishes safely.', icon: '⌛', tone: 'amber' },
  { id: 'wrong-address', title: 'Wrong delivery address', description: 'Correct an address before placing the order.', icon: '⌖', tone: 'coral' },
  { id: 'unavailable', title: 'Item unavailable', description: 'Choose a replacement when an item is no longer available.', icon: '◌', tone: 'amber' },
  { id: 'delayed', title: 'Delivery delayed', description: 'Get a revised arrival time and a clear next step.', icon: '◷', tone: 'blue' },
  { id: 'issue', title: 'Delivery issue', description: 'Reach your courier or get help from the support team.', icon: '!', tone: 'coral' },
  { id: 'cancel', title: 'Cancellation and refund', description: 'Check eligibility and understand your refund status.', icon: '↩', tone: 'slate' },
  { id: 'restaurant-cancel', title: 'Restaurant cancels the order', description: 'Understand a restaurant cancellation and follow your refund.', icon: '×', tone: 'coral' },
  { id: 'feedback', title: 'Post-delivery feedback', description: 'Rate your order and share any extra feedback.', icon: '☆', tone: 'yellow' },
];

const PAYMENT_METHODS = [
  { id: 'card', name: 'Visa ending in 4242', mark: 'VISA' },
  { id: 'paypal', name: 'PayPal', mark: 'P' },
  { id: 'apple', name: 'Apple Pay', mark: '●' },
  { id: 'google', name: 'Google Pay', mark: 'G' },
  { id: 'cash', name: 'Cash on delivery', mark: '$' },
];

const initialNotes = '';
const DEFAULT_ADDRESS = { street: '42 Willow Street', apartment: 'Apt 3B', city: 'Brooklyn', state: 'NY', postalCode: '11201' };

function formatAddress(address) {
  return [address.street, address.apartment, `${address.city}, ${address.state} ${address.postalCode}`].filter(Boolean).join(', ');
}

function isCompleteAddress(address) {
  return Boolean(address.street.trim() && address.city.trim() && address.state.trim() && address.postalCode.trim());
}

function Money({ children }) { return <span className="money">{children}</span>; }

function Brand({ compact = false }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`}><span className="brand-mark"><Leaf size={18} strokeWidth={2.4} /></span><span>ecobite</span></div>;
}

function Button({ variant = 'primary', className = '', children, ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}

function SectionTitle({ icon: Icon, title, action }) {
  return <div className="section-title"><div className="section-heading">{Icon && <Icon size={17} aria-hidden="true" />}<h2 id={title === 'Your order' ? 'order-summary-title' : undefined}>{title}</h2></div>{action}</div>;
}

function PriceDetails({ total, items }) {
  return <section className="price-card" aria-label="Price summary">
    <div className="price-summary-head"><span><strong>Total</strong><small>Including all fees</small></span><strong>${total.toFixed(2)}</strong></div>
    <div className="price-lines">{items.map(item => <div key={item.label}><span>{item.label}</span><Money>${item.price.toFixed(2)}</Money></div>)}<div><span>Delivery</span><Money>$1.49</Money></div><div><span>Service fee</span><Money>$0.80</Money></div></div>
  </section>;
}

function ChatView({ kind, onBack }) {
  const [messages, setMessages] = useState(kind === 'support'
    ? [{ from: 'team', text: 'Hi there! Our human support team is available around the clock. What can we help with?' }]
    : [{ from: 'courier', text: 'Hi! I’m on my way with your EcoBite order.' }]);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState(false);
  const inputRef = useRef(null);
  const isSupport = kind === 'support';
  const quickReplies = ['I’m coming downstairs', 'I can’t find the entrance', 'Please leave it at the door'];

  useEffect(() => { inputRef.current?.focus(); }, []);

  function sendMessage(text = draft) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(current => [...current, { from: 'you', text: trimmed }]);
    setDraft('');
    setSent(true);
    if (isSupport) {
      window.setTimeout(() => setMessages(current => [...current, { from: 'team', text: 'Your message is saved in the support conversation. A team member can pick it up here.' }]), 650);
    } else {
      window.setTimeout(() => setMessages(current => [...current, { from: 'courier', text: 'Got it, thanks for letting me know.' }]), 650);
    }
  }

  return <div className="phone-subpage">
    <header className="subpage-header"><button className="icon-button" type="button" onClick={onBack} aria-label="Back to order"><ArrowLeft size={20} /></button><div><p className="overline">Order #EB2048</p><h1>{isSupport ? 'Human support' : 'Chat with Alex'}</h1></div><span className={`presence ${isSupport ? 'presence-support' : ''}`} aria-label={isSupport ? 'Available 24 hours a day' : 'Courier conversation'}>{isSupport ? '24/7' : 'Chat'}</span></header>
    <div className="chat-thread" role="log" aria-label={`${isSupport ? 'Support' : 'Courier'} message history`} aria-live="polite" aria-relevant="additions">
      <p className="chat-date">Today · 6:24 PM</p>
      {messages.map((message, index) => <div className={`message-row ${message.from === 'you' ? 'message-own' : ''}`} key={`${index}-${message.text}`}><div className={`message-bubble ${message.from === 'you' ? 'message-bubble-own' : ''}`}>{message.text}</div>{message.from === 'you' && index === messages.length - 1 && sent && <span className="message-status">Sent</span>}</div>)}
    </div>
    {!isSupport && <div className="quick-replies" aria-label="Suggested messages">{quickReplies.map(reply => <button key={reply} type="button" onClick={() => sendMessage(reply)}>{reply}</button>)}</div>}
    <form className="chat-composer" onSubmit={event => { event.preventDefault(); sendMessage(); }}><label className="visually-hidden" htmlFor="chat-message">Write a message</label><input id="chat-message" ref={inputRef} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Write a message…" /><button type="submit" className="send-button" aria-label="Send message" disabled={!draft.trim()}><Send size={17} /></button></form>
    <p className="chat-footnote">{isSupport ? 'Messages are kept in this conversation. For urgent order issues, use the options on your tracking page.' : 'Courier chat is separate from EcoBite human support.'}</p>
  </div>;
}

function ProblemReportView({ onClose, onSupport }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const firstReasonRef = useRef(null);
  const successHeadingRef = useRef(null);
  const sheetRef = useRef(null);
  const reasons = ['Missing item', 'Wrong item', 'Food quality', 'Delivery issue', 'Other'];

  useEffect(() => {
    if (submitted) successHeadingRef.current?.focus();
    else firstReasonRef.current?.focus();
    const handleKeys = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        const controls = [...(sheetRef.current?.querySelectorAll('button, input, textarea') || [])].filter(control => !control.disabled);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeys);
    return () => document.removeEventListener('keydown', handleKeys);
  }, [submitted, onClose]);

  function submitReport(event) {
    event.preventDefault();
    if (!reason) {
      setError('Choose what went wrong before sending your report.');
      firstReasonRef.current?.focus();
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return <div className="report-sheet-scrim" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="report-sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="report-sheet-title"><span className="sheet-grabber" aria-hidden="true" /><header className="report-sheet-heading"><div><p className="overline">Order #EB2048</p><h2 id="report-sheet-title">Report a problem</h2></div><button className="icon-button" type="button" aria-label="Close problem report" onClick={onClose}><X size={18} /></button></header>
    {submitted ? <div className="report-success" role="status" aria-live="polite"><span className="state-chip state-good"><CheckCircle2 size={14} /> Report received</span><h2 ref={successHeadingRef} tabIndex={-1}>Thanks for letting us know.</h2><p>Your report is attached to order #EB2048. Need help now?</p><Button variant="secondary" onClick={onSupport}>Contact human support</Button><Button variant="tertiary" onClick={onClose}>Back to your order</Button></div> : <form className="report-form" onSubmit={submitReport} noValidate>
      <p className="report-intro">Tell us what went wrong with this order.</p>
      <fieldset className="report-reasons" aria-invalid={Boolean(error)} aria-describedby={error ? 'report-error' : undefined}><legend>What went wrong?</legend>{reasons.map((item, index) => <label className="report-reason" key={item}><input ref={index === 0 ? firstReasonRef : undefined} type="radio" name="report-reason" value={item} checked={reason === item} onChange={() => { setReason(item); setError(''); }} /><span>{item}</span></label>)}</fieldset>
      {error && <p id="report-error" className="field-error" role="alert">{error}</p>}
      <label className="note-field report-details"><span>More detail <span className="optional">· optional</span></span><textarea value={details} onChange={event => setDetails(event.target.value)} rows="4" placeholder="Add a few details to help us understand…" /></label>
      <Button type="submit">Send report</Button>
      <Button type="button" variant="tertiary" onClick={onSupport}>Contact human support</Button>
    </form>}
  </section></div>;
}

function Rating({ value, onChange }) {
  return <div className="rating-control">
    {[1, 2, 3, 4, 5].map(star => <label className="rating-choice" key={star}><input type="radio" name="order-rating" value={star} checked={value === star} onChange={() => onChange(star)} aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`} /><span className={`rating-star ${value >= star ? 'rating-star-active' : ''}`} aria-hidden="true"><Star size={30} fill={value >= star ? 'currentColor' : 'none'} /></span></label>)}
  </div>;
}

function Showcase({ onClose }) {
  const swatches = [['Primary', 'var(--primary)'], ['Secondary', 'var(--secondary)'], ['Ink', 'var(--text)'], ['Error', 'var(--error)'], ['Success', 'var(--success-bright)']];
  return <div className="showcase-page">
    <header className="showcase-header"><Brand /><Button variant="tertiary" onClick={onClose}><ArrowLeft size={16} /> Back to journeys</Button></header>
    <main className="showcase-content">
      <p className="overline">EcoBite UI</p><h1>Component library</h1><p className="showcase-lead">A small set of clear, consistent building blocks used throughout the order journey.</p>
      <section className="showcase-panel"><h2>Color tokens</h2><div className="swatch-grid">{swatches.map(([name, color]) => <div className="swatch" key={name}><span style={{ background: color }} /><strong>{name}</strong><code>{color}</code></div>)}</div></section>
      <section className="showcase-panel"><h2>Actions</h2><div className="showcase-row"><Button>Primary action</Button><Button variant="secondary">Secondary</Button><Button variant="tertiary">Tertiary link</Button><Button disabled>Disabled</Button></div></section>
      <section className="showcase-panel"><h2>Order states</h2><div className="showcase-row"><span className="state-chip state-good"><CheckCircle2 size={14} /> Confirmed</span><span className="state-chip state-pending"><Clock3 size={14} /> Preparing</span><span className="state-chip state-alert">Action needed</span></div></section>
    </main>
  </div>;
}

function App() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [showcase, setShowcase] = useState(false);
  const modalRef = useRef(null);
  const lastTriggerRef = useRef(null);

  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;
    if (activeScenario && !dialog.open) {
      dialog.showModal();
      dialog.querySelector('.dialog-close')?.focus();
    } else if (!activeScenario && dialog.open) dialog.close();
  }, [activeScenario]);

  function closeModal() {
    setActiveScenario(null);
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  return <div className="desktop-shell">
    {showcase ? <Showcase onClose={() => setShowcase(false)} /> : <>
      <main className="overview" id="main-content" inert={Boolean(activeScenario)}>
        <div className="overview-top"><Brand /></div>
        <section className="journey-intro" aria-labelledby="journey-title"><h1 id="journey-title">Choose a journey</h1></section>
        <section className="scenario-grid" aria-label="Order scenarios">
          {scenarios.map(scenario => <button className="scenario-card" type="button" key={scenario.id} onClick={event => { lastTriggerRef.current = event.currentTarget; setActiveScenario(scenario.id); }}>
            <span className={`scenario-icon tone-${scenario.tone}`} aria-hidden="true">{scenario.icon}</span><span className="scenario-copy"><strong>{scenario.title}</strong></span>
          </button>)}
        </section>
        <footer className="overview-footer"><button type="button" onClick={() => setShowcase(true)}>Component library</button></footer>
      </main>
      <dialog ref={modalRef} className="journey-dialog" aria-label="EcoBite mobile app" onCancel={event => { event.preventDefault(); closeModal(); }} onClick={event => { if (event.target === modalRef.current) closeModal(); }}>
        <div className="dialog-inner"><button type="button" className="dialog-close" aria-label="Close journey and return to scenarios" onClick={closeModal}><X size={20} /></button><div className="phone-frame"><div className="phone-speaker" aria-hidden="true"><span /></div><div className="phone-viewport"><MobileJourney scenario={activeScenario} /></div></div></div>
      </dialog>
    </>}
  </div>;
}

function MobileJourney({ scenario }) {
  const [page, setPage] = useState('checkout');
  const [notes, setNotes] = useState(initialNotes);
  const [payment, setPayment] = useState('card');
  const [paymentError, setPaymentError] = useState(false);
  const [paymentUnavailable, setPaymentUnavailable] = useState(false);
  const [paymentSelectionError, setPaymentSelectionError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [slowNetworkNotice, setSlowNetworkNotice] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);
  const [hasRetriedNetwork, setHasRetriedNetwork] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [itemAvailable, setItemAvailable] = useState(true);
  const [substituted, setSubstituted] = useState(false);
  const [status, setStatus] = useState('confirmed');
  const [delayExperienced, setDelayExperienced] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(scenario === 'cancel');
  const [canceled, setCanceled] = useState(false);
  const [restaurantCanceled, setRestaurantCanceled] = useState(false);
  const [refundStatus, setRefundStatus] = useState('processing');
  const [issueResolved, setIssueResolved] = useState(false);
  const [rating, setRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [comment, setComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState(DEFAULT_ADDRESS);
  const [addressNeedsCorrection, setAddressNeedsCorrection] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const scenarioRef = useRef(null);
  const addressInputRef = useRef(null);
  const addressEditTriggerRef = useRef(null);
  const reportTriggerRef = useRef(null);
  const addressSheetWasOpenRef = useRef(false);
  const orderTimersRef = useRef([]);
  const bagPrice = 12.5 - (scenario === 'unavailable' && !itemAvailable ? 3.5 : 0);
  const orderItems = [{ label: 'Bakery rescue bag', price: bagPrice }];
  const total = orderItems.reduce((sum, item) => sum + item.price, 1.49 + 0.8);

  function scheduleOrderUpdate(callback, delay) {
    const timer = window.setTimeout(() => {
      orderTimersRef.current = orderTimersRef.current.filter(id => id !== timer);
      callback();
    }, delay);
    orderTimersRef.current.push(timer);
  }

  useEffect(() => {
    if (!scenario || scenarioRef.current === scenario) return;
    orderTimersRef.current.forEach(timer => window.clearTimeout(timer));
    orderTimersRef.current = [];
    scenarioRef.current = scenario;
    const startsOnTracking = ['delayed', 'issue', 'cancel', 'restaurant-cancel', 'feedback'].includes(scenario);
    const scenarioAddress = scenario === 'wrong-address' ? { ...DEFAULT_ADDRESS, postalCode: '11210' } : { ...DEFAULT_ADDRESS };
    if (scenario === 'feedback') { setPage('feedback'); setStatus('delivered'); }
    else if (startsOnTracking) {
      setPage('tracking');
      if (scenario === 'delayed') setStatus('delayed');
      else if (scenario === 'issue') setStatus('issue');
      else if (scenario === 'cancel') setStatus('confirmed');
      else if (scenario === 'restaurant-cancel') setStatus('canceled');
      else setStatus('confirmed');
    } else {
      setPage('checkout');
      setStatus('confirmed');
    }
    setDelayExperienced(scenario === 'delayed');
    setCancelOpen(scenario === 'cancel');
    setPaymentError(false); setPaymentUnavailable(scenario === 'payment-unavailable'); setPaymentSelectionError(false); setNetworkError(false); setSlowNetworkNotice(false); setHasRetried(false); setHasRetriedNetwork(false); setIsPlacingOrder(false); setPayment(scenario === 'payment-unavailable' ? 'paypal' : 'card'); setNotes(initialNotes); setAddress(scenarioAddress); setAddressDraft(scenarioAddress); setAddressNeedsCorrection(scenario === 'wrong-address'); setAddressSheetOpen(false); setReportOpen(false); setAddressError(''); setItemAvailable(true); setSubstituted(false); setCanceled(scenario === 'restaurant-cancel'); setRestaurantCanceled(scenario === 'restaurant-cancel'); setRefundStatus(scenario === 'restaurant-cancel' ? 'pending' : 'processing'); setIssueResolved(false); setRating(0); setCategories([]); setFeedbackSent(false); setComment(''); setFormError(''); setToast('');
  }, [scenario]);

  useEffect(() => {
    if (page !== 'tracking') return undefined;
    if (scenario === 'cancel' && !canceled) return undefined;
    let nextStatus;
    let delay = 4500;
    if (status === 'confirmed') nextStatus = 'preparing';
    else if (status === 'preparing' && scenario !== 'cancel') nextStatus = 'picked';
    else if (status === 'picked') nextStatus = 'onway';
    else if (status === 'onway') { nextStatus = 'delivered'; delay = 8000; }
    else if (status === 'delayed') { nextStatus = 'onway'; delay = 9000; }
    if (canceled && refundStatus === 'processing') {
      const refundTimer = window.setTimeout(() => setRefundStatus('completed'), 12000);
      return () => window.clearTimeout(refundTimer);
    }
    if (canceled && refundStatus === 'pending') {
      const refundTimer = window.setTimeout(() => setRefundStatus('processing'), 1800);
      return () => window.clearTimeout(refundTimer);
    }
    if (!nextStatus || canceled) return undefined;
    const timer = window.setTimeout(() => {
      setStatus(nextStatus);
      if (status === 'delayed') setNotice('Alex is moving again. Your updated ETA is 7:10–7:20 PM.');
      else if (nextStatus === 'delivered') setNotice('Delivered. We hope you enjoy every bite!');
    }, delay);
    return () => window.clearTimeout(timer);
  }, [page, status, canceled, refundStatus, scenario]);

  const setNotice = (message) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };

  function closeAddressSheet() {
    setAddressSheetOpen(false);
    setAddressError('');
  }

  function closeReportSheet() {
    setReportOpen(false);
    requestAnimationFrame(() => reportTriggerRef.current?.focus());
  }

  function saveAddress() {
    if (!isCompleteAddress(addressDraft)) {
      setAddressError('Enter a street address, city, state, and ZIP code.');
      const firstMissingField = [...document.querySelectorAll('.address-sheet input[aria-required="true"]')].find(input => !input.value.trim());
      (firstMissingField || addressInputRef.current)?.focus();
      return;
    }
    if (scenario === 'wrong-address' && addressDraft.postalCode.trim() === '11210') {
      setAddressError('Check the ZIP code before saving this address.');
      document.querySelector('.address-sheet input[autocomplete="postal-code"]')?.focus();
      return;
    }
    const savedAddress = { ...addressDraft, state: addressDraft.state.trim().toUpperCase() };
    setAddress(savedAddress);
    setAddressDraft(savedAddress);
    setAddressNeedsCorrection(false);
    setAddressError('');
    setAddressSheetOpen(false);
    setNotice('Delivery address saved.');
  }

  function updateAddressField(field, value) {
    setAddressDraft(current => ({ ...current, [field]: value }));
    setAddressError('');
  }

  useEffect(() => {
    if (!addressSheetOpen) {
      if (addressSheetWasOpenRef.current) {
        addressSheetWasOpenRef.current = false;
        addressEditTriggerRef.current?.focus();
      }
      return undefined;
    }
    addressSheetWasOpenRef.current = true;
    addressInputRef.current?.focus();
    const handleSheetKeys = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAddressSheet();
      }
      if (event.key === 'Tab') {
        const controls = [...(document.querySelector('.address-sheet')?.querySelectorAll('button, input') || [])].filter(control => !control.disabled);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleSheetKeys);
    return () => document.removeEventListener('keydown', handleSheetKeys);
  }, [addressSheetOpen]);

  function placeOrder() {
    if (!isCompleteAddress(address)) {
      setAddressError('Enter a street address, city, state, and ZIP code.');
      setAddressDraft({ ...address });
      setAddressSheetOpen(true);
      return;
    }
    if (addressNeedsCorrection) {
      setAddressDraft({ ...address });
      setAddressError('Correct the delivery address before placing your order.');
      setAddressSheetOpen(true);
      return;
    }
    if (paymentUnavailable) {
      setPaymentSelectionError(true);
      document.querySelector('.payment-option input:not(:disabled)')?.focus();
      return;
    }
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    if (scenario === 'slow-network') {
      setSlowNetworkNotice(false);
      scheduleOrderUpdate(() => setSlowNetworkNotice(true), 900);
      scheduleOrderUpdate(() => {
        setIsPlacingOrder(false);
        setSlowNetworkNotice(false);
        setNetworkError(false);
        setPaymentError(false);
        setPage('tracking');
        setStatus('confirmed');
      }, 3600);
      return;
    }
    scheduleOrderUpdate(() => {
      setIsPlacingOrder(false);
      setNetworkError(false);
      if (scenario === 'network' && !hasRetriedNetwork) { setNetworkError(true); setHasRetriedNetwork(true); return; }
      if (scenario === 'payment' && !hasRetried) { setPaymentError(true); setHasRetried(true); return; }
      setPaymentError(false); setPage('tracking'); setStatus('confirmed');
    }, 700);
  }

  function submitCancel() {
    setCanceled(true); setCancelOpen(false); setStatus('canceled'); setRefundStatus('pending');
  }

  function submitFeedback(event) {
    event.preventDefault();
    if (!rating) { setFormError('Choose a star rating to send your feedback.'); return; }
    setFormError(''); setFeedbackSent(true);
  }

  const isDeliveryIssue = status === 'issue' && !issueResolved;
  const courierAvailable = ['picked', 'onway', 'delayed'].includes(status) || issueResolved;
  const trackingStages = ['confirmed', 'preparing', 'picked', 'onway', 'delivered'];
  const currentStageIndex = status === 'issue' ? 3 : trackingStages.indexOf(status);
  const isDelayed = status === 'delayed';
  const trackingCopy = {
    confirmed: ['Order confirmed', 'Corner Crumb has your order and will start preparing soon.'],
    preparing: ['Being prepared', 'Corner Crumb is preparing your rescue bag.'],
    picked: ['Picked up by Alex', 'Alex has picked up your order from Corner Crumb.'],
    onway: ['On the way', ''],
    delivered: ['Delivered with care', 'Your meal has arrived. Enjoy!'],
  };
  const trackingDescription = canceled ? restaurantCanceled ? 'Corner Crumb ran out of bakery rescue bags before pickup. Your refund has been started.' : 'Your refund is being processed.' : isDeliveryIssue ? 'We couldn’t complete your delivery just yet.' : isDelayed ? 'Heavy traffic nearby. We’ve updated your arrival time.' : trackingCopy[status]?.[1] ?? 'Your order is being prepared.';

  if (page === 'support' || page === 'courier') return <ChatView kind={page} onBack={() => setPage('tracking')} />;

  return <div className="mobile-app">
    <div className="mobile-brand-row"><Brand compact /><button type="button" className="help-icon" aria-label="Contact human support, available 24/7" onClick={() => setPage('support')}><Headset size={19} /></button></div>

    {page === 'checkout' && <main className="journey-content checkout-content">
      <h1>Checkout</h1><p className="page-lead">Review your rescued food and place your order.</p>

      <section className="order-card" aria-labelledby="order-summary-title"><SectionTitle icon={PackageCheck} title="Your order" /><div className="food-item"><img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&q=82" alt="Freshly baked bread and pastries for a bakery rescue bag" /><div className="food-details"><div className="food-title-row"><strong>Bakery rescue bag</strong><strong className="item-price">${bagPrice.toFixed(2)}</strong></div><span>A bag full of today’s bakery picks</span></div></div>
        {scenario === 'unavailable' && <div className="unavailable-box" role="status"><div className="unavailable-copy"><span className="status-icon amber-icon">!</span><div><strong>{substituted ? 'Replacement selected' : itemAvailable ? 'One bakery pick is unavailable' : 'Bakery pick removed from your bag'}</strong><p>{substituted ? 'Chocolate croissant selected · $3.50' : itemAvailable ? 'Chocolate croissant · $3.50' : 'Your bag price has been reduced by $3.50.'}</p></div></div>{itemAvailable && !substituted && <div className="substitute-actions"><button type="button" onClick={() => setSubstituted(true)}>Choose replacement</button><button type="button" onClick={() => setItemAvailable(false)}>Remove from bag</button></div>}</div>}
      </section>

      <section className="address-card"><SectionTitle icon={MapPin} title="Delivering to" action={<button ref={addressEditTriggerRef} className="text-link" type="button" aria-haspopup="dialog" onClick={() => { setAddressDraft({ ...address }); setAddressError(''); setAddressSheetOpen(true); }}>Edit</button>} /><p className="address-display">{formatAddress(address)}</p>{addressNeedsCorrection && <p className="address-warning" role="alert">This address may not match the delivery area. Check the ZIP code before ordering.</p>}</section>

      <section className="payment-section"><SectionTitle icon={CreditCard} title="Payment method" action={<span className="payment-protected"><ShieldCheck size={12} /> Protected</span>} /><fieldset className="payment-list"><legend className="visually-hidden">Choose a payment method</legend>{PAYMENT_METHODS.map(method => <label className={`payment-option ${payment === method.id ? 'payment-selected' : ''} ${paymentUnavailable && method.id === 'paypal' ? 'payment-option-unavailable' : ''}`} key={method.id}><input type="radio" name="payment" value={method.id} checked={payment === method.id} disabled={paymentUnavailable && method.id === 'paypal'} aria-describedby={paymentUnavailable && method.id === 'paypal' ? 'payment-unavailable-message' : undefined} onChange={() => { setPayment(method.id); setPaymentError(false); setPaymentUnavailable(false); setPaymentSelectionError(false); }} /><span className={`payment-mark payment-${method.id}`} aria-hidden="true">{method.mark}</span><span className="payment-name"><strong>{method.name}</strong></span><span className="radio-visual" aria-hidden="true" /></label>)}</fieldset>{paymentUnavailable && <div id="payment-unavailable-message" className="alert alert-warning payment-unavailable-message" role="status"><span className="alert-symbol">!</span><p>PayPal is temporarily unavailable. Choose another payment method.</p></div>}{paymentSelectionError && <p className="field-error payment-selection-error" role="alert">Choose an available payment method to continue.</p>}</section>

      <label className="note-field"><span>Delivery note <span className="optional">· optional</span></span><textarea value={notes} onChange={event => setNotes(event.target.value)} rows="2" placeholder="Gate code, floor, or anything helpful" /></label>
      <PriceDetails total={total} items={orderItems} />
      {networkError && <div className="alert alert-warning network-alert" role="alert"><span className="alert-symbol">!</span><div><strong>Connection interrupted</strong><p>Your address and order are saved. Reconnect and try again.</p></div></div>}
      {paymentError && <div className="alert alert-error" role="alert"><span className="alert-symbol">!</span><div><strong>Payment didn’t go through</strong><p>Your address and delivery note are saved. Try again or choose another method.</p></div></div>}
      <Button className="place-order-button" onClick={placeOrder} disabled={isPlacingOrder} aria-busy={isPlacingOrder}>{isPlacingOrder ? <><LoaderCircle size={17} className="loading-spinner" aria-hidden="true" /><span aria-live="polite">Placing order…</span></> : networkError ? 'Try again' : paymentError ? 'Try payment again' : 'Place order'}</Button>
      {slowNetworkNotice && <div className="slow-network-notice" role="status">Taking longer than expected. Stay with us — your order details are saved.</div>}
      <p className="cancel-policy">You can cancel for a full refund until the kitchen starts preparing your order.</p>
    </main>}

    {page === 'tracking' && <main className="journey-content tracking-content">
      <div className="journey-kicker"><span>Order #EB2048</span><span className="order-date">Today, 6:24 PM</span></div>
      <div className={`tracking-status-head ${isDeliveryIssue ? 'tracking-status-danger' : ''}`} aria-live="polite"><div><h1>{canceled ? (restaurantCanceled ? 'Restaurant canceled your order' : 'Order canceled') : isDeliveryIssue ? 'Delivery needs attention' : isDelayed ? 'Running a little late' : trackingCopy[status]?.[0] || 'Order confirmed'}</h1>{trackingDescription && <p>{trackingDescription}</p>}</div></div>
      {status === 'delivered' && !canceled && <Button className="feedback-cta feedback-cta-top" onClick={() => setPage('feedback')}>Rate your order <Star size={16} /></Button>}

      {!canceled && <section className={`eta-card ${isDelayed || delayExperienced ? 'eta-card-delayed' : ''}`} aria-label="Delivery estimate"><div className="eta-copy"><span>{status === 'delivered' ? 'Delivered at' : isDeliveryIssue ? 'Next step' : 'Estimated arrival'}</span><strong>{status === 'delivered' ? '6:52 PM' : isDeliveryIssue ? 'Choose how to continue' : delayExperienced ? '7:10 – 7:20 PM' : '6:50 – 7:00 PM'}</strong></div></section>}

      {!canceled && status !== 'delivered' && <button type="button" className="text-link cancel-info-link" aria-expanded={cancelOpen} onClick={() => setCancelOpen(value => !value)}>Cancellation and refund information</button>}
      {cancelOpen && !canceled && <section className="cancel-panel" aria-labelledby="cancel-heading"><div className="cancel-panel-title"><h2 id="cancel-heading">Cancel this order?</h2><button type="button" aria-label="Close cancellation panel" onClick={() => setCancelOpen(false)}><X size={17} /></button></div>{['confirmed', 'preparing'].includes(status) ? <><p>You can cancel before the restaurant starts preparing your order. Your payment will be refunded to your original method, usually within 5–7 business days.</p><Button variant="danger" onClick={submitCancel}>Cancel order and request refund</Button></> : <><p>This order has already been picked up, so it can’t be canceled here. Our support team can help with next steps.</p><Button variant="secondary" onClick={() => setPage('support')}>Contact human support</Button></>}</section>}

      {isDelayed && <div className="alert alert-warning delay-alert" role="status"><Clock3 size={17} /><p><strong>Thanks for your patience.</strong> Alex is moving through traffic. Your new ETA is 7:10–7:20 PM.</p></div>}
      {isDeliveryIssue && <div className="alert alert-error issue-alert" role="alert"><span className="alert-symbol">!</span><p><strong>We couldn’t reach the entrance.</strong> Your order is safe with Alex. Message your courier or ask our support team to help arrange another attempt.</p></div>}
      {canceled && <div className="refund-card" aria-live="polite"><div className="refund-top"><span className="status-icon amber-icon">{refundStatus === 'completed' ? <Check size={15} /> : <Clock3 size={15} />}</span><div><strong>Refund {refundStatus}</strong><span>Back to Visa ending in 4242</span></div><span className="state-pill">{refundStatus}</span></div><p>{refundStatus === 'pending' ? (restaurantCanceled ? 'Corner Crumb ran out of the bakery rescue bag. Your refund request is being sent to your payment provider.' : 'Your cancellation is confirmed. We’re sending the refund request to your payment provider.') : refundStatus === 'completed' ? 'Your refund is complete. Your bank may take a little longer to show it on your statement.' : 'Most refunds appear within 5–7 business days. You can check this status here anytime.'}</p></div>}

      {!canceled && <>
        <section className="map-card" aria-label="Illustrative delivery map"><div className="map-art" aria-hidden="true"><span className="map-block block-one" /><span className="map-block block-two" /><span className="map-block block-three" /><span className="map-block block-four" /><span className="map-road road-horizontal" /><span className="map-road road-vertical" /><span className="map-road road-diagonal" /><span className="map-route" /><span className="map-pin restaurant-pin"><Leaf size={12} /></span><span className="map-pin home-pin"><MapPin size={13} /></span><span className="map-rider">↗</span><span className="map-label map-label-one">Atlantic Ave</span><span className="map-label map-label-two">Willow St</span></div><div className="map-caption"><span><span className="map-dot" /> Delivery route overview</span><span>Brooklyn, NY</span></div></section>

        <section className="timeline-section"><SectionTitle title="Your delivery" />
          <ol className="timeline" aria-label="Delivery progress">{[
            ['confirmed', 'Order confirmed', '6:24 PM'], ['preparing', 'Being prepared', status === 'confirmed' ? 'Up next' : '6:28 PM'], ['picked', 'Picked up by Alex', status === 'picked' || status === 'onway' || status === 'delivered' || isDelayed ? '6:42 PM' : 'Up next'], ['onway', 'On the way', isDelayed || status === 'onway' || status === 'delivered' ? 'Now' : 'Up next'], ['delivered', 'At your door', status === 'delivered' ? '6:52 PM' : 'Up next'],
          ].map(([key, label, time]) => { const done = status === 'delayed' ? ['confirmed', 'preparing', 'picked', 'onway'].includes(key) : currentStageIndex >= trackingStages.indexOf(key); const active = status === key || (isDelayed && key === 'onway') || (status === 'issue' && key === 'onway'); return <li key={key} className={`${done ? 'timeline-done' : ''} ${active ? 'timeline-active' : ''}`}><span className="timeline-node">{done ? <Check size={11} /> : null}</span><span className="timeline-label">{label}{active && <span className="visually-hidden">, current status</span>}</span><span className="timeline-time">{time}</span></li>; })}</ol>
          <div className="tracking-order-details"><h2 className="tracking-details-heading">Order details</h2><strong>Bakery rescue bag · 1 item</strong><span>Delivery to {formatAddress(address)}</span><div><span>Paid with {payment === 'card' ? 'Visa •••• 4242' : PAYMENT_METHODS.find(item => item.id === payment)?.name}</span><strong>${total.toFixed(2)}</strong></div></div>
        </section>

        {isDeliveryIssue && <div className="issue-actions"><Button onClick={() => setPage('courier')}><MessageCircle size={16} /> Message Alex</Button><Button variant="secondary" onClick={() => setPage('support')}>Contact human support</Button><button type="button" className="text-link reattempt-link" onClick={() => { setIssueResolved(true); setStatus('onway'); setNotice('A new delivery attempt is underway.'); }}>Request another attempt</button></div>}

        {!isDeliveryIssue && !canceled && courierAvailable && status !== 'delivered' && <div className="courier-card"><div className="courier-avatar" aria-hidden="true">A</div><div className="courier-info"><strong>Alex is your courier</strong><span>On the way with your order</span></div><button type="button" className="chat-action" onClick={() => setPage('courier')}><MessageCircle size={16} /><span>Message</span></button></div>}
      </>}

      {canceled && <div className="support-after-cancel"><p>Need help with your refund?</p><Button variant="secondary" onClick={() => setPage('support')}>Contact human support</Button></div>}
      <button ref={reportTriggerRef} type="button" className="report-problem-button" onClick={() => setReportOpen(true)}>Report a problem</button>

    </main>}

    {page === 'feedback' && <main className="journey-content feedback-content">
      <div className="journey-kicker"><span>Order #EB2048</span><span className="state-chip state-good"><CheckCircle2 size={13} /> Delivered</span></div>
      {feedbackSent ? <div className="feedback-success"><span className="success-orb"><Check size={26} /></span><p className="overline">Thank you</p><h1>Your feedback helps good food go further.</h1><p>We’ve saved your rating for Corner Crumb.</p><Button variant="secondary" onClick={() => setPage('tracking')}>Back to your order</Button></div> : <>
        <div className="feedback-illustration" aria-hidden="true"><span className="feedback-sun" /><div className="feedback-bowl"><span>🥗</span></div><span className="feedback-leaf leaf-a">✦</span><span className="feedback-leaf leaf-b">✳</span></div>
        <p className="overline feedback-overline">A quick check-in</p><h1>How was your order?</h1><p className="page-lead">Your honest feedback helps local kitchens and our rescue community.</p>
        <form onSubmit={submitFeedback} noValidate>
          <fieldset className="rating-field" aria-invalid={Boolean(formError)} aria-describedby={formError ? 'rating-error' : undefined}><legend className="visually-hidden">Required rating</legend><Rating value={rating} onChange={value => { setRating(value); setFormError(''); }} /></fieldset>
          {formError && <p className="field-error" id="rating-error" role="alert">{formError}</p>}
          <fieldset className="category-field"><legend>Anything you’d like to highlight? <span className="optional">· optional</span></legend><div className="category-chips">{['Food quality', 'Portion size', 'Packaging', 'Value for money'].map(category => <label key={category} className={`category-chip ${categories.includes(category) ? 'category-active' : ''}`}><input type="checkbox" checked={categories.includes(category)} onChange={() => setCategories(current => current.includes(category) ? current.filter(item => item !== category) : [...current, category])} /><span>{category}</span>{categories.includes(category) && <Check size={13} />}</label>)}</div></fieldset>
          <label className="note-field feedback-note"><span>Anything else? <span className="optional">· optional</span></span><textarea value={comment} onChange={event => setComment(event.target.value)} rows="3" placeholder="Share a little more, if you like…" /></label>
          <Button className="feedback-submit" type="submit">Send feedback <ArrowRight size={16} /></Button>
        </form>
        <button className="skip-feedback" type="button" onClick={() => setPage('tracking')}>Skip for now</button>
      </>}
    </main>}

    {addressSheetOpen && <div className="address-sheet-scrim" onMouseDown={event => { if (event.target === event.currentTarget) closeAddressSheet(); }}><section className="address-sheet" role="dialog" aria-modal="true" aria-labelledby="address-sheet-title"><span className="sheet-grabber" aria-hidden="true" /><div className="sheet-heading"><h2 id="address-sheet-title">Delivery address</h2><button type="button" className="icon-button" aria-label="Close address editor" onClick={closeAddressSheet}><X size={18} /></button></div><form noValidate onSubmit={event => { event.preventDefault(); saveAddress(); }}>
      <label className="sheet-field"><span>Street address</span><input ref={addressInputRef} autoComplete="address-line1" aria-required="true" aria-invalid={Boolean(addressError)} aria-describedby={addressError ? 'address-sheet-error' : undefined} value={addressDraft.street} onChange={event => updateAddressField('street', event.target.value)} /></label>
      <label className="sheet-field"><span>Apartment, suite, etc. <span className="optional">· optional</span></span><input autoComplete="address-line2" value={addressDraft.apartment} onChange={event => updateAddressField('apartment', event.target.value)} /></label>
      <label className="sheet-field"><span>City</span><input autoComplete="address-level2" aria-required="true" aria-invalid={Boolean(addressError)} aria-describedby={addressError ? 'address-sheet-error' : undefined} value={addressDraft.city} onChange={event => updateAddressField('city', event.target.value)} /></label>
      <div className="address-grid"><label className="sheet-field"><span>State</span><input autoComplete="address-level1" aria-required="true" aria-invalid={Boolean(addressError)} aria-describedby={addressError ? 'address-sheet-error' : undefined} maxLength={2} autoCapitalize="characters" value={addressDraft.state} onChange={event => updateAddressField('state', event.target.value)} /></label><label className="sheet-field"><span>ZIP code</span><input autoComplete="postal-code" inputMode="numeric" aria-required="true" aria-invalid={Boolean(addressError)} aria-describedby={addressError ? 'address-sheet-error' : undefined} value={addressDraft.postalCode} onChange={event => updateAddressField('postalCode', event.target.value)} /></label></div>
      {addressError && <p id="address-sheet-error" className="address-error" role="alert">{addressError}</p>}
      <Button type="submit">Save address</Button><Button type="button" variant="tertiary" onClick={closeAddressSheet}>Cancel</Button>
    </form></section></div>}
    {reportOpen && <ProblemReportView onClose={closeReportSheet} onSupport={() => { setReportOpen(false); setPage('support'); }} />}
    {toast && <div className="toast" role="status"><CheckCircle2 size={16} />{toast}</div>}
  </div>;
}

export default App;
