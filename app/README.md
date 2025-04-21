# Shopping Discount Telegram Mini App

This is a Telegram mini app that allows you to get notifications when the price of a product drops below a certain threshold.

## Development

### Setup

```bash
pnpm install
```

## Set the environment variables
Copy the `.env.example` file to `.env` and set the environment variables, the `VITE_SUPABASE_API_URL` is the URL of the Supabase API and the `VITE_SUPABASE_ANON_TOKEN` is the anon token of the Supabase project.

```bash
cp .env.example .env
```

### Run

```bash
pnpm run dev
```
