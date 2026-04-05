import React from "react";
import Link from "next/link";

function Hero() {
  return (
    <section className="bg-white lg:grid lg:place-content-center">
      <div className="mx-auto w-screen max-w-7xl px-4 py-32 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-primary font-extrabold sm:text-5xl text-4xl">
            AI Course Generator
            <strong className="text-black font-extrabold sm:block">
              Custom learning paths, Powered by AI
            </strong>
          </h1>

          <p className="mt-4 text-base text-gray-700 sm:text-lg/relaxed">
            Unlock personalized education with AI-driven course creation.
            Tailor your learning journey to fit your unique goals and pace.
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            <Link
              className="inline-block rounded border border-primary bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
              href={'/dashboard'}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;