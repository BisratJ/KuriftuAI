"use client";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel, variant = "default" }) {
  if (!open) return null;

  const btnColor = variant === "danger"
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-kuriftu-700 hover:bg-kuriftu-800 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/30 animate-fade-in" />
      <div
        className="relative bg-white rounded-xl shadow-2xl border border-sand-200 p-6 max-w-[400px] w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[16px] font-semibold text-kuriftu-900 mb-2">{title}</h3>
        <p className="text-sm text-sand-500 leading-relaxed mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-sand-200 text-sm font-medium text-sand-600 hover:bg-sand-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btnColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
