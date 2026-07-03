import NewsletterForm from '@/components/NewsletterForm';

type SocialLinkProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

function SocialLink({ href, label, children }: SocialLinkProps) {
  return (
    <a href={href} className="footer-social-link" aria-label={label} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

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
              <SocialLink href="#" label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 8.5V7.2c0-.7.6-1.2 1.3-1.2H17V4h-2.2C13.1 4 12 5.1 12 6.8V8.5H10v2.7h2V20h2.5v-8.8H17l.4-2.7h-3.4z" fill="currentColor" />
                </svg>
              </SocialLink>
              <SocialLink href="#" label="X (Twitter)">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.9 4H22l-6.8 7.8L22.7 20h-4.2l-3.3-4.3-3.8 4.3H7.1l7.3-8.4L7.5 4h4.3l3 3.9L18.9 4zm-1.5 14.3h1.2L9.6 5.6H8.3l9.1 12.7z" fill="currentColor" />
                </svg>
              </SocialLink>
              <SocialLink href="#" label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.5 9.3H9v10.7H6.5V9.3zm1.3-4.2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM11 9.3h2.4v1.5h.1c.3-.6 1.1-1.5 2.3-1.5 2.5 0 3 1.6 3 3.8v5.9H16.4v-5.2c0-1.2 0-2.8-1.7-2.8-1.7 0-2 1.3-2 2.7v5.3H11V9.3z" fill="currentColor" />
                </svg>
              </SocialLink>
              <SocialLink href="#" label="WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm0 16.2a7.2 7.2 0 0 1-3.7-1l-.3-.2-2.7.7.7-2.6-.2-.3a7.2 7.2 0 1 1 6.2 3.4zm4-5.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.9-.1.1-.3.1-.5 0-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1.1-.2 0-.4-.1-.1-.5-1.2-.7-1.6-.2-.4-.4-.3-.5-.3h-.5c-.2 0-.4.1-.5.2-.2.2-.7.7-.7 1.7 0 1 .7 2 1 2.1.2.2 1.8 2.7 4.3 3.7.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2z" fill="currentColor" />
                </svg>
              </SocialLink>
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
            <NewsletterForm />
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
