# Toast Notifications Setup - Complete Guide

## Overview

This implementation adds comprehensive error handling and success notifications using **Sonner** (a toast library compatible with shadcn) across all CRUD operations in your application.

## What Was Installed

- **sonner** - A modern, responsive toast notification library

## How It Works

### Toast Provider Setup

The `Toaster` component is now initialized in `src/main.jsx` with the following configuration:

```jsx
<Toaster position="top-right" richColors />
```

- **position**: "top-right" - Toasts appear in the top-right corner
- **richColors**: Enables automatic color coding (green for success, red for errors)

## Controllers Updated with Error Handling

All CRUD operations now include structured error handling with toast notifications:

### 1. **Students Controller** (`studentsController.js`)

- ✅ Create Student - Success/Error toast
- ✅ Update Student - Success/Error toast
- ✅ Delete Student - Success/Error toast

### 2. **Departments Controller** (`departmentsController.js`)

- ✅ Create Department - Success/Error toast
- ✅ Update Department - Success/Error toast
- ✅ Delete Department - Success/Error toast

### 3. **Programs Controller** (`programController.js`)

- ✅ Create Program - Success/Error toast
- ✅ Update Program - Success/Error toast
- ✅ Delete Program - Success/Error toast

### 4. **Admins Controller** (`adminController.js`)

- ✅ Create Admin - Success/Error toast
- ✅ Delete Admin - Success/Error toast

### 5. **Colleges Controller** (`collegesController.js`)

- ✅ Create College - Success/Error toast
- ✅ Update College - Success/Error toast
- ✅ Delete College - Success/Error toast

### 6. **Questions Controller** (`questionsController.js`)

- ✅ Create Question - Success/Error toast
- ✅ Update Question - Success/Error toast
- ✅ Delete Question - Success/Error toast
- ✅ Add Question to Paper Set - Success/Error toast
- ✅ Remove Question from Paper Set - Success/Error toast
- ✅ Publish Bank Question - Success/Error toast
- ✅ Unpublish Bank Question - Success/Error toast

### 7. **Cycles Controller** (Part of questionsController.js)

- ✅ Create Cycle - Success/Error toast
- ✅ Change Cycle Status - Success/Error toast
- ✅ Delete Cycle - Success/Error toast
- ✅ Publish Cycle - Success/Error toast
- ✅ Unpublish Cycle - Success/Error toast

## Toast Message Format

### Success Toast Example:

```javascript
toast.success("Student created successfully!", {
  description: "John Doe has been added.",
});
```

### Error Toast Example:

```javascript
toast.error("Failed to create student", {
  description: "Please check your input and try again.",
});
```

## Error Handling Pattern

Each mutation follows this consistent pattern:

```javascript
export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentData) => {
      const response = await api.post(STUDENT_API.CREATE_STUDENT, studentData);
      return response.data ?? response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student created successfully!", {
        description: `${data.first_name} ${data.last_name} has been added.`,
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create student";
      const details =
        error?.response?.data?.error ||
        "Please check your input and try again.";
      toast.error(message, {
        description: details,
      });
      console.error("Failed to create student:", error);
    },
  });
}
```

## Error Extraction Logic

The error handling intelligently extracts error messages from the API response:

1. **Primary**: `error?.response?.data?.message` - Custom error message from server
2. **Secondary**: `error?.message` - Generic error message
3. **Fallback**: Default message like "Failed to create student"

For details:

1. **Primary**: `error?.response?.data?.error` - Detailed error explanation
2. **Fallback**: Generic instruction like "Please check your input and try again."

## Usage in Components

Components don't need to manually handle toasts anymore. When calling mutations:

```javascript
const createStudentMutation = useCreateStudent();

// Simply call mutate - toasts are handled automatically
createStudentMutation.mutate(
  {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    // ... other fields
  },
  {
    onSuccess: (data) => {
      // Optional: Additional component-specific logic
      setForm(EMPTY_FORM);
      onOpenChange(false);
    },
  },
);
```

## Toast Customization

If you need to customize toasts further, modify `src/main.jsx`:

```jsx
<Toaster
  position="top-right"
  richColors
  theme="light" // or "dark"
  duration={4000} // Custom duration in ms
/>
```

## Available Toast Types

- `toast.success()` - Green toast for successful operations
- `toast.error()` - Red toast for errors
- `toast.warning()` - Yellow toast for warnings
- `toast.info()` - Blue toast for information
- `toast.loading()` - For async operations
- `toast.promise()` - For promise-based operations

## Testing

All changes have been tested with a production build. The application successfully compiles with:

```bash
npm run build
```

No console warnings or errors related to toast notifications.
