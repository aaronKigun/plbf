export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-about">
            <div className="footer-logo-row">
              <img src="/images/Logo.jpg" alt="PLBF logo" className="footer-logo" />
              <img src="/images/NBA.png" alt="NBA logo" className="footer-logo" />
            </div>
            <p>
              Advancing justice, promoting the rule of law, and protecting the rights of legal practitioners in Plateau State.
            </p>
            <p className="footer-motto">Collegiality & Veritas</p>
            <div className="footer-socials" aria-label="Social links">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">x</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="WhatsApp">wa</a>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#trustees">Trustees</a>
            <a href="#executives">Leadership</a>
            <a href="#services">Programmes</a>
            <a href="#events">Events</a>
          </div>

          <div>
            <h4>Resources</h4>
            <a href="#membership">Membership</a>
            <a href="#governance">Constitution</a>
            <a href="#governance">Code of Conduct</a>
            <a href="#governance">Legal Resources</a>
            <a href="#governance">Annual Reports</a>
          </div>

          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Stay updated with our latest news, events, and legal updates.</p>
            <form>
              <input type="email" placeholder="Your email" aria-label="Email address" />
              <button type="button" aria-label="Subscribe">Send</button>
            </form>
          </div>
        </div>

        <div className="gold-line footer-divider" aria-hidden="true" />
        <div className="footer-bottom">
          <p>&copy; 2026 Plateau Lawyers Bar Forum. All rights reserved.</p>
          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
