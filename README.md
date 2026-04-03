🏡 Betoch-Homes
A modern full-stack real estate application featuring dynamic property listings, user-saved posts, and a real-time integrated chat system.

📖 About the Project
Betoch-Homes is a comprehensive real estate platform designed to connect property seekers with their ideal homes. Transitioning to a modern server-rendered architecture, this application provides a seamless user experience for browsing available real estate, bookmarking favorite properties for later, and communicating directly through an embedded chat interface.

✨ Key Features
Dynamic Property Listings: Browse, filter, and view detailed information about available real estate properties.

Saved Posts: Users can bookmark and save their favorite properties to a personalized dashboard for easy access later.

Integrated Chat System: A real-time messaging interface allowing users to communicate directly regarding specific property listings.

Modern UI/UX: Built with accessible, highly customizable components for a clean and responsive user interface.

Secure Authentication: Robust session management and user authentication.

🛠️ Tech Stack
Framework: Next.js (App Router)

Language: TypeScript

Authentication: Better Auth

UI Components: shadcn/ui + Tailwind CSS

Database / ORM: Prisma (with MongoDB/PostgreSQL)

🚀 Getting Started
Prerequisites
Ensure you have the following installed on your local machine:

Node.js (v18.x or later)

npm, pnpm, or yarn

A running database instance (MongoDB or PostgreSQL)
Installation
Clone the repository

Bash
git clone https://github.com/eyosi168/Betoch-Homes.git
cd Betoch-Homes
Install dependencies

Bash
npm install
Set up Environment Variables
Create a .env file in the root directory and add your specific configuration:

Code snippet
# Database connection string
DATABASE_URL="your_database_connection_string"

# Better Auth Configuration
BETTER_AUTH_SECRET="your_auth_secret_here"
BETTER_AUTH_URL="http://localhost:3000"
Initialize the Database
Push your Prisma schema to your database and generate the client:

Bash
npx prisma db push
npx prisma generate
Run the Development Server

Bash
npm run dev
The application will be available at http://localhost:3000.