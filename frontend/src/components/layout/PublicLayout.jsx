import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { themes } from '../../theme';

/**
 * Simple layout that passes a default theme down.
 * Later you can wire this to a ThemeProvider/context.
 */
export default function PublicLayout({ children }) {
  const theme = themes[0]; // default: first theme
  return (
    <div style={{ background: theme.background, color: theme.text, minHeight: '100vh' }}>
      <Header theme={theme} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>{children}</main>
      <Footer theme={theme} />
    </div>
  );
}
