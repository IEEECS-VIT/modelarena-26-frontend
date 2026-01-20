"use client";

export default function LeaveTeamModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h3 className="text-xl font-semibold mb-3 text-black">
          Leave Team
        </h3>

        <p className="text-neutral-600 mb-6">
          Are you sure you want to leave this team?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Leave Team
          </button>
        </div>
      </div>
    </div>
  );
}
