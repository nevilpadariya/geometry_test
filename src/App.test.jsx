import { render, screen } from '@testing-library/react';
import App from './App';

test('renders geometry test app', () => {
  render(<App />);
  const headingElement = screen.getByText(/geometry test/i);
  expect(headingElement).toBeInTheDocument();
});
