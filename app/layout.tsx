import "@/styles/globals.css";

export const metadata = {
  title: "Tera Raid Type Chart and Egg Timer",
  description: "Generated by create next app",
  icons: {
    icon: "/type-chart/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
