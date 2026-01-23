export default function TimelineSection() {
  return (
    <section id="timeline" className="min-h-screen bg-transparent p-12 flex flex-col gap-8">
      <div className="bg-overlay p-8 rounded-lg max-w-7xl mx-auto text-white w-full">
        <h1 className="text-4xl font-semibold">Timeline</h1>

        <div className="border-l border-white/25 pl-6 flex flex-col gap-6 mt-6">
          <div>
            <h3 className="text-xl text-white">Registrations Open</h3>
            <p className="text-white/60">Jan 25</p>
          </div>

          <div>
            <h3 className="text-xl text-white">Round 1 Begins</h3>
            <p className="text-white/60">Feb 8</p>
          </div>

          <div>
            <h3 className="text-xl text-white">Final Results</h3>
            <p className="text-white/60">Feb 10</p>
          </div>
        </div>
      </div>
    </section>
  );
}

