import type { Metadata } from "next";
import "./globals.css";
import { sora } from "@/lib/fonts";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "ModelArena | IEEECS-VIT",
  description: "ModelArena by IEEECS-VIT",
  icons: {
    icon: "/hero/ma-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
