import type {
  Profile,
  DepartmentType,
  Store,
  GroceryItem,
  DeliveryTiming,
  PlatformFee,
  OrderStatus,
  Order,
  OrderItem,
  SortingOption,
  Review,
  CartItem,
} from './types'

// ---------------------------------------------------------------------------
// Demo mode detection
// ---------------------------------------------------------------------------

export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return (
    !url ||
    url === '' ||
    url === 'https://placeholder.supabase.co'
  )
}

// ---------------------------------------------------------------------------
// Users & profiles
// ---------------------------------------------------------------------------

export const demoUser = {
  id: 'demo-user-id',
  email: 'maria@aigroceries.com',
  created_at: new Date().toISOString(),
}

export const demoProfile: Profile = {
  id: 'demo-user-id',
  first_name: 'Maria',
  last_name: 'Hernandez',
  zip: '10001',
  phone: '(212) 555-0147',
  address: '123 Main St, Apt 4B, New York, NY 10001',
  gender: 'female',
  date_of_birth: '1990-06-15',
  order_comment: 'Leave with doorman please',
  admin: false,
  avatar_url: '',
  created_at: new Date().toISOString(),
}

export const demoAdminProfile: Profile = {
  id: 'demo-admin-id',
  first_name: 'Admin',
  last_name: 'User',
  zip: '10001',
  phone: '(212) 555-0100',
  address: '',
  gender: '',
  date_of_birth: null,
  order_comment: '',
  admin: true,
  avatar_url: '',
  created_at: new Date().toISOString(),
}

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

export const demoDepartments: DepartmentType[] = [
  {
    id: 'dept-1',
    name: 'Fruits & Vegetables',
    icon: 'apple',
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-2',
    name: 'Dairy & Eggs',
    icon: 'egg',
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-3',
    name: 'Bakery',
    icon: 'croissant',
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-4',
    name: 'Meat & Seafood',
    icon: 'beef',
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-5',
    name: 'Pantry Essentials',
    icon: 'package',
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-6',
    name: 'Beverages',
    icon: 'coffee',
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-7',
    name: 'Frozen Foods',
    icon: 'snowflake',
    sort_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-8',
    name: 'Snacks',
    icon: 'cookie',
    sort_order: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-9',
    name: 'Household',
    icon: 'home',
    sort_order: 9,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dept-10',
    name: 'Personal Care',
    icon: 'heart',
    sort_order: 10,
    created_at: new Date().toISOString(),
  },
]

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------

