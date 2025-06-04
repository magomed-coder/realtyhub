// PolygonToolbar.tsx
import React from "react";

export interface PolygonToolbarProps {
  /** Показывает, идёт ли сейчас режим рисования */
  isDrawing: boolean;
  /** Колбэк: начать новый полигона */
  startNewPolygon: () => void;
  /** Колбэк: завершить текущий полигона */
  finishCurrentPolygon: () => void;
  /** Колбэк: полностью очистить всё (список полигонов, состояние рисования и т.д.) */
  clearAll: () => void;
}

/**
 * PolygonToolbar – презентационный компонент, отображающий три кнопки:
 * – «Начать разметку»
 * – «Завершить полигон»
 * – «Очистить всё»
 *
 * Условия дизейбла и стили передаются через пропсы:
 *  • isDrawing – если true, то кнопка «Начать разметку» будет отключена,
 *    а кнопка «Завершить полигон» наоборот – активна.
 *  • clearAll – просто сбрасывает всё состояние через переданный колбэк.
 */
export const PolygonToolbar: React.FC<PolygonToolbarProps> = ({
  isDrawing,
  startNewPolygon,
  finishCurrentPolygon,
  clearAll,
}) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {/* Кнопка «Начать разметку» */}
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

      {/* Кнопка «Завершить полигон» */}
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

      {/* Кнопка «Очистить всё» */}
      <button
        onClick={clearAll}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Очистить всё
      </button>
    </div>
  );
};
