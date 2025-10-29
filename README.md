# TV Shows Dashboard

A **modern, modular, and reusable** Vue 3 application built with the **Composition API**, **Pinia**, and **Storybook** for component-driven development.  
This app fetches TV shows by genre using the [TVMaze API](https://www.tvmaze.com/api), featuring a clean UI, search functionality, and test coverage for reliability.

---

##  Features

-  **Genre-based Carousels:** Horizontally scrollable TV show lists by genre.  
-  **Search Functionality:** Dynamic search with instant results.  
-  **Show Details:** Detailed view for each selected show.  
-  **Pinia Store:** Centralized and reactive state management.  
-  **Composable Logic:** Reusable logic extracted into composables.  
-  **Storybook Integration:** Isolated component testing and documentation.  
-  **Unit Testing & Coverage:** Comprehensive Jest test coverage.  
-  **Loading & Error Handling:** Smooth UX with skeletons and user-friendly messages.  
-  **Clean Code Practices:** Modular, well-named, and documented structure.

---

## Component Overview

### `GenreCarousel.vue`
- Displays a **horizontal list** of TV shows per genre.  
- Uses `ShowCard` for each show.  
- Shows **skeleton loaders** while fetching data.  
- Handles errors and empty-state gracefully.  

### `SearchBar.vue`
- A reusable **search input** with debouncing.  
- Syncs search state with Pinia store.  
- Emits search events to parent components or routes.

### `ShowCard.vue`
- Displays a single show’s **poster, title, and rating**.  
- Emits `click` event to navigate to `ShowDetailView`.  
- Fully reusable across genre lists and search results.

---

##  Composables

### `useShows.js`
- Centralized **data-fetching logic** for shows and genres.  
- Provides loading, error, and data states.  
- Reused in both views and store actions.  
- Keeps business logic separate from components.

---

## State Management (Pinia)

### `showsStore.js`
Manages all data related to shows, genres, and search.

**State:**
- `showsByGenre`
- `selectedShow`
- `searchQuery`
- `searchResults`
- `loading` / `error`

**Actions:**
- `fetchShowsByGenre(genre)`
- `fetchShowDetails(id)`
- `searchShows(query)`

**Getters:**
- `getShowsByGenre`
- `filteredShows`
- `isLoading`

---

##  Views

### `HomeView.vue`
- Displays multiple `GenreCarousel` components dynamically.  
- Fetches and renders shows per genre.  

### `GenreView.vue`
- Displays all shows for a specific genre.  
- Uses `ShowCard` in a grid layout.  

### `ShowDetailView.vue`
- Displays full details of a single show.  
- Fetches additional info (summary, genres, ratings).  
- Includes loading skeleton and error fallback.  

### `SearchResultsView.vue`
- Displays search results dynamically as user types.  
- Uses `SearchBar` and `ShowCard` components.  

---

## Routing

### `router/index.js`
Defines routes for app navigation:

| Route | View | Description |
|-------|------|--------------|
| `/` | `HomeView` | Main landing page with carousels |
| `/genre/:genreName` | `GenreView` | All shows for a given genre |
| `/show/:id` | `ShowDetailView` | Detailed show page |
| `/search` | `SearchResultsView` | Global search results |

---

## Project Setup

### Install dependencies
```bash
npm install
```

### Start the development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

---

## Folder Structure

```
src/
│
├── components/
│   ├── GenreCarousel.vue
│   ├── SearchBar.vue
│   ├── ShowCard.vue
│
├── composables/
│   ├── useShows.js
│
├── store/
│   ├── showsStore.js
│
├── views/
│   ├── GenreView.vue
│   ├── HomeView.vue
│   ├── ShowDetailView.vue
│   ├── SearchResultsView.vue
│
├── router/
│   └── index.js
│
├── assets/
│   └── styles/
│
└── App.vue
```

---

## Testing & Coverage

### Run Unit Tests
```bash
npm run test:unit
```

### Generate Coverage Report
```bash
npm run test:coverage
```

**Coverage Output:**  
A detailed report will be available in the `coverage/` folder after running the above command.

- **Framework:** Jest + Vue Test Utils  
- **Goal:** Maintain 70%+ test coverage  
- **Focus Areas:**  
  - Component rendering & props  
  - Store actions & getters  
  - API call mocking  
  - Error and loading states  

---

## Storybook Integration

### Run Storybook
```bash
npm run storybook
```

### Build Storybook for deployment
```bash
npm run build-storybook
```

**Purpose:**
- Visualize and test components in isolation.  
- Document component usage, props, and variations.  
- Maintain UI consistency across views.

**Recommended Stories:**
- `ShowCard.stories.js` → Variations with/without image and rating.  
- `GenreCarousel.stories.js` → Displays mock horizontal list.  
- `SearchBar.stories.js` → Interactive input with mock debounce.  

---

## Best Practices

- Use **Composition API** (`setup()` + composables).  
- Store logic and state in **Pinia**.  
- Modular, self-contained **components**.  
- Manage async operations with `try...catch`.  
- Use skeletons/spinners for loading states.  
- Use Storybook for visual component testing.  
- Write unit tests for all core components and stores.  
- Add clear and concise comments for complex logic.

---

## Example User Flow

1. App loads → genres and shows fetched → displayed in carousels.  
2. User clicks a show → navigates to `ShowDetailView`.  
3. User searches → `SearchResultsView` updates instantly.  
4. All states and data flow managed by **Pinia** + **Composition API**.  
5. Developers can preview individual components via **Storybook**.

---

##  Author

**Tanvi Priya**  
Frontend Developer | Passionate about clean UI and modern architecture  
 [tanvi.priya@tcs.com](mailto:tanvi.priya@tcs.com)

---

## License

This project is licensed under the **MIT License**.
