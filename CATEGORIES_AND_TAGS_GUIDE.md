# Categories and Tags Guide for LMS

## Overview

**Categories** and **Tags** are organizational tools in your LMS that help you classify and organize your content, courses, and learning paths. They make it easier for learners to find relevant content and for administrators to manage large amounts of educational material.

---

## What "X items" Means

When you see **"4 items"** next to a category, it means that category is currently being used by:
- **Courses** (assigned to that category)
- **Content Library items** (files, videos, documents assigned to that category)
- **Learning Paths** (learning paths assigned to that category)

The count is calculated as: `course_count + content_count + learning_path_count`

For example, if a category shows "4 items", it could be:
- 2 courses + 1 content item + 1 learning path = 4 items
- Or any other combination

---

## Categories

### What Are Categories?

Categories are **hierarchical organizational structures** used to group related content. Think of them like folders in a file system.

**Key Features:**
- **Hierarchical**: Categories can have parent categories and subcategories
- **Visual**: Each category can have an icon and color for easy identification
- **Organizational**: Used to group courses, content, and learning paths

### Where Categories Are Used

1. **Courses** (`courses` table)
   - Each course can be assigned to ONE category via `category_id`
   - Used to organize courses by subject/topic
   - Example: "Banking & Finance" category → Contains all banking-related courses

2. **Content Library** (`content_library` table)
   - Each content item (video, document, PDF, etc.) can be assigned to ONE category via `category_id`
   - Used to organize uploaded files and external content
   - Example: "Training Materials" category → Contains all training documents

3. **Learning Paths** (`learning_paths` table)
   - Each learning path can be assigned to ONE category via `category_id`
   - Used to organize learning paths by subject area
   - Example: "Onboarding" category → Contains all onboarding learning paths

### How to Use Categories

#### Creating Categories

1. Go to **Admin Dashboard → Categories & Tags**
2. Click **"New Category"**
3. Fill in:
   - **Name**: e.g., "Banking & Finance"
   - **Description**: Optional description
   - **Parent Category**: Leave empty for top-level, or select a parent for subcategories
   - **Icon**: Choose an emoji or icon name (e.g., "DollarSign", "Users")
   - **Color**: Choose a color for visual identification

#### Assigning Categories

**When Creating/Editing a Course:**
- In the Course Builder, you can assign a category to the course
- This helps learners filter and find courses by topic

**When Uploading Content:**
- In the Content Library, when uploading files or adding URLs, you can select a category
- This helps organize all your training materials

**When Creating Learning Paths:**
- In the Learning Path Creator, you can assign a category
- This groups related learning paths together

### Category Structure Example

```
📁 Banking & Finance (Parent Category)
  ├── 💰 Banking Operations (Subcategory)
  ├── 📊 Financial Analysis (Subcategory)
  └── 🏦 Customer Service (Subcategory)

📁 Insurance (Parent Category)
  ├── 🛡️ Policy Management (Subcategory)
  └── 📋 Claims Processing (Subcategory)
```

---

## Tags

### What Are Tags?

Tags are **flexible labels** that can be applied to multiple items. Unlike categories (one per item), you can assign **multiple tags** to a single course or content item.

**Key Features:**
- **Multiple tags per item**: A course can have many tags
- **Flexible**: Tags can be added/removed easily
- **Searchable**: Help users find content by specific topics or keywords

### Where Tags Are Used

1. **Courses** (`course_tags` table - many-to-many relationship)
   - A course can have multiple tags
   - Tags help describe course topics, difficulty, skills, etc.
   - Example: A course might have tags: "beginner", "video", "certification", "banking"

2. **Content Library** (`content_tags` table - many-to-many relationship)
   - Content items can have multiple tags
   - Tags help describe content type, topic, or purpose
   - Example: A document might have tags: "policy", "pdf", "reference", "compliance"

### How to Use Tags

#### Creating Tags

1. Go to **Admin Dashboard → Categories & Tags**
2. Switch to the **"Tags"** tab
3. Click **"New Tag"**
4. Enter a tag name (e.g., "beginner", "video", "certification")

#### Assigning Tags

**To Courses:**
- When creating/editing a course, you can add multiple tags
- Tags help with filtering and searching courses

