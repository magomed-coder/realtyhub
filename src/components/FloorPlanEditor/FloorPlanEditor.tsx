import React, { useState, useRef, useEffect, useCallback } from "react";
import { ApartmentControlPanel } from "./ApartmentControlPanel";
import { UploadPlaceholder } from "./UploadPlaceholder";
import { PolygonToolbar } from "./PolygonToolbar";
import type { ApartmentStatus, Point, Polygon } from "../../types/editor";
import { isPointInPolygon } from "../../lib/isPointInPolygon";

const COLORS = {
  available: {
    fill: "rgba(0, 252, 46, 0.7)",
    stroke: "rgba(0, 252, 46, 1)",
  },
  reserved: {
    fill: "rgba(248, 162, 3, 0.7)",
    stroke: "rgba(248, 162, 3, 1)",
  },
  sold: {
    fill: "rgba(247, 3, 3, 0.7)",
    stroke: "rgba(247, 3, 3, 1)",
  },
  selected: {
    fill: "rgba(255, 255, 0, 0.3)",
    stroke: "#ff9900",
  },
  numberText: {
    default: "#131212",
    selected: "#ff9900",
  },
  currentPolygon: {
    line: "#00ff00",
    pointFill: "#0000ff",
  },
};

// Цвета статусов квартир
const statusColors: Record<ApartmentStatus, { fill: string; stroke: string }> =
  {
    available: COLORS.available,
    reserved: COLORS.reserved,
    sold: COLORS.sold,
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
      ctx.lineWidth = 4;
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
            : // : colors.stroke;
              "#131212";
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

      ctx.strokeStyle = "#f90303";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Рисуем точки текущего полигона
      currentPolygon.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#0c7ee8";
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

  const clearAll = () => {
    setPolygons([]);
    setCurrentPolygon([]);
    setIsDrawing(false);
    setPolygonCounter(0);
    setSelectedPolygon(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing, selectedPolygon, isEditing]);

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-6xl mx-auto">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />

      {image ? (
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="w-full lg:w-3/4">
            <div className="border-2 rounded-lg overflow-auto shadow-lg bg-gray-100">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: isDrawing ? "crosshair" : "default" }}
                className="max-w-full max-h-[70vh]"
              />
            </div>

            <PolygonToolbar
              isDrawing={isDrawing}
              startNewPolygon={startNewPolygon}
              finishCurrentPolygon={finishCurrentPolygon}
              clearAll={clearAll}
            />

            <div className="mt-4 text-gray-600 text-center">
              <p>Квартир: {polygons.length}</p>
              {isDrawing && (
                <p>Режим рисования: {currentPolygon.length} точек</p>
              )}
            </div>
          </div>

          <ApartmentControlPanel
            // currentFloorName={floors[currentFloor]?.name || ""}
            currentFloorName={""}
            polygons={polygons}
            selectedPolygon={selectedPolygon}
            editingNumber={editingNumber}
            setEditingNumber={setEditingNumber}
            updatePolygonNumber={updatePolygonNumber}
            updatePolygonStatus={updatePolygonStatus}
            deletePolygon={deletePolygon}
            selectPolygon={selectPolygon}
            statusColors={statusColors}
          />
        </div>
      ) : (
        <UploadPlaceholder
          onUploadClick={() => fileInputRef.current?.click()}
        />
      )}
    </div>
  );
};
