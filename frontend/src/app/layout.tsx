import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConnectButton from "@/components/ConnectButton";
import Header from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Zetto Dex",
  description: "Some DEX called Zetto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header>
          <div className="flex flex-1 justify-end w-full">
            <ConnectButton />
          </div>
        </Header>
        <main>{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
