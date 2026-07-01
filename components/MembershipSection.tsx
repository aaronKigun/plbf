export default function MembershipSection() {
  return (
    <section id="membership" className="section section-alt">
      <h2>Membership</h2>
      <p>Join the Plateau Lawyers Bar Forum and become part of a stronger legal community committed to justice and professional excellence.</p>
      <form className="form-card">
        <label htmlFor="member-name">Full Name</label>
        <input id="member-name" placeholder="Enter your full name" />
        <label htmlFor="member-email">Email Address</label>
        <input id="member-email" type="email" placeholder="Enter your email" />
        <label htmlFor="member-phone">Phone Number</label>
        <input id="member-phone" placeholder="Enter your phone number" />
        <button type="button">Submit Membership Request</button>
      </form>
    </section>
  );
}
