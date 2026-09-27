import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Wine pairing API endpoint
  app.post("/api/wine-pairing", async (req, res) => {
    try {
      const { mealDescription } = req.body;
      if (!mealDescription || typeof mealDescription !== "string") {
        return res.status(400).json({ error: "Indtast venligst en ret for at få en vinanbefaling." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "API-nøglen mangler i servermiljøet. Tjek venligst Settings > Secrets." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Foreslå den absolut bedste vin til denne ret: "${mealDescription}".
Ager som en dansk sommelier i absolut verdensklasse hos Vininvestoren. Vær specifik, professionel og formidlende. Svar altid på dansk.`;

      const candidateModels = [
        "gemini-2.5-flash",
        "gemini-3-flash-preview",
        "gemini-2.5-flash-lite",
        "gemini-3.8-flash",
      ];

      let lastError: any = null;
      let text: string | null | undefined = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction:
                "Du er en erfaren dansk topsommelier hos Vininvestoren. Dit mål er at anbefale én enkeltstående, optimal vin til den angivne ret. Analysér smagsnoter, fedme, syre og intensitet i retten og giv et overbevisende, elegant match. Svar altid på dansk og følg det definerede JSON-skema præcist.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  wineName: {
                    type: Type.STRING,
                    description: "Specifikt vinnavn, producent, årgang eller appellation (f.eks. 'Ampelos Cellars Pinot Noir' eller 'Bourgogne Rouge')",
                  },
                  type: {
                    type: Type.STRING,
                    enum: ["Red", "White", "Rosé", "Sparkling", "Dessert", "Fortified"],
                  },
                  region: {
                    type: Type.STRING,
                    description: "Den specifikke region og land vinen kommer fra (f.eks. 'Bourgogne, Frankrig' eller 'Californien, USA')",
                  },
                  grape: {
                    type: Type.STRING,
                    description: "Den primære drue eller blanding (f.eks. 'Pinot Noir' eller 'Chardonnay')",
                  },
                  description: {
                    type: Type.STRING,
                    description: "En indbydende, sofistikeret forklaring på dansk af, hvorfor denne vin komplementerer retten perfekt.",
                  },
                  tastingNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3-5 markante smagsnoter på dansk (f.eks. 'Røde bær', 'Skovbund', 'Krydderier')",
                  },
                  servingTemp: {
                    type: Type.STRING,
                    description: "Anbefalet serveringstemperatur (f.eks. '14-16°C')",
                  },
                  priceRange: {
                    type: Type.STRING,
                    description: "Estimeret prisleje i DKK (f.eks. '175 - 250 kr.')",
                  },
                  matchScore: {
                    type: Type.INTEGER,
                    description: "En score mellem 85 og 99 der afspejler matchgraden",
                  },
                },
                required: [
                  "wineName",
                  "type",
                  "region",
                  "grape",
                  "description",
                  "tastingNotes",
                  "servingTemp",
                  "priceRange",
                  "matchScore",
                ],
              },
            },
          });

          if (response.text) {
            text = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${model} fejlede, forsøger næste model...`, err?.message || err);
          lastError = err;
          // If unavailable / high demand, continue to next model
          continue;
        }
      }

      if (!text) {
        throw lastError || new Error("Ingen svar modtaget fra sommelieren.");
      }

      const pairing = JSON.parse(text);
      return res.json(pairing);
    } catch (err: any) {
      console.error("Fejl ved vinparring:", err);
      return res.status(500).json({
        error: err?.message || "Der opstod en fejl under analysen af retten. Prøv venligst igen.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // In Express v5 wildcard route uses *all
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
