const request = require("supertest");

describe("Task 1", () => {
  describe("POST /parse", () => {
    const getTask1 = async (inputStr) => {
      return await request("http://localhost:8080")
        .post("/parse")
        .send({ input: inputStr });
    };

    it("example1", async () => {
      const response = await getTask1("Riz@z RISO00tto!");
      expect(response.body).toStrictEqual({ msg: "Rizz Risotto" });
    });

    it("example2", async () => {
      const response = await getTask1("alpHa-alFRedo");
      expect(response.body).toStrictEqual({ msg: "Alpha Alfredo" });
    });

    it("error case", async () => {
      const response = await getTask1("");
      expect(response.status).toBe(400);
    });

    // Extra tests
    it("replaces underscores with spaces", async () => {
      const response = await getTask1("Skibidi___Spaghetti");
      expect(response.body).toStrictEqual({ msg: "Skibidi Spaghetti" });
    });

    it("replaces hyphens with spaces", async () => {
      const response = await getTask1("Skibidi---Spaghetti");
      expect(response.body).toStrictEqual({ msg: "Skibidi Spaghetti" });
    });

    it("collapses multiple spaces", async () => {
      const response = await getTask1("Skibidi   spaghetti");
      expect(response.body).toStrictEqual({ msg: "Skibidi Spaghetti" });
    });

    it("trims trailing whitespace", async () => {
      const response = await getTask1("Skibidi spaghetti    ");
      expect(response.body).toStrictEqual({ msg: "Skibidi Spaghetti" });
    });

    it("capitalises first letter of each word, lowercases rest", async () => {
      const response = await getTask1("alpHa alFRedo");
      expect(response.body).toStrictEqual({ msg: "Alpha Alfredo" });
    });

    it("single word is title cased", async () => {
      const response = await getTask1("meatball");
      expect(response.body).toStrictEqual({ msg: "Meatball" });
    });

    it("removes special characters other than hyphen/underscore", async () => {
      const response = await getTask1("p@st@!");
      expect(response.body).toStrictEqual({ msg: "Pst" });
    });

    it("string with only special characters returns 400", async () => {
      const response = await getTask1("@@@!!!");
      expect(response.status).toBe(400);
    });

    it("string with only hyphens/underscores returns 400", async () => {
      const response = await getTask1("---___");
      expect(response.status).toBe(400);
    });

    it("mixed hyphens, underscores, and spaces collapse to single space", async () => {
      const response = await getTask1("Skibidi_-_Spaghetti");
      expect(response.body).toStrictEqual({ msg: "Skibidi Spaghetti" });
    });

    it("already valid string is returned unchanged", async () => {
      const response = await getTask1("Alpha Alfredo");
      expect(response.body).toStrictEqual({ msg: "Alpha Alfredo" });
    });

    it("numbers and symbols are stripped", async () => {
      const response = await getTask1("Riz@z RISO00tto!");
      expect(response.body).toStrictEqual({ msg: "Rizz Risotto" });
    });
  });
});

