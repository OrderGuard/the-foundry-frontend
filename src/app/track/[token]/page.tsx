
import { Suspense } from "react";
import TrackOrder from "./TrackOrder";
import './page.css';
//import Return from "./Return";

export default function Page({ params }: { params: { token: string } }) {
  return (
    <section id="page" className="login d-flex align-items-center">
        <div className="container align-items-center mx-auto space-y-6">
          <TrackOrder token={params.token} />
        </div>
    </section>
  );
}


