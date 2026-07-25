import pasta from "@/assets/dish-pasta.jpg";
import pizza from "@/assets/dish-pizza.jpg";
import steak from "@/assets/dish-steak.jpg";
import dessert from "@/assets/dish-dessert.jpg";
import salad from "@/assets/dish-salad.jpg";
import drink from "@/assets/dish-drink.jpg";
import starter from "@/assets/dish-starter.jpg";

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  veg: boolean;
  spice: 0 | 1 | 2 | 3;
  prepMins: number;
  calories: number;
  rating: number;
  badges?: ("chef" | "bestseller" | "new" | "signature")[];
  story?: string;
  ingredients?: string[];
  allergens?: string[];
  pairs?: string[];
};

export const categories = [
  { id: "signature", label: "Signature", emoji: "✨" },
  { id: "starters", label: "Starters", emoji: "🥢" },
  { id: "mains", label: "Main Course", emoji: "🍽" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "pasta", label: "Pasta", emoji: "🍝" },
  { id: "salads", label: "Salads", emoji: "🥗" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "drinks", label: "Drinks", emoji: "🍸" },
];

export const dishes: Dish[] = [
  {
    id: "truffle-pasta",
    name: "Black Truffle Tagliolini",
    description: "Hand-rolled tagliolini, aged parmigiano, shaved winter truffle.",
    price: 32,
    image: pasta,
    category: "pasta",
    veg: true, spice: 0, prepMins: 18, calories: 640, rating: 4.9,
    badges: ["chef", "signature"],
    story: "A quiet dish. Slow-hand pasta finished tableside with truffle shaved in front of you.",
    ingredients: ["Tagliolini", "Winter truffle", "Parmigiano 24m", "Butter", "Sea salt"],
    allergens: ["Gluten", "Dairy", "Egg"],
    pairs: ["chardonnay", "burrata"],
  },
  {
    id: "wagyu-steak",
    name: "A5 Wagyu, Rosemary & Gold",
    description: "Grade A5 Miyazaki wagyu, rosemary smoke, hand-cut fries, béarnaise.",
    price: 78, image: steak, category: "mains",
    veg: false, spice: 1, prepMins: 22, calories: 820, rating: 4.9,
    badges: ["signature", "bestseller"],
    story: "Sourced from a single farm in Miyazaki. Finished over Japanese oak, plated with gold leaf.",
    ingredients: ["A5 wagyu", "Rosemary", "Béarnaise", "Sea salt", "Gold leaf"],
    allergens: ["Dairy", "Egg"],
  },
  {
    id: "margherita",
    name: "Wood-Fired Margherita",
    description: "72-hour dough, San Marzano, fior di latte, garden basil.",
    price: 18, image: pizza, category: "pizza",
    veg: true, spice: 0, prepMins: 12, calories: 720, rating: 4.8,
    badges: ["bestseller"],
    story: "Fermented three days, blistered in 90 seconds at 480°C.",
    ingredients: ["Dough", "San Marzano", "Fior di latte", "Basil", "EVOO"],
    allergens: ["Gluten", "Dairy"],
  },
  {
    id: "burrata",
    name: "Heirloom Burrata",
    description: "Puglia burrata, heirloom tomatoes, basil oil, aged balsamic.",
    price: 16, image: salad, category: "salads",
    veg: true, spice: 0, prepMins: 6, calories: 380, rating: 4.7,
    badges: ["chef"],
    story: "Burrata arrives from Puglia every Tuesday. Torn by hand.",
    ingredients: ["Burrata", "Heirloom tomatoes", "Basil", "Balsamic 12y"],
    allergens: ["Dairy"],
  },
  {
    id: "tempura",
    name: "Garden Tempura, Yuzu Salt",
    description: "Seasonal vegetables in ice-cold batter with yuzu sea salt.",
    price: 14, image: starter, category: "starters",
    veg: true, spice: 0, prepMins: 8, calories: 320, rating: 4.6,
    ingredients: ["Seasonal vegetables", "Tempura batter", "Yuzu salt"],
    allergens: ["Gluten"],
  },
  {
    id: "lava",
    name: "Molten Chocolate, Vanilla Bean",
    description: "70% Valrhona lava cake, Madagascar vanilla ice cream, gold dust.",
    price: 12, image: dessert, category: "desserts",
    veg: true, spice: 0, prepMins: 10, calories: 540, rating: 4.9,
    badges: ["bestseller", "signature"],
    story: "The cake rests three minutes. Cut it and it flows.",
    ingredients: ["Valrhona 70%", "Vanilla", "Butter", "Egg"],
    allergens: ["Dairy", "Egg", "Gluten"],
  },
  {
    id: "smoke-negroni",
    name: "Smoked Negroni",
    description: "House gin, Campari, sweet vermouth, applewood smoke.",
    price: 15, image: drink, category: "drinks",
    veg: true, spice: 0, prepMins: 5, calories: 210, rating: 4.8,
    badges: ["chef"],
    ingredients: ["Gin", "Campari", "Vermouth", "Orange peel"],
    allergens: [],
  },
];

export const findDish = (id: string) => dishes.find((d) => d.id === id);
