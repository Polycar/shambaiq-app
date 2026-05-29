// ─────────────────────────────────────────────────────────────────────────────
// ShambaIQ Site Data — Counties, Crops, Zones
// Single source of truth for sitemap, search, county pages, and internal links.
// ─────────────────────────────────────────────────────────────────────────────

export interface County {
  slug: string;
  name: string;
  zone: string;
  zoneSlug: string;
  region: string;
}

export interface Crop {
  slug: string;
  name: string;
  category: string;
}

export interface Zone {
  slug: string;
  name: string;
  counties: string[]; // county slugs
}

// ── All 47 Kenyan Counties ─────────────────────────────────────────────────

export const ALL_COUNTIES: County[] = [
  { slug: "baringo", name: "Baringo", zone: "Rift Valley", zoneSlug: "rift-valley", region: "Rift Valley" },
  { slug: "bomet", name: "Bomet", zone: "South Rift", zoneSlug: "south-rift", region: "Rift Valley" },
  { slug: "bungoma", name: "Bungoma", zone: "Western Highlands", zoneSlug: "western-highlands", region: "Western" },
  { slug: "busia", name: "Busia", zone: "Lake Victoria Basin", zoneSlug: "lake-victoria-basin", region: "Western" },
  { slug: "elgeyo-marakwet", name: "Elgeyo Marakwet", zone: "Rift Valley", zoneSlug: "rift-valley", region: "Rift Valley" },
  { slug: "embu", name: "Embu", zone: "Central Highlands", zoneSlug: "central-highlands", region: "Central" },
  { slug: "garissa", name: "Garissa", zone: "Arid and Semi-Arid", zoneSlug: "arid-semi-arid", region: "North Eastern" },
  { slug: "homa-bay", name: "Homa Bay", zone: "Lake Victoria Basin", zoneSlug: "lake-victoria-basin", region: "Nyanza" },
  { slug: "isiolo", name: "Isiolo", zone: "Arid and Semi-Arid", zoneSlug: "arid-semi-arid", region: "Eastern" },
  { slug: "kajiado", name: "Kajiado", zone: "Semi-Arid", zoneSlug: "semi-arid", region: "Rift Valley" },
  { slug: "kakamega", name: "Kakamega", zone: "Western Highlands", zoneSlug: "western-highlands", region: "Western" },
  { slug: "kericho", name: "Kericho", zone: "South Rift", zoneSlug: "south-rift", region: "Rift Valley" },
  { slug: "kiambu", name: "Kiambu", zone: "Central Highlands", zoneSlug: "central-highlands", region: "Central" },
  { slug: "kilifi", name: "Kilifi", zone: "Coastal Lowlands", zoneSlug: "coastal-lowlands", region: "Coast" },
  { slug: "kirinyaga", name: "Kirinyaga", zone: "Central Highlands", zoneSlug: "central-highlands", region: "Central" },
  { slug: "kisii", name: "Kisii", zone: "Western Highlands", zoneSlug: "western-highlands", region: "Nyanza" },
  { slug: "kisumu", name: "Kisumu", zone: "Lake Victoria Basin", zoneSlug: "lake-victoria-basin", region: "Nyanza" },
  { slug: "kitui", name: "Kitui", zone: "Semi-Arid", zoneSlug: "semi-arid", region: "Eastern" },
  { slug: "kwale", name: "Kwale", zone: "Coastal Lowlands", zoneSlug: "coastal-lowlands", region: "Coast" },
  { slug: "laikipia", name: "Laikipia", zone: "Rift Valley", zoneSlug: "rift-valley", region: "Rift Valley" },
  { slug: "lamu", name: "Lamu", zone: "Coastal Lowlands", zoneSlug: "coastal-lowlands", region: "Coast" },
  { slug: "machakos", name: "Machakos", zone: "Semi-Arid", zoneSlug: "semi-arid", region: "Eastern" },
  { slug: "makueni", name: "Makueni", zone: "Semi-Arid", zoneSlug: "semi-arid", region: "Eastern" },
  { slug: "mandera", name: "Mandera", zone: "Arid and Semi-Arid", zoneSlug: "arid-semi-arid", region: "North Eastern" },
  { slug: "marsabit", name: "Marsabit", zone: "Arid and Semi-Arid", zoneSlug: "arid-semi-arid", region: "Eastern" },
  { slug: "meru", name: "Meru", zone: "Central Highlands", zoneSlug: "central-highlands", region: "Eastern" },
  { slug: "migori", name: "Migori", zone: "Lake Victoria Basin", zoneSlug: "lake-victoria-basin", region: "Nyanza" },
  { slug: "mombasa", name: "Mombasa", zone: "Coastal Lowlands", zoneSlug: "coastal-lowlands", region: "Coast" },
  { slug: "murang-a", name: "Muranga", zone: "Central Highlands", zoneSlug: "central-highlands", region: "Central" },
  { slug: "nairobi", name: "Nairobi", zone: "Central Highlands", zoneSlug: "central-highlands", region: "Nairobi" },
  { slug: "nakuru", name: "Nakuru", zone: "Rift Valley", zoneSlug: "rift-valley", region: "Rift Valley" },
  { slug: "nandi", name: "Nandi", zone: "Western Highlands", zoneSlug: "western-highlands", region: "Rift Valley" },
  { slug: "narok", name: "Narok", zone: "South Rift", zoneSlug: "south-rift", region: "Rift Valley" },
  { slug: "nyamira", name: "Nyamira", zone: "Western Highlands", zoneSlug: "western-highlands", region: "Nyanza" },
  { slug: "nyandarua", name: "Nyandarua", zone: "Central Highlands", zoneSlug: "central-highlands", region: "Central" },
  { slug: "nyeri", name: "Nyeri", zone: "Central Highlands", zoneSlug: "central-highlands", region: "Central" },
  { slug: "samburu", name: "Samburu", zone: "Arid and Semi-Arid", zoneSlug: "arid-semi-arid", region: "Rift Valley" },
  { slug: "siaya", name: "Siaya", zone: "Lake Victoria Basin", zoneSlug: "lake-victoria-basin", region: "Nyanza" },
  { slug: "taita-taveta", name: "Taita Taveta", zone: "Coastal Highlands", zoneSlug: "coastal-highlands", region: "Coast" },
  { slug: "tana-river", name: "Tana River", zone: "Arid and Semi-Arid", zoneSlug: "arid-semi-arid", region: "Coast" },
  { slug: "tharaka-nithi", name: "Tharaka Nithi", zone: "Central Highlands", zoneSlug: "central-highlands", region: "Eastern" },
  { slug: "trans-nzoia", name: "Trans Nzoia", zone: "Western Highlands", zoneSlug: "western-highlands", region: "Rift Valley" },
  { slug: "turkana", name: "Turkana", zone: "Arid and Semi-Arid", zoneSlug: "arid-semi-arid", region: "Rift Valley" },
  { slug: "uasin-gishu", name: "Uasin Gishu", zone: "Rift Valley", zoneSlug: "rift-valley", region: "Rift Valley" },
  { slug: "vihiga", name: "Vihiga", zone: "Western Highlands", zoneSlug: "western-highlands", region: "Western" },
  { slug: "wajir", name: "Wajir", zone: "Arid and Semi-Arid", zoneSlug: "arid-semi-arid", region: "North Eastern" },
  { slug: "west-pokot", name: "West Pokot", zone: "Rift Valley", zoneSlug: "rift-valley", region: "Rift Valley" },
];