export const demoStores: Store[] = [
  {
    id: 'store-1',
    name: 'Greenleaf Market',
    description:
      'Your neighborhood source for certified organic produce, pasture-raised eggs, and locally sourced pantry staples. Every item is hand-selected for freshness.',
    image_url: '/images/stores/greenleaf.jpg',
    serviced_zips: ['10001', '10002', '10003'],
    department_type_ids: ['dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5', 'dept-6'],
    rating: 4.8,
    review_count: 15,
    active: true,
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'store-2',
    name: 'Harbor Fresh',
    description:
      'Premium seafood flown in daily and hand-cut steaks from heritage breeds. For the home cook who demands restaurant-quality proteins.',
    image_url: '/images/stores/harbor-fresh.jpg',
    serviced_zips: ['10001', '10004', '10005'],
    department_type_ids: ['dept-4', 'dept-7', 'dept-5'],
    rating: 4.6,
    review_count: 12,
    active: true,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'store-3',
    name: 'Sunrise Bakery & Pantry',
    description:
      'Artisan baked goods made from scratch every morning using stone-milled flour and European-style butter. The aroma alone is worth the visit.',
    image_url: '/images/stores/sunrise-bakery.jpg',
    serviced_zips: ['10001', '10002', '10006'],
    department_type_ids: ['dept-3', 'dept-5', 'dept-8'],
    rating: 4.9,
    review_count: 20,
    active: true,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// ---------------------------------------------------------------------------
// Grocery items — 24 total (8 per store)
// ---------------------------------------------------------------------------

export const demoItems: GroceryItem[] = [
  // ── Greenleaf Market (store-1) ──────────────────────────────────────────
  {
    id: 'item-1',
    store_id: 'store-1',
    department_type_id: 'dept-1',
    name: 'Organic Avocados',
    description:
      'Perfectly ripe Hass avocados with a rich, buttery texture ideal for toast, guacamole, or salads.',
    image_url: '/images/items/avocados.jpg',
    price: 2.49,
    sale_price: 1.99,
    sale: true,
    measure_type: 'unit',
    weight: null,
    stock: 120,
    provenance_story:
      'Grown on the sun-drenched hillsides of Carpinteria, California, where the Pacific breeze and rich alluvial soil create the perfect conditions for creamy, flavorful Hass avocados. Each fruit is hand-picked at peak maturity.',
    provenance_farm: 'Del Sol Family Farms',
    provenance_location: 'Carpinteria, CA',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-2',
    store_id: 'store-1',
    department_type_id: 'dept-2',
    name: 'Farm Eggs (Dozen)',
    description:
      'Free-range eggs from hens raised on open pasture. Deep orange yolks with an unmistakably rich flavor.',
    image_url: '/images/items/farm-eggs.jpg',
    price: 6.99,
    sale_price: null,
    sale: false,
    measure_type: 'unit',
    weight: null,
    stock: 85,
    provenance_story:
      'Our hens roam freely across rolling meadows in the Hudson Valley, foraging on wild grasses, seeds, and insects. This natural diet produces eggs with vibrant, golden yolks and a taste that factory farms simply cannot replicate.',
    provenance_farm: 'Hilltop Heritage Poultry',
    provenance_location: 'Rhinebeck, NY',
    created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-3',
    store_id: 'store-1',
    department_type_id: 'dept-3',
    name: 'Sourdough Loaf',
    description:
      'Slow-fermented for 48 hours using a 20-year-old starter. Crispy crust with a tangy, open crumb.',
    image_url: '/images/items/sourdough-loaf.jpg',
    price: 7.50,
    sale_price: null,
    sale: false,
    measure_type: 'unit',
    weight: 680,
    stock: 30,
    provenance_story:
      'Baked in small batches at our partner bakehouse in Brooklyn, using a sourdough starter that traces its lineage back two decades. Stone-milled flour from upstate New York wheat gives each loaf its signature depth of flavor.',
    provenance_farm: 'Borough Bread Collective',
    provenance_location: 'Brooklyn, NY',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-4',
    store_id: 'store-1',
    department_type_id: 'dept-5',
    name: 'Local Wildflower Honey',
    description:
      'Raw, unfiltered honey with complex floral notes. Naturally crystallizes over time — a sign of purity.',
    image_url: '/images/items/honey.jpg',
    price: 12.99,
    sale_price: 10.49,
    sale: true,
    measure_type: 'weight',
    weight: 454,
    stock: 45,
    provenance_story:
      'Harvested from hives nestled among wildflower meadows in the Catskill Mountains. Our beekeeper tends each colony by hand, never over-harvesting, ensuring the bees thrive season after season. The result is a honey that tastes like the landscape itself.',
    provenance_farm: 'Catskill Apiary',
    provenance_location: 'Phoenicia, NY',
    created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-5',
    store_id: 'store-1',
    department_type_id: 'dept-4',
    name: 'Grass-Fed Ground Beef',
    description:
      '85/15 lean-to-fat ratio. Rich, beefy flavor from cattle raised entirely on pasture.',
    image_url: '/images/items/ground-beef.jpg',
    price: 9.99,
    sale_price: null,
    sale: false,
    measure_type: 'weight',
    weight: 454,
    stock: 60,
    provenance_story:
      'Raised on lush Pennsylvania pastures with no antibiotics or added hormones. The cattle graze on a rotating mix of clover, ryegrass, and native forbs, producing beef with a clean, robust flavor and a healthier omega-3 profile.',
    provenance_farm: 'Meadowbrook Ranch',
    provenance_location: 'Lancaster, PA',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-6',
    store_id: 'store-1',
    department_type_id: 'dept-6',
    name: 'Cold-Pressed Orange Juice',
    description:
      'Never heated, never concentrated. Pure Valencia orange juice pressed fresh every morning.',
    image_url: '/images/items/orange-juice.jpg',
    price: 8.49,
    sale_price: null,
    sale: false,
    measure_type: 'unit',
    weight: null,
    stock: 40,
    provenance_story:
      'Pressed from tree-ripened Valencia oranges grown in Florida\'s Indian River district, famous for producing the sweetest citrus in the country. Each bottle is cold-pressed within hours of harvest to lock in vitamins and bright, sunny flavor.',
    provenance_farm: 'Indian River Citrus Co-op',
    provenance_location: 'Vero Beach, FL',
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-7',
    store_id: 'store-1',
    department_type_id: 'dept-1',
    name: 'Mixed Berry Medley',
    description:
      'A vibrant mix of blueberries, raspberries, and blackberries — all organic, all bursting with flavor.',
    image_url: '/images/items/mixed-berries.jpg',
    price: 5.99,
    sale_price: 4.99,
    sale: true,
    measure_type: 'weight',
    weight: 340,
    stock: 55,
    provenance_story:
      'Hand-harvested from family farms across the fertile Willamette Valley in Oregon, where cool nights and warm days coax out intense sweetness. Each berry is picked at the peak of ripeness and rushed to cold storage within the hour.',
    provenance_farm: 'Willamette Berry Growers',
    provenance_location: 'Salem, OR',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-8',
    store_id: 'store-1',
    department_type_id: 'dept-5',
    name: 'Artisan Maple Granola',
    description:
      'Crunchy clusters of oats, pecans, and dried cranberries sweetened with pure Vermont maple syrup.',
    image_url: '/images/items/granola.jpg',
    price: 9.49,
    sale_price: null,
    sale: false,
    measure_type: 'weight',
    weight: 400,
    stock: 70,
    provenance_story:
      'Small-batch roasted in a family kitchen in Vermont using oats from a nearby farm and maple syrup tapped from their own sugar bush each spring. No refined sugars, no artificial anything — just honest, crunchy goodness.',
    provenance_farm: 'Sugarwood Kitchen',
    provenance_location: 'Stowe, VT',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ── Harbor Fresh (store-2) ──────────────────────────────────────────────
  {
    id: 'item-9',
    store_id: 'store-2',
    department_type_id: 'dept-4',
    name: 'Atlantic Salmon Fillet',
    description:
      'Skin-on fillet with a gorgeous coral hue. Buttery, delicate flesh perfect for pan-searing or baking.',
    image_url: '/images/items/salmon.jpg',
    price: 14.99,
    sale_price: 12.49,
    sale: true,
    measure_type: 'weight',
    weight: 454,
    stock: 35,
    provenance_story:
      'Line-caught in the cold, pristine waters off the coast of Norway, where strong currents and frigid temperatures produce salmon with exceptional fat marbling and a clean, oceanic flavor. Flown to us within 48 hours of the catch.',
    provenance_farm: 'Nordic Line Fisheries',
    provenance_location: 'Lofoten, Norway',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-10',
    store_id: 'store-2',
    department_type_id: 'dept-4',
    name: 'King Crab Legs',
    description:
      'Wild-caught Alaskan king crab legs, flash-frozen at sea to preserve their sweet, succulent meat.',
    image_url: '/images/items/crab-legs.jpg',
    price: 24.99,
    sale_price: null,
    sale: false,
    measure_type: 'weight',
    weight: 454,
    stock: 15,
    provenance_story:
      'Hauled from the icy depths of the Bering Sea by a third-generation fishing family. Each cluster is flash-frozen on the boat within minutes of harvest, locking in the sweet, briny flavor that has made Alaskan king crab legendary.',
    provenance_farm: 'Bering Star Crab Co.',
    provenance_location: 'Dutch Harbor, AK',
    created_at: new Date(Date.now() - 13 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-11',
    store_id: 'store-2',
    department_type_id: 'dept-4',
    name: 'Wagyu Beef Strips',
    description:
      'A5-grade wagyu sliced thin for hot pot, stir-fry, or a decadent beef tataki.',
    image_url: '/images/items/wagyu.jpg',
    price: 22.99,
    sale_price: null,
    sale: false,
    measure_type: 'weight',
    weight: 227,
    stock: 20,
    provenance_story:
      'Sourced from the Miyazaki prefecture in southern Japan, where cattle are raised with meticulous care — brushed daily, fed a carefully balanced diet, and given ample space to roam. The result is beef with snowflake-like marbling that melts on the tongue.',
    provenance_farm: 'Miyazaki Wagyu Collective',
    provenance_location: 'Miyazaki, Japan',
    created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-12',
    store_id: 'store-2',
    department_type_id: 'dept-4',
    name: 'Fresh Oysters (Half Dozen)',
    description:
      'Briny, plump East Coast oysters with a clean mineral finish. Shucked to order.',
    image_url: '/images/items/oysters.jpg',
    price: 16.99,
    sale_price: 13.99,
    sale: true,
    measure_type: 'unit',
    weight: null,
    stock: 25,
    provenance_story:
      'Cultivated in the cool, tidal bays of Wellfleet, Massachusetts, where the mix of fresh and salt water gives each oyster its signature brininess and a delicate, cucumber-like finish. Harvested and shipped the same day.',
    provenance_farm: 'Wellfleet Shellfish Co.',
    provenance_location: 'Wellfleet, MA',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-13',
    store_id: 'store-2',
    department_type_id: 'dept-4',
    name: 'Smoked Trout',
    description:
      'Hot-smoked over applewood with a silky, flaky texture. Outstanding on crackers or in salads.',
    image_url: '/images/items/smoked-trout.jpg',
    price: 11.49,
    sale_price: null,
    sale: false,
    measure_type: 'weight',
    weight: 227,
    stock: 30,
    provenance_story:
      'Rainbow trout raised in spring-fed ponds in the Appalachian foothills, then slowly smoked over applewood chips by a smokehouse that has perfected the craft over four generations. The result is a delicate, golden fillet with a whisper of sweetness.',
    provenance_farm: 'Blue Ridge Smokehouse',
    provenance_location: 'Asheville, NC',
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-14',
    store_id: 'store-2',
    department_type_id: 'dept-4',
    name: 'Jumbo Shrimp (1 lb)',
    description:
      'Wild Gulf shrimp — sweet, firm, and versatile. Perfect for grilling, scampi, or cocktail.',
    image_url: '/images/items/shrimp.jpg',
    price: 13.99,
    sale_price: null,
    sale: false,
    measure_type: 'weight',
    weight: 454,
    stock: 50,
    provenance_story:
      'Netted from the warm, nutrient-rich waters of the Gulf of Mexico by a cooperative of small-boat shrimpers who use turtle-excluder devices to protect marine life. Flash-frozen dockside for peak freshness.',
    provenance_farm: 'Gulf Coast Shrimp Co-op',
    provenance_location: 'Biloxi, MS',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-15',
    store_id: 'store-2',
    department_type_id: 'dept-4',
    name: 'Yellowfin Tuna Steaks',
    description:
      'Sashimi-grade tuna with a deep ruby color. Sear it rare for the best experience.',
    image_url: '/images/items/tuna-steaks.jpg',
    price: 18.99,
    sale_price: null,
    sale: false,
    measure_type: 'weight',
    weight: 340,
    stock: 22,
    provenance_story:
      'Pole-and-line caught in the deep blue waters of the Pacific, south of Hawaii. This sustainable method targets only mature yellowfin, resulting in firm, jewel-toned steaks with a mild, meaty flavor that rivals the finest sushi bars.',
    provenance_farm: 'Pacific Pole & Line',
    provenance_location: 'Kona, HI',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-16',
    store_id: 'store-2',
    department_type_id: 'dept-4',
    name: 'Lobster Tails (2-pack)',
    description:
      'Cold-water lobster tails with firm, sweet meat. Broil with butter for an effortless feast.',
    image_url: '/images/items/lobster-tails.jpg',
    price: 24.99,
    sale_price: 21.99,
    sale: true,
    measure_type: 'unit',
    weight: null,
    stock: 18,
    provenance_story:
      'Trapped in the frigid Atlantic waters off the rocky coast of Maine by lobstermen who have worked these same grounds for generations. Cold water means slow growth, which means denser, sweeter meat in every tail.',
    provenance_farm: 'Penobscot Bay Lobster',
    provenance_location: 'Stonington, ME',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ── Sunrise Bakery & Pantry (store-3) ───────────────────────────────────
  {
    id: 'item-17',
    store_id: 'store-3',
    department_type_id: 'dept-3',
    name: 'Butter Croissants (4-pack)',
    description:
      'Flaky, golden layers made with imported French butter. 72-hour lamination process.',
    image_url: '/images/items/croissants.jpg',
    price: 8.99,
    sale_price: null,
    sale: false,
    measure_type: 'unit',
    weight: null,
    stock: 40,
    provenance_story:
      'Our pastry chef trained in Paris and insists on using AOC-certified Normandy butter, which has a higher butterfat content than American varieties. Each croissant is laminated over three days, folded 27 times, and baked at dawn.',
    provenance_farm: 'Sunrise Bakery',
    provenance_location: 'Manhattan, NY',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-18',
    store_id: 'store-3',
    department_type_id: 'dept-3',
    name: 'French Baguette',
    description:
      'Crisp, shattering crust with a soft, airy interior. Best enjoyed the day it is baked.',
    image_url: '/images/items/baguette.jpg',
    price: 3.99,
    sale_price: null,
    sale: false,
    measure_type: 'unit',
    weight: 350,
    stock: 50,
    provenance_story:
      'Made with only four ingredients — flour, water, salt, and yeast — following the French tradition of simplicity. Our baker uses a steam-injected oven to achieve that signature crackling crust that sings when you squeeze it.',
    provenance_farm: 'Sunrise Bakery',
    provenance_location: 'Manhattan, NY',
    created_at: new Date(Date.now() - 19 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-19',
    store_id: 'store-3',
    department_type_id: 'dept-3',
    name: 'Cinnamon Rolls (6-pack)',
    description:
      'Soft, pillowy rolls swirled with Ceylon cinnamon and topped with a tangy cream cheese glaze.',
    image_url: '/images/items/cinnamon-rolls.jpg',
    price: 11.99,
    sale_price: 9.99,
    sale: true,
    measure_type: 'unit',
    weight: null,
    stock: 35,
    provenance_story:
      'A cherished recipe from our head baker\'s grandmother, updated with high-quality Ceylon cinnamon sourced from a single estate in Sri Lanka. The dough rises overnight for a tender crumb that practically dissolves on your tongue.',
    provenance_farm: 'Sunrise Bakery',
    provenance_location: 'Manhattan, NY',
    created_at: new Date(Date.now() - 17 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-20',
    store_id: 'store-3',
    department_type_id: 'dept-3',
    name: 'Everything Bagels (6-pack)',
    description:
      'Boiled and baked the New York way — chewy, dense, and loaded with sesame, poppy, garlic, onion, and salt.',
    image_url: '/images/items/bagels.jpg',
    price: 7.49,
    sale_price: null,
    sale: false,
    measure_type: 'unit',
    weight: null,
    stock: 60,
    provenance_story:
      'Kettle-boiled in malt-sweetened water before baking on burlap-lined boards, just like the bagel shops of old. Our everything topping blend uses hand-minced garlic and onion flakes that we dehydrate in-house for maximum flavor.',
    provenance_farm: 'Sunrise Bakery',
    provenance_location: 'Manhattan, NY',
    created_at: new Date(Date.now() - 16 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-21',
    store_id: 'store-3',
    department_type_id: 'dept-3',
    name: 'Olive Oil Focaccia',
    description:
      'Dimpled, golden, and drenched in extra-virgin olive oil with flaky sea salt and fresh rosemary.',
    image_url: '/images/items/focaccia.jpg',
    price: 6.99,
    sale_price: null,
    sale: false,
    measure_type: 'unit',
    weight: 450,
    stock: 25,
    provenance_story:
      'Inspired by the bakeries of Liguria, our focaccia uses a high-hydration dough that ferments slowly overnight. We finish it with Sicilian extra-virgin olive oil and rosemary clipped from our rooftop herb garden.',
    provenance_farm: 'Sunrise Bakery',
    provenance_location: 'Manhattan, NY',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-22',
    store_id: 'store-3',
    department_type_id: 'dept-3',
    name: 'Pain au Chocolat (4-pack)',
    description:
      'Buttery, laminated pastry wrapped around two bars of dark Valrhona chocolate.',
    image_url: '/images/items/pain-au-chocolat.jpg',
    price: 9.99,
    sale_price: null,
    sale: false,
    measure_type: 'unit',
    weight: null,
    stock: 30,
    provenance_story:
      'Same meticulous 72-hour lamination as our croissants, but with batons of 64% Valrhona Manjari chocolate tucked inside. The chocolate melts into pockets of bittersweet richness against all those buttery, flaky layers.',
    provenance_farm: 'Sunrise Bakery',
    provenance_location: 'Manhattan, NY',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-23',
    store_id: 'store-3',
    department_type_id: 'dept-3',
    name: 'Sourdough Boule',
    description:
      'A rustic round loaf with a deep, complex tang and a thick, caramelized crust.',
    image_url: '/images/items/sourdough-boule.jpg',
    price: 8.49,
    sale_price: null,
    sale: false,
    measure_type: 'unit',
    weight: 750,
    stock: 20,
    provenance_story:
      'Fermented for 36 hours with our house culture, which we feed daily with a blend of whole wheat and rye flours milled at a small stone mill in the Finger Lakes region. The long ferment develops lactic and acetic acids for a nuanced, lingering tang.',
    provenance_farm: 'Sunrise Bakery',
    provenance_location: 'Manhattan, NY',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-24',
    store_id: 'store-3',
    department_type_id: 'dept-3',
    name: 'Lemon Tarts (4-pack)',
    description:
      'Buttery shortcrust filled with silky Meyer lemon curd and finished with a torched meringue cap.',
    image_url: '/images/items/lemon-tarts.jpg',
    price: 10.99,
    sale_price: 8.99,
    sale: true,
    measure_type: 'unit',
    weight: null,
    stock: 28,
    provenance_story:
      'Made with Meyer lemons from a small grove in Marin County, California, where the mild coastal climate produces fruit with a floral sweetness you will not find in conventional lemons. The curd is cooked slowly in copper pots for a velvety finish.',
    provenance_farm: 'Sunrise Bakery',
    provenance_location: 'Manhattan, NY',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// ---------------------------------------------------------------------------
// Delivery timings
// ---------------------------------------------------------------------------

export const demoTimings: DeliveryTiming[] = [
  { id: 'timing-1', label: '8:00 AM - 10:00 AM', start_hour: 8, end_hour: 10, active: true, created_at: new Date().toISOString() },
  { id: 'timing-2', label: '10:00 AM - 12:00 PM', start_hour: 10, end_hour: 12, active: true, created_at: new Date().toISOString() },
  { id: 'timing-3', label: '12:00 PM - 2:00 PM', start_hour: 12, end_hour: 14, active: true, created_at: new Date().toISOString() },
  { id: 'timing-4', label: '2:00 PM - 4:00 PM', start_hour: 14, end_hour: 16, active: true, created_at: new Date().toISOString() },
  { id: 'timing-5', label: '4:00 PM - 6:00 PM', start_hour: 16, end_hour: 18, active: true, created_at: new Date().toISOString() },
  { id: 'timing-6', label: '6:00 PM - 8:00 PM', start_hour: 18, end_hour: 20, active: true, created_at: new Date().toISOString() },
]

// ---------------------------------------------------------------------------
// Platform fee
// ---------------------------------------------------------------------------

export const demoPlatformFee: PlatformFee = {
  id: 'fee-1',
  fee: 5.0,
  description: 'Standard delivery and platform fee',
  active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// ---------------------------------------------------------------------------
// Order statuses
// ---------------------------------------------------------------------------

export const demoOrderStatuses: OrderStatus[] = [
  { id: 'status-1', name: 'New', color: '#3B82F6', sort_order: 1, created_at: new Date().toISOString() },
  { id: 'status-2', name: 'Assembled', color: '#F59E0B', sort_order: 2, created_at: new Date().toISOString() },
  { id: 'status-3', name: 'Picked Up', color: '#8B5CF6', sort_order: 3, created_at: new Date().toISOString() },
  { id: 'status-4', name: 'Delivered', color: '#10B981', sort_order: 4, created_at: new Date().toISOString() },
  { id: 'status-5', name: 'Canceled', color: '#EF4444', sort_order: 5, created_at: new Date().toISOString() },
]

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export const demoOrders: Order[] = [
  {
    id: 'order-1',
    user_id: 'demo-user-id',
    store_id: 'store-1',
    status_id: 'status-1',
    delivery_timing_id: 'timing-3',
    delivery_date: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    delivery_address: '123 West 14th Street, Apt 4B, New York, NY 10001',
    subtotal: 22.47,
    platform_fee: 5.0,
    total: 27.47,
    notes: 'Please leave with the doorman if I am not home.',
    created_at: new Date(Date.now() - 0.5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'order-2',
    user_id: 'demo-user-id',
    store_id: 'store-2',
    status_id: 'status-2',
    delivery_timing_id: 'timing-5',
    delivery_date: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    delivery_address: '123 West 14th Street, Apt 4B, New York, NY 10001',
    subtotal: 52.97,
    platform_fee: 5.0,
    total: 57.97,
    notes: null,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 0.5 * 86400000).toISOString(),
  },
  {
    id: 'order-3',
    user_id: 'demo-user-id',
    store_id: 'store-3',
    status_id: 'status-4',
    delivery_timing_id: 'timing-1',
    delivery_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    delivery_address: '123 West 14th Street, Apt 4B, New York, NY 10001',
    subtotal: 30.96,
    platform_fee: 5.0,
    total: 35.96,
    notes: 'Ring doorbell twice please.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'order-4',
    user_id: 'demo-user-id',
    store_id: 'store-1',
    status_id: 'status-5',
    delivery_timing_id: 'timing-4',
    delivery_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    delivery_address: '123 West 14th Street, Apt 4B, New York, NY 10001',
    subtotal: 16.48,
    platform_fee: 5.0,
    total: 21.48,
    notes: null,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]

// ---------------------------------------------------------------------------
// Order items
// ---------------------------------------------------------------------------

export const demoOrderItems: OrderItem[] = [
  // Order 1 — Greenleaf Market (New)
  { id: 'oi-1', order_id: 'order-1', item_id: 'item-1', item_name: 'Organic Avocados', quantity: 3, unit_price: 1.99, total_price: 5.97, created_at: new Date(Date.now() - 0.5 * 86400000).toISOString() },
  { id: 'oi-2', order_id: 'order-1', item_id: 'item-3', item_name: 'Sourdough Loaf', quantity: 1, unit_price: 7.50, total_price: 7.50, created_at: new Date(Date.now() - 0.5 * 86400000).toISOString() },
  { id: 'oi-3', order_id: 'order-1', item_id: 'item-8', item_name: 'Artisan Maple Granola', quantity: 1, unit_price: 9.49, total_price: 9.49, created_at: new Date(Date.now() - 0.5 * 86400000).toISOString() },

  // Order 2 — Harbor Fresh (Assembled)
  { id: 'oi-4', order_id: 'order-2', item_id: 'item-9', item_name: 'Atlantic Salmon Fillet', quantity: 2, unit_price: 12.49, total_price: 24.98, created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'oi-5', order_id: 'order-2', item_id: 'item-14', item_name: 'Jumbo Shrimp (1 lb)', quantity: 2, unit_price: 13.99, total_price: 27.98, created_at: new Date(Date.now() - 1 * 86400000).toISOString() },

  // Order 3 — Sunrise Bakery (Delivered)
  { id: 'oi-6', order_id: 'order-3', item_id: 'item-17', item_name: 'Butter Croissants (4-pack)', quantity: 1, unit_price: 8.99, total_price: 8.99, created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'oi-7', order_id: 'order-3', item_id: 'item-19', item_name: 'Cinnamon Rolls (6-pack)', quantity: 1, unit_price: 9.99, total_price: 9.99, created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'oi-8', order_id: 'order-3', item_id: 'item-18', item_name: 'French Baguette', quantity: 3, unit_price: 3.99, total_price: 11.97, created_at: new Date(Date.now() - 4 * 86400000).toISOString() },

  // Order 4 — Greenleaf Market (Canceled)
  { id: 'oi-9', order_id: 'order-4', item_id: 'item-2', item_name: 'Farm Eggs (Dozen)', quantity: 1, unit_price: 6.99, total_price: 6.99, created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'oi-10', order_id: 'order-4', item_id: 'item-8', item_name: 'Artisan Maple Granola', quantity: 1, unit_price: 9.49, total_price: 9.49, created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
]

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export const demoReviews: Review[] = [
  {
    id: 'review-1',
    user_id: 'demo-user-id',
    store_id: 'store-1',
    order_id: 'order-3',
    rating: 5,
    comment:
      'The organic avocados were absolutely perfect — creamy and ripe without a single brown spot. The sourdough loaf had a gorgeous crust and the most wonderful tang. I will be ordering from Greenleaf every week.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'review-2',
    user_id: 'demo-user-id',
    store_id: 'store-2',
    order_id: 'order-2',
    rating: 5,
    comment:
      'The salmon was unbelievably fresh — bright coral color, firm flesh, and it tasted like it came straight off the boat. Harbor Fresh is now my go-to for seafood. The shrimp were enormous and sweet.',
    created_at: new Date(Date.now() - 1.5 * 86400000).toISOString(),
  },
  {
    id: 'review-3',
    user_id: 'demo-user-id',
    store_id: 'store-3',
    order_id: 'order-3',
    rating: 5,
    comment:
      'I have never had croissants this good outside of Paris. Shatteringly flaky on the outside and impossibly buttery inside. The cinnamon rolls were heavenly too. Sunrise Bakery is a treasure.',
    created_at: new Date(Date.now() - 2.5 * 86400000).toISOString(),
  },
  {
    id: 'review-4',
    user_id: 'demo-admin-id',
    store_id: 'store-1',
    order_id: null,
    rating: 4,
    comment:
      'Consistently great produce and the farm eggs are a revelation. Only reason for four stars instead of five is that the delivery window was a little wider than I would have liked. The food itself is impeccable.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]

// ---------------------------------------------------------------------------
// Sorting options
// ---------------------------------------------------------------------------

export const demoSortingOptions: SortingOption[] = [
  { id: 'sort-1', label: 'Price: Low to High', value: 'price-low', category: 'items', created_at: new Date().toISOString() },
  { id: 'sort-2', label: 'Price: High to Low', value: 'price-high', category: 'items', created_at: new Date().toISOString() },
  { id: 'sort-3', label: 'Newest First', value: 'newest', category: 'items', created_at: new Date().toISOString() },
  { id: 'sort-4', label: 'On Sale', value: 'sale', category: 'items', created_at: new Date().toISOString() },
  { id: 'sort-5', label: 'Name: A to Z', value: 'name-asc', category: 'customers', created_at: new Date().toISOString() },
  { id: 'sort-6', label: 'Newest Customers', value: 'newest', category: 'customers', created_at: new Date().toISOString() },
]

// ---------------------------------------------------------------------------
// AI response helpers
// ---------------------------------------------------------------------------

export function getSampleAIResponse(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('recommend') || lower.includes('suggest')) {
    return `Based on what's in season right now, I'd highly recommend the Mixed Berry Medley from Greenleaf Market — the Willamette Valley berries are at peak sweetness this time of year. Pair them with the Artisan Maple Granola and some Farm Eggs for a gorgeous breakfast spread. If you're planning dinner, the Atlantic Salmon Fillet from Harbor Fresh is outstanding right now; the Norwegian catch has been exceptionally fresh this week. For bread lovers, you absolutely cannot go wrong with Sunrise Bakery's Sourdough Boule — the long ferment gives it a depth of flavor that elevates any meal.`
  }

  if (lower.includes('substitut')) {
    return `I noticed the item you're looking for is currently out of stock. Here are some excellent alternatives: If the Organic Avocados are unavailable, I'd suggest the ripe conventional Hass avocados — still great quality at a lower price point. For the Atlantic Salmon, the Yellowfin Tuna Steaks make a wonderful substitute with a similar richness and versatility. If the Sourdough Loaf from Greenleaf is sold out, the Sourdough Boule from Sunrise Bakery uses a similar long-ferment process and has an even more complex tang. I can automatically swap any of these into your cart — just say the word.`
  }

  if (lower.includes('inventory') || lower.includes('stock')) {
    return `Here's my predictive inventory analysis for the week ahead: The Mixed Berry Medley (current stock: 55 units) typically sells through by Thursday based on the last four weeks of data — I'd recommend reordering by Wednesday. Farm Eggs consistently spike on weekends, so the current 85 units should hold through Friday but will need replenishment for Saturday morning demand. The Butter Croissants at Sunrise Bakery sell out almost daily (40 units, average daily sales: 38) — consider increasing the daily bake by 15-20%. King Crab Legs are at only 15 units and tend to see a surge on Fridays; I'd flag this for priority restocking.`
  }

  if (lower.includes('pricing') || lower.includes('sale')) {
    return `Based on current market trends and competitor analysis, here are my dynamic pricing suggestions: The Organic Avocados are priced well at $1.99 (sale) — avocado wholesale costs have dropped 12% this month, so the margin is healthy. Consider putting the Farm Eggs on a weekend promotion at $5.99 to drive basket size. The Wagyu Beef Strips at $22.99 are slightly above the market average of $20.50 for comparable A5 cuts — a modest reduction to $21.49 could increase conversion by an estimated 18%. The Lemon Tarts sale at $8.99 is performing well with a 34% uplift in unit sales since the promotion started.`
  }

  if (lower.includes('description') || lower.includes('product')) {
    return `Here's an enhanced product description: "Our Atlantic Salmon Fillet arrives with a jewel-like coral hue that speaks to its Norwegian heritage — line-caught in the icy fjord waters where strong currents build dense, marbled flesh. The texture is silken and yielding, with a clean ocean sweetness that needs nothing more than a hot pan, a pat of butter, and a squeeze of lemon. Each fillet is individually portioned at one pound, skin-on for that irresistible crispy finish when seared. From the cold waters of Lofoten to your table in under 48 hours — this is seafood the way it was meant to be."`
  }

  if (lower.includes('delivery') || lower.includes('slot')) {
    return `Based on your order history and current delivery logistics, I'd recommend the 10:00 AM - 12:00 PM slot for tomorrow. Here's why: Your area (ZIP 10001) has the lightest delivery traffic during that window, which means your groceries spend less time in transit. For your order containing salmon and shrimp, the morning slot also ensures optimal cold-chain integrity — ambient temperatures are lower and the items arrive at peak freshness. The 4:00 PM - 6:00 PM slot is also available but tends to run 10-15 minutes behind schedule due to afternoon congestion in your neighborhood.`
  }

  return `I'm your AI grocery assistant, here to help make your shopping experience smarter and more enjoyable. I can recommend seasonal items based on what's freshest right now, suggest substitutions when something is out of stock, analyze inventory trends to help stores stay well-stocked, optimize pricing for the best deals, craft compelling product descriptions, and find the ideal delivery slot for your schedule. Just tell me what you need help with, and I'll put my knowledge of all three stores — Greenleaf Market, Harbor Fresh, and Sunrise Bakery — to work for you.`
}

export const demoAIResponses: Record<string, string> = {
  recommendation:
    'This week I am loving the Mixed Berry Medley from Greenleaf Market — the Oregon berries are at peak ripeness and the sale price of $4.99 makes them an incredible value. Pair with the Artisan Maple Granola for a breakfast that feels indulgent but is packed with whole-food goodness.',
  substitution:
    'The Sourdough Loaf from Greenleaf is temporarily out of stock, but the Sourdough Boule from Sunrise Bakery is an excellent swap. It uses a similar long-ferment method with stone-milled Finger Lakes flour, and at $8.49 it is only a dollar more for a larger loaf with an even deeper tang.',
  inventory:
    'Stock alert: Butter Croissants at Sunrise Bakery are down to 40 units and historically sell out by 11 AM on weekends. Farm Eggs at Greenleaf are at 85 units — comfortable for midweek but will need replenishment before Saturday. King Crab Legs at Harbor Fresh are critically low at 15 units with a Friday demand spike expected.',
  pricing:
    'Dynamic pricing opportunity: Organic Avocados wholesale cost dropped 12% this month. Current sale price of $1.99 maintains a 38% margin. Recommend extending the promotion through the weekend to drive foot traffic. Wagyu Beef Strips could see an 18% conversion boost with a modest $1.50 price reduction to $21.49.',
  description:
    'Freshly baked every morning at Sunrise Bakery, these Butter Croissants are a masterclass in patience. Seventy-two hours of careful lamination with AOC-certified Normandy butter yields 27 gossamer layers that shatter at first bite and melt into pure, golden richness. Close your eyes and you are in a Parisian boulangerie.',
  delivery_slot:
    'For your ZIP code 10001, the 10:00 AM - 12:00 PM window offers the best combination of route efficiency and cold-chain freshness. Morning deliveries in your area average 8 minutes faster than afternoon slots, and perishable items like the salmon and shrimp in your cart will arrive at optimal temperature.',
}
