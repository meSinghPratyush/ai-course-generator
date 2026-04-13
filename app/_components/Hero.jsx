import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiSparkles, HiPlayCircle, HiClipboardDocumentCheck, HiShoppingBag } from "react-icons/hi2";

const features = [
  {
    icon: <HiSparkles className="w-7 h-7 text-white" />,
    title: "AI Generated Courses",
    desc: "Gemini AI builds complete structured courses with chapters, explanations, and code examples in seconds.",
  },
  {
    icon: <HiPlayCircle className="w-7 h-7 text-white" />,
    title: "YouTube Integration",
    desc: "Every chapter is paired with a relevant YouTube video automatically for richer learning.",
  },
  {
    icon: <HiClipboardDocumentCheck className="w-7 h-7 text-white" />,
    title: "Chapter Quizzes",
    desc: "Auto-generated MCQ quizzes after each chapter with an 80% pass gate to unlock the next.",
  },
  {
    icon: <HiShoppingBag className="w-7 h-7 text-white" />,
    title: "Course Marketplace",
    desc: "Share your courses and earn credits when others purchase them. Learn and earn together.",
  },
];

function Hero() {
  return (
    <div
      className="min-h-screen font-sans relative"
      style={{
        backgroundImage: "url('/17373.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "white",
      }}
    >

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-[70px] border-b border-gray-100/30">
          <Link href="/">
            <Image src="/logo.svg" alt="LearnSphere" width={200} height={45} className='hover:opacity-80 transition-opacity duration-200 object-contain' />
          </Link>
        <div className="flex items-center gap-8">
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
            About Us
          </Link>
          <Link
            href="/dashboard"
            className="bg-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-md shadow-purple-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-purple-200 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8 shadow-sm">
            <HiSparkles className="w-4 h-4" />
            Powered by Gemini AI
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            AI Course{" "}
            <span className="text-purple-600">Generator</span>
          </h1>

          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Create personalized, structured courses in seconds. Share them, monetize them, and learn smarter with AI.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-200"
            >
              Get Started →
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-7 py-3.5 rounded-xl hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to learn smarter</h2>
            <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
              From AI course creation to a full marketplace — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} LearnSphere · Built with ❤️ by Team MCA
      </footer>
    </div>
  );
}

export default Hero;