**To Content:**
- When uploading or editing content, you can add multiple tags
- Tags make content easier to find and organize

### Tag Examples

Common tag types:
- **Difficulty**: "beginner", "intermediate", "advanced"
- **Content Type**: "video", "document", "quiz", "interactive"
- **Topic**: "banking", "insurance", "compliance", "sales"
- **Purpose**: "required", "optional", "certification", "reference"
- **Skills**: "communication", "technical", "leadership"

---

## Categories vs Tags

| Feature | Categories | Tags |
|---------|-----------|------|
| **Structure** | Hierarchical (parent/child) | Flat (no hierarchy) |
| **Quantity** | ONE per item | MULTIPLE per item |
| **Purpose** | Broad organization | Specific labeling |
| **Example** | "Banking & Finance" | "beginner", "video", "certification" |
| **Use Case** | Group related items | Describe item attributes |

### When to Use Categories

- Organizing by **major subject areas** (Banking, Insurance, HR)
- Creating **hierarchical structures** (Parent → Subcategories)
- **Visual organization** with icons and colors
- When items belong to **one main group**

### When to Use Tags

- Adding **multiple descriptors** to items
- **Flexible labeling** that doesn't fit a hierarchy
- **Search and filtering** by specific attributes
- When items need **multiple classifications**

---

## Practical Examples

### Example 1: Banking Course

**Category**: "Banking & Finance" → "Banking Operations" (subcategory)

**Tags**: "beginner", "video", "required", "certification", "compliance"

**Result**: 
- Course is organized under Banking Operations category
- Can be found by searching for any of the tags
- Shows up in "beginner" filtered view
- Shows up in "certification" filtered view

### Example 2: Training Document

**Category**: "Training Materials" → "Policies" (subcategory)

**Tags**: "pdf", "reference", "compliance", "policy-update-2025"

**Result**:
- Document is organized under Policies subcategory
- Can be found by searching for "compliance" tag
- Can be found by searching for "pdf" tag
- Easy to find all policy documents

---

## Current Implementation Status

### ✅ Fully Implemented

- Category creation, editing, deletion
- Category hierarchy (parent/child relationships)
- Category icons and colors
- Category assignment to courses, content, and learning paths
- Category count display (shows how many items use each category)

### ⚠️ Partially Implemented

- **Tag creation and management** (UI exists)
- **Tag assignment** (database tables exist, but UI for assigning tags to courses/content may need to be added)

### 📝 To Be Implemented

- **Filtering by category** in Course Builder, Content Library, and Learning Paths
- **Filtering by tags** in Course Builder and Content Library
- **Category-based navigation** for learners
- **Tag-based search** functionality

---

## Database Structure

### Categories Table
```sql
categories
├── id (UUID)
├── name
├── slug
├── description
├── parent_id (for subcategories)
├── icon
├── color
└── timestamps
```

### Tags Table
```sql
tags
├── id (UUID)
├── name
├── slug
└── timestamps
```

### Relationships
- `courses.category_id` → `categories.id` (one-to-many)
- `content_library.category_id` → `categories.id` (one-to-many)
- `learning_paths.category_id` → `categories.id` (one-to-many)
- `course_tags` → many-to-many (courses ↔ tags)
- `content_tags` → many-to-many (content ↔ tags)

---

## Best Practices

1. **Create meaningful categories** that represent major subject areas
2. **Use subcategories** for more specific organization
3. **Keep tag names short and descriptive**
4. **Use consistent naming** for tags (e.g., always use "beginner" not "beginner" and "Beginner")
5. **Don't create too many categories** - keep it simple and hierarchical
6. **Use tags for flexible attributes** that don't fit into categories
7. **Regularly review and clean up** unused categories and tags

---

## Next Steps

To fully utilize categories and tags in your LMS:

1. **Add category selection** to Course Builder when creating/editing courses
2. **Add category selection** to Content Library upload forms
3. **Add category selection** to Learning Path Creator
4. **Add tag selection** to Course Builder (multi-select)
5. **Add tag selection** to Content Library (multi-select)
6. **Implement filtering** by category in all content views
7. **Implement filtering** by tags in all content views
8. **Add category navigation** for learners on the frontend

---

## Questions?

If you have questions about how to use categories and tags, or need help implementing the assignment features, feel free to ask!

