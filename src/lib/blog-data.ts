// ─────────────────────────────────────────────────────────────────────────────
// ShambaIQ Blog Post Registry
// Merged from: ShambaIQ_SEO_Strategy.md + seo_content_calendar.xlsx
// Single source of truth — metadata drives schema, OG tags, sitemap & listing
// ─────────────────────────────────────────────────────────────────────────────

export interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
}

export interface BlogPost {
  slug: string;
  title: string;                 // <60 chars — calendar: start with focus keyword
  metaTitle: string;             // Title tag (30–60 chars, keyword-first)
  metaDescription: string;       // 80–160 chars, contains focus keyword
  focusKeyword: string;          // Calendar primary keyword
  secondaryKeywords: string[];   // Calendar secondary + strategy long-tail
  kiswahiliKeywords?: string[];  // Strategy doc: Tier 2 Kiswahili keywords
  searchIntent: string;          // Calendar classification
  datePublished: string;
  dateModified: string;
  readingTimeMin: number;
  wordCount: number;
  image: string;                 // OG + Article schema image
  imageAlt: string;
  category: string;
  county?: string;               // County slug for /soil/[county] links
  crop?: string;                 // Crop slug for /crops/[crop] links
  ctaText: string;               // Calendar: custom CTA text
  ctaLink: string;               // Calendar: pre-filled /app?county=X&crop=Y
  section: string;               // Article schema section
  calendarDay: string;           // Which calendar window
}

