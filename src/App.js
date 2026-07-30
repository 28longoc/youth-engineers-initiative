import { useEffect, useState } from 'react';
import './App.css';

const slideContent = [
  {
    title: 'Photo 1',
    src: '/assets/photowheelhomepage/IMG_6968.jpeg',
  },
  {
    title: 'Photo 2',
    src: '/assets/photowheelhomepage/IMG_7191.jpeg',
  },
  {
    title: 'Photo 3',
    src: '/assets/photowheelhomepage/IMG_8052.jpeg',
  },
  {
    title: 'Photo 4',
    src: '/assets/photowheelhomepage/IMG_8634.jpg',
  },
  {
    title: 'Photo 5',
    src: '/assets/photowheelhomepage/engineeringenergy.png',
  },
];

const slides = slideContent;

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formStatus, setFormStatus] = useState({});

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveIndex((currentIndex) => (currentIndex - 1 + slides.length) % slides.length);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
  };

  const submitForm = async (event, formName) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setFormStatus((current) => ({ ...current, [formName]: { state: 'sending' } }));

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, formType: formName }),
      });

      if (!response.ok) {
        throw new Error('Unable to send your message.');
      }

      form.reset();
      setFormStatus((current) => ({
        ...current,
        [formName]: { state: 'success', message: 'Thank you! Your message has been sent.' },
      }));
    } catch (error) {
      setFormStatus((current) => ({
        ...current,
        [formName]: {
          state: 'error',
          message: 'Your message could not be sent. Please try again or email us directly.',
        },
      }));
    }
  };

  return (
    <div className="App">
      <main className="hero-shell">
        <section className="slideshow-panel" aria-label="Home page photo carousel">
          <div className="slideshow-frame">
            <button className="carousel-button carousel-button-left" onClick={goToPrevious} aria-label="Previous slide">
              <span aria-hidden="true">←</span>
            </button>

            <div className="slideshow-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              {slides.map((slide, index) => (
                <article className="slide" key={slide.title} aria-hidden={index !== activeIndex}>
                  <img className="slide-image" src={slide.src} alt={slide.title} />
                  <div className="slide-caption">
                    <span className="slide-eyebrow">Photo wheel {index + 1}</span>
                    <strong>{slide.title}</strong>
                  </div>
                </article>
              ))}
            </div>

            <button className="carousel-button carousel-button-right" onClick={goToNext} aria-label="Next slide">
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="slide-dots" aria-label="Slide navigation">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                className={`slide-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to ${slide.title}`}
                aria-pressed={index === activeIndex}
              />
            ))}
          </div>
        </section>

        <section className="hero-copy">
          <p className="eyebrow">Youth Engineers Initiative</p>
          <h1>Equipping youth to design the future.</h1>
          <p className="hero-description">
            The home page carousel now uses the images from the photo wheel folder. It auto-advances,
            loops continuously, and can be controlled with the arrow keys or the on-screen arrows.
          </p>
          <div className="hero-hint">Use the left and right arrow keys to move through the slideshow.</div>
        </section>
      </main>

      <section className="forms-section" aria-label="Get involved">
        <div className="forms-intro">
          <p className="eyebrow">Get involved</p>
          <h2>Let’s build what’s next.</h2>
          <p>Have a question, an idea, or a way to support young engineers? We would love to hear from you.</p>
        </div>

        <div className="forms-grid">
          <form className="inquiry-form" onSubmit={(event) => submitForm(event, 'contact')}>
            <div>
              <p className="form-kicker">Contact us</p>
              <h3>Start a conversation</h3>
            </div>
            <label>
              Your name
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Subject
              <input name="subject" type="text" required />
            </label>
            <label>
              Message
              <textarea name="message" rows="5" required />
            </label>
            <input className="website-field" name="website" type="text" tabIndex="-1" autoComplete="off" aria-hidden="true" />
            <button type="submit" disabled={formStatus.contact?.state === 'sending'}>
              {formStatus.contact?.state === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {formStatus.contact?.message && <p className={`form-status ${formStatus.contact.state}`} role="status">{formStatus.contact.message}</p>}
          </form>

          <form className="inquiry-form" onSubmit={(event) => submitForm(event, 'partner')}>
            <div>
              <p className="form-kicker">Partner with us</p>
              <h3>Create an impact together</h3>
            </div>
            <label>
              Your name
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Organization
              <input name="organization" type="text" autoComplete="organization" required />
            </label>
            <label>
              Your role
              <input name="role" type="text" required />
            </label>
            <label>
              How would you like to help?
              <select name="interest" defaultValue="" required>
                <option value="" disabled>Select an option</option>
                <option>Host a workshop</option>
                <option>Mentor students</option>
                <option>Sponsor a program</option>
                <option>Donate equipment or resources</option>
                <option>Other partnership</option>
              </select>
            </label>
            <label>
              Estimated number of students
              <input name="students" type="text" />
            </label>
            <label>
              Ideal timeframe
              <input name="timeframe" type="text" placeholder="For example, Fall 2026" />
            </label>
            <label>
              Tell us more
              <textarea name="message" rows="5" required />
            </label>
            <input className="website-field" name="website" type="text" tabIndex="-1" autoComplete="off" aria-hidden="true" />
            <button type="submit" disabled={formStatus.partner?.state === 'sending'}>
              {formStatus.partner?.state === 'sending' ? 'Sending…' : 'Request a partnership'}
            </button>
            {formStatus.partner?.message && <p className={`form-status ${formStatus.partner.state}`} role="status">{formStatus.partner.message}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
