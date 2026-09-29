import React from 'react';
import Link from 'next/link';
import './breadcrumbs.css';

export default function Breadcrumbs({ page }: { page: string }) {
  return (
    <section className="breadcrumbs">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h2>{page}</h2>
          <ol>
            <li>
              <Link href="/">
                <i className="bi bi-house-door-fill"></i>
              </Link>
            </li>
            <li>{page}</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
