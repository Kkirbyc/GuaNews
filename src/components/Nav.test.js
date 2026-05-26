import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Nav from './Nav';
import { LanguageProvider, LANGUAGE_STORAGE_KEY } from '../context/LanguageContext';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
}), { virtual: true });

function renderNav() {
  return render(
    <LanguageProvider>
      <Nav />
    </LanguageProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  delete window.__guaLang;
});

test('changes language from the selector', async () => {
  renderNav();

  userEvent.click(screen.getByText(/EN/));
  userEvent.click(screen.getByText(/中文/));

  expect(screen.getByText(/中文/)).toBeInTheDocument();
  expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('zh');
  expect(window.__guaLang).toBe('zh');
});

test('loads the persisted language from localStorage', () => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'ja');

  renderNav();

  expect(screen.getByText(/日本語/)).toBeInTheDocument();
});

test('falls back to English for an invalid stored language', () => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'xx');

  renderNav();

  expect(screen.getByText(/EN/)).toBeInTheDocument();
});
