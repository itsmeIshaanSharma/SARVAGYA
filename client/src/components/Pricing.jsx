import React, { useEffect } from 'react';
import './Pricing.css';

const Pricing = () => {
  useEffect(() => {
    // Add animation to elements when they come into view
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.pricing-card, .pricing-header, .pricing-faq');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animated');
        }
      });
    };
    
    // Run once on mount
    setTimeout(animateOnScroll, 100);
    
    // Add scroll listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Choose Your Perfect Plan</h1>
        <p className="pricing-subtitle">
          Access M.A.D.H.A.V.A.'s powerful intelligence with a plan that fits your needs
        </p>
      </div>

      <div className="pricing-cards">
        <div className="pricing-card free">
          <div className="starter-tag">Free</div>
          <div className="card-header">
            <h2>Free Tier</h2>
            <div className="price">$0<span>/mo</span></div>
            <p className="price-description">For casual users</p>
          </div>
          <div className="card-body">
            <ul className="features-list">
              <li>Basic access to all domains</li>
              <li>5 queries per day</li>
              <li>Standard response time</li>
              <li>Community support</li>
            </ul>
            <button className="cta-button">Get Started</button>
            <p className="no-credit-card">No credit card required</p>
          </div>
        </div>

        <div className="pricing-card premium">
          <div className="popular-tag">Popular</div>
          <div className="card-header">
            <h2>Premium</h2>
            <div className="price">$19<span>/mo</span></div>
            <p className="price-description">For professionals</p>
          </div>
          <div className="card-body">
            <ul className="features-list">
              <li>Full access to all domains</li>
              <li>100 queries per day</li>
              <li>Priority response time</li>
              <li>Email support</li>
              <li>API access</li>
            </ul>
            <button className="cta-button">Subscribe Now</button>
          </div>
        </div>

        <div className="pricing-card enterprise">
          <div className="enterprise-tag">Enterprise</div>
          <div className="card-header">
            <h2>Enterprise</h2>
            <div className="price">Custom</div>
            <p className="price-description">For organizations</p>
          </div>
          <div className="card-body">
            <ul className="features-list">
              <li>Unlimited access</li>
              <li>Unlimited queries</li>
              <li>Fastest response time</li>
              <li>Dedicated support</li>
              <li>Custom integrations</li>
              <li>Advanced security</li>
            </ul>
            <button className="cta-button">Contact Sales</button>
          </div>
        </div>
      </div>

      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-category">
          <h3 className="category-title">Subscription & Billing</h3>
          <div className="faq-item">
            <h3>Can I switch plans later?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a long-term commitment?</h3>
            <p>No, all our plans are billed monthly with no long-term commitment.</p>
          </div>
          <div className="faq-item">
            <h3>Are there discounts for annual billing?</h3>
            <p>Yes, we offer a 20% discount when you choose annual billing for any of our paid plans.</p>
          </div>
        </div>
        
        <div className="faq-category">
          <h3 className="category-title">Payment & Refunds</h3>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and bank transfers for enterprise customers. Cryptocurrency payments are also supported for annual subscriptions.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer refunds?</h3>
            <p>We offer a 14-day money-back guarantee for all paid plans.</p>
          </div>
        </div>
        
        <div className="faq-category">
          <h3 className="category-title">Plans & Features</h3>
          <div className="faq-item">
            <h3>What's included in the free plan?</h3>
            <p>Our free plan includes basic access to all domains with limited queries per day, standard response times, and community support. It's perfect for individual users or those wanting to try our platform before upgrading.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer educational or non-profit discounts?</h3>
            <p>Yes, we offer special pricing for educational institutions, non-profit organizations, and open-source projects. Please contact our sales team for more information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 