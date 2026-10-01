import React from 'react';
import SectionTitle from '../components/SectionTitle';
import './contact.css';

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container" data-aos="fade-up">
        <SectionTitle title="Contact" subtitle="Contact Us" />
      </div>

      <div data-aos="fade-up">
        <iframe
          style={{ border: 0, width: '100%', height: '350px' }}
          src="https://www.google.com/maps?q=5+High+Street,+Swansea,+SA1+1LE&output=embed"
          allowFullScreen
        ></iframe>
      </div>

      <div className="container" data-aos="fade-up">
        <div className="row mt-5">
          <div className="col-lg-4">
            <div className="info">
              <div className="address">
                <i className="bi bi-geo-alt"></i>
                <h4>Location:</h4>
                <p>5 high street, Swansea, SA1 1LE</p>
              </div>

              <div className="open-hours">
                <i className="bi bi-clock"></i>
                <h4>Open Hours:</h4>

                {/*<p>
                  Monday-Tuesday: Closed
                </p>
                  <br />*/}

                <p>
                  Breakfast
                  <br />
                  9:00 AM - 4:00 PM
                </p>
                  <br />

                <p>
                  Dinner
                  <br />
                  5:00 PM - 10:00 PM
                </p>
                  <br />

                {/*<p>
                  Sunday:
                  <br />
                  11:00 AM - 3:00 PM
                </p>*/}
              </div>

              <div className="email">
                <i className="bi bi-envelope"></i>
                <h4>Email:</h4>
                <p>theFoundry@gmail.com</p>
              </div>

              <div className="phone">
                <i className="bi bi-phone"></i>
                <h4>Call:</h4>
                <p>01792956055</p>
              </div>
            </div>
          </div>

          <div className="col-lg-8 mt-5 mt-lg-0">
            <form role="form" className="contact-form">
              <div className="row">
                <div className="col-md-6 form-group">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    required
                  />
                </div>
              </div>
              <div className="form-group mt-3">
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  id="subject"
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="form-group mt-3">
                <textarea
                  className="form-control"
                  name="message"
                  rows={8}
                  placeholder="Message"
                  required
                ></textarea>
              </div>
              <div className="my-3">
                <div className="loading">Loading</div>
                <div className="error-message"></div>
                <div className="sent-message">
                  Your message has been sent. Thank you!
                </div>
              </div>
              <div className="text-center">
                <button type="submit">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

