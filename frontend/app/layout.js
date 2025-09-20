import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-800 m-0 w-full min-h-lvh p-0">{children}</body>
    </html>
  );
}