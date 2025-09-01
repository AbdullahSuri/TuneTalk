# TuneTalk

TuneTalk is a full-stack web application that allows users to discover, rate, and review music albums. The application integrates Spotify's API to fetch album data, allowing users to browse new releases, search for albums, and leave reviews.


## 📌 Features

- **User Authentication**: Register and log in to leave reviews.
- **Album Discovery**: Browse and search albums fetched from Spotify.
- **Reviews & Ratings**: Submit album reviews with a 1-5 rating system.
- **Featured Albums**: View highly rated albums on the homepage.
- **Responsive UI**: Designed using Handlebars and Tailwind CSS for an elegant user experience.

## 🚀 Technologies Used

- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas
- **Frontend:** Handlebars (HBS), HTML, CSS
- **Styling:** Tailwind CSS
- **Authentication:** bcrypt, express-session
- **API Integration:** Spotify API
- **Testing:** Mocha, Chai, Supertest
- **Deployment:** Railway

## 📦 Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **MongoDB Atlas** (Cloud database setup)
- **Spotify Developer Account** (for API access)

### Clone the Repository

```sh
 git clone https://github.com/AbdullahSuri/TuneTalk.git
 cd TuneTalk
```

### Install Dependencies

```sh
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add:

```
DSN=mongodb+srv://YOUR_MONGODB_CREDENTIALS
PORT=3000
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Start the Server

```sh
npm start
```

Server runs on `http://localhost:3000`

## 📂 Directory Structure

```
TuneTalk/
│── node_modules/
│── public/
│   ├── Favicon.png
│   ├── site.css
│   ├── styles.css
│   ├── tailwind.css
│── tests/
│   ├── app-test.mjs
│── views/
│   ├── albumDetail.hbs
│   ├── albumList.hbs
│   ├── home.hbs
│   ├── layout.hbs
│   ├── login.hbs
│   ├── register.hbs
│   ├── reviewForm.hbs
│── .gitignore
│── app.mjs
│── auth.mjs
│── config.mjs
│── db.mjs
│── eslint.config.mjs
│── package-lock.json
│── package.json
│── postcss.config.js
│── README.md
│── spotify.mjs
│── tailwind.config.js
```

## 🔎 Troubleshooting

### Common Issues

1. **DSN Undefined** – Ensure `.env` is set correctly and loaded.
2. **Albums Not Loading** – Check MongoDB connection and ensure albums exist.
3. **Deployment Failure** – Verify that environment variables are configured in Railway.

## 📚 Contributors

- **Abdullah Suri** – Developer
