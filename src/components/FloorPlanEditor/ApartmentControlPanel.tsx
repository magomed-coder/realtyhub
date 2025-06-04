// components/ApartmentControlPanel.tsx
import React from "react";
import type { ApartmentStatus, Polygon } from "./FloorPlanEditor";

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
    <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
      <div className="bg-white border rounded-lg shadow p-4 sticky top-4">
        <h3 className="font-bold text-lg mb-4">Управление квартирами</h3>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Текущий этаж:</h4>
          <div className="bg-blue-50 rounded p-3">
            <p className="font-medium">{currentFloorName}</p>
            <p className="text-sm text-gray-600">{polygons.length} квартир</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Выбранная квартира:</h4>
          {selectedPolygon ? (
            <div className="bg-yellow-50 rounded p-3">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Номер квартиры:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={editingNumber}
                    onChange={(e) => {
                      setEditingNumber(e.target.value);
                    }}
                    className="border rounded-l px-2 py-1 w-full"
                  />
                  <button
                    onClick={updatePolygonNumber}
                    className="bg-blue-500 text-white px-3 rounded-r"
                  >
                    ✓
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Статус квартиры:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePolygonStatus("available")}
                    className={`flex-1 py-1 rounded ${
                      selectedPolygon.status === "available"
                        ? "bg-green-500 text-white"
                        : "bg-green-100"
                    }`}
                  >
                    Доступна
                  </button>
                  <button
                    onClick={() => updatePolygonStatus("reserved")}
                    className={`flex-1 py-1 rounded ${
                      selectedPolygon.status === "reserved"
                        ? "bg-orange-500 text-white"
                        : "bg-orange-100"
                    }`}
                  >
                    Забронирована
                  </button>
                  <button
                    onClick={() => updatePolygonStatus("sold")}
                    className={`flex-1 py-1 rounded ${
                      selectedPolygon.status === "sold"
                        ? "bg-gray-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Продана
                  </button>
                </div>
              </div>

              <button
                onClick={deletePolygon}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
              >
                Удалить квартиру
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-3 bg-gray-50 rounded">
              Выберите квартиру на плане
            </p>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Все квартиры:</h4>
          <div className="max-h-60 overflow-y-auto">
            {polygons.length > 0 ? (
              polygons.map((polygon) => {
                const colors = statusColors[polygon.status];
                return (
                  <div
                    key={polygon.id}
                    onClick={() => selectPolygon(polygon.id)}
                    className={`p-2 mb-2 rounded cursor-pointer flex items-center ${
                      selectedPolygon?.id === polygon.id
                        ? "bg-yellow-100 border border-yellow-300"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: colors.stroke }}
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
