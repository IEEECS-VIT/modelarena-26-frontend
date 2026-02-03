export default function AboutSection() {
  return (
    <section className="relative min-h-screen w-full px-6 py-28 flex items-center">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* LEFT — TITLE */}
        <div>
          <h1 className="metal-text text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold leading-[1.1]">
            <span className="block">OPERATIONAL</span>
            <span className="block mt-3">
              DIRECTIVE
              <span className="metal-dot inline-block ml-3 align-middle" />
            </span>
          </h1>
        </div>

        {/* RIGHT — PANELS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* OBJECTIVE */}
          <div className="panel font-mono text-sm">
            <p className="text-lime-400 mb-3 font-semibold">&gt; OBJECTIVE</p>
            <p className="text-white/85">&gt; CAT MISSION_CONFIG.YAML</p>

            <div className="space-y-1 text-white/60 mb-4">
              <p>TARGET_GROUP: <span className="text-white/85">[NEURAL_ARCHITECTS]</span></p>
              <p>DURATION: <span className="text-white/85">86400_SECONDS (24H)</span></p>
              <p>CONSTRAINTS: <span className="text-white/85">NO_PPT_SLIDES</span></p>
              <p>MODE: <span className="text-white/85">RAW_COMPUTE // CODE_ONLY</span></p>
              <p>
                STATUS: <span className="text-lime-400">AWAITING_DEPLOYMENT</span>
              </p>
            </div>
          </div>

          {/* EMPTY VISUAL PANEL */}
          <div className="panel" />

          {/* SUBMISSION DIRECTORY — FULL WIDTH */}
          <div className="panel font-mono text-sm md:col-span-2">
            <p className="text-lime-400 mb-4 font-semibold">
              ./SUBMISSION_DIRECTORY/
            </p>

            <div className="flex justify-between gap-10">
              {/* FILE TREE */}
              <div className="space-y-1 text-white/85">
                <p>├─ TRAINED_MODEL.PT</p>
                <p>├─ INFERENCE_PIPELINE.IPYNB</p>
                <p>├─ PREDICTIONS.CSV</p>
                <p>└─ SYSTEM_ARCH.PDF</p>
              </div>

              {/* STATUS */}
              <div className="text-right whitespace-nowrap space-y-2">
                <p>&gt; SYNC_STATUS: <span className="text-lime-400">ESTABLISHED</span></p>
                <p>&gt; UPLOAD_SPEED: <span className="text-white/85">840 MB/s</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .panel {
          background: linear-gradient(180deg, rgba(20,20,20,0.9), rgba(8,8,8,0.95));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 1.5rem;
          box-shadow:
            inset 0 1px 0 rgba(29, 29, 29, 0.05),
            0 12px 40px rgba(24, 24, 24, 0.8);
        }

        .metal-text {
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #e5e5e5 35%,
            #9a9a9a 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.03em;
          text-shadow:
            0 2px 1px rgba(153, 153, 153, 0.6),
            0 18px 70px rgba(56, 53, 53, 0.85);
        }

        .metal-dot {
          width: 18px;
          height: 18px;
          background: #ccff00;
          box-shadow:
            0 0 12px rgba(204,255,0,0.6),
            inset 0 -1px 2px rgba(0,0,0,0.25);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
