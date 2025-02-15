import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/lib/react-query-provider";

export const metadata: Metadata = {
  title: "Talk Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100" aria-live="polite">
        <ReactQueryProvider>
          <main role="main" className="">
            {children}
          </main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
