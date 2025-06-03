import React, { useState, useRef, useEffect, useCallback } from "react";

type Point = { x: number; y: number };
type Polygon = { id: string; points: Point[] };

export const FloorPlanEditor = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygonCounter, setPolygonCounter] = useState(0);

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

    polygons.forEach((polygon) => {
      ctx.beginPath();

      polygon.points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });

      ctx.closePath(); // замыкаем контур

      // Заливка внутренней области
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)"; // полупрозрачный зелёный
      ctx.fill();

      // Обводка
      ctx.strokeStyle = "rgba(249, 7, 7, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // draw current polygon
    if (currentPolygon.length > 0) {
      ctx.beginPath();
      currentPolygon.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.stroke();

      currentPolygon.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#0000ff";
        ctx.fill();
      });
    }
  }, [image, polygons, currentPolygon]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!image || !isDrawing) return;

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = image.width / rect.width;
    const scaleY = image.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setCurrentPolygon([...currentPolygon, { x, y }]);
  };

  const startNewPolygon = () => {
    if (!image) return;
    setIsDrawing(true);
    setCurrentPolygon([]);
  };

  const finishCurrentPolygon = () => {
    if (currentPolygon.length > 2) {
      const newPolygon: Polygon = {
        id: `polygon-${polygonCounter + 1}`,
        points: [...currentPolygon],
      };
      setPolygons([...polygons, newPolygon]);
      setPolygonCounter(polygonCounter + 1);
    }
    setCurrentPolygon([]);
    setIsDrawing(false);
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
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
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
        <div className="w-full">
          <div className="border-2 border-gray-300 rounded-lg overflow-auto shadow-lg bg-gray-100">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
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
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Очистить всё
            </button>
          </div>

          <div className="mt-4 text-gray-600 text-center">
            <p>Квартир: {polygons.length}</p>
            {isDrawing && <p>Режим рисования: {currentPolygon.length} точек</p>}
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
