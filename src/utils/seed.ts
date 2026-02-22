import Crop from "@/models/crop.model";
import Region from "@/models/region.model";
import YieldProfile from "@/models/yield-profile.model";
import PriceData from "@/models/price-data.model";
import IrrigationModifier from "@/models/irrigation-modifier.model";

export async function autoSeedDatabase() {
  try {
    const cropCount = await Crop.countDocuments();
    
    if (cropCount === 0) {
      console.log("🌱 Seeding Bihar-specific tables with absolute latest 2025-2026 data...");
      
      // CROPS (10 Major crops of Bihar)
      const cropsData = [
        { _id: "651a1b2c3d4e5f6a7b8c9c01", name: "Rice (Paddy)", category: "Cereal", unit: "quintal", status: "Active" },
        { _id: "651a1b2c3d4e5f6a7b8c9c02", name: "Wheat", category: "Cereal", unit: "quintal", status: "Active" },
        { _id: "651a1b2c3d4e5f6a7b8c9c03", name: "Maize", category: "Cereal", unit: "quintal", status: "Active" },
        { _id: "651a1b2c3d4e5f6a7b8c9c04", name: "Makhana", category: "Cash Crop", unit: "quintal", status: "Active" },
        { _id: "651a1b2c3d4e5f6a7b8c9c05", name: "Sugarcane", category: "Cash Crop", unit: "quintal", status: "Active" },
        { _id: "651a1b2c3d4e5f6a7b8c9c06", name: "Lentil (Masoor)", category: "Pulses", unit: "quintal", status: "Active" },
        { _id: "651a1b2c3d4e5f6a7b8c9c07", name: "Gram (Chana)", category: "Pulses", unit: "quintal", status: "Active" },
        { _id: "651a1b2c3d4e5f6a7b8c9c08", name: "Mustard", category: "Oilseeds", unit: "quintal", status: "Active" },
        { _id: "651a1b2c3d4e5f6a7b8c9c09", name: "Jute", category: "Cash Crop", unit: "quintal", status: "Active" },
        { _id: "651a1b2c3d4e5f6a7b8c9c10", name: "Potato", category: "Horticulture", unit: "quintal", status: "Active" }
      ];
      await Crop.insertMany(cropsData);

      const districts = [
        "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", 
        "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", 
        "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", 
        "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", 
        "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"
      ];

      const regionsData = districts.map((district, index) => {
        const hexIndex = (index + 1).toString().padStart(3, '0');
        return {
          _id: `651a1b2c3d4e5f6a7b8cd${hexIndex}`,
          name: district,
          state: "Bihar",
          district: district,
          climate: "Humid Subtropical",
          status: "Active"
        };
      });
      await Region.insertMany(regionsData);

      const baseYields: Record<string, { base: number; variance: number }> = {
        "651a1b2c3d4e5f6a7b8c9c01": { base: 14.5, variance: 0.15 }, // Rice
        "651a1b2c3d4e5f6a7b8c9c02": { base: 13.0, variance: 0.12 }, // Wheat
        "651a1b2c3d4e5f6a7b8c9c03": { base: 20.0, variance: 0.15 }, // Maize
        "651a1b2c3d4e5f6a7b8c9c04": { base: 8.0,  variance: 0.25 }, // Makhana
        "651a1b2c3d4e5f6a7b8c9c05": { base: 260.0, variance: 0.15 },// Sugarcane
        "651a1b2c3d4e5f6a7b8c9c06": { base: 5.5,  variance: 0.10 }, // Lentil
        "651a1b2c3d4e5f6a7b8c9c07": { base: 6.0,  variance: 0.10 }, // Gram
        "651a1b2c3d4e5f6a7b8c9c08": { base: 6.5,  variance: 0.10 }, // Mustard
        "651a1b2c3d4e5f6a7b8c9c09": { base: 10.0, variance: 0.20 }, // Jute
        "651a1b2c3d4e5f6a7b8c9c10": { base: 85.0, variance: 0.15 }  // Potato
      };

      const yieldsData: any[] = [];
      
      regionsData.forEach(region => {
        cropsData.forEach(crop => {
          const randomModifier = 0.9 + (Math.random() * 0.2); 
          let calculatedYield = baseYields[crop._id].base * randomModifier;

          if (region.name === "Rohtas" && (crop.name.includes("Rice") || crop.name.includes("Wheat"))) calculatedYield *= 1.15;
          if (region.name === "Purnia" && crop.name.includes("Maize")) calculatedYield *= 1.20;
          if (region.name === "Darbhanga" && crop.name.includes("Makhana")) calculatedYield *= 1.25;
          if (region.name === "West Champaran" && crop.name.includes("Sugarcane")) calculatedYield *= 1.15;

          yieldsData.push({
            crop: crop._id,
            region: region._id,
            baseYieldPerAcre: parseFloat(calculatedYield.toFixed(1)),
            yieldVariance: baseYields[crop._id].variance,
            status: "Active"
          });
        });
      });
      await YieldProfile.insertMany(yieldsData);

      const pricesData = [
        { crop: "651a1b2c3d4e5f6a7b8c9c01", msp: 2369, avgMarketPrice: 2300, status: "Active" }, // Rice
        { crop: "651a1b2c3d4e5f6a7b8c9c02", msp: 2585, avgMarketPrice: 2600, status: "Active" }, // Wheat
        { crop: "651a1b2c3d4e5f6a7b8c9c03", msp: 2400, avgMarketPrice: 2350, status: "Active" }, // Maize
        { crop: "651a1b2c3d4e5f6a7b8c9c04", msp: 0,    avgMarketPrice: 80000, status: "Active" }, // Makhana
        { crop: "651a1b2c3d4e5f6a7b8c9c05", msp: 355,  avgMarketPrice: 350,  status: "Active" }, // Sugarcane (FRP)
        { crop: "651a1b2c3d4e5f6a7b8c9c06", msp: 6425, avgMarketPrice: 6500, status: "Active" }, // Lentil (Masoor)
        { crop: "651a1b2c3d4e5f6a7b8c9c07", msp: 5440, avgMarketPrice: 5600, status: "Active" }, // Gram (Chana)
        { crop: "651a1b2c3d4e5f6a7b8c9c08", msp: 5650, avgMarketPrice: 5500, status: "Active" }, // Mustard
        { crop: "651a1b2c3d4e5f6a7b8c9c09", msp: 5335, avgMarketPrice: 5200, status: "Active" }, // Jute
        { crop: "651a1b2c3d4e5f6a7b8c9c10", msp: 0,    avgMarketPrice: 1800, status: "Active" }  // Potato
      ];
      await PriceData.insertMany(pricesData);

      const irrigationCount = await IrrigationModifier.countDocuments();
      if (irrigationCount === 0) {
        const irrigationData = [
          { irrigationType: "rainfed", yieldMultiplier: 0.70, reliabilityScore: 40, status: "Active" },
          { irrigationType: "canal", yieldMultiplier: 1.00, reliabilityScore: 70, status: "Active" },  
          { irrigationType: "borewell", yieldMultiplier: 1.10, reliabilityScore: 85, status: "Active" },
          { irrigationType: "drip", yieldMultiplier: 1.25, reliabilityScore: 95, status: "Active" }      
        ];
        await IrrigationModifier.insertMany(irrigationData);
      }
      
      console.log(`✅ Auto-seeding completed! Populated 10 crops and ${yieldsData.length} district yield profiles successfully.`);
    } else {
      console.log("⚡ Database already contains required tables. Skipping auto-seed.");
    }
  } catch (error) {
    console.error("❌ Auto-seeding failed:", error);
  }
}