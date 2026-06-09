"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ROUTES } from "@/constants";

export function StartAConvoSection() {
  return (
    <section
      id="start-a-convo"
      aria-label="Start a conversation"
      className="section-padding"
    >
      <div className="hero-container">
        <div className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-muted/40 via-white to-brand-muted/30" />

          {/* Glow Effects */}
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand-muted blur-3xl opacity-40" />

          <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-muted/60 blur-3xl opacity-40" />

          <div className="relative grid items-center gap-10 px-6 py-14 md:px-12 lg:grid-cols-2 lg:px-16 lg:py-10">
            {/* Left Content */}
            <div className="max-w-xl">
              {/* <p className="mb-4 inline-flex rounded-full border border-brand/25 bg-lime-50 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-brand-dark">
                Start a Conversation
              </p> */}

              <h2 className="text-heading text-[32px] leading-[1.08] sm:text-[44px] lg:text-[28px] lg:leading-[1.12] desktop:text-[34px] xl:text-[46px] 2xl:text-[50px]">
                Ready to Build
                <br />
                <span className="text-brand">Better Software?</span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 md:text-lg">
                Let’s discuss how we can help you achieve
                quality, speed, and innovation with scalable
                engineering solutions.
              </p>

              <div className="mt-8">
                <Link
                  href={ROUTES.contact}
                  className="group inline-flex items-center gap-3 rounded-2xl bg-brand px-7 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-[0_12px_32px_rgba(126,168,73,0.25)]"
                >
                  Start a Conversation
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative flex items-center justify-center">
              {/* Glow */}
              <div className="absolute h-[420px] w-[420px] rounded-full bg-brand-muted blur-3xl opacity-30" />

              {/* Floating Balls */}
              <div className="absolute top-10 left-10 h-6 w-6 rounded-full bg-brand-muted shadow-lg" />
              <div className="absolute top-24 right-16 h-10 w-10 rounded-full bg-brand-muted/60 shadow-lg" />
              <div className="absolute bottom-10 left-20 h-8 w-8 rounded-full bg-gray-200 shadow-lg" />

              {/* Rocket Image */}
              <div className="relative z-10">
                <Image
                  src="/images/global/rocket1111.png"
                  alt="Rocket illustration"
                  width={700}
                  height={700}
                  priority
                  className="h-auto w-full max-w-[650px] object-contain drop-shadow-2xl lg:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute inset-x-0 bottom-0 h-24 opacity-20">
            <svg
              viewBox="0 0 1440 320"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                fill="#7EA849"
                d="M0,128L60,138.7C120,149,240,171,360,181.3C480,192,600,192,720,176C840,160,960,128,1080,128C1200,128,1320,160,1380,176L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}