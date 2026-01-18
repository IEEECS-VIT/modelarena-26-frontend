import Protected from "../../components/Protected";
import Navbar from "../../components/Navbar";
import TimelineSection from "../../components/TimelineSection";

export default function TimelinePage() {
  return (
    <Protected>
      <Navbar />

      <main className="min-h-screen">
        <TimelineSection />
      </main>
    </Protected>
  );
}