describe("Task 2", () => {
  describe("POST /entry", () => {
    const putTask2 = async (data) => {
      return await request("http://localhost:8080").post("/entry").send(data);
    };

    it("Add Ingredients", async () => {
      const entries = [
        { type: "ingredient", name: "Egg", cookTime: 6 },
        { type: "ingredient", name: "Lettuce", cookTime: 1 },
      ];
      for (const entry of entries) {
        const resp = await putTask2(entry);
        expect(resp.status).toBe(200);
        expect(resp.body).toStrictEqual({});
      }
    });

    it("Add Recipe", async () => {
      const meatball = {
        type: "recipe",
        name: "Meatball",
        requiredItems: [{ name: "Beef", quantity: 1 }],
      };
      const resp1 = await putTask2(meatball);
      expect(resp1.status).toBe(200);
    });

    it("Congratulations u burnt the pan pt2", async () => {
      const resp = await putTask2({
        type: "ingredient",
        name: "beef",
        cookTime: -1,
      });
      expect(resp.status).toBe(400);
    });

    it("Congratulations u burnt the pan pt3", async () => {
      const resp = await putTask2({
        type: "pan",
        name: "pan",
        cookTime: 20,
      });
      expect(resp.status).toBe(400);
    });

    it("Unique names", async () => {
      const resp = await putTask2({
        type: "ingredient",
        name: "Beef",
        cookTime: 10,
      });
      expect(resp.status).toBe(200);

      const resp2 = await putTask2({
        type: "ingredient",
        name: "Beef",
        cookTime: 8,
      });
      expect(resp2.status).toBe(400);

      const resp3 = await putTask2({
        type: "recipe",
        name: "Beef",
        cookTime: 8,
      });
      expect(resp3.status).toBe(400);
    });

    // Extra tests
    it("ingredient with cookTime 0 is valid", async () => {
      const resp = await putTask2({
        type: "ingredient",
        name: "Flour",
        cookTime: 0,
      });
      expect(resp.status).toBe(200);
      expect(resp.body).toStrictEqual({});
    });

    it("recipe with multiple requiredItems is valid", async () => {
      const resp = await putTask2({
        type: "recipe",
        name: "Omelette",
        requiredItems: [
          { name: "Egg", quantity: 2 },
          { name: "Lettuce", quantity: 1 },
        ],
      });
      expect(resp.status).toBe(200);
      expect(resp.body).toStrictEqual({});
    });

    it("recipe with duplicate requiredItem names returns 400", async () => {
      const resp = await putTask2({
        type: "recipe",
        name: "BadRecipe",
        requiredItems: [
          { name: "Egg", quantity: 1 },
          { name: "Egg", quantity: 2 },
        ],
      });
      expect(resp.status).toBe(400);
    });

    it("ingredient name must be unique across ingredients and recipes", async () => {
      // Add an ingredient
      const resp1 = await putTask2({
        type: "ingredient",
        name: "Tomato",
        cookTime: 2,
      });
      expect(resp1.status).toBe(200);

      // Try to add a recipe with the same name
      const resp2 = await putTask2({
        type: "recipe",
        name: "Tomato",
        requiredItems: [{ name: "Egg", quantity: 1 }],
      });
      expect(resp2.status).toBe(400);
    });

    it("recipe name must be unique across ingredients and recipes", async () => {
      // Add a recipe
      const resp1 = await putTask2({
        type: "recipe",
        name: "Salad",
        requiredItems: [{ name: "Lettuce", quantity: 1 }],
      });
      expect(resp1.status).toBe(200);

      // Try to add an ingredient with the same name
      const resp2 = await putTask2({
        type: "ingredient",
        name: "Salad",
        cookTime: 5,
      });
      expect(resp2.status).toBe(400);
    });

    it("invalid type returns 400", async () => {
      const resp = await putTask2({
        type: "meal",
        name: "Pizza",
        cookTime: 10,
      });
      expect(resp.status).toBe(400);
    });

    it("ingredient with negative cookTime returns 400", async () => {
      const resp = await putTask2({
        type: "ingredient",
        name: "NegativeCook",
        cookTime: -5,
      });
      expect(resp.status).toBe(400);
    });
  });
});

