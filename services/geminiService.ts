import { WinePairing } from "../types";

export const getWinePairing = async (mealDescription: string): Promise<WinePairing> => {
  const response = await fetch("/api/wine-pairing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mealDescription }),
  });

  if (!response.ok) {
    let errorMessage = "Vores sommelier tabte flasken. Prøv venligst igen.";
    try {
      const data = await response.json();
      if (data?.error) {
        errorMessage = data.error;
      }
    } catch {
      // Ignore JSON parse error and use default
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data as WinePairing;
};
