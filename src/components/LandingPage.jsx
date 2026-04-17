// src/components/LandingPage.jsx
import React from 'react';

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>FreshTrack AI</h1>
        <p>Smart Expiry Tracking for a Greener Kitchen</p>
      </header>
      
      <section style={styles.hero}>
        <h2>Never let your food go to waste again.</h2>
        <button style={styles.button}>Get Started</button>
      </section>

      <section style={styles.features}>
        <div style={styles.featureCard}>
          <h3>AI Scanning</h3>
          <p>Scan receipts and labels instantly.</p>
        </div>
        <div style={styles.featureCard}>
          <h3>Smart Alerts</h3>
          <p>Get notified before items expire.</p>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Arial, sans-serif', color: '#fff', textAlign: 'center' },
  header: { padding: '50px 20px', background: '#2c3e50' },
  hero: { padding: '100px 20px', background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' },
  button: { padding: '15px 30px', fontSize: '18px', cursor: 'pointer', borderRadius: '5px', border: 'none', background: '#27ae60', color: '#fff' },
  features: { display: 'flex', justifyContent: 'center', gap: '20px', padding: '50px' },
  featureCard: { background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', width: '250px' }
};

export default LandingPage;