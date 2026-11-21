"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PrintButton } from "@/components/PrintButton";

const MEMBERS = [
  {
    name: "John Niño P. Amba",
    part: "Group leader. Company overview, case study narrative, dashboard shell, and overview page.",
  },
  {
    name: "Juvert N. Genabe",
    part: "Descriptive and predictive analysis, KPI design, charts, and the revenue forecast.",
  },
  {
    name: "Danfred Ando",
    part: "Prescriptive analysis, what-if model, data tables, database schema, and API routes.",
  },
];

const MAX_SCORE = 20;
const MAX_FINAL = 40;

const cell = "border border-[#c9c2b6] px-3 py-2.5 align-top";
const scoreField =
  "w-full rounded-sm bg-transparent px-1 py-0.5 text-center tabular-nums text-inherit outline-none placeholder:text-[#a39d92] focus:bg-[#efe9dd] print:placeholder:text-transparent";

// Keep scores numeric and inside 0 to max while the user types.
function cleanScore(raw: string, max: number): string {
  if (raw === "") return "";
  const n = Number(raw);
  if (Number.isNaN(n)) return "";
  return String(Math.min(max, Math.max(0, n)));
}

function toNumber(value: string): number {
  return value === "" ? 0 : Number(value);
}

export default function RatingSheetPage() {
  const [scores, setScores] = useState(() =>
    MEMBERS.map(() => ({ quality: "", process: "" })),
  );
  const [groupNo, setGroupNo] = useState("");
  const [finalRating, setFinalRating] = useState("");

  function updateScore(index: number, key: "quality" | "process", value: string) {
    setScores((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: cleanScore(value, MAX_SCORE) } : s)),
    );
  }

  return (
    <div className="space-y-4">
      <div className="print:hidden">
        <PageHeader
          eyebrow="Final Project 2026 · Submission"
          title="Rating sheet"
          description="The group rating sheet required for the presentation. Enter the scores, then print it or save it as a PDF."
          action={<PrintButton />}
        />
      </div>

      <article className="print-sheet mx-auto w-full max-w-3xl rounded-2xl bg-[#f7f5f1] px-5 py-7 text-[#1b1b1b] shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] sm:px-10 sm:py-9">
        <header className="border-b-2 border-[#1b1b1b] pb-4 text-center">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#6b665e]">
            Final Project 2026 · Business Analytics
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            Group Project Rating Sheet
          </h1>
          <p className="mt-1 text-[11px] text-[#6b665e]">
            Mactan Apex Dive Co. — Business Analytics Dashboard
          </p>
        </header>

        <dl className="mt-5 space-y-2.5 text-xs">
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 font-semibold">Group No.:</dt>
            <dd className="flex-1 border-b border-[#b9b2a6] pb-1">
              <input
                type="text"
                value={groupNo}
                onChange={(e) => setGroupNo(e.target.value)}
                aria-label="Group number"
                className="w-full bg-transparent text-inherit outline-none focus:bg-[#efe9dd]"
              />
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 font-semibold">Title of Project:</dt>
            <dd className="flex-1 border-b border-[#b9b2a6] pb-1">
              Mactan Apex Dive Co. — Business Analytics Dashboard
            </dd>
          </div>
        </dl>

        <section className="mt-6 space-y-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em]">
            Group leader identifies the task assigned to members
          </h2>
          <p className="text-xs leading-relaxed text-[#3a3732]">
            As group leader, John Niño P. Amba assigned the analytics steps, set the page structure,
            and reviewed the final output. Juvert N. Genabe led the descriptive and predictive
            analysis and the chart design. Danfred Ando led the prescriptive analysis, the what-if
            model, and the database and data tables.
          </p>
        </section>

        <section className="mt-5 space-y-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em]">
            Overview of the company and its identified problem
          </h2>
          <p className="text-xs leading-relaxed text-[#3a3732]">
            Mactan Apex Dive Co. is a dive shop and tour operator in Lapu-Lapu City, Mactan, Cebu.
            Revenue swings with the diving season, while marketing spend and staffing are planned the
            same way all year. Management cannot see which packages and campaigns drive bookings, so
            the shop is overstaffed in slow months and short of guides in peak months. The project
            describes performance, forecasts the next quarter, and recommends a campaign and package
            plan for the coming season.
          </p>
        </section>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="bg-[#eae5dd] text-[10px] uppercase tracking-[0.08em]">
                <th scope="col" className={cell}>Name of Member</th>
                <th scope="col" className={cell}>Part assigned</th>
                <th scope="col" className={`${cell} text-center`}>Quality of output (20)</th>
                <th scope="col" className={`${cell} text-center`}>BA process shown (20)</th>
                <th scope="col" className={`${cell} text-center`}>Total (40)</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map((member, index) => {
                const { quality, process } = scores[index];
                const filled = quality !== "" || process !== "";
                return (
                  <tr key={member.name}>
                    <td className={`${cell} font-medium`}>{member.name}</td>
                    <td className={`${cell} text-[#3a3732]`}>{member.part}</td>
                    <td className={cell}>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={MAX_SCORE}
                        step="any"
                        value={quality}
                        onChange={(e) => updateScore(index, "quality", e.target.value)}
                        placeholder="0"
                        aria-label={`${member.name} quality of output, out of ${MAX_SCORE}`}
                        className={scoreField}
                      />
                    </td>
                    <td className={cell}>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={MAX_SCORE}
                        step="any"
                        value={process}
                        onChange={(e) => updateScore(index, "process", e.target.value)}
                        placeholder="0"
                        aria-label={`${member.name} BA process shown, out of ${MAX_SCORE}`}
                        className={scoreField}
                      />
                    </td>
                    <td className={`${cell} text-center font-semibold tabular-nums`}>
                      {filled ? toNumber(quality) + toNumber(process) : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer className="mt-7 flex flex-col gap-4 border-t border-[#b9b2a6] pt-4 text-xs sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.14em] text-[#6b665e]">Submitted to</p>
            <p className="mt-1 font-semibold">ALMIRA M. ENTRENA</p>
          </div>
          <div className="sm:text-right">
            <p className="text-[9px] uppercase tracking-[0.14em] text-[#6b665e]">
              <label htmlFor="final-rating">Final Rating</label>
            </p>
            <div className="mt-1 flex items-baseline gap-1 sm:justify-end">
              <input
                id="final-rating"
                type="number"
                inputMode="decimal"
                min={0}
                max={MAX_FINAL}
                step="any"
                value={finalRating}
                onChange={(e) => setFinalRating(cleanScore(e.target.value, MAX_FINAL))}
                placeholder="0"
                className="w-16 rounded-sm border-b border-[#b9b2a6] bg-transparent text-right text-lg font-semibold tabular-nums text-inherit outline-none placeholder:text-[#a39d92] focus:bg-[#efe9dd] print:placeholder:text-transparent"
              />
              <span className="text-lg font-semibold tabular-nums">/ {MAX_FINAL}</span>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