// ── 25 Crops ──────────────────────────────────────────────────────────────

export const ALL_CROPS: Crop[] = [
  { slug: "maize", name: "Maize", category: "Cereals" },
  { slug: "wheat", name: "Wheat", category: "Cereals" },
  { slug: "sorghum", name: "Sorghum", category: "Cereals" },
  { slug: "millet", name: "Millet", category: "Cereals" },
  { slug: "rice", name: "Rice", category: "Cereals" },
  { slug: "beans", name: "Beans", category: "Legumes" },
  { slug: "cowpeas", name: "Cowpeas", category: "Legumes" },
  { slug: "green-grams", name: "Green Grams", category: "Legumes" },
  { slug: "pigeon-peas", name: "Pigeon Peas", category: "Legumes" },
  { slug: "soybeans", name: "Soybeans", category: "Legumes" },
  { slug: "tomato", name: "Tomato", category: "Vegetables" },
  { slug: "cabbage", name: "Cabbage", category: "Vegetables" },
  { slug: "kale", name: "Kale (Sukuma Wiki)", category: "Vegetables" },
  { slug: "onion", name: "Onion", category: "Vegetables" },
  { slug: "spinach", name: "Spinach", category: "Vegetables" },
  { slug: "carrot", name: "Carrot", category: "Vegetables" },
  { slug: "potato", name: "Potato", category: "Root Crops" },
  { slug: "sweet-potato", name: "Sweet Potato", category: "Root Crops" },
  { slug: "cassava", name: "Cassava", category: "Root Crops" },
  { slug: "arrow-root", name: "Arrow Root", category: "Root Crops" },
  { slug: "avocado", name: "Avocado", category: "Fruits" },
  { slug: "mango", name: "Mango", category: "Fruits" },
  { slug: "banana", name: "Banana", category: "Fruits" },
  { slug: "napier-grass", name: "Napier Grass", category: "Fodder" },
  { slug: "sunflower", name: "Sunflower", category: "Cash Crops" },
];

