# FinAI: Your AI Budgeting Ally

An AI-powered personal finance management application built with Next.js, featuring intelligent budget analysis, spending predictions, and personalized financial recommendations powered by Google's Gemini AI.

## Features

- 📊 **Smart Dashboard**: Real-time overview of your financial health
- 🤖 **AI-Powered Insights**: Intelligent budget analysis and recommendations using Google Gemini
- 💰 **Budget Planning**: Create and manage category-based budgets
- 📈 **Spending Predictions**: AI-driven forecasts of future spending patterns
- 🔔 **Smart Alerts**: Proactive notifications about overspending risks
- 💬 **AI Assistant**: Conversational interface for financial guidance
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🌙 **Dark Mode**: Eye-friendly dark theme

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AI**: Google Gemini (via Genkit)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod

## Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm
- Google Gemini API Key

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd fpti
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

To get a Gemini API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the key and paste it into your `.env` file

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. First-time setup

On first launch, you'll be guided through an onboarding process where the AI assistant will help you set up your budget and financial goals.

## Project Structure

```
fpti/
├── src/
│   ├── ai/                      # AI integration and flows
│   │   ├── genkit.ts           # Genkit AI configuration
│   │   └── flows/              # AI workflow definitions
│   ├── app/                    # Next.js app router pages
│   │   ├── (main)/            # Main app layout group
│   │   │   ├── assistant/     # AI assistant page
│   │   │   ├── budget/        # Budget planning page
│   │   │   ├── settings/      # Settings page
│   │   │   └── transactions/  # Transactions page
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── assistant/         # Chat interface components
│   │   ├── budget/            # Budget planning components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── layout/            # Layout components
│   │   ├── onboarding/        # Onboarding flow
│   │   ├── transactions/      # Transaction components
│   │   └── ui/                # Reusable UI components (shadcn/ui)
│   ├── context/               # React context providers
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities and data
│       ├── data.ts           # Mock data
│       ├── types.ts          # TypeScript types
│       └── utils.ts          # Utility functions
├── .env                       # Environment variables (not in git)
├── .env.example              # Example environment variables
├── components.json           # shadcn/ui configuration
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository in Vercel
3. Add your environment variables in the Vercel dashboard:
   - `GEMINI_API_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Other Platforms

This app can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js plugin
- **Railway**: Direct deployment from Git
- **AWS Amplify**: Configure build settings for Next.js
- **Docker**: Create a Dockerfile (see Next.js docs)

Make sure to set the `GEMINI_API_KEY` environment variable in your deployment platform.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |

## AI Features

The application uses Google's Gemini AI through Genkit to provide:

1. **Budget Analysis**: Analyzes spending patterns and suggests adjustments
2. **Transaction Explanations**: Provides detailed insights into transactions
3. **AI Recommendations**: Generates personalized financial advice
4. **Onboarding Guide**: Conversational setup for new users
5. **Overspending Alerts**: Proactive warnings about budget concerns

## Customization

### Adding New UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/). To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

### Modifying AI Flows

AI flows are located in `src/ai/flows/`. Each flow is a self-contained module that:
- Defines input/output schemas using Zod
- Creates prompts for the AI model
- Exports functions for use in the app

### Styling

- Global styles: `src/app/globals.css`
- Tailwind configuration: `tailwind.config.ts`
- CSS variables for theming: Defined in `globals.css`

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Delete `.next` folder and `node_modules`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

### AI Features Not Working

- Verify your `GEMINI_API_KEY` is set correctly in `.env`
- Check that the API key has the necessary permissions
- Ensure you're not exceeding API rate limits

### Type Errors

- Run `npm run lint` to check for errors
- Ensure `tsconfig.json` paths are correct
- Check that all dependencies are installed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review the [Next.js documentation](https://nextjs.org/docs)
- Review the [Genkit documentation](https://firebase.google.com/docs/genkit)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Icons from [Lucide](https://lucide.dev/)
