export default function DeleteModal({ onClose, onConfirm, type }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-30 z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this {type}?</p>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
