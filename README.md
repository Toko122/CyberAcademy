This is a Next.js application backed by standard PostgreSQL through the official `pg` driver.

## Database and authentication setup

1. Copy `.env.example` to `.env.local` and set `DB_URL`, optional `DB_SSL`, a random `JWT` of at least 32 characters, and all three `CLOUDY_*` values.
2. Run `database/schema.sql` as the database owner.
3. Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` temporarily, then run `npm run create-admin`.
4. Remove `ADMIN_PASSWORD` from the runtime environment after provisioning. The running application reads administrator credentials only from `public.users`.

`DB_SSL=disable` is appropriate for a trusted local connection. Use `DB_SSL=require` only when the database endpoint presents a certificate trusted by Node.js. The application does not disable certificate verification.

Uploaded images are validated server-side and stored in Cloudinary. JPEG, PNG, WebP, and GIF files up to 5 MB are accepted. PostgreSQL stores only their public URLs. The application server must be allowed outbound HTTPS access to Cloudinary. Existing external URLs remain in content rows; move legacy assets to Cloudinary before retiring their former host.

Admin content mutations validate all form fields before uploading. If an upload succeeds but the database write fails, the new Cloudinary asset is deleted to avoid orphaned files. Provider and database errors are logged on the server with stable public error codes; secrets and provider details are not returned to the browser.

For a database previously used through Supabase, keep the same PostgreSQL server when possible, apply `database/schema.sql`, review `database/migrations/001_supabase_to_standard_postgresql.sql`, provision an administrator, test the new login, and only then retire the old authentication and storage services.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to optimize the Inter and Roboto Mono fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
