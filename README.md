# Feedback Form App

A modern feedback collection application built with Nuxt 3, featuring user authentication, emoji-based feedback ratings, and multilingual support (English/Finnish).

## Features

- 🔐 **User Authentication**: Registration and login with password hashing
- 😊 **Emoji Feedback**: Five emoji options (Poor, Fair, Satisfactory, Good, Excellent)
- 📝 **Free Text Feedback**: Optional detailed feedback with scrollable text area
- 🌍 **Multilingual Support**: English and Finnish language support
- 🔒 **Privacy Controls**: Users can choose to make feedback public or private
- 📧 **Contact Preferences**: Users can opt-in to be contacted by the studio
- 💾 **Database Persistence**: PGlite database for data storage
- 🎨 **Modern UI**: Clean, responsive design with toast notifications
- 👤 **User Management**: One feedback per user with name display for public feedback

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Database**: [PGlite](https://github.com/electric-sql/pglite) (PostgreSQL in WebAssembly)
- **Authentication**: Cookie-based sessions with bcrypt password hashing
- **Internationalization**: [@nuxtjs/i18n](https://i18n.nuxtjs.org/)
- **Language**: TypeScript
- **Styling**: CSS with responsive design

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/bojanmitic/feedback.git
cd feedback
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
feedback/
├── components/          # Vue components
│   ├── ConsentCheckboxes.vue
│   ├── EmojiSelector.vue
│   ├── FeedbackForm.vue
│   ├── FreeTextInput.vue
│   ├── LanguageSwitcher.vue
│   ├── LoginForm.vue
│   ├── RegistrationForm.vue
│   └── Toast.vue
├── composables/        # Vue composables
│   ├── useAuth.ts      # Authentication logic
│   └── useToast.ts     # Toast notifications
├── locales/            # Translation files
│   ├── en.json         # English translations
│   └── fi.json         # Finnish translations
├── pages/              # Nuxt pages
│   ├── index.vue       # Home page (registration/feedback)
│   ├── login.vue       # Login page
│   └── register.vue    # Registration page
├── server/             # Server-side code
│   ├── api/
│   │   ├── auth/       # Authentication endpoints
│   │   │   ├── login.post.ts
│   │   │   ├── logout.post.ts
│   │   │   ├── me.get.ts
│   │   │   └── register.post.ts
│   │   ├── feedback/   # Feedback endpoints
│   │   │   ├── me.get.ts
│   │   │   └── submit.post.ts
│   │   └── debug/      # Debug endpoints
│   │       └── users.get.ts
│   ├── plugins/        # Nitro plugins
│   │   └── db-init.ts  # Database initialization
│   └── utils/
│       └── db.ts       # Database connection and schema
├── assets/             # Static assets
│   └── css/
│       └── main.css    # Global styles
└── public/
    └── emojis/         # Emoji SVG files
```

## Database Schema

### Users Table

- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `password` (VARCHAR(255) NOT NULL) - bcrypt hashed
- `phone` (VARCHAR(50))
- `first_name` (VARCHAR(100))
- `last_name` (VARCHAR(100))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Feedback Table

- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER UNIQUE REFERENCES users(id))
- `emoji` (TEXT NOT NULL)
- `emoji_label` (TEXT NOT NULL)
- `free_text` (TEXT)
- `is_public` (BOOLEAN DEFAULT false)
- `wants_contact` (BOOLEAN DEFAULT false)
- `contact_info` (TEXT)
- `agreed_to_privacy` (BOOLEAN DEFAULT false)
- `user_ip` (TEXT)
- `created_at` (TIMESTAMP)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ firstName, lastName, email, password, phone? }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/logout` - Logout user

### Feedback

- `GET /api/feedback/me` - Get current user's feedback
  - Returns: `{ success, hasFeedback, feedback? }`
- `POST /api/feedback/submit` - Submit or update feedback
  - Body: `{ emoji, emojiLabel, freeText?, isPublic, wantsContact, contactInfo?, agreedToPrivacy }`
  - Returns: `{ success, feedback }`

### Debug

- `GET /api/debug/users` - Get all users (for debugging)

## Usage

### Registration

1. Navigate to the home page
2. Fill in first name, last name, email, password, and optional phone
3. Click "Register"
4. You'll be automatically logged in and redirected to the feedback form

### Login

1. Click "Login here" or navigate to `/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the feedback form

### Submitting Feedback

1. Select an emoji rating (Poor, Fair, Satisfactory, Good, or Excellent)
2. Optionally provide detailed feedback in the text area
3. Choose privacy settings:
   - Make feedback public (shows your name)
   - Opt-in for contact from the studio
4. Agree to the privacy policy
5. Click "Send feedback"
6. View your confirmation screen
7. Click "Done" to logout

### Viewing Feedback

- If you've already submitted feedback, you'll see your confirmation screen immediately
- Public feedback displays the user's name (First Name + Last Initial, e.g., "Linda K.")
- Only one feedback submission is allowed per user

## Configuration

### Language Settings

Languages are configured in `nuxt.config.ts`:

- Default: English
- Available: English (en), Finnish (fi)
- Strategy: `prefix_except_default`

### Database

The database is automatically initialized on server startup via `server/plugins/db-init.ts`. Data is stored in `.data/pglite/` directory.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

### Environment Variables

No environment variables are currently required. The app runs in development mode by default.

## Features in Detail

### Emoji Selection

- Five emoji options with color-coded backgrounds
- Selected emoji is highlighted
- Responsive design for mobile and desktop

### Toast Notifications

- Success messages for registration, login, and feedback submission
- Error messages for failed operations
- Auto-dismiss after 3 seconds

### Responsive Design

- Mobile-first approach
- Adapts to different screen sizes
- Touch-friendly interface

## Security

- Passwords are hashed using bcrypt (10 rounds)
- HTTP-only cookies for session management
- Input validation on server-side
- SQL injection protection via parameterized queries
