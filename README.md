# AI Groceries

An AI-powered online grocery delivery platform built with Next.js 15, React 19, Supabase, Claude API, and Stripe. Designed around "The Harvest Table" philosophy -- abundant, warm, and grounded in real food provenance.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fquantnexusai%2Fai-groceries&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,ANTHROPIC_API_KEY&project-name=ai-groceries&repository-name=ai-groceries)

<!-- Screenshots -->
<!-- ![Homepage](docs/screenshots/homepage.png) -->
<!-- ![Store Page](docs/screenshots/store.png) -->
<!-- ![Cart](docs/screenshots/cart.png) -->

---

## Features

- **ZIP-based store search** -- find local grocery stores by ZIP code with GIN-indexed `serviced_zips` for fast lookups
- **Per-store cart grouping** -- items are grouped by store, creating separate orders for each store in your cart
- **AI-powered grocery experience** -- 6 distinct AI contexts powered by Claude: recommendation, substitution, inventory, pricing, description, and delivery_slot
- **Provenance Drawer** -- bottom sheet UI revealing farm stories, sourcing details, and origin information for products
- **Delivery slot picker** -- choose from 6 two-hour delivery windows per store
- **Simplified Stripe checkout** -- streamlined payment flow without Connect complexity
- **Demo mode** -- fully functional demo with 3 stores, 24 items, and 10 departments -- no API keys required
- **12 database tables with RLS** -- complete Supabase schema with row-level security policies
- **Light-first design** -- "The Harvest Table" palette with Sunbeam, New Leaf, Orchard, and Deep Earth colors
- **Responsive layout** -- mobile-friendly design with Fraunces display and Quicksand body typography

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 15 (App Router)            |
| UI           | React 19 + Tailwind CSS            |
| Database     | Supabase (PostgreSQL + Auth + RLS)  |
| AI           | Anthropic Claude API                |
| Payments     | Stripe                             |
| Icons        | Lucide React                       |
| Fonts        | Fraunces (display) + Quicksand (body) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase project
- A Stripe account
- An Anthropic API key

### 1. Clone the repository

```bash
git clone https://github.com/quantnexusai/ai-groceries.git
cd ai-groceries
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

See the [Environment Variables](#environment-variables) section below for details.

### 4. Set up the database

Run the schema file against your Supabase project:

```bash
# Using the Supabase CLI
supabase db push

# Or manually run the SQL in your Supabase dashboard
# Copy the contents of supabase/schema.sql into the SQL Editor
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable                        | Required | Description                                    |
| ------------------------------- | -------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Your Supabase project URL                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Your Supabase anonymous/public key             |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes      | Your Supabase service role key (server-side)   |
| `STRIPE_SECRET_KEY`             | Yes      | Your Stripe secret key                         |
| `STRIPE_WEBHOOK_SECRET`         | Yes      | Your Stripe webhook signing secret             |
| `ANTHROPIC_API_KEY`             | Yes      | Your Anthropic API key for Claude              |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No  | Stripe publishable key (client-side)           |
| `NEXT_PUBLIC_BASE_URL`          | No       | Base URL for the app (defaults to localhost)    |

When environment variables are not set, the app automatically enters **demo mode**.

---

## Database Setup

The application uses 12 PostgreSQL tables managed through Supabase. The full schema is located at `supabase/schema.sql`.

To set up the database:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Navigate to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase/schema.sql`
4. Execute the SQL to create all tables, indexes, and RLS policies

Key tables include stores, products, departments, orders, order items, carts, cart items, delivery slots, and profiles. The schema includes a GIN index on the `serviced_zips` column for fast ZIP code lookups.

All tables have row-level security (RLS) policies enabled to protect data access.

---

## AI Features

AI Groceries uses 6 specialized Claude AI contexts to enhance the shopping experience:

| Context          | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `recommendation` | Suggests products based on shopping history and preferences     |
| `substitution`   | Recommends alternatives when items are out of stock             |
| `inventory`      | Answers questions about product availability                    |
| `pricing`        | Provides price comparisons and value insights                   |
| `description`    | Generates detailed product descriptions and provenance stories  |
| `delivery_slot`  | Helps users pick optimal delivery windows                       |

Each context is served through a unified API route that selects the appropriate system prompt and parameters for the given task.

---

## Demo Mode

When environment variables are not configured, AI Groceries runs in full demo mode with:

- **3 sample stores** with unique branding and product selections
- **24 grocery items** across multiple categories
- **10 departments** (Produce, Dairy, Bakery, Meat & Seafood, etc.)
- Simulated cart, checkout, and delivery slot functionality
- Placeholder AI responses

Demo mode lets you explore the complete UI and user flow without needing any external service credentials. A demo banner appears at the top of the page to indicate the app is running in demo mode.

---

## Project Structure

```
ai-groceries/
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # Reusable React components
│   └── lib/              # Utilities, Supabase client, helpers
├── supabase/
│   └── schema.sql        # Database schema with RLS policies
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration with custom theme
├── README.md
├── CONTRIBUTING.md
├── STYLE-GUIDE.md
└── LICENSE
```

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
