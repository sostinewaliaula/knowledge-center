# Toast Notification System

A custom, well-styled toast notification system for the Knowledge Center LMS.

## Features

- ✅ 4 toast types: `success`, `error`, `warning`, `info`
- ✅ Auto-dismiss after specified duration (default: 5 seconds)
- ✅ Manual close button
- ✅ Smooth animations
- ✅ Stack multiple toasts
- ✅ Global state management with React Context
- ✅ Easy-to-use hook API

## Usage

### Basic Usage

Import the `useToast` hook in any component:

```tsx
import { useToast } from '../contexts/ToastContext';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleAction = async () => {
    try {
      await someApiCall();
      showSuccess('Operation completed successfully!');
    } catch (error) {
      showError('Something went wrong!');
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

### Toast Methods

- `showSuccess(message, duration?)` - Green toast with checkmark icon
- `showError(message, duration?)` - Red toast with alert icon
- `showWarning(message, duration?)` - Yellow toast with warning icon
- `showInfo(message, duration?)` - Blue toast with info icon
- `showToast(message, type, duration?)` - Generic method for custom types

### Examples

```tsx
// Success toast (auto-dismiss after 5 seconds)
showSuccess('User created successfully!');

// Error toast (auto-dismiss after 6 seconds - default for errors)
showError('Failed to save changes');

// Custom duration
showWarning('This action cannot be undone', 8000);

// Info toast
showInfo('New features are available');

// Generic toast
showToast('Custom message', 'success', 3000);
```

## Integration

The toast system is already integrated globally via `App.tsx`:

1. **ToastProvider** wraps the entire app
2. **ToastContainer** renders toasts in the top-right corner
3. Available in all components via `useToast` hook

## Styling

Toasts are styled with Tailwind CSS and include:
- Color-coded backgrounds and borders
- Matching icons for each type
- Smooth slide-in/out animations
- Hover effects
- Responsive design

## Current Implementation

Toasts are already integrated into:
- ✅ `UsersPage` - Shows success/error messages for CRUD operations

You can easily add toasts to any other component by importing and using the `useToast` hook.

