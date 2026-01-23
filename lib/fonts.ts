import { Roboto_Mono, Sora } from "next/font/google";

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});
