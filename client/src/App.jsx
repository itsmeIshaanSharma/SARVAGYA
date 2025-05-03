import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import BackToTop from './components/BackToTop.jsx';
import DomainPage from './pages/DomainPage.jsx';
import Profile from './components/Profile';
import Team from './components/Team';
import LoadingScreen from './components/LoadingScreen';
import APIReference from './components/APIReference';
import Pricing from './components/Pricing';
import About from './components/About';
import Contact from './components/Contact';
import PageHeader from './components/PageHeader';
import { scrollToTopImmediate } from './utils/scrollUtils';
// Keep logo for header
import './App.css';

// Add future flags configuration
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// Icons (you can replace these with actual icons)
const icons = {
  finance: '💰',
  healthcare: '🏥',
  legal: '⚖️',
  'code-assistant': '💻',
  news: '📰',
  ecommerce: '🛍️'
};

const domainDescriptions = {
  finance: 'Analyze financial data, market trends, and investment opportunities with AI-powered insights.',
  healthcare: 'Access medical information, research, and healthcare analytics with advanced natural language processing.',
  legal: 'Navigate legal documents, cases, and regulations with intelligent document analysis.',
  'code-assistant': 'Get intelligent debugging assistance, code reviews, and optimization suggestions powered by AI.',
  news: 'Stay updated with real-time news analysis and trend detection across multiple sources.',
  ecommerce: 'Track market trends, analyze consumer behavior, and optimize e-commerce operations.'
};

