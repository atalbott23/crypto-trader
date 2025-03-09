<<<<<<< HEAD
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/731c0de4-8306-4ab4-ba3e-7273b52512e4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/731c0de4-8306-4ab4-ba3e-7273b52512e4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

=======
# Crypto Trader

A comprehensive cryptocurrency trading platform with automated trading strategies and portfolio management.

## Project Structure

This project is organized into two main components:

- **Frontend**: React-based UI for visualizing portfolio, selecting trading strategies, and managing settings
- **Backend**: FastAPI service that handles trading logic, exchange API connections, and data processing

## Development Workflow

### Frontend Development (via Lovable)

The frontend is managed through Lovable.dev and also available in the `/frontend` directory.

**URL**: https://lovable.dev/projects/731c0de4-8306-4ab4-ba3e-7273b52512e4

**Options for frontend development:**

1. **Use Lovable.dev** (recommended for UI changes)
   - Visit the [Lovable Project](https://lovable.dev/projects/731c0de4-8306-4ab4-ba3e-7273b52512e4)
   - Changes made via Lovable will be committed automatically to the main branch

2. **Use your preferred IDE** 
   ```sh
   # Navigate to the frontend directory
   cd frontend

   # Install dependencies
   npm i

   # Start the development server
   npm run dev
   ```

### Backend Development

The backend is developed directly through your IDE in the `/backend` directory.

```sh
# Navigate to the backend directory
cd backend

# Install requirements
pip install -r requirements.txt

# Run the development server
python run.py
```

## Git Workflow

To avoid conflicts between frontend and backend development:

1. **Always pull before starting work:**
   ```sh
   git checkout main
   git pull origin main
   ```

2. **For backend changes:**
   - Make changes in your IDE
   - Commit and push directly to main:
   ```sh
   git add .
   git commit -m "Backend: [description]"
   git push origin main
   ```

3. **For frontend changes:**
   - If using Lovable.dev, changes are automatically committed to main
   - After making frontend changes, pull them to your local repo:
   ```sh
   git checkout main
   git pull origin main
   ```

## Technologies

### Frontend
>>>>>>> 59d735c2fb902f6e031428898a631d678e05fae6
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

<<<<<<< HEAD
## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/731c0de4-8306-4ab4-ba3e-7273b52512e4) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
=======
### Backend
- Python
- FastAPI
- Supabase (PostgreSQL)
- Trading APIs (configured in `.env`)

## Deployment

### Frontend
- Open [Lovable](https://lovable.dev/projects/731c0de4-8306-4ab4-ba3e-7273b52512e4) and click on Share -> Publish
- For custom domains: Use Netlify. See [Custom domains documentation](https://docs.lovable.dev/tips-tricks/custom-domain/)

### Backend
- [Placeholder for backend deployment instructions]

## API Integration

- Exchange API keys are managed through the Connect page
- API connections are handled securely through the backend

## Contributing

- Keep frontend and backend work in their respective directories
- Pull changes frequently, especially before starting new work
- Coordinate timing of changes to shared configuration files
>>>>>>> 59d735c2fb902f6e031428898a631d678e05fae6