// ── 7 Agroecological Zones ────────────────────────────────────────────────

export const ALL_ZONES: Zone[] = [
  {
    slug: "central-highlands",
    name: "Central Highlands",
    counties: ["kiambu", "murang-a", "nyeri", "kirinyaga", "nyandarua", "meru", "embu", "tharaka-nithi", "nairobi"],
  },
  {
    slug: "rift-valley",
    name: "Rift Valley",
    counties: ["nakuru", "baringo", "laikipia", "elgeyo-marakwet", "uasin-gishu", "west-pokot", "samburu", "narok", "bomet", "kericho"],
  },
  {
    slug: "western-highlands",
    name: "Western Highlands",
    counties: ["kakamega", "bungoma", "vihiga", "trans-nzoia", "nandi", "kisii", "nyamira"],
  },
  {
    slug: "lake-victoria-basin",
    name: "Lake Victoria Basin",
    counties: ["kisumu", "homa-bay", "migori", "siaya", "busia"],
  },
  {
    slug: "semi-arid",
    name: "Semi-Arid Lands",
    counties: ["kajiado", "machakos", "makueni", "kitui", "isiolo"],
  },
  {
    slug: "arid-semi-arid",
    name: "Arid and Semi-Arid",
    counties: ["garissa", "wajir", "mandera", "marsabit", "turkana", "tana-river"],
  },
  {
    slug: "coastal-lowlands",
    name: "Coastal Lowlands",
    counties: ["mombasa", "kilifi", "kwale", "lamu", "taita-taveta"],
  },
];

// ── Lookup helpers ────────────────────────────────────────────────────────

export function getCountyBySlug(slug: string): County | undefined {
  return ALL_COUNTIES.find((c) => c.slug === slug);
}

export function getCropBySlug(slug: string): Crop | undefined {
  return ALL_CROPS.find((c) => c.slug === slug);
}

export function getZoneBySlug(slug: string): Zone | undefined {
  return ALL_ZONES.find((z) => z.slug === slug);
}

export function getCountiesByZone(zoneSlug: string): County[] {
  return ALL_COUNTIES.filter((c) => c.zoneSlug === zoneSlug);
}

export function searchCounties(query: string): County[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_COUNTIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.zone.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
  ).slice(0, 8);
}

export function searchCrops(query: string): Crop[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_CROPS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  ).slice(0, 6);
}
