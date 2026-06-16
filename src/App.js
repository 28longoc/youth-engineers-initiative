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
    </div>
  );
}

export default App;
