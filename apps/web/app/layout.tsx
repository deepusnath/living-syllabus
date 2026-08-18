import type { ReactNode } from "react";

export const metadata = {
  title: "Living Syllabus",
  description: "The flipped-classroom operating layer built on the WikiSyllabus commons.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Georgia, serif", margin: 0 }}>{children}</body>
    </html>
  );
}
