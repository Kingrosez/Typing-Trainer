# Typing Test Feature

This feature provides a comprehensive typing test functionality with the following capabilities:

## Features

- **Timed Typing Tests**: Users can select test durations (15, 30, 60, or 120 seconds)
- **Real-time Metrics**: Shows WPM (Words Per Minute), accuracy percentage, and error count
- **Visual Feedback**: Color-coded text highlighting to show correct/incorrect characters
- **Custom Text Support**: Ability to use custom text for typing practice
- **Performance Analytics**: Detailed results display at the end of each test

## Components

1. `TypingTest.tsx` - Main typing test component with real-time feedback
2. `TypingTestSelector.tsx` - Test selection interface
3. `TypingTestRoute.tsx` - Route handler for typing tests
4. `__tests__/TypingTest.test.tsx` - Unit tests

## Usage

### Starting a Test

1. Navigate to the dashboard
2. Click on "Typing Tests"
3. Select test duration
4. Choose whether to use custom text or sample text
5. Start typing to begin the test

### Metrics Displayed

- **Time Left**: Countdown timer for the test duration
- **WPM (Words Per Minute)**: Calculated based on correct characters typed
- **Accuracy**: Percentage of correctly typed characters
- **Errors**: Number of incorrect characters typed

### Visual Feedback

- Green text: Correctly typed characters
- Red text with background: Incorrectly typed characters
- Blue highlight: Current character to type

## Technical Details

The typing test uses React hooks for state management and provides real-time feedback as users type. The WPM calculation is based on the standard formula:

```
WPM = (number of characters typed / 5) / minutes
```

Accuracy is calculated by comparing user input with the test text character-by-character.
