# 🏠 LOCAL SETUP GUIDE - Empower Platform

## 📋 Requirements for Your Local Computer

### **System Requirements**
- **OS**: Windows 10/11, macOS 10.15+, or Linux Ubuntu 18.04+
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space
- **Internet**: Required for installation and API calls

### **Software Prerequisites**
1. **Node.js 18+** - Download from https://nodejs.org
2. **Git** - Download from https://git-scm.com
3. **Code Editor** - VS Code (recommended) from https://code.visualstudio.com

## 🚀 Step-by-Step Installation

### **Step 1: Install Prerequisites**

#### **Windows:**
```powershell
# Install Node.js (download from nodejs.org)
# Install Git (download from git-scm.com)
# Verify installation
node --version
npm --version
git --version
```

#### **macOS:**
```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and Git
brew install node git

# Verify installation
node --version
npm --version
git --version
```

#### **Linux (Ubuntu/Debian):**
```bash
# Update package list
sudo apt update

# Install Node.js and Git
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Verify installation
node --version
npm --version
git --version
```

### **Step 2: Download Project**

1. **Clone Repository**
   ```bash
   # Replace with your actual GitHub repository URL
   git clone https://github.com/yourusername/empower-platform.git
   
   # Navigate to project directory
   cd empower-platform
   ```

2. **Verify Files Downloaded**
   ```bash
   # Check if all files are present
   ls -la
   
   # Should see:
   # - src/ folder
   # - supabase/ folder
   # - package.json
   # - deploy-*.sh scripts
   # - README.md
   ```

### **Step 3: Install Dependencies**

```bash
# Install all project dependencies
npm install

# This will download ~400MB of packages (one-time only)
# Takes 2-5 minutes depending on internet speed
```

### **Step 4: Start Development Server**

```bash
# Start the application
npm run dev
```

**Expected Output:**
```
  VITE v5.4.10  ready in 186 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

### **Step 5: Access Your Application**

Open your browser and visit:
- **Main App**: http://localhost:5173
- **Demo Page**: http://localhost:5173/demo
- **Verification**: http://localhost:5173/verification

## 🧪 Testing Your Local Setup

### **Quick Test Checklist**
- [ ] Homepage loads without errors
- [ ] Demo page shows commission calculator
- [ ] Commission calculator works (test ₹5000 → 12% fee)
- [ ] Payment system demo is functional
- [ ] Verification page loads
- [ ] Navigation between pages works
- [ ] Mobile view is responsive

### **Common Test Scenarios**

1. **Commission Calculator Test**
   - Visit: http://localhost:5173/demo
   - Tab: "Commission Calculator"
   - Input: ₹3000 → Should show 12% (₹360)
   - Input: ₹15000 → Should show 8% (₹1200)
   - Input: ₹50000 → Should show 5% (₹2500)

2. **Payment System Test**
   - Tab: "Payment System"
   - Click through payment flow
   - Test dispute and refund options

3. **Verification Test**
   - Visit: http://localhost:5173/verification
   - Try uploading a sample file
   - Check status progression

## 🔧 Development Commands

### **Available Scripts**
```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking
npm run type-check
```

### **Useful Development Commands**
```bash
# Clear cache if issues
rm -rf node_modules package-lock.json
npm install

# Check for updates
npm outdated

# Update dependencies
npm update
```

## 🌐 Production Deployment from Local

### **Deploy Backend (Supabase)**
```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Deploy backend
./deploy-backend.sh
```

### **Deploy Frontend (Vercel)**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy to production
./deploy-production.sh
```

## 🛠️ Development Tips

### **VS Code Extensions (Recommended)**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- GitLens — Git supercharged

### **Debugging Tips**
1. **Browser DevTools**: F12 to open developer tools
2. **Network Tab**: Check API calls and responses
3. **Console Tab**: View JavaScript errors
4. **React DevTools**: Install React Developer Tools extension

### **File Structure Understanding**
```
empower-platform/
├── src/
│   ├── components/         # React components
│   │   ├── payment/       # Payment management
│   │   ├── verification/  # Document verification
│   │   └── ui/           # Reusable UI components
│   ├── pages/            # Application pages
│   ├── lib/              # Utilities and API functions
│   └── integrations/     # Supabase integration
├── supabase/             # Backend code
│   ├── migrations/       # Database schema
│   └── functions/        # API functions
├── public/               # Static assets
└── dist/                 # Build output (created after build)
```

## 🚨 Troubleshooting

### **Common Issues and Solutions**

#### **Issue: `npm install` fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Issue: Port 5173 already in use**
```bash
# Kill existing process
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

#### **Issue: TypeScript errors**
```bash
# Run type checking
npm run type-check

# Fix common issues
npm run lint --fix
```

#### **Issue: Build fails**
```bash
# Check for errors
npm run build

# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

#### **Issue: Hot reload not working**
- Save files with Ctrl+S (or Cmd+S on Mac)
- Check file permissions
- Restart development server

### **Performance Optimization**
```bash
# Analyze bundle size
npm run build
npx vite preview

# Check dependencies size
npx bundlephobia
```

## 📱 Mobile Testing

### **Local Network Testing**
1. **Find your IP address**:
   - Windows: `ipconfig`
   - macOS/Linux: `ifconfig` or `ip addr`

2. **Access from mobile**:
   - Visit: `http://YOUR_IP:5173`
   - Example: `http://192.168.1.100:5173`

3. **Test mobile features**:
   - Touch interactions
   - Responsive design
   - Performance on slower devices

## 🔒 Environment Variables for Production

### **Create `.env.local`**
```env
# Supabase Configuration (fill with your values)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_ENV=production
VITE_APP_NAME=Empower Platform

# Payment Integration (for future)
VITE_RAZORPAY_KEY_ID=your-razorpay-key
VITE_SMS_API_KEY=your-sms-api-key
```

## 📞 Support

### **If You Get Stuck**
1. **Check console for errors**: F12 → Console tab
2. **Read error messages carefully**
3. **Google the specific error**
4. **Check GitHub issues**: Look for similar problems
5. **Stack Overflow**: Search for React/Vite/TypeScript issues

### **Useful Resources**
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **TypeScript Docs**: https://typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **Supabase Docs**: https://supabase.com/docs

## ✅ Success Checklist

After setup, you should be able to:
- [ ] Run `npm run dev` without errors
- [ ] Access http://localhost:5173
- [ ] See the Empower Platform homepage
- [ ] Navigate to demo page and test commission calculator
- [ ] View verification dashboard
- [ ] Build project with `npm run build`
- [ ] Deploy to production when ready

---

## 🎉 You're Ready!

**Congratulations! Your Empower Platform is now running locally.**

**Next Steps:**
1. **Test all features** thoroughly
2. **Customize** as needed
3. **Deploy to production** when ready
4. **Start building** your gig economy business!

**Made with ❤️ for developers worldwide**