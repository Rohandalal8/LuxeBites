import { restaurantSeeds, type RestaurantSeed } from "../data/restaurants.js";

export type RestaurantQuery = {
  search?: string;
  cuisine?: string;
  rating?: number;
  vegOnly?: boolean;
};

export function listRestaurants(query: RestaurantQuery = {}): RestaurantSeed[] {
  const search = (query.search ?? "").trim().toLowerCase();
  const cuisine = (query.cuisine ?? "").trim();
  const rating = Number(query.rating ?? 0);
  const vegOnly = Boolean(query.vegOnly);

  return restaurantSeeds.filter((restaurant) => {
    const searchableText = [
      restaurant.name,
      restaurant.cuisine,
      restaurant.location,
      restaurant.description,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !search || searchableText.includes(search);
    const matchesCuisine = !cuisine || cuisine === "all" || restaurant.cuisine.toLowerCase() === cuisine.toLowerCase();
    const matchesRating = !rating || restaurant.rating >= rating;
    const matchesVeg = !vegOnly || restaurant.isVegFriendly;

    return matchesSearch && matchesCuisine && matchesRating && matchesVeg;
  });
}
