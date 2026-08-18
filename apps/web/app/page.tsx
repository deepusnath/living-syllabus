import { K_ANONYMITY_THRESHOLD } from "@living-syllabus/core";

// Scaffold landing page. Real surfaces (teacher console, student brief) arrive
// with the Sprint 1 stories — one primary action per screen, per
// docs/UX-PRINCIPLES.md. Importing from core proves the workspace wiring.

export default function Home() {
  return (
    <main style={{ maxWidth: "42rem", margin: "0 auto", padding: "4rem 1.25rem" }}>
      <p style={{ color: "#6B21A8", fontFamily: "system-ui", fontSize: "0.8rem", letterSpacing: "0.08em" }}>
        LIVING SYLLABUS · SCAFFOLD
      </p>
      <h1 style={{ fontFamily: "system-ui", lineHeight: 1.2 }}>The classroom loop is under construction.</h1>
      <p>
        Teacher console and student brief land in Sprint 1. The domain core underneath is already keeping its
        promises: nothing here will ever show a teacher fewer than {K_ANONYMITY_THRESHOLD} students&apos; worth of
        aggregate.
      </p>
    </main>
  );
}
