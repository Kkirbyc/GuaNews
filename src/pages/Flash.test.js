import { render, screen, waitFor } from '@testing-library/react';
import Flash from './Flash';
import { LanguageProvider, LANGUAGE_STORAGE_KEY } from '../context/LanguageContext';

const article = {
  title: 'Global markets rally on policy shift',
  description: 'Investors responded to the policy update with broad gains.',
  source: 'Reuters',
  url: 'https://example.com/story',
  publishedAt: new Date().toISOString(),
};

function renderFlash() {
  return render(
    <LanguageProvider>
      <Flash />
    </LanguageProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ articles: [article] }),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('requests flash news with the default language parameter', async () => {
  renderFlash();

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/news?pageSize=20&language=en')
    );
  });
  expect(await screen.findAllByText(article.title)).toHaveLength(2);
});

test('requests flash news with the persisted language parameter', async () => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'zh');

  renderFlash();

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/news?pageSize=20&language=zh')
    );
  });
});

test('does not crash when flash news request fails', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  global.fetch = jest.fn(() => Promise.reject(new Error('network error')));

  renderFlash();

  await waitFor(() => {
    expect(screen.queryByText(/Loading latest updates/i)).not.toBeInTheDocument();
  });
  expect(screen.getByText('Latest')).toBeInTheDocument();
});
