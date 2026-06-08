import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page hero and slideshow controls', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /equipping youth to design the future/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /previous slide/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /next slide/i })).toBeInTheDocument();
});
