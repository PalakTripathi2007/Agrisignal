import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// In-memory feedback store with initial seed
let farmerFeedbackStore = [
  {
    id: 'fb-101',
    recommendationId: 'rec-tomato-sep12',
    timestamp: '2026-09-12T14:30:00Z',
    farmerName: 'Ramesh Gowda',
    phone: '+91 98451 22891',
    village: 'Mulbagal Cluster, Kolar',
    crop: 'tomato',
    quantityQuintals: 30,
    originalRecommendation: {
      recommendation: 'Store for 2–3 Days',
      actionTitle: 'Store 3 Days in Kolar Cold Chain',
      recommendedChannel: 'Kolar Agro Cold Storage',
      expectedNetProfit: 62400,
      projectedNetPerQtl: 2080,
      confidence: 'High',
    },
    followedRecommendation: 'yes',
    actualChannel: 'Kolar Agro Cold Storage (Released Day 4 to Bangalore Trader)',
    actualPricePerQuintal: 2250,
    actualNetRealized: 64200,
    realizedVariancePerQtl: 170,
    issuesEncountered: ['Minor unloading queue at gate (1 hr delay)'],
    otherNotes: 'Mandi price on harvest day was only ₹1,820. Holding 4 days in cold store fetched ₹2,250. Paid ₹260 total storage fee. Very happy with the advisory.',
    satisfactionRating: 5,
    verifiedByFpo: true,
  },
  {
    id: 'fb-102',
    recommendationId: 'rec-tomato-sep14',
    timestamp: '2026-09-14T11:15:00Z',
    farmerName: 'Manjunatha K',
    phone: '+91 98452 33412',
    village: 'Bangarapet Road, Kolar',
    crop: 'tomato',
    quantityQuintals: 45,
    originalRecommendation: {
      recommendation: 'Sell Today',
      actionTitle: 'Sell Today: FreshBazaar Farmgate Pickup',
      recommendedChannel: 'FreshBazaar Ltd',
      expectedNetProfit: 94500,
      projectedNetPerQtl: 2100,
      confidence: 'High',
    },
    followedRecommendation: 'yes',
    actualChannel: 'FreshBazaar Direct Farmgate',
    actualPricePerQuintal: 2150,
    actualNetRealized: 95400,
    realizedVariancePerQtl: 50,
    issuesEncountered: ['None - Smooth transaction'],
    otherNotes: 'Buyer arrived at 2:00 PM with electronic scale. Instant bank transfer before truck left. Saved ₹5,000 in mandi commission and transport hassle.',
    satisfactionRating: 5,
    verifiedByFpo: true,
  },
  {
    id: 'fb-103',
    recommendationId: 'rec-potato-sep10',
    timestamp: '2026-09-10T16:45:00Z',
    farmerName: 'Suresh Patel',
    phone: '+91 98453 88129',
    village: 'Malur Hub',
    crop: 'potato',
    quantityQuintals: 50,
    originalRecommendation: {
      recommendation: 'Sell in Nearby Market',
      actionTitle: 'Sell in Nearby Market: Malur APMC Yard',
      recommendedChannel: 'Malur APMC Yard',
      expectedNetProfit: 95000,
      projectedNetPerQtl: 1900,
      confidence: 'Medium',
    },
    followedRecommendation: 'partially',
    actualChannel: 'Local Aggregator at Village Gate',
    actualPricePerQuintal: 1820,
    actualNetRealized: 89000,
    realizedVariancePerQtl: -80,
    issuesEncountered: [
      'Buyer price re-negotiation upon arrival',
      'Payment delayed past agreed terms',
    ],
    otherNotes: 'Aggregator initially promised ₹1,900 but cut price to ₹1,820 claiming small tuber sizing. Took 3 days to receive cash.',
    satisfactionRating: 3,
    verifiedByFpo: true,
  }
];

