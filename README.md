# Easy Lawn Care - Lawn Care Service Platform

A comprehensive lawn care service booking platform built with Next.js, featuring user authentication, service booking, payment processing, and customer management.

## 🌱 Features

- **User Authentication** - Secure authentication with Clerk
- **Service Booking** - Easy booking system for lawn care services
- **Payment Processing** - Integrated Stripe payments
- **User Dashboard** - Manage bookings and addresses
- **Address Management** - Multiple service locations per user
- **Service Tiers** - Various lawn care packages
- **Custom Assessments** - Request custom service evaluations
- **Responsive Design** - Mobile-friendly interface
- **Admin Features** - Service management and booking oversight

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma Accelerate
- **Authentication**: Clerk
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Clerk account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd easy-lawn-care
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   - Database URL (Prisma Accelerate)
   - Clerk keys (development)
   - Stripe keys (test mode)

4. **Database Setup**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── booking/        # Booking flow pages
│   │   ├── dashboard/      # User dashboard
│   │   └── ...
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components
│   │   ├── home/          # Homepage components
│   │   └── ...
│   └── lib/               # Utilities and configurations
├── docs/                  # Documentation
├── prisma/               # Database schema
├── scripts/              # Utility scripts
└── migrations/           # Database migrations
```

## 🗄 Database Models

- **Profile** - User profiles linked to Clerk
- **Service** - Available lawn care services
- **Address** - Customer service locations
- **Booking** - Service appointments
- **CustomAssessment** - Custom service requests
- **BookingMedia** - Before/after photos

## 📱 API Endpoints

### Authentication Required
- `GET/POST /api/addresses` - Address management
- `GET/POST /api/bookings` - Booking management
- `GET/POST /api/assessments` - Custom assessments
- `POST /api/stripe/create-checkout` - Payment processing

### Public
- `GET /api/services` - Available services
- `POST /api/stripe/webhook` - Stripe webhooks

## 🔧 Configuration

### Environment Variables

See `.env.example` for all required environment variables:

- **Database**: Prisma Accelerate connection string
- **Authentication**: Clerk publishable and secret keys
- **Payments**: Stripe publishable, secret, and webhook keys
- **App Configuration**: URLs and feature flags

### Middleware

The application uses Next.js middleware for:
- Route protection (dashboard, booking, etc.)
- Authentication checks
- API route security

## 🚀 Deployment

### Vercel Deployment (Recommended)

This application is optimized for Vercel deployment. See [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
1. Push code to GitHub/GitLab/Bitbucket
2. Import project to Vercel
3. Configure environment variables
4. Deploy!

### Manual Deployment

For other platforms:
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Ensure environment variables are configured
4. Set up reverse proxy (nginx/Apache) if needed

## 📚 Documentation

- [Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT.md)
- [Prisma Setup](docs/PRISMA.md)
- [Stripe Integration](docs/STRIPE.md)
- [Webhook Configuration](docs/WEBHOOK_SETUP.md)
- [Migration Guide](docs/MIGRATION_IMPROVEMENTS.md)

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:push     # Push schema to database
npm run prisma:studio   # Open Prisma Studio
```

### Testing

```bash
# Test payment flow with dummy data
npm run test:payments

# Check database connections
npm run test:db
```

## 🔒 Security Features

- Authentication with Clerk
- API route protection
- CORS configuration
- Environment variable validation
- Secure payment processing with Stripe
- Input validation with Zod schemas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the [documentation](docs/)
2. Review existing issues
3. Create a new issue if needed

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

Built with ❤️ for efficient lawn care service management.

<!-- Minor update to trigger Vercel redeployment -->
