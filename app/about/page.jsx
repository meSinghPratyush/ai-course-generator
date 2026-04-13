import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiEnvelope, HiIdentification, HiArrowLeft } from "react-icons/hi2";

const members = [
  {
    name: "Pratyush Kumar",
    email: "pratyush1555@gmail.com",
    roll: "2470237",
    image: "/PratyushKumar.jpg",
    role: "Full Stack Developer",
  },
  {
    name: "Pratya Pratim Kuanr",
    email: " pratimkuanrpratya@gmail.com",
    roll: "2470236",
    image: "/PratyaPratimKuanr.jpg",
    role: "Full Stack Developer",
  },
  {
    name: "Somen Dash",
    email: "somendash986@gmail.com",
    roll: "2470337",
    image: "/SomenDash.jpg",
    role: "Full Stack Developer",
  },
  {
    name: "Sachin Upadhyay",
    email: "upsachin588@gmail.com",
    roll: "2470279",
    image: "/SachinUpadhyay.jpg",
    role: "Full Stack Developer",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-[70px] border-b border-gray-100/30">
        <Link href="/">
          <Image src="/logo.svg" alt="LearnSphere" width={200} height={45} />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      {/* ── Hero Banner ── */}
      <section
        className="relative pt-32 pb-20 px-6 text-center overflow-hidden"
        style={{
          backgroundImage: "url('/17373.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative z-10">
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            MCA Project — 2024–26
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Meet the <span className="text-purple-600">Team</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            We are four MCA students who built this AI-powered course generation platform as our major project.
          </p>
        </div>
      </section>

      {/* ── Team Cards ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Avatar */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-100 mb-4 group-hover:ring-purple-300 transition-all duration-300">
            {/* Initials always shown as background */}
            <div className="absolute inset-0 bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            {/* Photo sits on top when it exists */}
            <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover relative z-10"
            />
            </div>

              {/* Name & Role */}
              <h3 className="font-bold text-gray-800 text-base leading-tight">{member.name}</h3>
              <p className="text-xs text-purple-600 font-medium mt-1 mb-4">{member.role}</p>

              {/* Divider */}
              <div className="w-full h-px bg-gray-100 mb-4" />

              {/* Details */}
              <div className="w-full flex flex-col gap-2 text-left">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <HiIdentification className="w-4 h-4 text-purple-400 flex-none mt-0.5" />
                  <span className="font-medium text-gray-700">{member.roll}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <HiEnvelope className="w-4 h-4 text-purple-400 flex-none mt-0.5" />
                  <span className="break-all">{member.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Project Info ── */}
      <section className="bg-gray-50 border-t border-gray-100 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About the Project</h2>
          <p className="text-gray-500 leading-relaxed text-base">
            <strong className="text-gray-700">AI Course Generator</strong> is an MCA major project built with Next.js,
            Clerk authentication, Drizzle ORM, Neon PostgreSQL, and Google Gemini AI.
            It allows users to generate full structured courses with chapters, quizzes, and YouTube video integration —
            all powered by AI. Users can also share and monetize their courses through a built-in credit marketplace.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-8 bg-purple-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-md shadow-purple-200"
          >
            Try the App →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} LearnSphere · MCA Project
      </footer>
    </div>
  );
}