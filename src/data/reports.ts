export interface ReportItem {
  id: number;
  photoUrl: string;
  title: string;
  area: number;
  rooms: number;
  floor: string;
  pricePerSqm: number;
  address: string;
}

export const mockReports: ReportItem[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  photoUrl: `https://picsum.photos/400/300?random=${i + 1}`,
  title: `${1 + (i % 3)}-комн. квартира`, // 1,2,3 комнаты по кругу
  area: 30 + i * 2,
  rooms: 1 + (i % 3),
  floor: `${2 + (i % 9)}/10`,
  pricePerSqm: 120000 + i * 3000,
  address: `Южно-Сахалинск, проспект Победы, ${50 + i}`,
}));
