import React from "react";

export default function SummaryDisplay({ summary }: { summary: string }) {
  const keyPoints = summary
    .split(/\d+\.\s+/)
    .filter(Boolean)
    .map((point) => point.trim());

  return (
    <div className="mt-6 p-6">
      <h2 className="text-2xl font-semibold mb-4">Summary:</h2>
      <div className="space-y-4">
        <ul className="list-disc pl-6 space-y-2">
          {keyPoints.map((point, index) => (
            <li key={index} className="text-sm">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
