import type { Camera } from "../types";

// Fixed camera network. Coordinates match the locations already referenced
// in data/records.ts — each camera is a real, mapped detection point.
// `nearby` is a fictional point-of-interest list used only to generate
// "likely regular destination" guesses on the person profile page — see
// utils/personInsights.ts.
export const cameras: Camera[] = [
  {
    id: "cam-1",
    name: "5th & Main — Downtown Plaza",
    latitude: 34.0522,
    longitude: -118.2437,
    nearby: ["Riverbend Public Library", "Plaza Coffee Roasters", "Downtown Farmers Market"],
  },
  {
    id: "cam-2",
    name: "7th & Figueroa",
    latitude: 34.0407,
    longitude: -118.2468,
    nearby: ["QuickStop Gas & Grocery", "Figueroa Laundromat"],
  },
  {
    id: "cam-3",
    name: "Sepulveda & Venice",
    latitude: 34.0195,
    longitude: -118.4912,
    nearby: ["Seaside Fuel Station", "Venice Pharmacy"],
  },
  {
    id: "cam-4",
    name: "Franklin & Bronson",
    latitude: 34.0611,
    longitude: -118.3004,
    nearby: ["Franklin Family Grocers", "Bronson Community Center"],
  },
  {
    id: "cam-5",
    name: "3rd & Vermont",
    latitude: 34.0455,
    longitude: -118.261,
    nearby: ["Vermont Ave Gas Station", "3rd Street Elementary"],
  },
  {
    id: "cam-6",
    name: "6th & Alvarado",
    latitude: 34.0498,
    longitude: -118.2551,
    nearby: ["Alvarado Fresh Market", "6th Street Post Office"],
  },
  {
    id: "cam-7",
    name: "Adams & Western",
    latitude: 34.0389,
    longitude: -118.2724,
    nearby: ["Western Fuel Stop", "Adams Street Diner"],
  },
  {
    id: "cam-8",
    name: "Sunset & Alameda",
    latitude: 34.0567,
    longitude: -118.2345,
    nearby: ["Sunset Grocery Co-op", "Alameda Public Pool"],
  },
];
