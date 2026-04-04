"use client";

export default function LoadingSpinner({ size = "md", label = "Loading..." }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} rounded-full border-sand-200 border-t-kuriftu-600 animate-spin`} />
      {label && <span className="text-xs text-sand-500 font-medium">{label}</span>}
    </div>
  );
}

export function InlineSpinner() {
  return (
    <div className="w-4 h-4 rounded-full border-2 border-sand-200 border-t-kuriftu-600 animate-spin" />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-sand-200 rounded-lg p-5 animate-pulse">
      <div className="h-3 w-24 bg-sand-100 rounded mb-3" />
      <div className="h-7 w-20 bg-sand-100 rounded mb-2" />
      <div className="h-2.5 w-32 bg-sand-100 rounded" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-sand-100" />
      <div className="flex-1">
        <div className="h-3 w-32 bg-sand-100 rounded mb-2" />
        <div className="h-2.5 w-48 bg-sand-100 rounded" />
      </div>
      <div className="h-5 w-16 bg-sand-100 rounded-full" />
    </div>
  );
}
