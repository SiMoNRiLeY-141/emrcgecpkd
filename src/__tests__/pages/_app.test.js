import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../pages/_app';

describe('App component (pages/_app.js)', () => {
  it('renders the given Component', () => {
    const MockPage = () => <div data-testid="mock-page" />;
    render(<App Component={MockPage} pageProps={{}} />);
    expect(screen.getByTestId('mock-page')).toBeInTheDocument();
  });

  it('passes pageProps to the Component', () => {
    const MockPage = ({ greeting }) => <h1>{greeting}</h1>;
    render(<App Component={MockPage} pageProps={{ greeting: 'Hello EMRC' }} />);
    expect(screen.getByRole('heading', { name: 'Hello EMRC' })).toBeInTheDocument();
  });

  it('passes all pageProps fields through to the Component', () => {
    const MockPage = ({ a, b }) => (
      <span>
        {a}-{b}
      </span>
    );
    render(<App Component={MockPage} pageProps={{ a: 'foo', b: 'bar' }} />);
    expect(screen.getByText('foo-bar')).toBeInTheDocument();
  });

  it('renders different Components when the prop changes', () => {
    const PageA = () => <div data-testid="page-a" />;
    const PageB = () => <div data-testid="page-b" />;

    const { rerender } = render(<App Component={PageA} pageProps={{}} />);
    expect(screen.getByTestId('page-a')).toBeInTheDocument();
    expect(screen.queryByTestId('page-b')).not.toBeInTheDocument();

    rerender(<App Component={PageB} pageProps={{}} />);
    expect(screen.getByTestId('page-b')).toBeInTheDocument();
    expect(screen.queryByTestId('page-a')).not.toBeInTheDocument();
  });
});
