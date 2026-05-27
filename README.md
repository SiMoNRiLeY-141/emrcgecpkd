# Electrical Maintenance and Research Club (EMRC) Website

Welcome to the official GitHub repository for the Electrical Maintenance and Research Club (EMRC) at Govt. Engineering College, Sreekrishnapuram.

## About

This repository contains the source code and assets for the EMRC GEC Palakkad official website. The website serves as the primary online platform for the club, providing information about its activities, events, committee members, and more.

## Features

- **Responsive Design**: The website is optimized for various screen sizes, ensuring a seamless experience across devices.
- **Dynamic Content**: Content such as news updates, committee member details, and contact information are dynamically loaded from data sources.
- **Pre-rendered Content**: News and committee sections are pre-rendered with periodic revalidation for fast first loads.
- **Contact Section**: Allows visitors to get in touch with the club for inquiries, collaborations, or other purposes.
- **Social Media Integration**: Quick access to the club's social media profiles for updates and announcements.

## Website

View the website at: [EMRC Website](https://emrcgecpkd.vercel.app)

## Environment Variables

Create `.env.local` with the required values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://jfgkhseftiwquikjuhcv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable_key>
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.jfgkhseftiwquikjuhcv.supabase.co:5432/postgres
```

## Database Setup

This project uses Supabase for database storage.

> [!IMPORTANT]
> **Supabase API Grant Breaking Change**: In recent Supabase projects, tables in the `public` schema are no longer exposed to the Data (REST and GraphQL) API automatically. To allow the Next.js API routes (using the client-side `anon` role) to query and insert data, explicit SQL `GRANT` privileges must be set up.

To set up the database and permissions:

1. Navigate to the **SQL Editor** in your Supabase Dashboard.
2. Open the [schema.sql](file:///d:/Gits/emrcgecpkd/schema.sql) file located in the root of this project.
3. Copy and execute the SQL commands in the Supabase SQL Editor. This will:
   - Create the necessary tables (`news`, `committee`, `newsletter_subscribers`, and `maintenance_requests`).
   - Enable Row Level Security (RLS) and configure the access control policies.
   - Explicitly grant privileges (`GRANT SELECT`, `GRANT INSERT`) to the `anon`, `authenticated`, and `service_role` database roles so they are exposed to the API correctly.

## License

All rights reserved. The content of this repository is the property of the Electrical Maintenance and Research Club (EMRC) at Govt. Engineering College, Sreekrishnapuram. Unauthorized copying, distribution, or modification of any files is strictly prohibited without prior written permission from the club.

## Contact

For questions, feedback, or inquiries about the EMRC website, feel free to contact us:

- **Email**: [emrc@gecskp.ac.in](mailto:emrc@gecskp.ac.in)
- **GitHub**: [github.com/SiMoNRiLeY-141](https://github.com/SiMoNRiLeY-141)

Visit our social media:

- [Instagram](https://instagram.com/emrc_gec)
- [LinkedIn](https://linkedin.com/company/emrc-gecpkd)
