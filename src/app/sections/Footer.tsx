'use client';

import React, { useState } from 'react';
import './footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter a valid email');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Subscribed successfully!');
        setEmail('');
      } else {
        setMessage(data.message || data.email?.[0] || 'Something went wrong');
      }
    } catch (error) {
      setMessage('❌ Server error. Try again.');
    }
  };

  return (
    <footer id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">

            {/* INFO */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-info">
                <h3>Restaurant</h3>
                <p>
                  83 Eversley Rd, Sketty, <br />Swansea SA2 9DE
                  <br /><br />
                  <strong>Phone:</strong> 07818030777<br />
                  <strong>Email:</strong> Klubkitchen83@gmail.com<br />
                </p>
              </div>
            </div>

            {/* LINKS */}
            <div className="col-lg-4 col-md-6 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li><a href="/terms-and-use">Terms of Use</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                <li><a href="/cookies-policy">Cookies Policy</a></li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div className="col-lg-4 col-md-6 footer-newsletter">
              <h4>Our Newsletter</h4>
              <p>
                Stay updated with the latest news, offers, and stories from our kitchen.
              </p>

              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input type="submit" value="Subscribe" />
              </form>

              {message && <p className="newsletter-msg">{message}</p>}
            </div>

          </div>
        </div>
      </div>

      <div className="container">
        <div className="copyright">
          &copy; Copyright <strong>Restaurant</strong>. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

