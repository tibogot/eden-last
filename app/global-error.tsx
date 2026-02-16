"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-neue-haas-display), Arial, Helvetica, sans-serif",
          background: "#fffdf6",
          color: "#465643",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >
        <main style={{ maxWidth: "36rem", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-ivy-presto-headline), serif",
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 300,
              marginBottom: "1rem",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ opacity: 0.8, marginBottom: "2.5rem" }}>
            A critical error occurred. You can try again or return to the home page.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                border: "1px solid #465643",
                background: "#465643",
                color: "#fffdf6",
                padding: "0.75rem 2rem",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                border: "1px solid #465643",
                color: "#465643",
                padding: "0.75rem 2rem",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Return home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
