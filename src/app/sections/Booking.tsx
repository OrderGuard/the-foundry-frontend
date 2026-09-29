'use client';

import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import './booking.css';

// phone to +44
import {
  sanitizeUKPhone,
  formatUK,
  toE164UK,
} from "@/utils/phone";

const getTimeSlots = (date: string): string[] => {
  if (!date) return [];

  const day = new Date(date).getDay();

  const generateSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    let current = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (current <= endTime) {
      slots.push(current.toTimeString().slice(0,5));
      current.setMinutes(current.getMinutes() + 30); // 30 min slots
    }

    return slots;
  };

  if (day === 2 || day === 3 || day === 4) return generateSlots("17:00","21:00"); // Wed–Thu
  if (day === 5 || day === 6) return generateSlots("17:00","21:00"); // Fri–Sat
  if (day === 0) return generateSlots("11:00","15:00"); // Sunday

  return []; // Closed Mon-Tue
};

export default function Booking() {
  const initialState = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    people: '',
    message: '',
    validate: '',
  };

  const [text, setText] = useState(initialState);
  // ✅ time slots update automatically when date changes
  const timeSlots = getTimeSlots(text.date);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e: Event | any) => {
    const { name, value } = e.target;

    if (name === "date") {
      setText({ ...text, date: value, time: "", validate: "" });
      return;
    }

    setText({ ...text, [name]: value, validate: '' });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, ""); // digits only

    setText((prev) => ({
      ...prev,
      phone: raw,
    }));
  };

  const isValidBookingTime = (date: string, time: string): boolean => {
    const day = new Date(date).getDay(); // 0=Sun,1=Mon,...6=Sat

    const minutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const selected = minutes(time);

    if (day === 3 || day === 4) { // Wed, Thu
      return selected >= minutes("17:00") && selected <= minutes("22:30");
    }

    if (day === 5 || day === 6) { // Fri, Sat
      return selected >= minutes("17:00") && selected <= minutes("23:00");
    }

    if (day === 0) { // Sunday
      return selected >= minutes("11:00") && selected <= minutes("15:00");
    }

    return false; // closed Mon-Tue
  };

  const handleSubmitBooking = async (e: Event | any) => {
    e.preventDefault();
    // simple form validation

    if (loading) return;

    if (
      text.name === '' ||
      text.email === '' ||
      text.date === '' ||
      text.time === '' ||
      text.phone === ''
    ) {
      setText({ ...text, validate: 'incomplete' });
      return;
    }

    if (!isValidBookingTime(text.date, text.time)) {
      setText({
        ...text,
        validate: "invalid_time"
      });
      return;
    }

    // POST request sent
    try {
      //const response = await fetch('http://localhost:8000/api/booking/', {
      setLoading(true);

      const payload = {
        ...text,
        phone: toE164UK(text.phone), // 🔥 IMPORTANT FIX
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setText({ ...text, validate: 'loading' });

      const result = await response.json();
      if (result) {
        setText({ ...initialState, validate: 'success' });
        console.log('Success:', result);
      }
    } catch (error) {
      setText({ ...text, validate: 'error' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book-a-table" className="book-a-table">
      <div className="container" data-aos="fade-up">
        <SectionTitle title="Reservation" subtitle="Book a Table" />

        <form
          onSubmit={handleSubmitBooking}
          className="booking-form"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="row">
            <div className="col-lg-4 col-md-6 form-group">
              <input
                type="text"
                name="name"
                value={text.name}
                className="form-control"
                placeholder="Your Name"
                onChange={handleTextChange}
              />
            </div>
            <div className="col-lg-4 col-md-6 form-group mt-3 mt-md-0">
              <input
                type="email"
                className="form-control"
                name="email"
                value={text.email}
                placeholder="Your Email"
                onChange={handleTextChange}
              />
            </div>

            <div className="col-lg-4 col-md-6 form-group">
              <div className="input-group">
                {/* Prefix with flag + +44 */}
                 {/*<span
                  className="input-group-text"
                  style={{
                    fontSize: "0.80rem",
                    padding: "0.25rem 0.5rem",
                    gap: "4px",
                  }}
                >
                  🇬🇧 <span style={{ fontWeight: 600 }}>+44</span>
                </span>*/}

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formatUK(text.phone)}
                  onChange={handlePhoneChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-6 form-group mt-3">
              <input
                type="date"
                name="date"
                className="form-control"
                value={text.date}
                placeholder="Date"
                onChange={handleTextChange}
              />
            </div>
            <div className="col-lg-4 col-md-6 form-group mt-3">
              {/*<input
                type="time"
                className="form-control"
                name="time"
                value={text.time}
                placeholder="Time"
                onChange={handleTextChange}
              />*/}
              <select
                className="form-control"
                name="time"
                value={text.time}
                onChange={handleTextChange}
              >
                <option value="">Select Time</option>

                {timeSlots.length === 0 ? (
                  <option disabled>Restaurant Closed</option>
                ) : (
                  timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))
                )}
              </select>

            </div>
            <div className="col-lg-4 col-md-6 form-group mt-3">
              <input
                type="number"
                className="form-control"
                name="people"
                value={text.people}
                placeholder="# of people"
                onChange={handleTextChange}
              />
            </div>
          </div>
          <div className="form-group mt-3">
            <textarea
              className="form-control"
              name="message"
              value={text.message}
              rows={5}
              placeholder="Message"
              onChange={handleTextChange}
            ></textarea>
          </div>
          <div className="mb-3">
            {text.validate === 'loading' && (
              <div className="loading">Send Booking</div>
            )}
            {text.validate === 'incomplete' && (
              <div className="error-message">
                Please fill in all above details for booking a table
              </div>
            )}
            {text.validate === 'success' && (
              <div className="sent-message">
                Your booking request was sent. We will call back or send an
                Email to confirm your reservation. Thank you!
              </div>
            )}
            {text.validate === 'error' && (
              <div className="error-message">Server Error</div>
            )}

            {text.validate === 'invalid_time' && (
              <div className="error-message">
                Booking time is outside restaurant hours.
              </div>
            )}

          </div>
          <div className="text-center">
            <button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Book a Table"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

