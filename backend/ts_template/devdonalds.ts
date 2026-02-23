import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: (recipe | ingredient)[] = [];

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  }
  res.json({ msg: parsed_string });
  return;

});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that
const parse_handwriting = (recipeName: string): string | null => {
  let result = recipeName.replace(/[-_]/g, " ");
  result = result.replace(/[^a-zA-Z ]/g, "");
  result = result.replace(/\s+/g, " ").trim();
  if (result.length === 0) return null;
  result = result
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return result;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  const entry = req.body;

  if (entry.type !== "recipe" && entry.type !== "ingredient") {
    res.status(400).send("Invalid type");
    return;
  }

  if (cookbook.some((e) => e.name === entry.name)) {
    res.status(400).send("Name must be unique");
    return;
  }

  if (entry.type === "ingredient") {
    if (typeof entry.cookTime !== "number" || entry.cookTime < 0) {
      res.status(400).send("cookTime must be >= 0");
      return;
    }
    cookbook.push({ type: "ingredient", name: entry.name, cookTime: entry.cookTime } as ingredient);
  } else {
    const requiredItems: requiredItem[] = entry.requiredItems;
    const itemNames = requiredItems.map((i: requiredItem) => i.name);
    if (new Set(itemNames).size !== itemNames.length) {
      res.status(400).send("requiredItems must have unique names");
      return;
    }
    cookbook.push({ type: "recipe", name: entry.name, requiredItems } as recipe);
  }

  res.status(200).json({});
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Response) => {
  const name = req.query.name as string;

  const entry = cookbook.find((e) => e.name === name);

  if (!entry || entry.type !== "recipe") {
    res.status(400).send("Recipe not found");
    return;
  }

  const ingredientMap = new Map<string, number>();
  let totalCookTime = 0;

  const resolve = (itemName: string, multiplier: number): boolean => {
    const found = cookbook.find((e) => e.name === itemName);
    if (!found) return false;
    if (found.type === "ingredient") {
      const ing = found as ingredient;
      totalCookTime += ing.cookTime * multiplier;
      ingredientMap.set(itemName, (ingredientMap.get(itemName) ?? 0) + multiplier);
    } else {
      const rec = found as recipe;
      for (const item of rec.requiredItems) {
        if (!resolve(item.name, item.quantity * multiplier)) return false;
      }
    }
    return true;
  };

  const rec = entry as recipe;
  for (const item of rec.requiredItems) {
    if (!resolve(item.name, item.quantity)) {
      res.status(400).send("Missing ingredient or recipe in cookbook");
      return;
    }
  }

  const ingredients: requiredItem[] = Array.from(ingredientMap.entries()).map(
    ([n, q]) => ({ name: n, quantity: q })
  );

  res.status(200).json({ name, cookTime: totalCookTime, ingredients });
});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
