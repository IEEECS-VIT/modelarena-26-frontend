"use client";

import Image from "next/image";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white px-12 py-10">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div>
            <div className="w-32 md:w-40 lg:w-48">
                <Image
                    src="/hero/logo.png"
                    alt="Logo"
                    width={200}
                    height={200}
                    className="w-full h-auto object-contain"
                />
            </div>

          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 text-xl">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition"
          >
            <FaInstagram />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition"
          >
            <FaLinkedin />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition"
          >
            <FaTwitter />
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition"
          >
            <FaYoutube />
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition"
          >
            <FaGithub />
          </a>

          <a
            href="mailto:modelarena@gmail.com"
            className="hover:text-orange-500 transition"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
}
