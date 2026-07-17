"use client";

import { motion, animate, useInView } from "framer-motion";
import { FaAward } from "react-icons/fa";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { PiUsersThreeBold } from "react-icons/pi";
import { RxGlobe } from "react-icons/rx";
import { useEffect, useRef } from "react";
import type { IconType } from "react-icons";

const stats: {
  icon: IconType;
  value: number;
  suffix: string;
  label: string;
}[] = [
  {
    icon: FaAward,
    value: 10,
    suffix: "+",
    label: "Years of Excellence",
  },
  {
    icon: RxGlobe,
    value: 25,
    suffix: "+",
    label: "Countries Served",
  },
  {
    icon: PiUsersThreeBold,
    value: 150,
    suffix: "+",
    label: "Happy Clients",
  },
  {
    icon: MdOutlineRocketLaunch,
    value: 300,
    suffix: "+",
    label: "Projects Delivered",
  },
  
 
];

function Counter({
  value,
  suffix,
  start,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  start: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node || !start) return;

    const controls = animate(0, value, {
      duration: 1.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        node.textContent = Math.round(latest).toString();
      },
    });

    return () => controls.stop();
  }, [value, start, delay]);

  return (
    <span className="tabular-nums">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export function AchievementsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.35,
  });

  return (
    <section className="relative overflow-hidden bg-transparent py-6 sm:py-8 lg:py-10">
      {/* background dots */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      {/* green gradient */}
      <div className="absolute right-0 top-0 h-full w-[45%] bg-[radial-gradient(circle_at_top_right,rgba(126, 168, 73,0.16),transparent_70%)]" />

      <div className="hero-container relative z-10">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-[34px] border border-[#edf2e7] bg-[#fcfdf9] shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
        >
          {/* left bottom shape */}
          <div className="pointer-events-none absolute bottom-0 left-0 h-[180px] w-[180px] overflow-hidden opacity-80">
            <div className="absolute bottom-[-30px] left-[-30px] h-[160px] w-[160px] rounded-full border-[18px] border-brand/10" />

            <div className="absolute bottom-[-10px] left-[-10px] h-[120px] w-[120px] rounded-full border-[14px] border-brand/10" />
          </div>

          {/* right bottom shape */}
          <div className="pointer-events-none absolute bottom-0 right-0 h-[180px] w-[180px] overflow-hidden opacity-80">
            <div className="absolute bottom-[-30px] right-[-30px] h-[160px] w-[160px] rounded-full border-[18px] border-brand/10" />

            <div className="absolute bottom-[-10px] right-[-10px] h-[120px] w-[120px] rounded-full border-[14px] border-brand/10" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative flex flex-col items-center justify-center px-3 py-6 text-center sm:px-5 sm:py-7 md:px-6 md:py-8 lg:py-8 desktop:py-10 xl:py-12 ${
                    index < 2
                      ? "border-b border-[#e9eee3] lg:border-b-0"
                      : ""
                  }`}
                >
                  {/* center divider */}
                  {index !== stats.length - 1 && (
                    <div className="absolute right-0 top-1/2 hidden h-[120px] w-px -translate-y-1/2 bg-[#e4e9df] lg:block desktop:h-[140px] xl:h-[160px]" />
                  )}

                  {/* icon */}
                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                    className="mb-2 sm:mb-3 md:mb-4 lg:mb-3 desktop:mb-4 xl:mb-5"
                  >
                    <Icon
                      className="h-10 w-10 text-brand sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-12 lg:w-12 desktop:h-16 desktop:w-16 xl:h-[72px] xl:w-[72px]"
                      aria-hidden
                    />
                  </motion.div>

                  {/* number */}
                  <h3 className="text-[22px] font-extrabold leading-none tracking-tight text-[#0f172a] sm:text-[28px] md:text-[34px] lg:text-[32px] desktop:text-[40px] xl:text-[48px]">
                    <Counter
                      value={item.value}
                      suffix={item.suffix}
                      start={isInView}
                      delay={index * 0.08}
                    />
                  </h3>

                  {/* label */}
                  <p className="mt-1.5 max-w-[7.5rem] text-balance text-[11px] font-medium leading-snug text-[#4b5563] sm:mt-2 sm:max-w-none sm:text-[12px] md:text-[14px] lg:text-[13px] desktop:text-[15px] xl:mt-3 xl:text-[17px]">
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}