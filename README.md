# 📸 Instagram Clone - MERN Stack

A full-stack Instagram clone built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time messaging, image uploads, and social interactions.

## ✨ Features

### User Features
- 🔐 User Authentication (Register/Login/Logout)
- 👤 Profile Management (Edit profile, upload profile picture)
- 📸 Post Creation (Upload images with captions)
- ❤️ Like & Unlike Posts
- 💬 Comment on Posts
- 🔔 Real-time Notifications
- 👥 Follow/Unfollow Users
- 🔍 Search Users
- 📊 View User Profiles
- 💌 Real-time Direct Messaging
- 📱 Responsive Design

### Technical Features
- Real-time updates using Socket.IO
- Image upload and optimization with Cloudinary
- JWT-based authentication
- RESTful API architecture
- Redux for state management
- Protected routes
- Online/offline user status

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Library
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Socket.IO Client** - Real-time Communication
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Cloudinary** - Image Storage
- **Multer** - File Upload
- **Sharp** - Image Processing

## 📁 Project Structure

```
INSTRAGRAM/
├── backend/
│   ├── Controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── socket/            # Socket.IO configuration
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── redux/         # Redux slices
│   │   ├── lib/           # Utility libraries
│   │   └── App.jsx        # Main component
│   └── package.json
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/instagram-clone.git
cd instagram-clone
```

### 2. Backend Setup

```bash
# Navigate to backend (root directory)
cd INSTRAGRAM

# Install dependencies
npm install

# Create .env file
touch .env
```

**Add these environment variables to `.env`:**
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 4. Run the Application

**Development Mode:**
```bash
# Terminal 1 - Run backend
cd INSTRAGRAM
npm run start

# Terminal 2 - Run frontend
cd INSTRAGRAM/frontend
npm run dev
```

**Production Mode:**
```bash
# Build frontend first
cd INSTRAGRAM/frontend
npm run build

# Run backend (serves both frontend and backend)
cd ..
npm run start
```

Visit `http://localhost:3000` in your browser.

## 📸 Screenshots

<!-- Add screenshots of your application here -->
![Home Page](screenshots/home.png)
![Profile Page](screenshots/profile.png)
![Messages](screenshots/messages.png)

## 🔑 API Endpoints

### Authentication
```
POST   /api/v1/user/register     - Register new user
POST   /api/v1/user/login        - Login user
GET    /api/v1/user/logout       - Logout user
```

### User
```
GET    /api/v1/user/:id/profile  - Get user profile
POST   /api/v1/user/profile/edit - Edit profile
GET    /api/v1/user/suggested    - Get suggested users
POST   /api/v1/user/followorunfollow/:id - Follow/Unfollow user
```

### Post
```
POST   /api/v1/post/addpost      - Create new post
GET    /api/v1/post/all          - Get all posts
GET    /api/v1/post/userpost/all - Get user's posts
GET    /api/v1/post/:id/like     - Like/Unlike post
POST   /api/v1/post/:id/comment  - Add comment
DELETE /api/v1/post/delete/:id   - Delete post
```

### Message
```
POST   /api/v1/message/send/:id  - Send message
GET    /api/v1/message/all/:id   - Get all messages
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- CORS configuration
- Input validation
- Protected API routes
- File upload restrictions

## 🌟 Key Learning Points

This project demonstrates:
- Building a full-stack application from scratch
- Real-time features implementation
- Image upload and processing
- State management with Redux
- WebSocket communication
- RESTful API design
- Authentication & Authorization
- Database modeling and relationships

## 📝 To-Do / Future Enhancements

- [ ] Stories feature
- [ ] Video upload support
- [ ] Explore page with trending posts
- [ ] Hashtag functionality
- [ ] Save posts feature
- [ ] Multiple image upload per post
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Dark mode
- [ ] Post sharing
- [ ] Advanced search filters

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Inspired by Instagram
- Built as a learning project for MERN stack development
- Thanks to all the open-source libraries used in this project

---

⭐ If you found this project helpful, please give it a star!

Made with ❤️ using MERN Stack
