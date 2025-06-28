# MindRush - Web Application

**MindRush** is a web application developed in Next.js that offers a complete platform for quiz creation and management for educators.

## 🌐 Features

- Administrative interface for quiz creation and management
- Authentication system with Google OAuth
- Dashboard for tracking results and statistics
- QR Code generation for game access
- Real-time communication with Pusher
- PDF analysis system with AI for automatic question generation
- Modern interface with Tailwind CSS
- Light and dark theme support

## 🛠️ Technologies Used

- **Next.js**: React framework for web development
- **TypeScript**: Typed programming language
- **Tailwind CSS**: Utility CSS framework
- **ShadCN/UI**: React component library
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **PostgreSQL**: Relational database
- **NextAuth.js**: Authentication for Next.js
- **Pusher**: Real-time communication
- **React Query**: State management and cache
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Recharts**: Chart library
- **OpenAI**: AI integration for PDF analysis

## 📋 Prerequisites

Before running the application, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (included with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (version 13 or higher)
- Code editor (recommended: [VS Code](https://code.visualstudio.com/))

## 🚀 How to Run the Application

### 1. Clone the repository and navigate to the web directory

```bash
cd code/web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database

Start PostgreSQL using Docker:

```bash
./start-database.sh
```

### 4. Set up environment variables

Copy the `.env.example` file to `.env` and configure the necessary variables:

```bash
cp .env.example .env
```

Then, edit the `.env` file with your specific settings. See the section [Setting up authentication with Google OAuth](#setting-up-authentication-with-google-oauth) for Google credentials.

### 5. Run the database migrations

```bash
npm run db:push
```

### 6. Run the application

#### To run in development mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

#### To run in production mode

```bash
npm run build
npm run start
```

## 🔧 Useful Commands

### Database management

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema to the database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

### Development

```bash
# Check TypeScript types
npm run typecheck

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format:write

# Check formatting
npm run format:check
```

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Performance test (response loading)
npm run test:load
```

---

## Development Guidelines

1. **Avoid using `any` in TypeScript**. If you have doubts about how to type something correctly, ask for help before
   using this generic type.

2. **Do not use `@ts-ignore` or `eslint-disable`**. These commands ignore important errors. If there is an ESLint warning that you cannot resolve, seek support instead of suppressing the warning.

3. **For redirects, use the `useRouter()` hook from Next.js**. Do not use `window.location.href`, as this is not
   appropriate in SPA (Single Page Application) applications.

4. **Avoid reloading the page with `window.location.reload()`**. This practice breaks the fluidity of the SPA and should be
   replaced with reactive and controlled approaches.

5. **Use route constants defined in the `lib/routes.ts` file**. This avoids the use of hard-coded routes, ensures
   consistency between files, and facilitates future maintenance.

6. **With React Hook Form, do not pass form objects as props**. Instead, use the hooks directly
   within the components that need to interact with the form.

7. **Fix all ESLint warnings**. Carefully read each yellow or red underline and understand the problem
   before fixing it. This contributes to cleaner and more reliable code.

8. **Write all code in English**, except for texts displayed to end users (such as labels, messages,
   and titles).

9. **To display messages to the user, use the Sonner component from ShadCN**. Avoid using `alert()`, which is neither
   elegant nor standardized with the rest of the interface.

10. **Always use the components from the ShadCN library when available**. Avoid unnecessarily creating custom
    components. This ensures visual consistency, reduces rework, and speeds up development.

11. **All database entities have automatically inferred types**, available in the `lib/types.ts` file. Use these types to avoid duplicating types and ensure consistency between the database
    and the code.

12. **Avoid using `throw`.** The `/lib/result.ts` file provides an abstraction for handling errors in a
    functional way. Read [this article](https://www.dennisokeeffe.com/blog/2024-07-14-creating-a-result-type-in-typescript)
    about the Result Pattern.

---

## Setting up authentication with Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/cloud-resource-manager)
2. Create a new project
3. Go to **APIs & Services** -> **OAuth consent screen**
4. Set up OAuth consent:
   - Enter `http://localhost:3000` in the "Application homepage" field
   - Under **Scopes for Google APIs**, add the first three available scopes
5. Go to **Credentials** and create a new **OAuth Client ID**:
   - Select "Web application"
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copy the **Client ID** and **Client Secret**

### Create the `.env` file

In the root directory of the project, create a `.env` file and add:

```env
AUTH_GOOGLE_ID=your-client-id
AUTH_GOOGLE_SECRET=your-client-secret
AUTH_SECRET=your-secret-key
```

**Tip**: To generate a secure key for `AUTH_SECRET`, use:

```bash
npx auth secret
```

## 📚 Additional Resources

- [Next.js official documentation](https://nextjs.org/docs)
- [ShadCN/UI documentation](https://ui.shadcn.com/)
- [Drizzle ORM documentation](https://orm.drizzle.team/)
- [NextAuth.js documentation](https://next-auth.js.org/)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
- [React Query documentation](https://tanstack.com/query/latest)
