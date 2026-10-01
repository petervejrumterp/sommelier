var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = process.env.PORT || 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.post("/api/wine-pairing", async (req, res) => {
    try {
      const { mealDescription } = req.body;
      if (!mealDescription || typeof mealDescription !== "string") {
        return res.status(400).json({ error: "Indtast venligst en ret for at f\xE5 en vinanbefaling." });
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "API-n\xF8glen mangler i servermilj\xF8et. Tjek venligst Settings > Secrets."
        });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const prompt = `Foresl\xE5 den absolut bedste vin til denne ret: "${mealDescription}".
Ager som en dansk sommelier i absolut verdensklasse hos Vininvestoren. V\xE6r specifik, professionel og formidlende. Svar altid p\xE5 dansk.`;
      const candidateModels = [
        "gemini-2.5-flash",
        "gemini-3-flash-preview",
        "gemini-2.5-flash-lite",
        "gemini-3.8-flash"
      ];
      let lastError = null;
      let text = null;
      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: "Du er en erfaren dansk topsommelier hos Vininvestoren. Dit m\xE5l er at anbefale \xE9n enkeltst\xE5ende, optimal vin til den angivne ret. Analys\xE9r smagsnoter, fedme, syre og intensitet i retten og giv et overbevisende, elegant match. Svar altid p\xE5 dansk og f\xF8lg det definerede JSON-skema pr\xE6cist.",
              responseMimeType: "application/json",
              responseSchema: {
                type: import_genai.Type.OBJECT,
                properties: {
                  wineName: {
                    type: import_genai.Type.STRING,
                    description: "Specifikt vinnavn, producent, \xE5rgang eller appellation (f.eks. 'Ampelos Cellars Pinot Noir' eller 'Bourgogne Rouge')"
                  },
                  type: {
                    type: import_genai.Type.STRING,
                    enum: ["Red", "White", "Ros\xE9", "Sparkling", "Dessert", "Fortified"]
                  },
                  region: {
                    type: import_genai.Type.STRING,
                    description: "Den specifikke region og land vinen kommer fra (f.eks. 'Bourgogne, Frankrig' eller 'Californien, USA')"
                  },
                  grape: {
                    type: import_genai.Type.STRING,
                    description: "Den prim\xE6re drue eller blanding (f.eks. 'Pinot Noir' eller 'Chardonnay')"
                  },
                  description: {
                    type: import_genai.Type.STRING,
                    description: "En indbydende, sofistikeret forklaring p\xE5 dansk af, hvorfor denne vin komplementerer retten perfekt."
                  },
                  tastingNotes: {
                    type: import_genai.Type.ARRAY,
                    items: { type: import_genai.Type.STRING },
                    description: "3-5 markante smagsnoter p\xE5 dansk (f.eks. 'R\xF8de b\xE6r', 'Skovbund', 'Krydderier')"
                  },
                  servingTemp: {
                    type: import_genai.Type.STRING,
                    description: "Anbefalet serveringstemperatur (f.eks. '14-16\xB0C')"
                  },
                  priceRange: {
                    type: import_genai.Type.STRING,
                    description: "Estimeret prisleje i DKK (f.eks. '175 - 250 kr.')"
                  },
                  matchScore: {
                    type: import_genai.Type.INTEGER,
                    description: "En score mellem 85 og 99 der afspejler matchgraden"
                  }
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
                  "matchScore"
                ]
              }
            }
          });
          if (response.text) {
            text = response.text;
            break;
          }
        } catch (err) {
          console.warn(`Model ${model} fejlede, fors\xF8ger n\xE6ste model...`, err?.message || err);
          lastError = err;
          continue;
        }
      }
      if (!text) {
        throw lastError || new Error("Ingen svar modtaget fra sommelieren.");
      }
      const pairing = JSON.parse(text);
      return res.json(pairing);
    } catch (err) {
      console.error("Fejl ved vinparring:", err);
      return res.status(500).json({
        error: err?.message || "Der opstod en fejl under analysen af retten. Pr\xF8v venligst igen."
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const fs = await import("fs");
    const distPath = fs.existsSync(import_path.default.join(process.cwd(), "dist", "index.html")) ? import_path.default.join(process.cwd(), "dist") : process.cwd();
    app.use(import_express.default.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  if (typeof PORT === "string" && isNaN(Number(PORT))) {
    app.listen(PORT, () => {
      console.log(`Server running on socket ${PORT}`);
    });
  } else {
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}
startServer();
//# sourceMappingURL=server.cjs.map
