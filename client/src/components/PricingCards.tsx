import React from 'react';
import { Check, X } from 'lucide-react';
import './PricingCards.css';

const PricingCards: React.FC = () => {
  return (
    <div className="pricing-container">
      {/* Free Tier */}
      <div className="pricing-card">
        <h3>Free Tier</h3>
        <div className="plan">
          <h4>Basic Access</h4>
          <div className="price-tag">₹0/month</div>
          <ul>
            <li><Check className="feature-check" />Basic data analysis</li>
            <li><Check className="feature-check" />5 queries per day</li>
            <li><Check className="feature-check" />Standard support</li>
            <li><X className="feature-x" />Advanced features</li>
          </ul>
          <button className="pricing-button secondary">Get Started Free</button>
        </div>
        <p className="best-for">📌 Perfect for individual users</p>
      </div>

      {/* Pro Tier */}
      <div className="pricing-card popular">
        <div className="popular-badge">MOST POPULAR</div>
        <h3>Pro Plan</h3>
        <div className="plan">
          <h4>Professional Access</h4>
          <div className="price-tag">₹830/month</div>
          <ul>
            <li><Check className="feature-check" />Unlimited queries</li>
            <li><Check className="feature-check" />Priority processing</li>
            <li><Check className="feature-check" />Advanced analytics</li>
            <li><Check className="feature-check" />24/7 support</li>
          </ul>
          <button className="pricing-button">Upgrade to Pro</button>
        </div>
        <p className="best-for">📌 Best for professionals</p>
      </div>

      {/* Enterprise Tier */}
      <div className="pricing-card">
        <h3>Enterprise</h3>
        <div className="plan">
          <h4>Custom Solutions</h4>
          <div className="price-tag">Custom Pricing</div>
          <ul>
            <li><Check className="feature-check" />Custom integration</li>
            <li><Check className="feature-check" />Dedicated support</li>
            <li><Check className="feature-check" />Custom features</li>
            <li><Check className="feature-check" />SLA guarantee</li>
          </ul>
          <button className="pricing-button secondary">Contact Sales</button>
        </div>
        <p className="best-for">📌 For large organizations</p>
      </div>

      {/* Lifetime Access */}
      <div className="pricing-card">
        <h3>Lifetime</h3>
        <div className="plan">
          <h4>One-time Purchase</h4>
          <div className="price-tag">₹41,500</div>
          <ul>
            <li><Check className="feature-check" />Lifetime access</li>
            <li><Check className="feature-check" />All Pro features</li>
            <li><Check className="feature-check" />Free updates</li>
            <li><X className="feature-x" />Future premium features</li>
          </ul>
          <button className="pricing-button secondary">Buy Lifetime</button>
        </div>
        <p className="best-for">📌 For long-term users</p>
      </div>
    </div>
  );
};

export default PricingCards; 