import PrivacyPolicy from './PrivacyPolicy';
import './page.css';

export default function TermsAndUse() {
  return (
    <section id="page" className="profile-page d-flex align-items-center">
        <div className="container align-items-center mx-auto space-y-6">
          <PrivacyPolicy />
        </div>
    </section>
  );
}




