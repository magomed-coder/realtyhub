import React from "react";
import { useAuthStore } from "../context/authStore";
import { mockReports } from "../data/reports";
import { Link } from "react-router-dom";

const Reports: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) {
    return <div>Загрузка профиля...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 py-20">
      {/* Сетка: 1 колонка на моб, 2 на планшете, 3 на десктопе */}
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
        {mockReports.map((item) => (
          <Link
            to={`/reports/${item.id}`}
            key={item.id}
            className="block bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={item.photoUrl}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">
                  {item.rooms}-комн. · {item.area} м²
                </p>
                <p className="text-gray-600">Этаж: {item.floor}</p>
                <p className="text-gray-600 mt-2 text-sm">{item.address}</p>
              </div>
              <div className="mt-4 bg-gray-100 rounded-xl p-3 flex justify-between items-center">
                <span className="text-gray-700 font-medium">Цена за м²</span>
                <span className="text-gray-900 font-semibold">
                  {item.pricePerSqm.toLocaleString("ru-RU")} ₽/м²
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Reports;
