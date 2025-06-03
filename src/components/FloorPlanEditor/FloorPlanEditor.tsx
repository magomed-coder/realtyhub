import React, { useState, useRef, useEffect, useCallback } from "react";

type Point = { x: number; y: number };
type ApartmentStatus = "available" | "reserved" | "sold";
type Polygon = {
  id: string;
  points: Point[];
  number: string;
  status: ApartmentStatus;
};

// Цвета статусов квартир
const statusColors: Record<ApartmentStatus, { fill: string; stroke: string }> =
  {
    available: { fill: "rgba(0, 255, 47, 0.3)", stroke: "#0000ff" },
    reserved: { fill: "rgba(255, 165, 0, 0.3)", stroke: "#ff8c00" },
    sold: { fill: "rgba(128, 128, 128, 0.3)", stroke: "#555555" },
  };

export const FloorPlanEditor = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygonCounter, setPolygonCounter] = useState(0);
  const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(null);
  const [editingNumber, setEditingNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [mousePosition, setMousePosition] = useState<Point | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);

  // Проверка точки внутри полигона
  const isPointInPolygon = (point: Point, polygon: Polygon) => {
    const x = point.x;
    const y = point.y;
    let inside = false;

    for (
      let i = 0, j = polygon.points.length - 1;
      i < polygon.points.length;
      j = i++
    ) {
      const xi = polygon.points[i].x;
      const yi = polygon.points[i].y;
      const xj = polygon.points[j].x;
      const yj = polygon.points[j].y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  };

  const drawCanvas = useCallback(() => {
    if (!image) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    // Отрисовка завершенных полигонов
    polygons.forEach((polygon) => {
      ctx.beginPath();
      polygon.points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();

      // Определение цвета в зависимости от статуса
      const colors = statusColors[polygon.status];

      // Если полигон выбран - желтый цвет, иначе - цвет по статусу
      if (selectedPolygon && selectedPolygon.id === polygon.id) {
        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ctx.strokeStyle = "#ff9900";
      } else {
        ctx.fillStyle = colors.fill;
        ctx.strokeStyle = colors.stroke;
      }

      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();

      // Подпись номера квартиры
      if (polygon.points.length > 0) {
        const center = polygon.points.reduce(
          (acc, point) => {
            return { x: acc.x + point.x, y: acc.y + point.y };
          },
          { x: 0, y: 0 }
        );

        center.x /= polygon.points.length;
        center.y /= polygon.points.length;

        ctx.fillStyle =
          selectedPolygon && selectedPolygon.id === polygon.id
            ? "#ff9900"
            : colors.stroke;
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(polygon.number, center.x, center.y + 5);
      }
    });

    // Отрисовка текущего полигона
    if (currentPolygon.length > 0) {
      ctx.beginPath();
      currentPolygon.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });

      // Если есть позиция мыши - рисуем до нее линию
      if (mousePosition) {
        ctx.lineTo(mousePosition.x, mousePosition.y);
      }

      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Рисуем точки текущего полигона
      currentPolygon.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#0000ff";
        ctx.fill();
      });
    }
  }, [image, polygons, currentPolygon, selectedPolygon, mousePosition]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Обработчик движения мыши
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!image || !isDrawing) return;

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = image.width / rect.width;
    const scaleY = image.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setMousePosition({ x, y });
  };

  // Обработчик выхода мыши за пределы canvas
  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  // Обработчик клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawing) {
        setCurrentPolygon([]);
        setIsDrawing(false);
        setMousePosition(null);
      }

      if (e.key === "Delete" && selectedPolygon) {
        deletePolygon();
      }

      if (e.key === "Enter" && isEditing && selectedPolygon) {
        updatePolygonNumber();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawing, selectedPolygon, isEditing]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!image) return;

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = image.width / rect.width;
    const scaleY = image.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const point = { x, y };

    // Режим рисования - добавление точки
    if (isDrawing) {
      setCurrentPolygon([...currentPolygon, point]);
      return;
    }

    // Режим выбора полигона
    let foundPolygon = null;
    // Проверяем с конца, чтобы верхние полигоны имели приоритет
    for (let i = polygons.length - 1; i >= 0; i--) {
      if (isPointInPolygon(point, polygons[i])) {
        foundPolygon = polygons[i];
        break;
      }
    }

    if (foundPolygon) {
      selectPolygon(foundPolygon.id);
    } else {
      setSelectedPolygon(null);
    }
  };

  const startNewPolygon = () => {
    if (!image) return;
    setIsDrawing(true);
    setCurrentPolygon([]);
    setSelectedPolygon(null);
    setMousePosition(null);
  };

  const finishCurrentPolygon = () => {
    if (currentPolygon.length > 2) {
      const newPolygon: Polygon = {
        id: `polygon-${polygonCounter + 1}`,
        points: [...currentPolygon],
        number: `Кв. ${polygonCounter + 1}`,
        status: "available", // Статус по умолчанию
      };
      setPolygons([...polygons, newPolygon]);
      setPolygonCounter(polygonCounter + 1);
    }
    setCurrentPolygon([]);
    setIsDrawing(false);
    setMousePosition(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setPolygons([]);
        setCurrentPolygon([]);
        setIsDrawing(false);
        setPolygonCounter(0);
        setSelectedPolygon(null);
        setMousePosition(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const selectPolygon = (polygonId: string) => {
    const polygon = polygons.find((p) => p.id === polygonId);
    if (polygon) {
      setSelectedPolygon(polygon);
      setEditingNumber(polygon.number);
      setIsEditing(false);
    }
  };

  const updatePolygonNumber = () => {
    if (selectedPolygon) {
      const updatedPolygons = polygons.map((p) =>
        p.id === selectedPolygon.id ? { ...p, number: editingNumber } : p
      );
      setPolygons(updatedPolygons);
      setIsEditing(false);
    }
  };

  // Обновление статуса квартиры
  const updatePolygonStatus = (status: ApartmentStatus) => {
    if (selectedPolygon) {
      const updatedPolygons = polygons.map((p) =>
        p.id === selectedPolygon.id ? { ...p, status } : p
      );
      setPolygons(updatedPolygons);
      setSelectedPolygon({ ...selectedPolygon, status });
    }
  };

  const deletePolygon = () => {
    if (selectedPolygon) {
      const updatedPolygons = polygons.filter(
        (p) => p.id !== selectedPolygon.id
      );
      setPolygons(updatedPolygons);
      setSelectedPolygon(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-6xl mx-auto">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Загрузить изображение
      </button>

      {image ? (
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="w-full lg:w-3/4">
            <div className="border-2 border-amber-700 rounded-lg overflow-auto shadow-lg bg-gray-100">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: isDrawing ? "crosshair" : "default" }}
                className="max-w-full max-h-[70vh]"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={startNewPolygon}
                disabled={isDrawing}
                className={`px-4 py-2 rounded ${
                  isDrawing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Начать разметку
              </button>

              <button
                onClick={finishCurrentPolygon}
                disabled={!isDrawing}
                className={`px-4 py-2 rounded ${
                  !isDrawing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
              >
                Завершить полигон
              </button>

              <button
                onClick={() => {
                  setPolygons([]);
                  setCurrentPolygon([]);
                  setIsDrawing(false);
                  setPolygonCounter(0);
                  setSelectedPolygon(null);
                  setMousePosition(null);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Очистить всё
              </button>
            </div>

            <div className="mt-4 text-gray-600 text-center">
              <p>Квартир: {polygons.length}</p>
              {isDrawing && (
                <p>Режим рисования: {currentPolygon.length} точек</p>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
            <div className="bg-white border rounded-lg shadow p-4 sticky top-4">
              <h3 className="font-bold text-lg mb-4">Управление квартирами</h3>

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
                            setIsEditing(true);
                          }}
                          ref={numberInputRef}
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
        </div>
      ) : (
        <div className="w-full h-[50vh] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="mt-4 text-gray-500">
            Загрузите изображение, чтобы начать работу
          </p>
        </div>
      )}
    </div>
  );
};
