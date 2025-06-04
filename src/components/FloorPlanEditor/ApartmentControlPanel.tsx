// components/ApartmentControlPanel.tsx
import React from "react";
import type { ApartmentStatus, Polygon } from "../../types/editor";
import { StatusButton } from "./StatusButton";

interface ApartmentControlPanelProps {
  currentFloorName: string;
  polygons: Polygon[];
  selectedPolygon: Polygon | null;
  editingNumber: string;
  setEditingNumber: (value: string) => void;
  updatePolygonNumber: () => void;
  updatePolygonStatus: (status: ApartmentStatus) => void;
  deletePolygon: () => void;
  selectPolygon: (id: string) => void;
  statusColors: Record<ApartmentStatus, { fill: string; stroke: string }>;
}

// Конфигурация статусов
const STATUS_CONFIG: Record<ApartmentStatus, { label: string }> = {
  available: { label: "Доступна" },
  reserved: { label: "Забронирована" },
  sold: { label: "Продана" },
};

export const ApartmentControlPanel: React.FC<ApartmentControlPanelProps> = ({
  currentFloorName,
  polygons,
  selectedPolygon,
  editingNumber,
  setEditingNumber,
  updatePolygonNumber,
  updatePolygonStatus,
  deletePolygon,
  selectPolygon,
  statusColors,
}) => {
  return (
    <div className="w-full lg:w-1/4 mt-6 lg:mt-0 overflow-hidden">
      <div className="bg-white rounded-lg shadow p-4 sticky top-4 flex flex-col">
        <h3 className="font-bold text-lg mb-4 text-gray-700">
          Управление квартирами
        </h3>

        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-gray-700">Текущий этаж:</h4>
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <p className="font-medium text-gray-900">{currentFloorName}</p>
            <p className="text-sm text-gray-600 mt-1">
              {polygons.length} квартир
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-gray-700">
            Выбранная квартира:
          </h4>
          {selectedPolygon ? (
            <div className="rounded p-3 space-y-3 border border-gray-200">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Номер квартиры:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={editingNumber}
                    onChange={(e) => setEditingNumber(e.target.value)}
                    className="border border-gray-300 rounded-l px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#009257]"
                  />
                  <button
                    onClick={updatePolygonNumber}
                    className="bg-[#009257] text-white px-3 rounded-r hover:bg-[#007a46] transition-colors"
                  >
                    ✓
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Статус квартиры:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    Object.entries(STATUS_CONFIG) as [
                      ApartmentStatus,
                      { label: string }
                    ][]
                  ).map(([status, config]) => (
                    <StatusButton
                      key={status}
                      status={status}
                      currentStatus={selectedPolygon.status}
                      onClick={updatePolygonStatus}
                      label={config.label}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={deletePolygon}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors mt-2"
              >
                Удалить квартиру
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4 rounded bg-gray-50 border border-gray-200">
              Выберите квартиру на плане
            </p>
          )}
        </div>

        <div className="h-[30vh] overflow-hidden flex flex-col">
          <h4 className="font-semibold mb-2 text-gray-700">Все квартиры:</h4>
          <div className="overflow-y-auto border border-gray-200 rounded">
            {polygons.length > 0 ? (
              polygons.map((polygon) => {
                const colors = statusColors[polygon.status];
                return (
                  <div
                    key={polygon.id}
                    onClick={() => selectPolygon(polygon.id)}
                    className={`p-3 cursor-pointer flex items-center transition-colors ${
                      selectedPolygon?.id === polygon.id
                        ? "bg-[#009257] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{
                        backgroundColor:
                          selectedPolygon?.id === polygon.id
                            ? "white"
                            : colors.stroke,
                      }}
                    ></div>
                    <span>{polygon.number}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">
                Нет размеченных квартир
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