const domainDisplayNames = {
  finance: 'Finance',
  healthcare: 'Healthcare',
  legal: 'Legal',
  'code-assistant': 'Code Assistant',
  news: 'News',
  ecommerce: 'E-commerce'
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [menuOpen]);

  // Add effect to handle page refreshes
  useEffect(() => {
    // Scroll to top on page load/refresh
    window.onbeforeunload = () => {
      scrollToTopImmediate();
    };

    // Also scroll to top on initial load
    scrollToTopImmediate();

    // Cleanup function
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return (
    <ThemeProvider>
      <Router {...routerConfig}>
        <ScrollToTop />
        <div className="app">
          {isLoading && <LoadingScreen />}

          <Navbar 
            onMenuClick={() => setMenuOpen(true)}
          />
          
          <SideMenu 
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
          />

          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <>
                  <PageHeader 
                    title="Domain Intelligence Platform" 
                    subtitle="Select a domain to get started with AI-powered insights"
                  />
                  <div className="home">
                    <main className="domain-grid">
                      {Object.entries(icons).map(([domain, icon]) => (
                        <Link 
                          key={domain} 
                          to={`/${domain}`}
                          className="domain-card"
                        >
                          <div className="domain-icon">{icon}</div>
                          <h2>{domainDisplayNames[domain]}</h2>
                          <p>{domainDescriptions[domain]}</p>
                          {domain === 'code-assistant' && (
                            <div className="code-features">
                              <ul>
                                <li>🔍 AI Debugging</li>
                                <li>📝 Code Review</li>
                                <li>🔄 Refactoring</li>
                                <li>⚡ Performance Optimization</li>
                                <li>🔒 Security Analysis</li>
                              </ul>
                            </div>
                          )}
                        </Link>
                      ))}
                    </main>
                  </div>
                </>
              } />
              
              {/* About Route */}
              <Route 
                path="/about" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="About Us" 
                        subtitle="Learn more about our platform and mission"
                      />
                      <About />
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Add API Reference Route */}
              <Route 
                path="/api-reference" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="API Reference" 
                        subtitle="Comprehensive documentation for developers"
                      />
                      <div className="container mx-auto px-4 py-8">
                        <APIReference />
                      </div>
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Privacy Policy Route */}
              <Route 
                path="/privacy" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Privacy Policy" 
                        subtitle="How we handle and protect your data"
                      />
                      <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                          <h2 className="text-2xl font-semibold mb-6">Privacy Policy</h2>
                          <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          
                          <div className="space-y-6">
                            <section>
                              <h3 className="text-xl font-medium mb-3">Information We Collect</h3>
                              <p className="mb-3">We collect several types of information from and about users of our platform, including:</p>
                              <ul className="list-disc pl-6 space-y-2">
                                <li>Personal information you provide when registering or using our services</li>
                                <li>Usage information about your activity on our platform</li>
                                <li>Device information including IP address and browser type</li>
                                <li>Cookies and similar tracking technologies</li>
                              </ul>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">How We Use Your Information</h3>
                              <p className="mb-3">We use the information we collect to:</p>
                              <ul className="list-disc pl-6 space-y-2">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send you technical notices, updates, and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Understand how users interact with our platform</li>
                              </ul>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">Information Sharing</h3>
                              <p className="mb-3">We may share your information with:</p>
                              <ul className="list-disc pl-6 space-y-2">
                                <li>Service providers who perform services on our behalf</li>
                                <li>Business partners with your consent</li>
                                <li>Legal authorities when required by law</li>
                              </ul>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">Your Choices</h3>
                              <p className="mb-3">You have several choices regarding the information you provide:</p>
                              <ul className="list-disc pl-6 space-y-2">
                                <li>Account Information: You can update or delete your account information</li>
                                <li>Cookies: You can set your browser to refuse cookies</li>
                                <li>Marketing Communications: You can opt out of receiving promotional emails</li>
                              </ul>
                            </section>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Terms of Service Route */}
              <Route 
                path="/terms" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Terms of Service" 
                        subtitle="Guidelines for using our platform"
                      />
                      <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                          <h2 className="text-2xl font-semibold mb-6">Terms of Service</h2>
                          <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          
                          <div className="space-y-6">
                            <section>
                              <h3 className="text-xl font-medium mb-3">Acceptance of Terms</h3>
                              <p>By accessing or using M.A.D.H.A.V.A. services, you agree to be bound by these Terms. If you do not agree to all the terms and conditions, you may not access or use our services.</p>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">Description of Services</h3>
                              <p>M.A.D.H.A.V.A. provides a multi-domain analytical data harvesting and automated verification assistant platform that allows users to analyze and verify data across multiple domains.</p>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">User Accounts</h3>
                              <p>To access certain features of our services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and restricting access to your account.</p>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">API Usage and Rate Limits</h3>
                              <p>Our API is subject to rate limits based on your subscription plan. You agree not to exceed the rate limits or attempt to circumvent any limitations we impose on API usage.</p>
                            </section>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Cookie Policy Route */}
              <Route 
                path="/cookies" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Cookie Policy" 
                        subtitle="How we use cookies and similar technologies"
                      />
                      <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                          <h2 className="text-2xl font-semibold mb-6">Cookie Policy</h2>
                          <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          
                          <div className="space-y-6">
                            <section>
                              <h3 className="text-xl font-medium mb-3">What Are Cookies?</h3>
                              <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">Why Do We Use Cookies?</h3>
                              <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies.</p>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">How Can You Control Cookies?</h3>
                              <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie table above.</p>
                            </section>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Tutorials Route */}
              <Route 
                path="/tutorials" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Tutorials" 
                        subtitle="Learn how to use M.A.D.H.A.V.A. with our comprehensive guides"
                      />
                      <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                          {/* Featured Tutorial */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl overflow-hidden shadow-lg mb-8">
                            <div className="md:flex">
                              <div className="md:w-2/5 bg-blue-600 flex items-center justify-center p-8">
                                <div className="text-white text-5xl">💡</div>
                              </div>
                              <div className="p-8 md:w-3/5">
                                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">Featured Tutorial</div>
                                <h2 className="mt-2 text-2xl font-bold text-gray-800">Getting Started with M.A.D.H.A.V.A.</h2>
                                <p className="mt-3 text-gray-600">Learn the basics of M.A.D.H.A.V.A. and how to set up your first project. This comprehensive guide will walk you through the initial setup process.</p>
                                <div className="mt-4">
                                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                    Start Learning
                                    <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Tutorial Categories */}
                          <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tutorial Categories</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">API Integration</h3>
                                <p className="text-gray-600 mb-4">Learn how to integrate M.A.D.H.A.V.A. API into your applications.</p>
                              </div>
                              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Security</h3>
                                <p className="text-gray-600 mb-4">Best practices for securing your data when using M.A.D.H.A.V.A.</p>
                              </div>
                              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Advanced Features</h3>
                                <p className="text-gray-600 mb-4">Explore advanced features and capabilities of M.A.D.H.A.V.A.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Team Route */}
              <Route 
                path="/team" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Our Team" 
                        subtitle="Meet the people behind the platform"
                      />
                      <Team />
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Pricing Route */}
              <Route 
                path="/pricing" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Pricing Plans" 
                        subtitle="Choose the right plan for your needs"
                      />
                      <Pricing />
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Contact Route */}
              <Route 
                path="/contact" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Contact Us" 
                        subtitle="Get in touch with our team"
                      />
                      <Contact />
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Documentation Route */}
              <Route 
                path="/documentation" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Documentation" 
                        subtitle="Comprehensive guides and reference materials"
                      />
                      <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                          <h2 className="text-2xl font-semibold mb-6">Documentation</h2>
                          <p className="text-gray-600 mb-4">
                            Welcome to the M.A.D.H.A.V.A. documentation. Here you'll find comprehensive guides and reference materials to help you get the most out of our platform.
                          </p>
                          
                          <div className="space-y-6 mt-8">
                            <section>
                              <h3 className="text-xl font-medium mb-3">Getting Started</h3>
                              <p className="mb-3">Learn the basics of M.A.D.H.A.V.A. and how to set up your first project.</p>
                              <ul className="list-disc pl-6 space-y-2">
                                <li>Platform Overview</li>
                                <li>Account Setup</li>
                                <li>API Keys and Authentication</li>
                                <li>Making Your First API Call</li>
                              </ul>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">Core Concepts</h3>
                              <p className="mb-3">Understand the fundamental concepts behind M.A.D.H.A.V.A.</p>
                              <ul className="list-disc pl-6 space-y-2">
                                <li>Multi-domain Analysis</li>
                                <li>Data Harvesting Techniques</li>
                                <li>Automated Verification Processes</li>
                                <li>Integration Patterns</li>
                              </ul>
                            </section>
                            
                            <section>
                              <h3 className="text-xl font-medium mb-3">API Reference</h3>
                              <p className="mb-3">Detailed information about our API endpoints and parameters.</p>
                              <div className="mt-4">
                                <Link to="/api-reference" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                  View API Reference
                                </Link>
                              </div>
                            </section>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Blog Route */}
              <Route 
                path="/blog" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Blog" 
                        subtitle="Latest news, updates, and insights"
                      />
                      <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Blog Post 1 */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                              <div className="h-48 bg-blue-600"></div>
                              <div className="p-6">
                                <div className="text-sm text-gray-500 mb-2">June 15, 2023</div>
                                <h3 className="text-xl font-semibold mb-2">Introducing M.A.D.H.A.V.A. 2.0</h3>
                                <p className="text-gray-600 mb-4">We're excited to announce the release of M.A.D.H.A.V.A. 2.0, featuring enhanced multi-domain analysis capabilities and improved verification algorithms.</p>
                                <button className="text-blue-600 font-medium hover:text-blue-800">Read More →</button>
                              </div>
                            </div>
                            
                            {/* Blog Post 2 */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                              <div className="h-48 bg-green-600"></div>
                              <div className="p-6">
                                <div className="text-sm text-gray-500 mb-2">May 28, 2023</div>
                                <h3 className="text-xl font-semibold mb-2">Best Practices for Data Verification</h3>
                                <p className="text-gray-600 mb-4">Learn how to implement effective data verification strategies using M.A.D.H.A.V.A.'s automated verification assistant.</p>
                                <button className="text-blue-600 font-medium hover:text-blue-800">Read More →</button>
                              </div>
                            </div>
                            
                            {/* Blog Post 3 */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                              <div className="h-48 bg-purple-600"></div>
                              <div className="p-6">
                                <div className="text-sm text-gray-500 mb-2">May 10, 2023</div>
                                <h3 className="text-xl font-semibold mb-2">Multi-domain Analysis for Financial Services</h3>
                                <p className="text-gray-600 mb-4">Discover how financial institutions are leveraging M.A.D.H.A.V.A. for comprehensive data analysis across multiple domains.</p>
                                <button className="text-blue-600 font-medium hover:text-blue-800">Read More →</button>
                              </div>
                            </div>
                            
                            {/* Blog Post 4 */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                              <div className="h-48 bg-yellow-600"></div>
                              <div className="p-6">
                                <div className="text-sm text-gray-500 mb-2">April 22, 2023</div>
                                <h3 className="text-xl font-semibold mb-2">API Integration Strategies</h3>
                                <p className="text-gray-600 mb-4">A comprehensive guide to integrating M.A.D.H.A.V.A. API into your existing applications and workflows.</p>
                                <button className="text-blue-600 font-medium hover:text-blue-800">Read More →</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Suspense>
                } 
              />
              
              {/* Domain Routes */}
              {Object.entries(icons).map(([domain, icon]) => (
                <Route
                  key={domain}
                  path={`/${domain}`}
                  element={
                    <React.Suspense fallback={<LoadingScreen />}>
                      <div className="page-container">
                        <PageHeader 
                          title={domainDisplayNames[domain]} 
                          subtitle={domainDescriptions[domain]}
                        />
                        <DomainPage
                          domain={domainDisplayNames[domain]}
                          description={domainDescriptions[domain]}
                          icon={icon}
                        />
                      </div>
                    </React.Suspense>
                  }
                />
              ))}

              {/* Profile Routes */}
              <Route 
                path="/profile/settings" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Profile Settings" 
                        subtitle="Manage your personal information"
                      />
                      <Profile section="settings" />
                    </div>
                  </React.Suspense>
                } 
              />
              <Route 
                path="/account/settings" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Account Settings" 
                        subtitle="Manage your account preferences"
                      />
                      <Profile section="account" />
                    </div>
                  </React.Suspense>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Notifications" 
                        subtitle="Manage your notification preferences"
                      />
                      <Profile section="notifications" />
                    </div>
                  </React.Suspense>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Analytics" 
                        subtitle="View your usage statistics and insights"
                      />
                      <Profile section="analytics" />
                    </div>
                  </React.Suspense>
                } 
              />
              <Route 
                path="/support" 
                element={
                  <React.Suspense fallback={<LoadingScreen />}>
                    <div className="page-container">
                      <PageHeader 
                        title="Support" 
                        subtitle="Get help with your questions and issues"
                      />
                      <Profile section="support" />
                    </div>
                  </React.Suspense>
                } 
              />
            </Routes>
          </main>

          <Footer />
          <BackToTop />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
