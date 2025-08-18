# Testing Documentation

This document provides a comprehensive guide to the testing setup for SonicScribe, a React audio processing application.

## Overview

Our testing setup uses **Vitest + React Testing Library**, providing fast, reliable testing with excellent TypeScript support and native Vite integration.

### Why Vitest + React Testing Library?

- **Native Vite Integration**: No configuration headaches, uses the same bundler as development
- **Fast Execution**: Optimized for speed with hot reload support
- **Jest-Compatible API**: Familiar syntax with easy migration path
- **TypeScript Support**: First-class TypeScript support out of the box
- **Modern Testing**: Built for modern React applications

## Tech Stack

| Tool | Purpose | Version |
|------|---------|---------|
| [Vitest](https://vitest.dev/) | Test runner and framework | ^1.0.4 |
| [React Testing Library](https://testing-library.com/react) | React component testing utilities | ^14.1.2 |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | Custom DOM matchers | ^6.1.4 |
| [@testing-library/user-event](https://github.com/testing-library/user-event) | User interaction simulation | ^14.5.1 |
| [jsdom](https://github.com/jsdom/jsdom) | DOM implementation for testing | ^23.0.1 |
| [@vitest/coverage-v8](https://github.com/vitest-dev/vitest) | Code coverage reporting | Latest |

## Project Structure

```
src/
├── test/
│   ├── setup.ts              # Global test configuration
│   ├── utils.tsx              # Custom testing utilities
│   ├── integration/           # Integration tests
│   │   └── *.test.tsx
│   └── README.md              # This file
├── components/
│   └── **/*.test.tsx          # Component unit tests
├── hooks/
│   └── **/*.test.tsx          # Hook unit tests
└── **/*.test.tsx              # Other unit tests
```

## Running Tests

### Available Scripts

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Modes

- **Single Run**: `npm test` - Runs all tests once and exits
- **Watch Mode**: `npm run test:watch` - Runs tests and watches for changes
- **UI Mode**: `npm run test:ui` - Opens interactive test UI in browser
- **Coverage**: `npm run test:coverage` - Generates detailed coverage reports

## Writing Tests

### Basic Component Test

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### Hook Testing

```tsx
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.count).toBe(0);
  });

  it('updates state when called', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Integration Testing

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppWithProviders } from './test-utils';

describe('Feature Integration', () => {
  it('works end-to-end', async () => {
    const user = userEvent.setup();
    render(<AppWithProviders />);
    
    // Test multiple components working together
    await user.click(screen.getByRole('button', { name: /start/i }));
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });
});
```

## Testing Utilities

### Custom Render Function

The `src/test/utils.tsx` file provides enhanced testing utilities:

```tsx
import { render } from '@/test/utils';

// Renders with all providers (Theme, etc.)
render(<Component />);

// Render with user event setup
const { user } = renderWithUser(<Component />);
await user.click(button);
```

### Audio Testing Helpers

```tsx
import { 
  mockAudioContext,
  createMockAudioFile,
  simulateAudioLoad 
} from '@/test/utils';

// Mock audio context for audio-related tests
mockAudioContext();

// Create mock audio files
const audioFile = createMockAudioFile('test.mp3');

// Simulate audio loading
await simulateAudioLoad(audioElement);
```

### Canvas and Media Mocks

```tsx
import { mockCanvasContext, mockFileReader } from '@/test/utils';

// Mock canvas for waveform tests
mockCanvasContext();

// Mock file reader for upload tests
mockFileReader();
```

## Test Configuration

### Global Setup (`src/test/setup.ts`)

The setup file configures:
- **DOM matchers** from @testing-library/jest-dom
- **AudioContext mocking** for audio components
- **matchMedia mocking** for theme detection
- **ResizeObserver/IntersectionObserver** mocking
- **Automatic cleanup** after each test

### Vite Configuration (`vite.config.ts`)

```ts
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        "dist/",
      ],
    },
  },
});
```

## Coverage Reporting

Coverage reports are generated in multiple formats:
- **Text**: Console output during test runs
- **JSON**: Machine-readable format for CI/CD
- **HTML**: Interactive web reports in `coverage/` directory

### Coverage Thresholds

Current coverage metrics:
- **Statements**: ~53%
- **Branches**: ~77%
- **Functions**: ~35%
- **Lines**: ~53%

## Best Practices

### 1. Test Organization

- **Unit Tests**: Test individual components/hooks in isolation
- **Integration Tests**: Test component interactions and workflows
- **Keep tests close to code**: Place `.test.tsx` files next to components

### 2. Test Naming

```tsx
describe('ComponentName', () => {
  it('does something when condition is met', () => {
    // Test implementation
  });
});
```

### 3. User-Centric Testing

```tsx
// ✅ Good - Test user interactions
await user.click(screen.getByRole('button', { name: /submit/i }));

// ❌ Avoid - Testing implementation details
fireEvent.click(wrapper.find('.submit-button'));
```

### 4. Async Testing

```tsx
// ✅ Good - Proper async handling
await user.click(button);
expect(await screen.findByText('Success')).toBeInTheDocument();

// ✅ Good - Wait for effects
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### 5. Mock Management

```tsx
import { vi } from 'vitest';

// Reset mocks between tests
afterEach(() => {
  vi.clearAllMocks();
});

// Mock external dependencies
vi.mock('external-library', () => ({
  default: vi.fn(),
}));
```

## Audio-Specific Testing

### Mocking Audio APIs

```tsx
// AudioContext is automatically mocked in setup.ts
const audioContext = new AudioContext(); // Uses mock

// Mock audio element methods
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  value: vi.fn(() => Promise.resolve()),
});
```

### Testing Audio Components

```tsx
it('handles audio playback', async () => {
  const { user } = renderWithUser(<AudioPlayer />);
  
  // Simulate audio loading
  const audio = screen.getByTestId('audio-element');
  await simulateAudioLoad(audio);
  
  // Test play functionality
  await user.click(screen.getByRole('button', { name: /play/i }));
  expect(audio.play).toHaveBeenCalled();
});
```

## Keyboard Shortcut Testing

```tsx
it('handles keyboard shortcuts', async () => {
  const { user } = renderWithUser(<Component />);
  
  // Test space bar
  await user.keyboard(' ');
  expect(screen.getByText('Playing')).toBeInTheDocument();
  
  // Test arrow keys
  await user.keyboard('{ArrowLeft}');
  expect(mockPreviousFunction).toHaveBeenCalled();
});
```

## Debugging Tests

### 1. Use screen.debug()

```tsx
import { screen } from '@testing-library/react';

it('debugs the DOM', () => {
  render(<Component />);
  screen.debug(); // Prints current DOM to console
});
```

### 2. Query Debugging

```tsx
// See available queries
screen.logTestingPlaygroundURL();

// Find elements by text with regex
screen.getByText(/partial text/i);

// Use getAllBy* for multiple elements
screen.getAllByRole('button');
```

### 3. Async Debugging

```tsx
// Debug async state changes
await waitFor(() => {
  screen.debug();
  expect(screen.getByText('Expected')).toBeInTheDocument();
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Common Patterns

### Testing Forms

```tsx
it('submits form with valid data', async () => {
  const { user } = renderWithUser(<ContactForm />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/message/i), 'Hello world');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.getByText('Message sent!')).toBeInTheDocument();
});
```

### Testing Error States

```tsx
it('displays error when API fails', async () => {
  vi.mocked(api.getData).mockRejectedValue(new Error('API Error'));
  
  render(<DataComponent />);
  
  expect(await screen.findByText('Error loading data')).toBeInTheDocument();
});
```

### Testing Loading States

```tsx
it('shows loading spinner during data fetch', async () => {
  render(<DataComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event API](https://testing-library.com/docs/user-event/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new tests:

1. **Follow naming conventions**: `ComponentName.test.tsx`
2. **Include both happy and error paths**
3. **Test user interactions, not implementation details**
4. **Keep tests focused and independent**
5. **Update this README** when adding new testing utilities

---

For questions about testing, please check existing tests for examples or reach out to the development team.