// ─── MERGED CONTENT CALENDAR ─────────────────────────────────────────────────
// Sources:
//   [XLS]  = seo_content_calendar.xlsx (county-specific, 30-day plan)
//   [STR]  = ShambaIQ_SEO_Strategy.md  (foundational + seasonal posts)
//   [NEW]  = Added by SEO analysis (gaps identified in both docs)
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_POSTS: BlogPost[] = [

  // ── WEEK 1 — Foundation Posts [STR] ────────────────────────────────────────

  {
    slug: "kenya-county-soil-rankings-2026",
    title: "2026 Kenya soil health report: all 47 counties ranked",
    metaTitle: "Kenya Soil Health Rankings 2026 — All 47 Counties | ShambaIQ",
    metaDescription:
      "We ranked every Kenyan county by soil health using precision soil mapping 30m satellite data. See your county's pH, nitrogen, and phosphorus scores. Free data for all 47 counties.",
    focusKeyword: "Kenya county soil rankings 2026",
    secondaryKeywords: ["soil quality Kenya", "best farming county Kenya", "county soil pH Kenya", "precision soil mapping Kenya data"],
    kiswahiliKeywords: ["hali ya udongo Kenya", "udongo bora Kenya"],
    searchIntent: "Informational",
    datePublished: "2026-06-02",
    dateModified: "2026-06-02",
    readingTimeMin: 9,
    wordCount: 1800,
    image: "/images/blog/kenya-soil-rankings-2026.jpg",
    imageAlt: "Map of Kenya showing soil health scores for all 47 counties by ShambaIQ",
    category: "Soil reports",
    ctaText: "Check your county's exact soil score — get a personalised fertilizer plan for your farm.",
    ctaLink: "/app",
    section: "Data reports",
    calendarDay: "Week 1",
  },

  {
    slug: "complete-maize-farming-guide-kenya",
    title: "The complete maize farming guide for Kenya",
    metaTitle: "Maize Farming Guide Kenya — Soil, Fertilizer, Yields | ShambaIQ",
    metaDescription:
      "Complete maize farming guide: optimal soil pH, best counties ranked by suitability, certified seed varieties, fertilizer budget. Data for all 47 Kenyan counties.",
    focusKeyword: "maize farming guide Kenya",
    secondaryKeywords: ["best fertilizer for maize Kenya", "how to grow maize Kenya", "DAP vs CAN maize", "maize soil requirements"],
    kiswahiliKeywords: ["mbolea ya mahindi", "jinsi ya kupanda mahindi Kenya"],
    searchIntent: "Informational & Commercial",
    datePublished: "2026-06-04",
    dateModified: "2026-06-04",
    readingTimeMin: 11,
    wordCount: 2100,
    image: "/images/blog/maize-farming-guide-kenya.jpg",
    imageAlt: "Kenyan farmer examining maize crop in fertile green field",
    category: "Crop guides",
    crop: "maize",
    ctaText: "Get your county's maize fertilizer plan — bags per acre, cost, and application schedule.",
    ctaLink: "/app?crop=maize",
    section: "Crop guides",
    calendarDay: "Week 1",
  },

  {
    slug: "why-your-soil-is-acidic-kenya",
    title: "Why your soil is acidic — and what to do about it",
    metaTitle: "Acidic Soil Kenya — Causes, Fix, Lime Guide | ShambaIQ",
    metaDescription:
      "22 Kenyan counties have acidic soil (pH below 5.5). Learn why, which counties are affected, and the cheapest way to fix it with agricultural lime. Free county data.",
    focusKeyword: "why is my soil acidic Kenya",
    secondaryKeywords: ["acidic soil treatment Kenya", "agricultural lime application", "soil pH Kenya fix", "Mavuno fertilizer soil correction"],
    kiswahiliKeywords: ["udongo wa tindikali Kenya", "jinsi ya kurekebisha udongo"],
    searchIntent: "Informational",
    datePublished: "2026-06-06",
    dateModified: "2026-06-06",
    readingTimeMin: 8,
    wordCount: 1600,
    image: "/images/blog/acidic-soil-kenya-lime-treatment.jpg",
    imageAlt: "Farmer applying agricultural lime to acidic red soil in Kenyan highland",
    category: "Soil health",
    ctaText: "Check if your county soil needs lime — get the exact dosage and cost breakdown.",
    ctaLink: "/app",
    section: "Soil health",
    calendarDay: "Week 1",
  },

  {
    slug: "dap-vs-can-vs-npk-fertilizer-guide-kenya",
    title: "DAP vs CAN vs NPK: which fertilizer does your farm need?",
    metaTitle: "DAP vs CAN vs NPK Kenya — Which Fertilizer to Use | ShambaIQ",
    metaDescription:
      "Full DAP vs CAN vs NPK comparison: nutrient content, when to use each, application rates, subsidised vs commercial prices in Kenya. Make the right choice for your soil.",
    focusKeyword: "DAP vs CAN vs NPK fertilizer Kenya",
    secondaryKeywords: ["best fertilizer Kenya", "how many bags DAP per acre", "cheap fertilizer Kenya", "when to apply CAN top dressing"],
    kiswahiliKeywords: ["mbolea bora Kenya", "DAP au CAN Kenya"],
    searchIntent: "Informational & Commercial",
    datePublished: "2026-06-09",
    dateModified: "2026-06-09",
    readingTimeMin: 10,
    wordCount: 1950,
    image: "/images/blog/dap-can-npk-fertilizer-comparison-kenya.jpg",
    imageAlt: "Side-by-side comparison of DAP, CAN, and NPK fertilizer bags at Kenyan agrovet",
    category: "Fertilizer guides",
    ctaText: "Stop guessing which fertilizer to buy — get your exact bag count and budget for your crop and county.",
    ctaLink: "/app",
    section: "Fertilizer guides",
    calendarDay: "Week 1",
  },

  // ── COUNTY × CROP DEEP DIVES [XLS] ─────────────────────────────────────────

  {
    slug: "maize-farming-nakuru-yield-guide",
    title: "Nakuru county maize guide: maximize yields this season",
    metaTitle: "Maize Farming in Nakuru — Fertilizer, Soil, Yields | ShambaIQ",
    metaDescription:
      "Nakuru maize farming guide: pH 6.0–6.8 loam soils in Rongai, Njoro, Molo. Basal NPK 23:21:0 or DAP + CAN top-dressing plan, certified varieties, and KES budget per acre.",
    focusKeyword: "maize farming in Nakuru",
    secondaryKeywords: ["Nakuru county soil pH", "best maize fertilizer Kenya", "Nakuru rainfall season", "NPK 23:21:0 maize Nakuru"],
    kiswahiliKeywords: ["kilimo cha mahindi Nakuru", "mbolea ya mahindi Nakuru"],
    searchIntent: "Commercial & Transactional",
    datePublished: "2026-06-02",
    dateModified: "2026-06-02",
    readingTimeMin: 8,
    wordCount: 1500,
    image: "/images/blog/maize-nakuru-county-guide.jpg",
    imageAlt: "Maize field at flowering stage in Nakuru County, Rift Valley Kenya",
    category: "County farming guides",
    county: "nakuru",
    crop: "maize",
    ctaText: "Optimize Your Yield: Get a tailored fertilizer budget instantly. Use the ShambaIQ Precision Tool for Nakuru Maize.",
    ctaLink: "/app?county=nakuru&crop=maize",
    section: "County farming guides",
    calendarDay: "Day 1–3",
  },

  {
    slug: "cabbage-farming-kiambu-highland-soils",
    title: "Cabbage farming in Kiambu: a high-yield guide for highland soils",
    metaTitle: "Cabbage Farming Kiambu — Soil, Lime, Spacing Guide | ShambaIQ",
    metaDescription:
      "Kiambu cabbage farming guide: acidic highland soils in Limuru and Githunguri. Dolomitic lime before planting, clubroot prevention, spacing, and CAN top-dressing schedule.",
    focusKeyword: "cabbage farming in Kiambu",
    secondaryKeywords: ["Kiambu soil suitability cabbage", "cabbage spacing Kenya", "CAN fertilizer cabbage", "clubroot disease prevention Kenya"],
    kiswahiliKeywords: ["kilimo cha kabichi Kiambu", "udongo wa Kiambu"],
    searchIntent: "Informational & Commercial",
    datePublished: "2026-06-05",
    dateModified: "2026-06-05",
    readingTimeMin: 7,
    wordCount: 1400,
    image: "/images/blog/cabbage-farming-kiambu-highlands.jpg",
    imageAlt: "Dense cabbage crop in Kiambu highland farm with Aberdare forest in background",
    category: "County farming guides",
    county: "kiambu",
    crop: "cabbage",
    ctaText: "Check Kiambu Soil Suitability: Calculate your lime dosage before planting at ShambaIQ Kiambu Cabbage Advisor.",
    ctaLink: "/app?county=kiambu&crop=cabbage",
    section: "County farming guides",
    calendarDay: "Day 4–6",
  },

  {
    slug: "wheat-farming-uasin-gishu-yield-guide",
    title: "Uasin Gishu wheat guide: data-driven yield maximization",
    metaTitle: "Wheat Farming Uasin Gishu — Fertilizer, Soil Data | ShambaIQ",
    metaDescription:
      "Uasin Gishu wheat farming: clay loams in Eldoret and Moiben with low phosphorus. High-P planting compound recommendations, local stockist pricing, and yield targets.",
    focusKeyword: "wheat farming Uasin Gishu",
    secondaryKeywords: ["wheat fertilizer schedule Kenya", "best soil for wheat Kenya", "Uasin Gishu agricultural extension", "phosphorus deficiency wheat"],
    kiswahiliKeywords: ["kilimo cha ngano Uasin Gishu", "mbolea ya ngano Kenya"],
    searchIntent: "Commercial & Transactional",
    datePublished: "2026-06-09",
    dateModified: "2026-06-09",
    readingTimeMin: 8,
    wordCount: 1500,
    image: "/images/blog/wheat-farming-uasin-gishu-eldoret.png",
    imageAlt: "Golden wheat crop ready for harvest on Uasin Gishu plateau near Eldoret Kenya",
    category: "County farming guides",
    county: "uasin-gishu",
    crop: "wheat",
    ctaText: "Max out Wheat Outputs: Get the precise fertilizer bags you need at ShambaIQ Wheat Fertilizer Optimizer.",
    ctaLink: "/app?county=uasin-gishu&crop=wheat",
    section: "County farming guides",
    calendarDay: "Day 7–9",
  },

  {
    slug: "tomato-farming-kirinyaga-mwea-soils",
    title: "Tomato farming in Kirinyaga: maximizing yields in Mwea's black cotton soils",
    metaTitle: "Tomato Farming Kirinyaga — Mwea Soil, Calcium Fix | ShambaIQ",
    metaDescription:
      "Kirinyaga tomato guide: black cotton soils of Mwea block calcium absorption. CAN and Calcium Nitrate top-dressing to prevent blossom end rot, legume rotation, and yield targets.",
    focusKeyword: "tomato farming in Kirinyaga",
    secondaryKeywords: ["tomato blossom end rot prevention Kenya", "Mwea black cotton soil tomato", "Yara Winner fertilizer tomato", "calcium nitrate tomatoes Kenya"],
    kiswahiliKeywords: ["kilimo cha nyanya Kirinyaga", "udongo wa Mwea"],
    searchIntent: "Informational",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingTimeMin: 8,
    wordCount: 1500,
    image: "/images/blog/tomato-farming-kirinyaga-mwea.jpg",
    imageAlt: "Ripening tomato crop on trellis in Kirinyaga County Mwea irrigation scheme Kenya",
    category: "County farming guides",
    county: "kirinyaga",
    crop: "tomato",
    ctaText: "Prevent Blossom End Rot: Calculate your calcium top-dressing intervals using the ShambaIQ Kirinyaga Tomato Tool.",
    ctaLink: "/app?county=kirinyaga&crop=tomato",
    section: "County farming guides",
    calendarDay: "Day 10–12",
  },

  {
    slug: "onion-farming-kajiado-dryland-guide",
    title: "High-yield onion farming in Kajiado: a drylands goldmine",
    metaTitle: "Onion Farming Kajiado — Alkaline Soil, Drip Irrigation | ShambaIQ",
    metaDescription:
      "Kajiado onion farming: alkaline soils (pH >7.5) cause zinc and iron deficiencies. Ammonium sulfate soil acidification, drip irrigation scheduling, and Jere onion variety guide.",
    focusKeyword: "onion farming in Kajiado",
    secondaryKeywords: ["onion fertilizer application Kenya", "Kajiado soil pH alkaline", "Jere onions Kenya", "zinc deficiency onions Kenya"],
    kiswahiliKeywords: ["kilimo cha vitunguu Kajiado", "udongo wa Kajiado"],
    searchIntent: "Informational & Transactional",
    datePublished: "2026-06-16",
    dateModified: "2026-06-16",
    readingTimeMin: 8,
    wordCount: 1500,
    image: "/images/blog/onion-farming-kajiado-drylands.jpg",
    imageAlt: "Onion crop growing under drip irrigation in semi-arid Kajiado County Kenya",
    category: "County farming guides",
    county: "kajiado",
    crop: "onion",
    ctaText: "Optimize Dryland Irrigation: Pre-fill your water and soil properties at ShambaIQ Kajiado Onion Advisor.",
    ctaLink: "/app?county=kajiado&crop=onion",
    section: "County farming guides",
    calendarDay: "Day 13–15",
  },

  {
    slug: "sweet-potato-farming-homa-bay",
    title: "Sweet potato farming in Homa Bay: the complete Lake Victoria shore guide",
    metaTitle: "Sweet Potato Farming Homa Bay — Soil, Fertilizer, Yields | ShambaIQ",
    metaDescription:
      "Homa Bay sweet potato guide: sandy-loam Lake Victoria soils, Mavuno Sweet Potato high-K fertilizer, orange-fleshed variety selection, and maize rotation scheduling. Science-backed.",
    focusKeyword: "sweet potato farming Homa Bay",
    secondaryKeywords: [
      "orange-fleshed sweet potato Kenya", "sandy loam soils sweet potato",
      "low nitrogen crop fertilizer", "Mavuno Sweet Potato Kenya",
      "sweet potato vs maize rotation Kenya", "high potassium fertilizer sweet potato",
    ],
    kiswahiliKeywords: ["kilimo cha viazi vitamu Homa Bay", "mbolea ya viazi vitamu Kenya", "mzunguko wa mazao Homa Bay"],
    searchIntent: "Informational & Sustainable",
    datePublished: "2026-06-19",
    dateModified: "2026-06-19",
    readingTimeMin: 10,
    wordCount: 2000,
    image: "/images/blog/sweet-potato-farming-homa-bay.jpg",
    imageAlt: "Orange-fleshed sweet potato harvest in sandy loam soil near Lake Victoria, Homa Bay County Kenya",
    category: "County farming guides",
    county: "homa-bay",
    crop: "sweet-potato",
    ctaText: "Plan Your Crop Rotation: Sweet potatoes are the perfect maize rotation crop. Calculate the optimal fertilizer schedule at ShambaIQ Homa Bay Sweet Potato Tool.",
    ctaLink: "/app?county=homa-bay&crop=sweet-potato",
    section: "County farming guides",
    calendarDay: "Day 16–18",
  },

  {
    slug: "acidic-soil-treatment-meru-nyeri",
    title: "Acidic soil treatment: restoring crop vitality in Meru and Nyeri",
    metaTitle: "Acidic Soil Meru Nyeri — Lime Treatment, pH Fix | ShambaIQ",
    metaDescription:
      "Meru and Nyeri have volcanic soils below pH 5.0 that lock out NPK. Dolomitic vs calcitic lime comparison, phosphorus fixation chemistry explained, and lime application calculator.",
    focusKeyword: "acidic soil treatment Kenya",
    secondaryKeywords: ["agricultural lime application Kenya", "soil pH Meru Nyeri", "Mavuno fertilizer soil correction", "phosphorus fixation acidic soil Kenya"],
    kiswahiliKeywords: ["udongo wa tindikali Meru", "chokaa ya kilimo Kenya"],
    searchIntent: "Informational",
    datePublished: "2026-06-23",
    dateModified: "2026-06-23",
    readingTimeMin: 9,
    wordCount: 1700,
    image: "/images/blog/acidic-soil-lime-meru-nyeri.jpg",
    imageAlt: "Farmer applying dolomitic lime to acidic volcanic soil in Meru County Kenya highlands",
    category: "Soil health",
    county: "meru",
    ctaText: "Heal Your Soil: Run the ShambaIQ Acidic Soil Checker to calculate your exact lime requirement and cost.",
    ctaLink: "/app?county=meru",
    section: "Soil health",
    calendarDay: "Day 19–21",
  },

  {
    slug: "organic-soil-restoration-machakos",
    title: "Building soil organic matter in Machakos: a dryland restoration guide",
    metaTitle: "Organic Farming Machakos — Soil Carbon, Cover Crops | ShambaIQ",
    metaDescription:
      "Machakos dryland alfisols have organic carbon below 1.2%. Cover cropping with pigeon peas and cowpeas, composting strategy, and moisture retention techniques for semi-arid Kenya.",
    focusKeyword: "organic farming Machakos",
    secondaryKeywords: ["soil carbon conservation Kenya", "green manure cover crops Kenya", "composting arid soils", "pigeon peas nitrogen fixation Kenya"],
    kiswahiliKeywords: ["kilimo asili Machakos", "rutuba ya udongo Machakos"],
    searchIntent: "Informational & Sustainable",
    datePublished: "2026-06-26",
    dateModified: "2026-06-26",
    readingTimeMin: 8,
    wordCount: 1500,
    image: "/images/blog/cover-crops-machakos-dryland.jpg",
    imageAlt: "Pigeon pea cover crop growing in degraded dryland soil in Machakos County Kenya",
    category: "Soil health",
    county: "machakos",
    ctaText: "Protect Against Drought: Plan your dryland cover crops with ShambaIQ Machakos Arid Advisor.",
    ctaLink: "/app?county=machakos",
    section: "Soil health",
    calendarDay: "Day 22–24",
  },

  {
    slug: "dairy-fodder-farming-nandi-county",
    title: "Dairy farming in Nandi: integrating fodder crops and organic manures",
    metaTitle: "Dairy Farming Nandi — Fodder Crops, Silage, Manure | ShambaIQ",
    metaDescription:
      "Nandi red clay loam soils for fodder crops. Rhodes grass, Napier, and silage maize fertilizer guide. Cow dung vs chicken manure NPK comparison and organic dairy profitability.",
    focusKeyword: "dairy farming Nandi county",
    secondaryKeywords: ["fodder crops fertilizer Kenya", "boma manure application rate", "silage maize Nandi", "Napier grass fertilizer Kenya"],
    kiswahiliKeywords: ["ufugaji wa ng'ombe Nandi", "malisho ya mifugo Kenya"],
    searchIntent: "Informational & Commercial",
    datePublished: "2026-06-30",
    dateModified: "2026-06-30",
    readingTimeMin: 8,
    wordCount: 1500,
    image: "/images/blog/dairy-fodder-nandi-county.jpg",
    imageAlt: "Napier grass fodder crop growing on red clay loam soil in Nandi Hills Kenya",
    category: "County farming guides",
    county: "nandi",
    crop: "napier-grass",
    ctaText: "Optimize Fodder Yields: Plan your silage maize inputs at ShambaIQ Nandi Silage Tool.",
    ctaLink: "/app?county=nandi&crop=maize",
    section: "County farming guides",
    calendarDay: "Day 25–27",
  },

  {
    slug: "bean-farming-kakamega-double-harvest",
    title: "Precision bean cultivation in Kakamega: double your harvests",
    metaTitle: "Bean Farming Kakamega — Rhizobium, Soil, Yields | ShambaIQ",
    metaDescription:
      "Kakamega leached acidic soils need Rhizobium inoculant to fix nitrogen naturally. Rock phosphate vs DAP at planting, skipping urea entirely, and certified bean variety rankings.",
    focusKeyword: "bean farming Kakamega",
    secondaryKeywords: ["certified bean seeds Kenya", "rhizobium inoculant beans Kenya", "Kakamega county soil fertility", "nitrogen fixation beans Kenya"],
    kiswahiliKeywords: ["kilimo cha maharagwe Kakamega", "mbegu bora za maharagwe Kenya"],
    searchIntent: "Informational",
    datePublished: "2026-07-03",
    dateModified: "2026-07-03",
    readingTimeMin: 7,
    wordCount: 1400,
    image: "/images/blog/bean-farming-kakamega-western.jpg",
    imageAlt: "Healthy bean crop growing in acidic leached soil in Kakamega County Western Kenya",
    category: "County farming guides",
    county: "kakamega",
    crop: "beans",
    ctaText: "Reduce Fertilizer Cost: Let beans fix nitrogen for you. Calculate your bean fertilizer rates at ShambaIQ Kakamega Bean Advisor.",
    ctaLink: "/app?county=kakamega&crop=beans",
    section: "County farming guides",
    calendarDay: "Day 28–30",
  },

  // ── MONTH 2 — Data Reports & County Comparisons [STR] ──────────────────────

  {
    slug: "kakamega-soil-western-kenya-mavuno",
    title: "Kakamega soil: why Western Kenya needs Mavuno, not DAP",
    metaTitle: "Kakamega Soil Analysis — Mavuno vs DAP Western Kenya | ShambaIQ",
    metaDescription:
      "Kakamega's highly leached acidic soils make DAP inefficient. See the data behind why Mavuno outperforms standard fertilizers in Western Kenya — with savings per acre.",
    focusKeyword: "Kakamega soil Mavuno fertilizer",
    secondaryKeywords: ["Mavuno fertilizer Western Kenya", "DAP alternative Kenya", "leached soil fertilizer Kenya", "Kakamega county farming"],
    kiswahiliKeywords: ["mbolea Mavuno Kakamega", "udongo wa Kakamega"],
    searchIntent: "Informational & Commercial",
    datePublished: "2026-07-07",
    dateModified: "2026-07-07",
    readingTimeMin: 8,
    wordCount: 1500,
    image: "/images/blog/kakamega-mavuno-western-kenya.jpg",
    imageAlt: "Mavuno fertilizer bag against green Western Kenya farmland",
    category: "Fertilizer guides",
    county: "kakamega",
    ctaText: "See whether Mavuno or DAP wins for your specific crop and farm location in Western Kenya.",
    ctaLink: "/app?county=kakamega",
    section: "Fertilizer guides",
    calendarDay: "Month 2",
  },

  {
    slug: "farming-semi-arid-kenya-machakos-makueni-kitui",
    title: "Farming in semi-arid Kenya: Machakos, Makueni, and Kitui guide",
    metaTitle: "Semi-Arid Farming Kenya — Machakos Makueni Kitui | ShambaIQ",
    metaDescription:
      "Complete guide to farming in Kenya's semi-arid counties. Drought-tolerant crop selection, water harvesting, cover crops, and soil organic matter strategies for Machakos, Makueni, and Kitui.",
    focusKeyword: "farming semi-arid Kenya",
    secondaryKeywords: ["drought tolerant crops Kenya", "Machakos farming guide", "Makueni agriculture", "Kitui county soil"],
    searchIntent: "Informational",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    readingTimeMin: 10,
    wordCount: 1900,
    image: "/images/blog/semi-arid-farming-machakos-makueni.png",
    imageAlt: "Drought-tolerant sorghum crop growing in semi-arid Machakos County Kenya",
    category: "County farming guides",
    ctaText: "Get a drought-resilient crop plan built from your county's actual soil data.",
    ctaLink: "/app",
    section: "County farming guides",
    calendarDay: "Month 2",
  },

  {
    slug: "nakuru-vs-uasin-gishu-best-county-wheat",
    title: "Nakuru vs Uasin Gishu: which county is best for wheat?",
    metaTitle: "Nakuru vs Uasin Gishu Wheat Farming Comparison | ShambaIQ",
    metaDescription:
      "Data-driven comparison of Nakuru and Uasin Gishu for wheat production. Soil pH, phosphorus levels, rainfall reliability, and yield potential — side by side from precision soil mapping data.",
    focusKeyword: "best county wheat farming Kenya",
    secondaryKeywords: ["Nakuru wheat farming", "Uasin Gishu wheat soil", "wheat yield comparison Kenya", "Rift Valley wheat"],
    searchIntent: "Informational & Commercial",
    datePublished: "2026-07-14",
    dateModified: "2026-07-14",
    readingTimeMin: 7,
    wordCount: 1400,
    image: "/images/blog/nakuru-vs-uasin-gishu-wheat.jpg",
    imageAlt: "Side by side soil profile comparison of Nakuru loam and Uasin Gishu clay loam for wheat farming",
    category: "County farming guides",
    ctaText: "Compare your county's wheat suitability score against neighbouring counties.",
    ctaLink: "/app?crop=wheat",
    section: "County farming guides",
    calendarDay: "Month 2",
  },

  {
    slug: "how-much-fertilizer-per-acre-kenya-calculator",
    title: "How much fertilizer per acre? A Kenya crop-by-crop calculator",
    metaTitle: "Fertilizer Per Acre Kenya — 40 Crops Calculator | ShambaIQ",
    metaDescription:
      "Exact fertilizer quantities per acre for 40 Kenyan crops. DAP bags at planting, CAN top-dressing rates, KES cost at subsidised and commercial prices. Stop guessing.",
    focusKeyword: "how many bags fertilizer per acre Kenya",
    secondaryKeywords: ["DAP per acre Kenya", "CAN per acre Kenya", "fertilizer calculator Kenya", "fertilizer cost per acre"],
    kiswahiliKeywords: ["mbolea kwa ekari Kenya", "hesabu ya mbolea"],
    searchIntent: "Transactional",
    datePublished: "2026-07-17",
    dateModified: "2026-07-17",
    readingTimeMin: 6,
    wordCount: 1200,
    image: "/images/blog/fertilizer-per-acre-kenya.jpg",
    imageAlt: "Table showing fertilizer bags per acre for maize beans potatoes wheat and other Kenyan crops",
    category: "Fertilizer guides",
    ctaText: "Get the exact bag count for your crop and county — personalised to your soil data.",
    ctaLink: "/app",
    section: "Fertilizer guides",
    calendarDay: "Month 2",
  },

  // ── MONTH 3 — Seasonal & Problem-Based [STR + NEW] ─────────────────────────

  {
    slug: "long-rains-2026-what-to-plant-kenya",
    title: "Long rains 2026: what to plant this season in your county",
    metaTitle: "What to Plant Long Rains 2026 Kenya — County Guide | ShambaIQ",
    metaDescription:
      "County-by-county planting guide for Kenya's 2026 long rains season. Optimal crops by soil type, agroecological zone, and rainfall forecast. Updated with climate data.",
    focusKeyword: "what to plant long rains 2026 Kenya",
    secondaryKeywords: ["long rains planting calendar Kenya", "when to plant maize Kenya 2026", "March April planting Kenya", "seasonal farming guide Kenya"],
    kiswahiliKeywords: ["kupanda wakati wa mvua Kenya", "kalenda ya kilimo Kenya 2026"],
    searchIntent: "Informational",
    datePublished: "2026-02-20",
    dateModified: "2026-02-20",
    readingTimeMin: 9,
    wordCount: 1700,
    image: "/images/blog/long-rains-2026-planting-kenya.jpg",
    imageAlt: "Kenyan farmer preparing seedbed ahead of 2026 long rains season March planting",
    category: "Seasonal guides",
    ctaText: "Get a season-specific planting and fertilizer plan built from your county's soil data.",
    ctaLink: "/app",
    section: "Seasonal guides",
    calendarDay: "Month 3",
  },

  {
    slug: "yellow-maize-leaves-soil-deficiency-kenya",
    title: "Yellow maize leaves? Here's exactly what your soil is missing",
    metaTitle: "Yellow Maize Leaves Kenya — Soil Deficiency Diagnosis | ShambaIQ",
    metaDescription:
      "Yellow maize leaves can mean nitrogen, iron, zinc, or magnesium deficiency — each needs a different fix. Diagnose by leaf pattern, confirm with soil data, fix with the right fertilizer.",
    focusKeyword: "yellow maize leaves Kenya",
    secondaryKeywords: ["maize nitrogen deficiency Kenya", "yellowing maize leaves causes", "how to fix yellow maize", "iron deficiency maize Kenya"],
    kiswahiliKeywords: ["majani ya mahindi manjano", "tatizo la mahindi Kenya"],
    searchIntent: "Informational",
    datePublished: "2026-07-28",
    dateModified: "2026-07-28",
    readingTimeMin: 7,
    wordCount: 1300,
    image: "/images/blog/yellow-maize-leaves-nitrogen-deficiency.png",
    imageAlt: "Maize plant with yellow leaves showing nitrogen deficiency in Kenyan farm",
    category: "Crop health",
    crop: "maize",
    ctaText: "Check if your county's soil has the deficiency causing yellow leaves — get a fix plan.",
    ctaLink: "/app?crop=maize",
    section: "Crop health",
    calendarDay: "Month 3",
  },

  {
    slug: "cheapest-way-fix-acidic-soil-kenya",
    title: "The cheapest way to fix acidic soil in Kenya",
    metaTitle: "Cheap Acidic Soil Fix Kenya — Lime Cost Guide | ShambaIQ",
    metaDescription:
      "Agricultural lime vs dolomite vs wood ash: which is cheapest per pH unit gained in Kenya? Real prices, application rates, and which 22 counties need it most. Data-driven guide.",
    focusKeyword: "cheapest way fix acidic soil Kenya",
    secondaryKeywords: ["wood ash soil pH Kenya", "agricultural lime price Kenya", "dolomite vs calcitic lime Kenya", "cheap lime alternative Kenya"],
    kiswahiliKeywords: ["njia ya bei rahisi ya kurekebisha udongo", "chokaa ya bei nafuu Kenya"],
    searchIntent: "Informational",
    datePublished: "2026-08-04",
    dateModified: "2026-08-04",
    readingTimeMin: 8,
    wordCount: 1500,
    image: "/images/blog/cheap-acidic-soil-fix-kenya-lime.jpg",
    imageAlt: "Agricultural lime bags stacked at Kenyan agrovet showing price per 50kg bag",
    category: "Soil health",
    ctaText: "Calculate exactly how much lime your farm needs and the total cost at current market prices.",
    ctaLink: "/app",
    section: "Soil health",
    calendarDay: "Month 3",
  },
];

// ── Lookup helpers ─────────────────────────────────────────────────────────────

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  return ALL_POSTS.filter(
    (p) =>
      p.slug !== current.slug &&
      (p.county === current.county || p.crop === current.crop || p.category === current.category)
  ).slice(0, limit);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return ALL_POSTS.filter((p) => p.category === category);
}
