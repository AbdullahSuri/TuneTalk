# TuneTalk

## Overview

Discover, rate, and immerse yourself in the world of music with TuneTalk, a album Review Platform, where music lovers unite! Users can create an account, browse albums, submit their own reviews, and rate albums. Each album will have an aggregated rating based on user ratings and a list of user-submitted reviews. This platform aims to foster a music community where users can share their opinions and discover new music through ratings and reviews.

## Data Model

The application will store data for Users, Albums, and Reviews, with relationships between these entities as follows:

- Users can review multiple albums (one-to-many relationship between users and reviews).
- Albums can have multiple reviews from different users (one-to-many relationship between albums and reviews).
- Each Review document references a specific user and album.

An Example User:

```javascript
{
  username: "musiclover123",
  hash: "hashed_password", // password hash
  email: "user@example.com",
  favoriteAlbums: [ObjectId("albumId1"), ObjectId("albumId2")] // references to Album documents
}
```

An Example Album:

```javascript
{
  title: "Abbey Road",
  artist: "The Beatles",
  releaseDate: "1969-09-26",
  genre: "Rock",
  coverImage: "https://example.com/abbey_road.jpg",
  reviews: [ObjectId("reviewId1"), ObjectId("reviewId2")], // references to Review documents
  averageRating: 4.8
}
```

An Example Review:

```javascript
{
  user: ObjectId("userId"), // reference to a User object
  album: ObjectId("albumId"), // reference to an Album object
  rating: 5,
  comment: "An all-time classic. Every song is iconic!",
  createdAt: "2024-10-01T10:00:00Z" // timestamp
}
```

## [Link to Commented First Draft Schema](db.mjs)

The initial schemas for User, Album, and Review are included in the file db.mjs. This file provides the structure for each document in the database, establishing relationships between them.

## Wireframes

(**TODO**: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc.)

/home - Home page with a welcome message, a brief description of the platform, and a button to navigate to the albums list.

![list create](documentation/home.png)

/albums - Page displaying a list of albums, showing each album’s title, artist, and average rating. Each album title links to its detailed view page.

![list](documentation/albums.png)

/album/

- Album detail page showing specific information for the album, including title, artist, genre, release date, cover image, and user reviews with ratings. Includes a link or button to add a review.

![list](documentation/album.png)

/review/new - Review form page for submitting a new review. Includes fields for the rating (1-5) and a text box for comments, along with a submit button.

![list](documentation/review.png)

## Site map

1. Home - Links to /albums and login/register pages.
2. Albums List (/albums) - Lists all albums and links to individual album pages.
3. Album Details (/album/) - Shows details and reviews for a specific album, with a link to the review form.
4. Review Form (/review/new) - Page for submitting a new review for an album.
5. Login / Register - Pages for user authentication.
   Profile - Displays the user's submitted reviews and favorite albums (not certain).

## User Stories or Use Cases

1. As a non-registered user, I can register a new account to start reviewing albums.
2. As a user, I can log in to the platform.
3. As a user, I can view a list of albums and browse their ratings and reviews.
4. As a user, I can submit a review and rating for an album.
5. As a user, I can view all of my submitted reviews in my profile.
6. As a user, I can mark albums as my favorites to view them in my profile.

## Research Topics

- (3 points) Unit Testing with Mocha/Chai:
  - Test key application functions and routes, such as adding reviews and calculating average ratings.
  - Testing code will be linked in the repository.
- (3 points) Configuration Management with nconf:
  - Replaced dotenv with nconf for managing environment variables and configuration settings.
- (5 points) Spotify API Integration:
  - Dynamic token generation implemented in JavaScript to ensure functionality across all devices.
  - The Spotify API is used to fetch album metadata.
- (2 points) CSS Framework (Tailwind CSS):
  - Use Tailwind CSS for a clean and responsive UI, with customizations for a unique platform look.

Total Points: 13 out of 10 required points.

## [Link to Initial Main Project File](app.mjs)

The main application setup, including the Express framework, can be found in app.mjs. This file serves as the entry point for the application, setting up routes, middleware, and initial configurations.

## Annotations / References Used

1. [Mocha/Chai Documentation](https://mochajs.org/) - for implementing unit tests in the project.
2. [Selenium WebDriver Documentation](https://www.selenium.dev/documentation/) - for setting up and automating functional tests.
3. [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation) - for implementing and customizing Tailwind CSS for UI styling.
