# 📚 BookWorm – Personalized Book Recommendation & Reading Tracker (Client)

BookWorm is a modern, responsive, book-themed web application that helps users discover books, track their reading progress, write reviews, and receive personalized recommendations based on their reading habits.

This is the **frontend (client)** built with **Next.js (App Router)** focusing on performance, SEO, and smooth user experience.

---

## 🌐 Live Demo
🔗 **Live Site:** https://your-client-live-link.vercel.app

---

## 🚀 Tech Stack

- **Next.js 15 (App Router)**
- **React 19**
- **Tailwind CSS**
- **Axios**
- **JWT-based Authentication**
- **Chart.js / Recharts**
- **Cloudinary (Image Upload)**
- **Vercel Deployment**

---

## 🎭 User Roles

### 👤 Normal User
- Secure authentication (Login / Register)
- Browse books with search, filter & pagination
- Personal library:
  - Want to Read
  - Currently Reading (with progress tracking)
  - Read
- Write reviews & give ratings (1–5 stars)
- Personalized book recommendations
- Reading statistics dashboard
- Embedded YouTube tutorials

### 🛠 Admin
- Admin dashboard with stats & charts
- Manage books (Add / Edit / Delete)
- Manage genres/categories
- Moderate reviews (Approve / Delete)
- Manage users & roles
- Manage tutorial videos

---

## 🧭 Routing & Access Control

- 🔒 No public routes
- 🔐 Authentication required for all pages
- Default redirect behavior:
  - **Admin → Dashboard**
  - **User →  Library**
- Role-based route protection

---

## ✨ Key Features

- 📖 Personalized book recommendations
- 📊 Reading analytics & progress tracking
- ⭐ Review & rating moderation system
- 🔍 Advanced search & filters
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Cozy, book-inspired UI/UX
- ⚡ Optimized images & loading states

---

## 🖼 Screenshots
User Home Page
<img width="1574" height="1488" alt="User_Home_Page" src="https://github.com/user-attachments/assets/e6e91452-3e38-4fc2-bb3b-76ed81011875" />


## 🛠 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-url
