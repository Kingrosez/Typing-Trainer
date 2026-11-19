# Typing Trainer Desktop Application

A desktop application for improving typing speed and accuracy with interactive exercises and analytics.

## Project Structure

```
src/
├── app/
│   └── providers/
│       ├── AppProviders.tsx      # Main provider component with routing
│       └── ThemeProvider.tsx     # Theme management
├── components/
│   └── layout/
│       └── AppShell.tsx          # Main application shell
├── features/
│   └── typing-test/
│       ├── TypingTest.tsx        # Main typing test component
│       ├── TypingTestSelector.tsx # Test selection interface
│       ├── TypingTestRoute.tsx   # Route handler for typing tests
│       ├── config.ts             # Configuration file
│       ├── index.ts              # Export file
│       └── __tests__/
│           ├── TypingTest.test.tsx
│           └── index.test.ts
├── features/
│   └── dashboard/
│       └── Dashboard.tsx         # Main dashboard with navigation
└── styles/
    └── globals.css               # Global CSS styles
```

## Features Implemented

### Typing Test Feature
- **Timed Typing Tests**: Users can select test durations (15, 30, 60, or 120 seconds)
- **Real-time Metrics**: Shows WPM (Words Per Minute), accuracy percentage, and error count
- **Visual Feedback**: Color-coded text highlighting to show correct/incorrect characters
- **Custom Text Support**: Ability to use custom text for typing practice
- **Performance Analytics**: Detailed results display at the end of each test

### Dashboard
- Main navigation interface with quick access to different features
- Recent activity tracking
- Responsive design with dark mode support

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run tauri:dev
```

3. Build for production:
```bash
npm run tauri:build
```

## Testing

Run the test suite:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

Generate coverage report:
```bash
npm run test:coverage
```

## Dependencies

- React 19.x
- React Router DOM 6.x
- Tauri 2.x
- Tailwind CSS 4.x
- TypeScript 5.x

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.