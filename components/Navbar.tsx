export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#hero" className="brand">
          <img src="/images/Logo.jpg" alt="PLBF logo" className="brand-logo" />
          <span>PLBF</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#governance">Governance</a>
          <a href="#trustees">Trustees</a>
          <a href="#executives">Leadership</a>
          <a href="#services">Programmes</a>
          <a href="#events">Events</a>
          <a href="#membership">Membership</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}
