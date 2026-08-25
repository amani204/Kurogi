import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { fetchAvailability, submitBooking } from '../../features/booking/api';
import Button from '../../comonents/ui/Button';

const todayISO = () => new Date().toISOString().split('T')[0];

const initialForm = {
  date: '', timeSlot: '', partySize: 2,
  customerName: '', phone: '', email: '', specialRequests: '',
};

const Booking = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const { data: slots, loading: slotsLoading } = useFetch(
    () => (form.date ? fetchAvailability(form.date) : Promise.resolve(null)),
    [form.date]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === 'date' ? { timeSlot: '' } : {}) }));
  };

  const adjustPartySize = (delta) => {
    setForm((prev) => ({ ...prev, partySize: Math.min(30, Math.max(1, prev.partySize + delta)) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.date) return setError('Please choose a date.');
    if (!form.timeSlot) return setError('Please choose a time slot.');

    setSubmitting(true);
    try {
      const payload = {
        customerName: form.customerName,
        phone: form.phone,
        email: form.email || undefined,
        partySize: form.partySize,
        date: form.date,
        timeSlot: form.timeSlot,
        specialRequests: form.specialRequests || undefined,
      };
      const data = await submitBooking(payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Success ----------
  if (result) {
    const { booking, whatsappLink } = result;
    return (
      <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <h1 className="font-display text-4xl md:text-5xl">Table reserved</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you, {booking.customerName}. We've reserved a table for{' '}
          <span className="num">{booking.partySize}</span> on{' '}
          <span className="num">{booking.date.split('T')[0]}</span> at{' '}
          <span className="num">{booking.timeSlot}</span>.
        </p>

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="label mt-10 bg-shu px-6 py-4 text-washi transition-colors hover:bg-sumi"
          >
            Confirm on WhatsApp
          </a>
        )}

        <p className="mt-6 text-sm text-muted-foreground">
          Need to change plans?{' '}
          <Link to={`/cancel/${booking.cancelToken}`} className="hairline-link text-foreground">
            Cancel this booking
          </Link>
        </p>
      </main>
    );
  }

  // ---------- Form ----------
  return (
    <main className="pt-24 md:pt-32">
      <header className="shell">
        <p className="label text-shu">Reservations</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">Reserve a table</h1>
      </header>

      <div className="shell"><div className="my-12 h-px bg-border" /></div>

      <div className="shell grid gap-16 pb-28 md:grid-cols-[1fr_0.8fr]">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <label className="block">
              <span className="label text-muted-foreground">Date</span>
              <input
                type="date" name="date" min={todayISO()} required
                value={form.date} onChange={handleChange}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
              />
            </label>

            {form.date && (
              <div>
                <span className="label text-muted-foreground">Time</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {slotsLoading && <p className="text-sm text-muted-foreground">Loading availability...</p>}
                  {!slotsLoading && slots?.length === 0 && (
                    <p className="text-sm text-muted-foreground">Closed on this date.</p>
                  )}
                  {!slotsLoading && slots?.map((slot) => (
                    <button
                      key={slot.timeSlot}
                      type="button"
                      disabled={slot.full}
                      onClick={() => setForm((prev) => ({ ...prev, timeSlot: slot.timeSlot }))}
                      data-active={form.timeSlot === slot.timeSlot}
                      className="num border border-border px-4 py-2 text-xs transition-colors data-[active=true]:border-shu data-[active=true]:text-shu disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {slot.timeSlot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="label text-muted-foreground">Party size</span>
              <div className="mt-3 flex w-fit items-center border border-border">
                <button type="button" onClick={() => adjustPartySize(-1)} className="num px-3 py-2 text-xs hover:bg-sumi hover:text-washi">−</button>
                <span className="num w-10 text-center text-xs">{form.partySize}</span>
                <button type="button" onClick={() => adjustPartySize(1)} className="num px-3 py-2 text-xs hover:bg-sumi hover:text-washi">+</button>
              </div>
            </div>

            <label className="block">
              <span className="label text-muted-foreground">Name</span>
              <input
                name="customerName" required value={form.customerName} onChange={handleChange}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
              />
            </label>

            <label className="block">
              <span className="label text-muted-foreground">Phone</span>
              <input
                name="phone" required value={form.phone} onChange={handleChange}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
              />
            </label>

            <label className="block">
              <span className="label text-muted-foreground">Email (optional)</span>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
              />
            </label>

            <label className="block">
              <span className="label text-muted-foreground">Special requests (optional)</span>
              <textarea
                name="specialRequests" rows={2} value={form.specialRequests} onChange={handleChange}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
              />
            </label>
          </div>

          {error && <p className="mt-6 text-sm text-shu">{error}</p>}

          <Button type="submit" variant="primary" disabled={submitting} className="mt-8 w-full">
            {submitting ? 'Reserving...' : 'Reserve Table'}
          </Button>
        </form>

        <aside className="text-sm leading-relaxed text-muted-foreground">
          <p>Tables are held for 15 minutes past your reservation time. For parties larger than 8, please call us directly.</p>
        </aside>
      </div>
    </main>
  );
};

export default Booking;