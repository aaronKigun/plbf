export default function Footer() {
  return (
    <footer className="footer footer-large">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/images/Logo.jpg" alt="PLBF logo" className="footer-logo" />
          <div>
            <h3>Plateau Lawyers Bar Forum</h3>
            <p>Promoting justice, legal excellence, and public service.</p>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="#about">About</a>
          <a href="#governance">Governance</a>
          <a href="#membership">Membership</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}
