# Blog App

The **Blog App** is a full-stack web application designed to let users create, edit, and manage blog posts. Users can register, log in, and securely manage their own posts while browsing categorized content from other users.

## Key Features

- **Post Management**: Logged-in users can create, edit, and delete their own posts. 
- **Authentication & Authorization**: Secure user authentication via JSON Web Tokens (JWT). Passwords are encrypted using bcryptjs, and only the post owner has permission to modify or delete their posts.
- **Category Sorting**: Posts are categorized, with related posts recommended based on the selected category.
- **Token-Based Authentication**: JWT is generated upon login, stored in LocalStorage, and expires after one hour, ensuring secure session management.

## Technologies Used

- **Frontend**: React, React Router, React Quill, Sass
- **Backend**: Express, SQLite3, bcryptjs, multer, JWT, CORS
- **Database**: MySQL (mysql2)

## Setup Instructions

### Prerequisites

- Ensure you have **Node.js** and **npm** installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/blog-app.git
   cd blog-app

## Running the Application
   To start the frontend (development mode):
   npm run dev
   
   To start the backend:
   npm start

## Database Configuration
   Ensure MySQL is installed and running. Modify the database configuration file as needed to connect to your local MySQL instance.
   
   
   





