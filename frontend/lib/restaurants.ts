import { apiFetch } from "@/lib/api";

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string;
  rating: number;
  priceLevel: number;
  deliveryTime: string;
  city: string;
  location: string;
  image: string;
  isOpen: boolean;
  isVegFriendly: boolean;
  offer: string | null;
};

export type RestaurantsResponse = {
  success: boolean;
  data: Restaurant[];
};

export type RestaurantDetails = Restaurant & {
  categories: Array<{
    id: string;
    name: string;
    items: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      isVeg: boolean;
      image: string | null;
    }>;
  }>;
};

export async function fetchRestaurants(params: Record<string, string | number | boolean | undefined> = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.append(key, String(value));
  });

  const endpoint = query.toString() ? `/restaurants?${query.toString()}` : "/restaurants";
  return apiFetch<RestaurantsResponse>(endpoint);
}

export async function fetchRestaurant(slug: string) {
  return apiFetch<{ success: boolean; data: RestaurantDetails }>(`/restaurants/${encodeURIComponent(slug)}`);
}
