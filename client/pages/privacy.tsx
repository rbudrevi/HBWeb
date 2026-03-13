import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-geologica py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-sm border border-black/5">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">Privacy Policy</h1>

        <div className="space-y-8 text-black/70 leading-relaxed text-sm sm:text-base">

          {/* Section 1: Linked Data */}
          <section>
            <h2 className="text-lg font-semibold text-black mb-3">1. Data Linked to Your Identity</h2>
            <p className="mb-4">The following information is collected and linked to your account for core app functionality:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Contact Info & Identifiers:</strong> Your email address and name (if provided) are used for authentication and to secure your account.</li>
              <li><strong>User Content:</strong> We store your habits, favorite tiles, and custom bingo grids so you can access them across devices.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with features to provide <strong>Product Personalization</strong>, such as custom-tailored habit suggestions.</li>
            </ul>
          </section>

          {/* Section 2: Unlinked Data */}
          <section>
            <h2 className="text-lg font-semibold text-black mb-3">2. Data Not Linked to Your Identity</h2>
            <p className="mb-4">We collect certain data to improve the HabitBingo experience that is not tied to your personal identity:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Diagnostics:</strong> Technical logs and crash reports to ensure server up-time and minimize app crashes.</li>
              <li><strong>Analytics:</strong> Aggregated data used to evaluate user behavior, measure audience size, and plan new features.</li>
            </ul>
          </section>

          {/* Section 3: App Functionality */}
          <section>
            <h2 className="text-lg font-semibold text-black mb-3">3. How We Use Your Data</h2>
            <p>Your data enables key <strong>App Functionality</strong>, including:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Authenticating your account via email.</li>
              <li>Preventing fraud and implementing security measures.</li>
              <li>Performing customer support and ensuring app scalability.</li>
            </ul>
          </section>

          {/* Section 4: AI & Third Parties */}
          <section>
            <h2 className="text-lg font-semibold text-black mb-3">4. AI Processing</h2>
            <p>
              When you use our AI generators, your habit prompts are processed to create your grid.
              We do not share your Identifiers (email/name) with our AI model providers.
            </p>
          </section>

          <section className="pt-8 border-t border-black/5">
            <p className="text-xs text-black/40 italic">
              This policy is designed to comply with Apple's App Store Privacy requirements.
              <br />Last updated: March 2026 | Support: support@habitbingo.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}