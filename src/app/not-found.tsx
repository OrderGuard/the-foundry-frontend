// src/app/not-found.tsx
import Link from "next/link";
import Image from "next/image";
import './terms-and-use/page.css';

export default function NotFound() {
  return (
    <section id="page" className="login d-flex align-items-center">
        <div className="container align-items-center mx-auto space-y-6">

    <div className="flex flex-col items-center justify-center min-h-screen text-white text-center p-6">
      <Image
        src="/assets/images/klub-kitchen-83-logo-white.PNG"
        alt="Klub Kitchen 83 Logo"
        width={150}
        height={150}
        className="mb-6"
      />

      <h1 className="text-5xl font-bold mb-2">404</h1>
      <p className="text-lg mb-6">Oops! The page you’re looking for doesn’t exist.</p>

      <Link
        href="/"
        className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
      >
        Go back home
      </Link>
    </div>
        </div>
    </section>

  );
}

