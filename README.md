
# 🎨 POS System Frontend UI

## Project Overview

This repository hosts the client-side user interface (UI) for a full-stack Point-of-Sale (POS) System. The application is built with the **Angular** framework, using **TypeScript** for strong typing, and is designed to provide cashiers and administrators with a fast, intuitive, and robust system for managing sales and inventory.

The frontend is responsible for:

  * Securely logging users in and managing session state.
  * Consuming the RESTful API to fetch and update application data.
  * Presenting a responsive and user-friendly interface using **Angular Material**.

### Related Project

  * **Backend Repository:** [POS\_System API (.NET Core 8)](https://github.com/ThisaraRajapakshe/POS_System)
      * **Note:** The backend API must be running for this application to function correctly.

-----

## 🚀 Getting Started

Follow these steps to get the Angular frontend running on your local machine.

### Prerequisites

You must have the following tools installed:

  * **Node.js** (LTS version)
  * **npm** (Node Package Manager) or **Yarn**
  * **Angular CLI** (Install globally: `npm install -g @angular/cli`)

### 1\. Installation

Open your terminal in the project directory and install the necessary dependencies:

```bash
npm install
```

### 2\. Configuration: Backend API URL

The application needs to know where to find the running API.

1.  Open the environment file: `src/environments/environment.development.ts`
2.  Verify the `apiUrl` matches the running address of your **POS\_System** backend:

<!-- end list -->

```typescript
// src/environments/environment.development.ts
export const environment = {
  production: false,
  // Ensure this URL matches your .NET backend's secure API endpoint
  apiUrl: 'https://localhost:7000/api' 
};
```

### 3\. Running the Application

Ensure the backend API is running, and then execute the frontend application using the Angular CLI:

```bash
ng serve --open
```

The application will be compiled and automatically opened in your browser, typically at: **`http://localhost:4200`**

-----

## 🔐 Architecture and Technical Highlights

### Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Angular 19** | Modern SPA (Single Page Application) framework. |
| **Language** | **TypeScript** | Enhances code quality and catches errors before runtime. |
| **Styling** | **Angular Material** | Provides pre-built UI components and professional styling. |
| **Routing** | **Angular Router** | Handles component navigation, lazy loading, and route protection. |
| **State** | **RxJS / Observables** | Used within services (e.g., `AuthService`) to manage and broadcast user state. |

### Security and Authorization

The application implements robust client-side security practices:

  * **Authentication Guard (`authGuard`):** Protects all feature routes (`/catalog`, `/product-management`, etc.) to ensure that only authenticated users can access them. Unauthenticated users are redirected to the `/login` page.
  * **Token Handling:** Uses Angular's `HttpClient` to intercept and attach the **JWT Bearer Token** (stored in local storage) to every outgoing API request.
  * **Layout Separation:** The login screen uses a **separate, minimal layout** that excludes the main navigation bar, ensuring a clean and professional user experience for public routes.

### Key Features Implemented

  * **User Login/Logout:** Securely authenticates against the backend API.
  * **Product Catalog View:** Displays all available products for sale.
  * **Product/Category Management:** Allows administrators to create, read, update, and delete inventory data.
  * **Reactive Navigation Bar:** Displays the current user's full name and a logout button, dynamically updating based on the **`AuthService`** state.

-----

## 👤 Development and Contribution

This project is a personal initiative to demonstrate full-stack development skills.

  * **Author:** RKD Thisara Sandeep
  * **Version Control:** Managed using Git and hosted on GitHub.

<!-- end list -->
