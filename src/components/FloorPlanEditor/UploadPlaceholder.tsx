// UploadPlaceholder.tsx
import React from "react";

export interface UploadPlaceholderProps {
  /** Called when user clicks the “Upload” button */
  onUploadClick: () => void;
}

export const UploadPlaceholder: React.FC<UploadPlaceholderProps> = ({
  onUploadClick,
}) => {
  return (
    <div className="w-full h-[50vh] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>

      <p className="mt-4 text-gray-500">
        Загрузите план этажа чтобы начать работу
      </p>

      <button
        onClick={onUploadClick}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Загрузить первый этаж
      </button>
    </div>
  );
};
