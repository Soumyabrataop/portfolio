"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white px-8 py-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
        SM
      </Link>
      <div className="hidden md:flex gap-8 text-sm uppercase font-medium tracking-wide">
        <Link href="/about" className="hover:opacity-70 transition">About</Link>
        <Link href="/projects" className="hover:opacity-70 transition">Projects</Link>
        <Link href="/contact" className="hover:opacity-70 transition">Contact</Link>
      </div>
      <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 right-8 bg-black/90 p-6 flex flex-col gap-4 text-white text-lg rounded-lg md:hidden shadow-lg border border-white/10">
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/projects" onClick={() => setIsOpen(false)}>Projects</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
}
