import type { ApartmentStatus } from "../../types/editor";

// Компонент для кнопки статуса
interface StatusButtonProps {
  status: ApartmentStatus;
  currentStatus: ApartmentStatus;
  onClick: (status: ApartmentStatus) => void;
  label: string;
}

export const StatusButton: React.FC<StatusButtonProps> = ({
  status,
  currentStatus,
  onClick,
  label,
}) => {
  const isActive = currentStatus === status;

  return (
    <button
      onClick={() => onClick(status)}
      className={`
        py-2 rounded transition-colors
        ${
          isActive
            ? "bg-[#009257] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
    >
      {label}
    </button>
  );
};
