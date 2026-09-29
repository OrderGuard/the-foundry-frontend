
import { Suspense } from "react";
import PaymentSuccessPage from "./PaymentSuccessPage";
import './page.css';
//import Return from "./Return";

export default function Page() {
  return (
    <section id="page" className="login-page d-flex align-items-center">
        <div className="container align-items-center mx-auto space-y-6">
          <Suspense fallback={<p>Loading payment status...</p>}>
            <PaymentSuccessPage />
          </Suspense>
        </div>
    </section>
  );
}

