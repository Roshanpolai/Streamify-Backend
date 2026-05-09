# Streamify Backend

A scalable backend project inspired by platforms like YouTube and Twitter, built using **Node.js**, **Express.js**, and **MongoDB**.  
This project provides core functionalities such as video management, tweets, subscriptions, playlists, likes, comments, and dashboard analytics.

---

## Introduction

**Streamify Backend** is a RESTful API project that combines:

- Video-sharing features similar to YouTube
- Tweet/post functionality inspired by Twitter

It is designed with modular architecture and covers authentication, media uploads, user interactions, and content management.

---

## 🔗 Important Links

| Content | Link |
|---------|------|
| API Documentation | [Click Here](https://documenter.getpostman.com/view/28570926/2s9YsNdVwW) |
| Database Models | [Click Here](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj) |

---

# Features

## User Management

- User Registration & Login
- JWT Authentication
- Logout Functionality
- Password Reset
- Profile Management
- Avatar & Cover Image Upload
- Watch History Tracking

---

## Video Management

- Upload Videos
- Publish / Unpublish Videos
- Edit & Delete Videos
- Search & Filter Videos
- Pagination & Sorting
- View Count Tracking

---

## Tweet Management

- Create Tweets
- Update & Delete Tweets
- View User Tweets
- Publish Posts

---

## Subscription Management

- Subscribe to Channels
- Unsubscribe from Channels
- View Subscribers List
- View Subscribed Channels

---

## Playlist Management

- Create Playlists
- Update & Delete Playlists
- Add Videos to Playlist
- Remove Videos from Playlist
- View User Playlists

---

## Like Management

- Like / Unlike Videos
- Like / Unlike Comments
- Like / Unlike Tweets
- View Liked Videos

---

## Comment Management

- Add Comments on Videos
- Update Comments
- Delete Comments

---

## Dashboard

- Channel Statistics
- Total Views
- Subscribers Count
- Uploaded Videos
- Likes Analytics

---

## Health Check

- API endpoint to verify server health status

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- ️Cloudinary
- JWT Authentication
- Mongoose

---

# Project Setup

## 1️. Clone the Repository

```bash
git clone https://github.com/Roshanpolai/Streamify-Backend
```

---

## 2️. Navigate to Project Folder

```bash
cd Streamify-Backend
```

---

## 3️. Install Dependencies

```bash
npm install
```

---

## 4️. Setup Environment Variables

Create a `.env` file in the root directory and add the required environment variables using `.env.sample` as reference.

Example:

```env
PORT=8000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 5️. Run the Development Server

```bash
npm run dev
```

---

# Project Structure

```bash
src/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
├── constants/
└── app.js
```

---

# Future Improvements

- Real-time Notifications
- Live Streaming Support
- Video Recommendations
- Chat System
- AI-based Search
- Admin Dashboard

---

# Contributing

Contributions are always welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

# License

This project is open-source and available under the **MIT License**.

---

# Author

Developed by **Roshan Polai** 
