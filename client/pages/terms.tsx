import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-geologica py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-sm border border-black/5">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">Terms of Service</h1>

        <div className="space-y-6 text-black/70 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-lg font-semibold text-black mb-2">1. Acceptance of Terms</h2>
            <p>
              By downloading or using HabitBingo, you agree to be bound by these terms.
              If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">2. Use of AI Services</h2>
            <p>
              HabitBingo uses AI to help generate habit ideas (e.g., our "Perfect Day" generator).
              While we strive for high-quality suggestions, we cannot guarantee the accuracy,
              safety, or suitability of AI-generated content for your specific health or fitness needs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">3. Health and Safety Disclaimer</h2>
            <p>
              <strong>HabitBingo is not a medical device.</strong> Any physical activities or
              health habits suggested by the app should be performed only if you are physically
              capable. Always consult a medical professional before starting new fitness or
              dietary routines.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">4. User Content</h2>
            <p>
              You retain ownership of the habit titles and grids you create. However, by using
              the app, you grant us the right to process this data to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">5. Limitation of Liability</h2>
            <p>
              HabitBingo is provided "as is." We are not liable for any damages, health issues,
              or data loss resulting from your use of the application.
            </p>
          </section>

          <section className="pt-8 border-t border-black/5">
            <p className="text-xs text-black/40">
              Last updated: March 2026<br />
              Questions? <a href="mailto:support@habitbingo.com" className="underline">support@habitbingo.com</a>
            </p>
          </section>
        </div>

        <div className="mt-12">
          <a href="/" className="text-sm font-medium text-[#4fd1c5] hover:opacity-70 transition-opacity">
            &larr; Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}