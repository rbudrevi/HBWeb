import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-geologica py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-sm border border-black/5">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">Privacy Policy</h1>

        <div className="space-y-6 text-black/70 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-lg font-semibold text-black mb-2">1. Overview</h2>
            <p>
              At HabitBingo, we believe small habits lead to big wins. We are committed to protecting
              your privacy. This policy explains how we handle your data when you use our mobile
              application and website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">2. Data We Collect</h2>
            <p>
              <strong>Habit Data:</strong> We store the habit titles and grid configurations you create.
              This data is used solely to provide the core bingo experience.
              <br /><br />
              <strong>AI Processing:</strong> When you generate a "Perfect Day," your prompt is
              processed via the Gemini API to create habit items. We do not use your personal prompts
              to train models for third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">3. Data Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal data. We only share information with
              essential service providers (like our database and AI services) required to run the app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">4. Your Rights</h2>
            <p>
              You have the right to delete your data at any time. To request account deletion or a
              copy of your data, please contact us via the support link below.
            </p>
          </section>

          <section className="pt-8 border-t border-black/5">
            <p className="text-xs text-black/40">
              Last updated: March 2026<br />
              Contact: <a href="mailto:support@habitbingo.com" className="underline">support@habitbingo.com</a>
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