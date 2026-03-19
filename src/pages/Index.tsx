export default function Index() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <section className="rounded-3xl border border-primary-100 dark:border-primary-900/60 bg-gradient-to-br from-white via-primary-50/40 to-blue-50/70 dark:from-gray-900 dark:via-gray-900 dark:to-primary-950/30 shadow-xl overflow-hidden">
        <div className="px-6 py-10 sm:px-10 sm:py-14 text-center">
          <div className="inline-flex items-center rounded-full border border-primary-200 dark:border-primary-800 bg-white/80 dark:bg-gray-900/80 px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-primary-700 dark:text-primary-300">
            Under Active Development
          </div>

          <h1 className="mt-6 text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Rozgar Sathi is currently being refined and will be live shortly.
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            We are actively working on the platform experience and preparing the final release.
            Thank you for your patience while we complete the remaining updates.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
            {[
              'A cleaner and more reliable experience is being prepared.',
              'Content and release details will be shared in the next phase.',
              'The full live version will be announced here very soon.',
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/70 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 px-4 py-4 text-sm text-gray-600 dark:text-gray-300 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
