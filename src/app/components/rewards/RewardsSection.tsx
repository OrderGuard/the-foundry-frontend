'use client';

import './rewards.css';
import { FaGift, FaCoins, FaUser, FaStar } from 'react-icons/fa';
import Link from "next/link";


export default function RewardsSection() {
  return (
    <section className="rewards-section">
      {/*<div className="container">*/}

        <div className="reward-card">

          {/* LEFT */}

          <div className="reward-info">

            <span className="reward-tag">
              Rewards
            </span>

            <h2>Spin the Wheel</h2>

            <p>
              Earn points every time you order and get a chance to
              win exciting rewards.
            </p>

            <div className="point-box">

              <div className="point-item">
                <FaCoins />
                <div>
                  <h4>1 POINT</h4>
                  <span>for every £1 spent</span>
                </div>
              </div>

              <div className="point-item">
                <FaGift />
                <div>
                  <h4>50 POINTS = 1 SPIN</h4>
                  <span>Keep ordering to earn more!</span>
                </div>
              </div>

            </div>


            <Link href="/login">
              <button className="reward-btn">
                Login / Create Account
              </button>
            </Link>

          </div>

          {/* RIGHT */}

          <div className="wheel-wrapper">

            <div className="wheel-pointer"></div>

            <div className="wheel">

              <div className="wheel-center">
                <FaGift />
              </div>

            </div>

            <div className="wheel-points">
              <FaStar />
              <span>0 / 50 POINTS</span>
            </div>

          </div>

        </div>

        {/* FEATURES */}

        <div className="reward-features">

          <div className="feature">

            <FaCoins />

            <div>
              <h5>Earn Points</h5>
              <p>1 point for every £1 spent</p>
            </div>

          </div>

          <div className="feature">

            <FaGift />

            <div>
              <h5>Get Rewards</h5>
              <p>Unlock spins and exclusive rewards</p>
            </div>

          </div>

          <div className="feature">

            <FaUser />

            <div>
              <h5>Your Account</h5>
              <p>Track your rewards and points</p>
            </div>

          </div>

        </div>

      {/*</div>*/}
    </section>
  );
}