describe("Task 3", () => {
  describe("GET /summary", () => {
    const postEntry = async (data) => {
      return await request("http://localhost:8080").post("/entry").send(data);
    };

    const getTask3 = async (name) => {
      return await request("http://localhost:8080").get(
        `/summary?name=${name}`
      );
    };

    it("What is bro doing - Get empty cookbook", async () => {
      const resp = await getTask3("nothing");
      expect(resp.status).toBe(400);
    });

    it("What is bro doing - Get ingredient", async () => {
      const resp = await postEntry({
        type: "ingredient",
        name: "beef",
        cookTime: 2,
      });
      expect(resp.status).toBe(200);

      const resp2 = await getTask3("beef");
      expect(resp2.status).toBe(400);
    });

    it("Unknown missing item", async () => {
      const cheese = {
        type: "recipe",
        name: "Cheese",
        requiredItems: [{ name: "Not Real", quantity: 1 }],
      };
      const resp1 = await postEntry(cheese);
      expect(resp1.status).toBe(200);

      const resp2 = await getTask3("Cheese");
      expect(resp2.status).toBe(400);
    });

    it("Bro cooked", async () => {
      const meatball = {
        type: "recipe",
        name: "Skibidi",
        requiredItems: [{ name: "Bruh", quantity: 1 }],
      };
      const resp1 = await postEntry(meatball);
      expect(resp1.status).toBe(200);

      const resp2 = await postEntry({
        type: "ingredient",
        name: "Bruh",
        cookTime: 2,
      });
      expect(resp2.status).toBe(200);

      const resp3 = await getTask3("Skibidi");
      expect(resp3.status).toBe(200);
    });

    // Extra tests: full Skibidi Spaghetti example from README
    // Uses uniquely-prefixed names to avoid collisions with entries added in earlier tests
    it("Skibidi Spaghetti - full recursive summary", async () => {
      await postEntry({ type: "ingredient", name: "SS_Beef", cookTime: 5 });
      await postEntry({ type: "ingredient", name: "SS_Egg", cookTime: 3 });
      await postEntry({ type: "ingredient", name: "SS_Flour", cookTime: 0 });
      await postEntry({ type: "ingredient", name: "SS_Tomato", cookTime: 2 });
      await postEntry({
        type: "recipe",
        name: "SS_Meatball",
        requiredItems: [
          { name: "SS_Beef", quantity: 2 },
          { name: "SS_Egg", quantity: 1 },
        ],
      });
      await postEntry({
        type: "recipe",
        name: "SS_Pasta",
        requiredItems: [
          { name: "SS_Flour", quantity: 3 },
          { name: "SS_Egg", quantity: 1 },
        ],
      });
      await postEntry({
        type: "recipe",
        name: "Skibidi Spaghetti",
        requiredItems: [
          { name: "SS_Meatball", quantity: 3 },
          { name: "SS_Pasta", quantity: 1 },
          { name: "SS_Tomato", quantity: 2 },
        ],
      });

      const resp = await getTask3("Skibidi Spaghetti");
      expect(resp.status).toBe(200);
      expect(resp.body.name).toBe("Skibidi Spaghetti");
      // SS_Beef: 5*2*3=30, SS_Egg: 3*1*3 + 3*1*1=12, SS_Flour: 0*3*1=0, SS_Tomato: 2*2=4 => total 46
      expect(resp.body.cookTime).toBe(46);

      // Verify ingredients (order may vary)
      const ingredients = resp.body.ingredients;
      expect(ingredients).toHaveLength(4);

      const findIngredient = (name) =>
        ingredients.find((i) => i.name === name);

      expect(findIngredient("SS_Beef")).toEqual({ name: "SS_Beef", quantity: 6 });
      expect(findIngredient("SS_Egg")).toEqual({ name: "SS_Egg", quantity: 4 });
      expect(findIngredient("SS_Flour")).toEqual({ name: "SS_Flour", quantity: 3 });
      expect(findIngredient("SS_Tomato")).toEqual({ name: "SS_Tomato", quantity: 2 });
    });

    it("simple single-ingredient recipe summary", async () => {
      await postEntry({ type: "ingredient", name: "Sugar", cookTime: 1 });
      await postEntry({
        type: "recipe",
        name: "SweetDish",
        requiredItems: [{ name: "Sugar", quantity: 4 }],
      });

      const resp = await getTask3("SweetDish");
      expect(resp.status).toBe(200);
      expect(resp.body.name).toBe("SweetDish");
      expect(resp.body.cookTime).toBe(4);
      expect(resp.body.ingredients).toEqual([{ name: "Sugar", quantity: 4 }]);
    });

    it("returns 400 for ingredient name instead of recipe", async () => {
      await postEntry({ type: "ingredient", name: "Salt", cookTime: 0 });
      const resp = await getTask3("Salt");
      expect(resp.status).toBe(400);
    });

    it("returns 400 when nested recipe references a missing item", async () => {
      await postEntry({ type: "ingredient", name: "Water", cookTime: 5 });
      await postEntry({
        type: "recipe",
        name: "InnerRecipe",
        requiredItems: [{ name: "Ghost Ingredient", quantity: 1 }],
      });
      await postEntry({
        type: "recipe",
        name: "OuterRecipe",
        requiredItems: [
          { name: "Water", quantity: 1 },
          { name: "InnerRecipe", quantity: 1 },
        ],
      });

      const resp = await getTask3("OuterRecipe");
      expect(resp.status).toBe(400);
    });

    it("cookTime is sum of all ingredient cookTimes multiplied by quantities", async () => {
      await postEntry({ type: "ingredient", name: "OilA", cookTime: 3 });
      await postEntry({ type: "ingredient", name: "OilB", cookTime: 7 });
      await postEntry({
        type: "recipe",
        name: "OilBlend",
        requiredItems: [
          { name: "OilA", quantity: 2 },
          { name: "OilB", quantity: 3 },
        ],
      });

      const resp = await getTask3("OilBlend");
      expect(resp.status).toBe(200);
      // 3*2 + 7*3 = 6 + 21 = 27
      expect(resp.body.cookTime).toBe(27);
    });

    it("nested recipes accumulate ingredient quantities correctly", async () => {
      // Base1 appears in both SubRecipe and TopRecipe
      await postEntry({ type: "ingredient", name: "Base1", cookTime: 10 });
      await postEntry({
        type: "recipe",
        name: "SubRecipe",
        requiredItems: [{ name: "Base1", quantity: 1 }],
      });
      await postEntry({
        type: "recipe",
        name: "TopRecipe",
        requiredItems: [
          { name: "SubRecipe", quantity: 2 },
          { name: "Base1", quantity: 3 },
        ],
      });

      const resp = await getTask3("TopRecipe");
      expect(resp.status).toBe(200);
      // SubRecipe x2 contributes Base1 x2, plus direct Base1 x3 => Base1 x5
      // cookTime = 10*5 = 50
      expect(resp.body.cookTime).toBe(50);
      const ingredients = resp.body.ingredients;
      expect(ingredients).toHaveLength(1);
      expect(ingredients[0]).toEqual({ name: "Base1", quantity: 5 });
    });
  });
});
