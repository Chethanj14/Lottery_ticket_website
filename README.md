# TickBuyEarn - Frontend Only Version

A complete ticket buying and draw system that runs entirely in the browser without requiring a backend server.

## 🚀 **Features**

- **Ticket Selection**: Choose from different price tiers (₹25 to ₹1000)
- **UPI Payment**: Simulated UPI payment system with QR codes
- **Draw Management**: Schedule, participate in, and complete draws
- **Winner Selection**: Random winner selection with prize distribution
- **Local Storage**: All data is stored in the browser's localStorage
- **Responsive Design**: Works on desktop and mobile devices

## 📁 **File Structure**

```
frontend/
├── index.html          # Main landing page
├── tickets.html        # Ticket selection page
├── checkout.html       # Payment and checkout page
├── draw.html          # Draw management page
├── buySuccess.html    # Success page after purchase
├── app.js             # Main application logic
├── data.js            # Data management and storage
├── styles.css         # Styling and responsive design
└── README.md          # This file
```

## 🌐 **How to Deploy**

### **Option 1: Simple File Server (Recommended for Testing)**

1. **Using Python (if installed):**
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   Then open: http://localhost:8000

2. **Using Node.js (if installed):**
   ```bash
   cd frontend
   npx http-server -p 8000
   ```
   Then open: http://localhost:8000

3. **Using PHP (if installed):**
   ```bash
   cd frontend
   php -S localhost:8000
   ```
   Then open: http://localhost:8000

### **Option 2: GitHub Pages (Free Hosting)**

1. Create a new GitHub repository
2. Upload all frontend files to the repository
3. Go to Settings → Pages
4. Select source branch (usually `main`)
5. Your site will be available at: `https://username.github.io/repository-name`

### **Option 3: Netlify (Free Hosting)**

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `frontend` folder
3. Your site will be deployed instantly with a free URL

### **Option 4: Vercel (Free Hosting)**

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Deploy automatically with each push

## 🔧 **How It Works**

### **Data Storage**
- All data is stored in the browser's `localStorage`
- Sample data is automatically created on first visit
- Data persists between browser sessions

### **Payment Simulation**
- UPI payment is simulated (no real money involved)
- QR codes are generated for demonstration
- Payment status is tracked locally

### **Draw System**
- Draws can be scheduled for future dates
- Users can participate with their tickets
- Winners are selected randomly from participants
- Prize calculation: 90% of total ticket sales

## 📱 **Browser Compatibility**

- **Chrome**: 60+ ✅
- **Firefox**: 55+ ✅
- **Safari**: 12+ ✅
- **Edge**: 79+ ✅
- **Mobile Browsers**: ✅

## 🎯 **Sample Data**

The system comes with pre-loaded sample data:

- **3 Sample Draws**: Scheduled, Active, and Completed
- **5 Sample Tickets**: Different prices and statuses
- **Sample Winners**: Previous draw results
- **Sample Payments**: Payment history

## 🚨 **Important Notes**

1. **No Backend**: This is a demonstration version
2. **Local Storage**: Data is stored only in your browser
3. **Simulated Payments**: No real money transactions
4. **Sample Data**: Reset data by clearing browser localStorage
5. **Single User**: Designed for single-user demonstration

## 🔄 **Resetting Data**

To reset all data and start fresh:

1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Clear localStorage for your domain
4. Refresh the page

## 📞 **Support**

This is a frontend-only demonstration version. For production use, you would need:

- Backend server (Spring Boot, Node.js, etc.)
- Database (MySQL, PostgreSQL, etc.)
- Real payment gateway integration
- User authentication system
- Security measures

## 🎉 **Enjoy Your Demo!**

The TickBuyEarn system is now fully functional in your browser without any backend requirements!
