import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function AuthForm() {
  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-16 text-center">

        {/* Heading Section */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary">
            Get started today
          </h1>

          <p className="mt-4 text-gray-500">
            Sign in to access your personalized AI-powered learning dashboard.
          </p>
        </div>

        {/* Clerk SignIn */}
        <div className="mt-10 flex justify-center">
          <SignIn
            appearance={{
              elements: {
                card: "shadow-xl",
              },
            }}
          />
        </div>

      </div>
    </section>
  );
}
