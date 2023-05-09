import "@/styles/globals.css";

export const metadata = {
  title: "Tera Raid Type Chart and Egg Timer",
  description: "Generated by create next app",
  icons: {
    icon: "favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="same-origin" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
