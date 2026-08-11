import { useEffect, useState } from 'react';
import './App.css';

const slides = [
  { title: 'Photo 1', src: '/assets/photowheelhomepage/IMG_6968.jpeg' },
  { title: 'Photo 2', src: '/assets/photowheelhomepage/IMG_7191.jpeg' },
  { title: 'Photo 3', src: '/assets/photowheelhomepage/IMG_8052.jpeg' },
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const intervalId = window.setInterval(() => setActiveIndex((index) => (index + 1) % slides.length), 3200);
    return () => window.clearInterval(intervalId);
  }, []);
  const previous = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const next = () => setActiveIndex((index) => (index + 1) % slides.length);
  return <div className="App"><main className="hero-shell"><section className="slideshow-panel" aria-label="Home page photo carousel"><div className="slideshow-frame"><button className="carousel-button carousel-button-left" onClick={previous} aria-label="Previous slide">?</button><img className="slide-image" src={slides[activeIndex].src} alt={slides[activeIndex].title} /><button className="carousel-button carousel-button-right" onClick={next} aria-label="Next slide">?</button></div></section><section className="hero-copy"><p className="eyebrow">Youth Engineers Initiative</p><h1>Equipping youth to design the future.</h1></section></main><section className="contact-section" aria-label="Contact"><div className="contact-card"><p className="eyebrow">Build the future with us</p><h2>Let’s make a bigger impact.</h2><p>Join our team, expand hands-on engineering opportunities, or explore a partnership.</p><a className="email-button" href="mailto:youthengineersinitiative@gmail.com?subject=Youth%20Engineers%20Initiative%20Inquiry">Email Youth Engineers Initiative</a><span>youthengineersinitiative@gmail.com</span></div></section></div>;
}
export default App;