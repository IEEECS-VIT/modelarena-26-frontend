import type { Metadata } from "next";
import "./globals.css";
import { sora } from "@/lib/fonts";

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
      <body className={sora.className}>{children}</body>
    </html>
  );
}

// import { supabase } from "@/lib/supabase";
// import Navbar from "@/components/Navbar";

// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   return (
//     <html lang="en">
//       <body>
//         <Navbar isLoggedIn={!!session} />
//         {children}
//       </body>
//     </html>
//   );
// }


