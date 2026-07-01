export default function ContactSection() {
  return (
    <section id="contact" className="section">
      <h2>Contact Us</h2>
      <p>Reach out to PLBF for partnerships, membership, or general enquiries. We welcome your questions and collaborations.</p>
      <form className="form-card">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" placeholder="Enter your name" />
        <label htmlFor="contact-email">Email Address</label>
        <input id="contact-email" type="email" placeholder="Enter your email" />
        <label htmlFor="contact-subject">Subject</label>
        <input id="contact-subject" placeholder="What would you like to discuss?" />
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" placeholder="Write your message here" rows={5} />
        <button type="button">Send Message</button>
      </form>
    </section>
  );
}
