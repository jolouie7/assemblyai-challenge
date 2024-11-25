import React from "react";

export default function SummaryDisplay({ summary }: { summary: string }) {
  const keyPoints = summary
    .split(/\d+\.\s+/)
    .filter(Boolean)
    .map((point) => {
      // Split on dash with space but keep the dash
      const parts = point.split(/(?=- )/);
      return {
        title: parts[0].trim(),
        content: parts.slice(1).map((part) => part.trim()),
      };
    });

  return (
    <div className="mt-6 p-6">
      <h2 className="text-2xl font-semibold mb-4">Summary:</h2>
      <div className="space-y-4">
        <ul className="list-disc pl-6 space-y-2">
          {keyPoints.map((point, index) => (
            <li key={index} className="text-sm">
              {point.title}
              {point.content.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {point.content.map((item, i) => (
                    <div key={i}>{item}</div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
