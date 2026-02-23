"use client";

import { useState } from "react";
import Image from "next/image";

const buildings = [
  { name: "AGSM", rooms_available: 9, image: "/agsm.webp" },
  { name: "Ainsworth Building", rooms_available: 16, image: "/ainsworth.webp" },
  { name: "Anita B Lawrence Centre", rooms_available: 44, image: "/anitab.webp" },
  { name: "Biological Sciences", rooms_available: 6, image: "/biologicalScience.webp" },
  { name: "Biological Science (West)", rooms_available: 8, image: "/biologicalScienceWest.webp" },
  { name: "Blockhouse", rooms_available: 42, image: "/blockhouse.webp" },
  { name: "Business School", rooms_available: 18, image: "/businessSchool.webp" },
  { name: "Civil Engineering Building", rooms_available: 8, image: "/civilBuilding.webp" },
  { name: "Colombo Building", rooms_available: 5, image: "/colombo.webp" },
  { name: "Computer Science & Eng (K17)", rooms_available: 7, image: "/cseBuilding.webp" },
];

export default function Home() {
  const [doorOpen, setDoorOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white lg:h-screen lg:overflow-hidden">
      {/* Horizontal Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <button
          onClick={() => setDoorOpen(!doorOpen)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            src={doorOpen ? "/freeRoomsLogo.png" : "/freeroomsDoorClosed.png"}
            alt="Freerooms Logo"
            width={36}
            height={36}
          />
          <span className="hidden sm:inline text-orange font-bold text-3xl">
            Freerooms
          </span>
        </button>

        {/* Nav Icon Buttons */}
        <div className="flex items-center gap-1.5">
          <NavButton icon="search" />
          <NavButton icon="grid_view" active />
          <NavButton icon="map" />
          <NavButton icon="dark_mode" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Filter / Search Bar */}
        <div className="px-4 md:px-6 py-3">
          {/* Search bar - mobile only (shown above filters row) */}
          <div className="sm:hidden relative mb-2">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search for a building..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-orange"
            />
          </div>

          {/* Filters | (desktop: search) | Sort */}
          <div className="flex items-center justify-between">
            {/* Filters */}
            <button className="flex-none flex items-center gap-3 border-2 border-orange text-orange rounded-xl pl-5 pr-7 py-2 text-base font-extrabold hover:bg-orange/5 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-lg">filter_alt</span>
              Filters
            </button>

            {/* Search bar - desktop only (between filters and sort) */}
            <div className="hidden sm:block w-[40%] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Search for a building..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-orange"
              />
            </div>

            {/* Sort */}
            <button className="flex-none flex items-center gap-3 border-2 border-orange text-orange rounded-xl pl-4 pr-10 py-2 text-base font-extrabold hover:bg-orange/5 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Sort
            </button>
          </div>
        </div>

        {/* Building Cards Grid */}
        <div className="px-4 md:px-6 pb-8 pt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:h-[calc(100vh-8rem)] lg:auto-rows-fr">
          {buildings.map((building) => (
            <BuildingCard key={building.name} building={building} />
          ))}
        </div>
      </main>
    </div>
  );
}

function NavButton({ icon, active }: { icon: string; active?: boolean }) {
  return (
    <div
      className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors border ${
        active
          ? "bg-orange border-orange text-white"
          : "border-orange text-orange hover:bg-orange/5"
      }`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{icon}</span>
    </div>
  );
}

function BuildingCard({
  building,
}: {
  building: { name: string; rooms_available: number; image: string };
}) {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group aspect-9/2 sm:aspect-square lg:aspect-auto">
      <Image
        src={building.image}
        alt={building.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
      />
      {/* Mobile: left-to-right gradient for text readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent sm:hidden" />
      {/* Rooms available badge */}
      <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:top-3 sm:translate-y-0 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700 shadow-sm">
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block" />
        <span className="sm:hidden">{building.rooms_available} / {building.rooms_available}</span>
        <span className="hidden sm:inline">{building.rooms_available} rooms available</span>
      </div>
      {/* Mobile: name as text overlay, vertically centered */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:hidden">
        <p className="text-white font-semibold text-sm drop-shadow-md">
          {building.name}
        </p>
      </div>
      {/* Tablet/desktop: floating orange label, inset from card edges */}
      <div className="absolute bottom-2 left-2 right-2 bg-orange rounded-xl px-4 py-3.5 hidden sm:block">
        <p className="text-white font-bold text-sm truncate">
          {building.name}
        </p>
      </div>
    </div>
  );
}
