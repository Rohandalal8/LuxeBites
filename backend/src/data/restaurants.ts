export type RestaurantSeed = {
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

export const restaurantSeeds: RestaurantSeed[] = [
  {
    id: "r-1",
    name: "Saffron Courtyard",
    slug: "saffron-courtyard",
    description: "Slow-simmered North Indian classics and modern tandoor favourites.",
    cuisine: "North Indian",
    rating: 4.8,
    priceLevel: 2,
    deliveryTime: "25-35 min",
    city: "Bengaluru",
    location: "Indiranagar",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    isOpen: true,
    isVegFriendly: true,
    offer: "20% off first order",
  },
  {
    id: "r-2",
    name: "Bamboo Wok",
    slug: "bamboo-wok",
    description: "Wok-fired comfort food with generous portions and bold flavour.",
    cuisine: "Chinese",
    rating: 4.6,
    priceLevel: 2,
    deliveryTime: "20-30 min",
    city: "Bengaluru",
    location: "Koramangala",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    isOpen: true,
    isVegFriendly: false,
    offer: "Free delivery over ₹399",
  },
  {
    id: "r-3",
    name: "Cedar & Co.",
    slug: "cedar-and-co",
    description: "Fresh salads, artisan grills, and brunch plates for the whole crew.",
    cuisine: "Cafe",
    rating: 4.9,
    priceLevel: 3,
    deliveryTime: "30-40 min",
    city: "Bengaluru",
    location: "Whitefield",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    isOpen: true,
    isVegFriendly: true,
    offer: "Free dessert with combo",
  },
  {
    id: "r-4",
    name: "Olio Pizza Lab",
    slug: "olio-pizza-lab",
    description: "Neapolitan-inspired pizzas, hand-stretched and fired to a blistered finish.",
    cuisine: "Pizza",
    rating: 4.7,
    priceLevel: 2,
    deliveryTime: "22-32 min",
    city: "Bengaluru",
    location: "HSR Layout",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    isOpen: true,
    isVegFriendly: true,
    offer: null,
  },
  {
    id: "r-5",
    name: "Masala Hookah",
    slug: "masala-hookah",
    description: "Biryani, kebabs, and house specials served hot with a generous finish.",
    cuisine: "Biryani",
    rating: 4.5,
    priceLevel: 2,
    deliveryTime: "18-26 min",
    city: "Hyderabad",
    location: "Gachibowli",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d0b0?auto=format&fit=crop&w=1200&q=80",
    isOpen: true,
    isVegFriendly: false,
    offer: "Save ₹80 on orders above ₹499",
  },
  {
    id: "r-6",
    name: "The Green Plate",
    slug: "the-green-plate",
    description: "Healthy bowls, smoothies, and vegetarian comfort dishes with a fresh edge.",
    cuisine: "Healthy",
    rating: 4.8,
    priceLevel: 2,
    deliveryTime: "20-28 min",
    city: "Mumbai",
    location: "Andheri",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    isOpen: false,
    isVegFriendly: true,
    offer: "Veg combo from ₹299",
  },
];
