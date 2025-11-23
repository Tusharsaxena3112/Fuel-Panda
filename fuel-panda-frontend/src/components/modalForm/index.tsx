import React from "react";

export default function ModalForm({ open, title, onClose, children }: { open: boolean; title?: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="bg-white rounded shadow-lg p-6 z-50 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
