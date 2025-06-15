// src/pages/ReportDetail.tsx
import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { FiShare2, FiCopy, FiCheck } from "react-icons/fi";
import { FaWhatsapp, FaTelegram, FaInstagram } from "react-icons/fa";

import { useAuthStore } from "../context/authStore";
import { mockReports } from "../data/reports";

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [copied, setCopied] = useState(false);

  if (!currentUser) return <div>Загрузка профиля...</div>;

  const report = mockReports.find((item) => item.id === Number(id));
  if (!report) return <Navigate to="/not-found" replace />;

  // Формируем ссылку для расшаривания
  const pageUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(
    `Посмотрите этот отчет по недвижимости: ${report.title} - ${report.address}`
  );

  // Ссылки для социальных сетей
  const socialLinks = {
    whatsapp: `https://wa.me/?text=${shareText}%20${pageUrl}`,
    telegram: `https://t.me/share/url?url=${pageUrl}&text=${shareText}`,
    instagram: `https://www.instagram.com/`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
        <img
          src={report.photoUrl}
          alt={report.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{report.title}</h1>
          <p className="mb-2">Комнат: {report.rooms}</p>
          <p className="mb-2">Площадь: {report.area} м²</p>
          <p className="mb-2">Этаж: {report.floor}</p>
          <p className="mb-2">Адрес: {report.address}</p>

          <div className="mt-4 bg-gray-100 rounded-xl p-4 flex justify-between">
            <span className="font-medium">Цена за м²</span>
            <span className="font-semibold">
              {report.pricePerSqm.toLocaleString("ru-RU")} ₽/м²
            </span>
          </div>

          {/* Блок для расшаривания */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg flex items-center">
                <FiShare2 className="mr-2" />
                Поделиться отчетом
              </h3>

              <div className="flex space-x-3">
                {/* WhatsApp */}
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition"
                  aria-label="Поделиться в WhatsApp"
                >
                  <FaWhatsapp size={20} />
                </a>

                {/* Telegram */}
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200 transition"
                  aria-label="Поделиться в Telegram"
                >
                  <FaTelegram size={20} />
                </a>

                {/* Instagram */}
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:opacity-90 transition"
                  aria-label="Поделиться в Instagram"
                >
                  <FaInstagram size={20} />
                </a>

                {/* Копировать ссылку */}
                <button
                  onClick={handleCopyLink}
                  className="bg-gray-100 text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
                  aria-label="Копировать ссылку"
                >
                  {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
              </div>
            </div>

            {copied && (
              <p className="mt-3 text-green-600 text-sm flex items-center">
                <FiCheck className="mr-1" /> Ссылка скопирована в буфер обмена!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
