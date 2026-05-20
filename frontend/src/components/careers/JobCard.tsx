import Link from "next/link";
import { HiOutlineLocationMarker, HiOutlineBriefcase } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";

import { ROUTES } from "@/constants";
import { formatJobType } from "@/lib/jobLabels";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={ROUTES.careerJob(job._id)}
      className="group flex h-full flex-col rounded-[20px] border border-[#E8EEF5] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_12px_40px_rgba(108,191,42,0.12)] sm:p-7"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
          {formatJobType(job.type)}
        </span>
        {job.department && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {job.department}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-xl font-bold text-slate-900 transition-colors group-hover:text-brand">
        {job.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
        {job.shortDescription}
      </p>

      <ul className="mt-5 space-y-2 text-sm text-slate-600">
        <li className="flex items-center gap-2">
          <HiOutlineBriefcase className="h-4 w-4 shrink-0 text-brand" aria-hidden />
          <span>{job.experience}</span>
        </li>
        <li className="flex items-center gap-2">
          <HiOutlineLocationMarker
            className="h-4 w-4 shrink-0 text-brand"
            aria-hidden
          />
          <span>{job.location}</span>
        </li>
      </ul>

      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
        View role
        <FiArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </Link>
  );
}
