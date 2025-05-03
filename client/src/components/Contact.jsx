import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-info">
          <h2 className="contact-info-title">Contact Information</h2>
          <p className="contact-description">
            Have questions about our services or need help with your account? 
            Reach out through any of these channels.
          </p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">📧</div>
              <div className="method-details">
                <h3>Email Us</h3>
                <p>support@madhava.ai</p>
                <p>For general inquiries: info@madhava.ai</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="method-icon">📞</div>
              <div className="method-details">
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
                <p>Monday to Friday, 9am - 5pm EST</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="method-icon">🏢</div>
              <div className="method-details">
                <h3>Visit Us</h3>
                <p>123 AI Innovation Center</p>
                <p>Tech District, San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
          
          <div className="social-section">
            <h3 className="social-title">Connect With Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon">Twitter</a>
              <a href="#" className="social-icon">LinkedIn</a>
              <a href="#" className="social-icon">GitHub</a>
              <a href="#" className="social-icon">YouTube</a>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          <h2 className="form-title">Send Us a Message</h2>
          
          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Thank you for your message!</h3>
              <p>We've received your inquiry and will get back to you as soon as possible.</p>
              <button 
                className="send-another-button"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows="3"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;