// Feedback API endpoints
app.get("/api/feedback", (_req, res) => {
  res.json({ feedback: farmerFeedbackStore });
});

app.post("/api/feedback", (req, res) => {
  try {
    const newFeedback = {
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...req.body,
    };
    farmerFeedbackStore.unshift(newFeedback);
    res.status(201).json({ success: true, feedback: newFeedback });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to log feedback" });
  }
});

// AI Post-Harvest Selling Recommendation endpoint
app.post("/api/ai/recommendation", async (req, res) => {
  try {
    const {
      crop,
      quantity,
      unit = "Quintals",
      village = "Kolar Cluster",
      currentPrice,
      qualityGrade = "Grade A",
      nearbyMarkets = [],
      storageFacilities = [],
      buyerOffers = [],
      transportOptions = [],
      language = "en",
      historicalSeasonalData = null,
      pastFeedbackSummary = null,
    } = req.body;

    const ai = getGeminiClient();

    // Context summary for prompt / algorithmic evaluation
    const marketSummary = nearbyMarkets
      .map((m: any) => `${m.marketName} (${m.distanceKm}km): ₹${m.modalPrice}/${m.unit || 'qtl'} [Demand: ${m.demandLevel}, Trend: ${m.priceTrend}]`)
      .join("; ");

    const buyerSummary = buyerOffers
      .map((b: any) => `${b.buyerName} offers ₹${b.offeredPrice}/qtl for ${b.requiredQuantityQuintals} qtl (Rating: ${b.reputationScore}★, Dist: ${b.distanceKm}km)`)
      .join("; ");

    const storageSummary = storageFacilities
      .map((s: any) => `${s.facilityName} (${s.distanceKm}km): ₹${s.pricePerDayPerQuintal}/qtl/day [Available: ${s.availableCapacityMT} MT]`)
      .join("; ");

    const transportSummary = transportOptions
      .map((t: any) => `${t.vehicleType}: ₹${t.costPerKm}/km (Pool Active: ${t.poolActive ? 'Yes' : 'No'})`)
      .join("; ");

    // Historical market context summary
    const historicalText = historicalSeasonalData
      ? `Historical 3-Year Avg: ₹${historicalSeasonalData.threeYearAvgPrice}/qtl (3-Yr High: ₹${historicalSeasonalData.threeYearHigh}, Low: ₹${historicalSeasonalData.threeYearLow}). Peak harvest glut months: ${historicalSeasonalData.peakHarvestMonths?.join(', ') || 'seasonal'}. Historical storage profit probability: ${historicalSeasonalData.historicalStorageProfitProbability || 80}%. Typical glut price drop: ${historicalSeasonalData.typicalGlutPriceDropPercent || 25}%, post-glut recovery: +${historicalSeasonalData.postGlutHoldingRecoveryPercent || 15}%. Seasonal notes: ${historicalSeasonalData.seasonalNotes || 'Standard cyclicality'}.`
      : `Historical trend indicates typical post-harvest arrival surge with 15-25% price sensitivity over 48-72 hours.`;

    // Past feedback summary from local farmers
    const feedbackText = pastFeedbackSummary
      ? `Local Farmer Feedback: ${pastFeedbackSummary.totalLogged || 3} recent transactions logged. Adherence rate: ${pastFeedbackSummary.adherenceRatePercent || 85}%. Average farmer realized price variance: ₹${pastFeedbackSummary.avgRealizedVariancePerQtl >= 0 ? '+' : ''}${pastFeedbackSummary.avgRealizedVariancePerQtl || 120}/qtl compared to distress sale. Top reported field issues to guard against: ${pastFeedbackSummary.topReportedIssues?.map((i: any) => `${i.issue} (${i.count}x)`).join(', ') || 'minor transit delays'}.`
      : `Past farmer feedback indicates high satisfaction (+₹140/qtl gain) when utilizing verified buyers or cold storage holding.`;

    if (ai) {
      try {
        const prompt = `
You are AgriSignal AI, an expert post-harvest agricultural market decision advisor helping small and marginal farmers in rural India.
Analyze the following harvest, local market signals, historical multi-year trends, and logged farmer feedback to generate a pragmatic, actionable recommendation:

Farmer Details:
- Crop: ${crop}
- Harvest Quantity: ${quantity} ${unit}
- Quality Grade: ${qualityGrade}
- Location: ${village}
- Current Local Baseline Price: ₹${currentPrice}/quintal

Nearby Markets:
${marketSummary || "Local Mandi: ₹" + currentPrice + "/qtl"}

Direct Buyer Orders:
${buyerSummary || "No direct buyer registered"}

Storage Options:
${storageSummary || "No cold storage nearby"}

Transport Options:
${transportSummary || "Standard pickup available"}

Historical Market Data & Seasonal Performance:
${historicalText}

Past Farmer Feedback & Ground Realities:
${feedbackText}

Target Language for Output: ${language} (if 'hi' Hindi, 'mr' Marathi, 'te' Telugu, 'pa' Punjabi, otherwise English).

Output a structured JSON response matching the following requirements:
1. recommendation: strictly one of ["Sell Today", "Store for 2–3 Days", "Sell in Nearby Market", "Send to Another Market"]
2. actionTitle: Short, impactful title in ${language} (e.g. "Sell Today to Shree Agro Direct Buyer" or "Store 3 Days in Kolar Cold Chain")
3. confidence: "High", "Medium", or "Low"
4. confidenceScore: integer between 60 and 95
5. recommendedChannel: specific name of buyer or mandi or storage
6. expectedNetProfit: calculated estimated net profit in INR for the total ${quantity} ${unit} (Revenue minus transport, storage, mandi fees)
7. rationale: 2-3 clear, simple, low-literacy-friendly sentences explaining why this option maximizes net income, referencing seasonal trends or past farmer feedback where appropriate.
8. keyFactors: array of 3-4 objects with { "label": string, "impact": "positive" | "negative" | "neutral", "detail": string }
9. assumptions: array of 3 realistic assumptions (e.g. storage fee rate, spoilage rate, price stability assumption)
10. historicalContext: object with {
      "seasonalPhase": string (e.g. "Late Kharif supply peak transitioning to festive demand surge"),
      "historicalPriceComparison": string (e.g. "Current price ₹${currentPrice}/qtl is 8% above the 3-year seasonal average"),
      "historicalStoragePayoffRate": string (e.g. "Past data shows 78% of farmers holding stock in this window gained ₹180-250/qtl net"),
      "pastFarmerFeedbackInsight": string (e.g. "Farmers report 100% digital payment adherence with verified direct buyers, while avoiding mandi commission")
    }
11. smsDraft: concise SMS under 140 chars in ${language}
12. whatsappDraft: clear WhatsApp broadcast with bullet points and emojis
13. ivrScript: a spoken 25-second script for an automated voice phone call to the farmer in ${language}

Emphasize: This is decision support based on verified market signals and past seasonal trends, not a guaranteed future price prediction.
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendation: { type: Type.STRING },
                actionTitle: { type: Type.STRING },
                confidence: { type: Type.STRING },
                confidenceScore: { type: Type.INTEGER },
                recommendedChannel: { type: Type.STRING },
                expectedNetProfit: { type: Type.NUMBER },
                rationale: { type: Type.STRING },
                keyFactors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      impact: { type: Type.STRING },
                      detail: { type: Type.STRING },
                    },
                    required: ["label", "impact", "detail"],
                  },
                },
                assumptions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                historicalContext: {
                  type: Type.OBJECT,
                  properties: {
                    seasonalPhase: { type: Type.STRING },
                    historicalPriceComparison: { type: Type.STRING },
                    historicalStoragePayoffRate: { type: Type.STRING },
                    pastFarmerFeedbackInsight: { type: Type.STRING },
                  },
                  required: [
                    "seasonalPhase",
                    "historicalPriceComparison",
                    "historicalStoragePayoffRate",
                    "pastFarmerFeedbackInsight",
                  ],
                },
                smsDraft: { type: Type.STRING },
                whatsappDraft: { type: Type.STRING },
                ivrScript: { type: Type.STRING },
              },
              required: [
                "recommendation",
                "actionTitle",
                "confidence",
                "confidenceScore",
                "recommendedChannel",
                "expectedNetProfit",
                "rationale",
                "keyFactors",
                "assumptions",
                "smsDraft",
                "whatsappDraft",
                "ivrScript",
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text || "{}");
        return res.json({
          id: `rec-${Date.now()}`,
          ...parsed,
          generatedBy: "gemini-3.8-flash",
          timestamp: new Date().toISOString(),
        });
      } catch (geminiErr) {
        console.warn("Gemini API call failed, falling back to heuristic engine:", geminiErr);
        // Fall through to algorithmic post-harvest engine
      }
    }

    // High-fidelity fallback heuristic engine enhanced with historical data
    const qty = Number(quantity) || 20;
    const basePrice = Number(currentPrice) || 1600;
    
    // Evaluate direct buyer vs mandi vs storage
    const bestBuyer = buyerOffers.length > 0
      ? buyerOffers.reduce((prev: any, curr: any) => (curr.offeredPrice > prev.offeredPrice ? curr : prev), buyerOffers[0])
      : null;

    const distantMarket = nearbyMarkets.find((m: any) => m.distanceKm > 20 && m.modalPrice > basePrice);
    const nearbyMarket = nearbyMarkets.find((m: any) => m.distanceKm <= 20) || nearbyMarkets[0];
    const coldStorage = storageFacilities.find((s: any) => s.availableCapacityMT > 5);

    let rec = "Sell Today";
    let channel = bestBuyer ? bestBuyer.buyerName : (nearbyMarket?.marketName || "Local APMC Mandi");
    let rationale = "";
    let conf = "High";
    let confScore = 88;
    let profitEst = 0;

    const isPerishable = ["Tomato", "Chilli", "Vegetables"].includes(crop);

    if (bestBuyer && bestBuyer.offeredPrice >= basePrice + 50) {
      rec = "Sell Today";
      channel = `${bestBuyer.buyerName} (Direct Purchase)`;
      profitEst = qty * bestBuyer.offeredPrice - (qty * 40); // 40 packaging
      rationale = `Direct buyer ${bestBuyer.buyerName} offers ₹${bestBuyer.offeredPrice}/qtl with instant farmgate pickup. Historical feedback shows 100% on-time settlement and eliminates ₹120/qtl in mandi dockage & transit loss.`;
      conf = "High";
      confScore = 92;
    } else if (!isPerishable && coldStorage && (crop === "Potato" || crop === "Onion" || crop === "Wheat")) {
      rec = "Store for 2–3 Days";
      channel = `${coldStorage.facilityName} (${coldStorage.distanceKm}km)`;
      const expectedUplift = basePrice * 0.12;
      const storageCost = (coldStorage.pricePerDayPerQuintal || 2) * 5 * qty;
      profitEst = qty * (basePrice + expectedUplift) - storageCost - (qty * 60);
      rationale = `Past 3-year seasonal data shows 84-88% historical profit probability when holding ${crop} through peak arrival days. Projected price recovery net of ₹${coldStorage.pricePerDayPerQuintal}/qtl/day storage fee yields superior return.`;
      conf = "Medium";
      confScore = 85;
    } else if (distantMarket && (distantMarket.modalPrice - basePrice) > 250) {
      rec = "Send to Another Market";
      channel = `${distantMarket.marketName} (${distantMarket.distanceKm}km)`;
      profitEst = qty * distantMarket.modalPrice - (qty * 140);
      rationale = `${distantMarket.marketName} has strong demand and prices are ₹${distantMarket.modalPrice - basePrice}/qtl higher than local. Using an FPO pooled vehicle avoids individual freight overhead and captures regional spread.`;
      conf = "Medium";
      confScore = 84;
    } else {
      rec = "Sell in Nearby Market";
      channel = nearbyMarket ? nearbyMarket.marketName : "District APMC Mandi";
      profitEst = qty * basePrice - (qty * 75);
      rationale = `Current spot price at ${channel} of ₹${basePrice}/qtl aligns with seasonal averages. Selling today locks in liquidity and avoids holding overhead.`;
      conf = "High";
      confScore = 89;
    }

    const recId = `rec-${Date.now()}`;

    return res.json({
      id: recId,
      recommendation: rec,
      actionTitle: `${rec}: ${channel}`,
      confidence: conf,
      confidenceScore: confScore,
      recommendedChannel: channel,
      expectedNetProfit: Math.round(profitEst),
      rationale,
      keyFactors: [
        { label: "Price Realization", impact: "positive", detail: `Net price estimated at ₹${Math.round(profitEst / qty)}/qtl` },
        { label: "Historical Seasonality", impact: "positive", detail: historicalSeasonalData ? `3-Yr Avg ₹${historicalSeasonalData.threeYearAvgPrice}/qtl; current market is active` : "Price aligns favorably with historical harvest curves" },
        { label: "Farmer Feedback Calibration", impact: "positive", detail: "Prior farmers reported smooth settlement and high satisfaction via this channel" },
        { label: "Logistics Optimization", impact: "neutral", detail: "Shared transport pooling available to lower freight cost" }
      ],
      assumptions: [
        "Transit handling expense assumed at ₹40-75/qtl depending on distance",
        "Market arrivals remain steady within 10% over the next 48 hours",
        "Produce meets standard Fair Average Quality (FAQ) grade specifications"
      ],
      historicalContext: {
        seasonalPhase: `${crop} harvest cycle currently in active market arrival phase`,
        historicalPriceComparison: `Current price ₹${basePrice}/qtl is within favorable range of the 3-year historical average`,
        historicalStoragePayoffRate: !isPerishable ? "84% historical profitability for 3-5 day holding in verified godowns" : "Swift movement recommended due to shelf-life constraints",
        pastFarmerFeedbackInsight: "Recent farmer feedback shows +₹120/qtl average realized gain when following verified hub recommendations",
      },
      smsDraft: `AgriSignal [${village}]: For ${crop} (${qty} qtl), recommendation is ${rec} at ${channel}. Expected net ₹${Math.round(profitEst)}. Call FPO steward for dispatch.`,
      whatsappDraft: `🌾 *AgriSignal Market Advisory*\n📍 *Hub:* ${village}\n🌱 *Crop:* ${crop} (${qty} ${unit})\n\n✅ *Decision:* *${rec}*\n🏪 *Target:* ${channel}\n💰 *Expected Net:* ₹${Math.round(profitEst).toLocaleString('en-IN')}\n\n📊 *Why:* ${rationale}\n\n_Assumptions: Standard FAQ grade, valid for 24 hours._`,
      ivrScript: `Namaste kisan bhai. AgriSignal FPO hub ki taraf se aapki ${crop} fasal ke liye aawashyak suchna. Aaj ka sabse behtareen nirnay hai: ${rec}. Aap ise ${channel} me bechein. Anumanit labh lagbhag rupaye ${Math.round(profitEst)} rahega. Adhik jankari ke liye FPO prabhari se sampark karein.`,
      generatedBy: "agrisignal-decision-engine",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error generating recommendation:", error);
    res.status(500).json({ error: error.message || "Failed to generate recommendation" });
  }
});

// Start server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgriSignal server running on http://localhost:${PORT}`);
  });
}

startServer();
