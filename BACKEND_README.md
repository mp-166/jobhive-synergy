# Empower Platform - Backend Architecture

## Overview

The Empower backend is built on **Supabase** (PostgreSQL + Edge Functions) and provides a comprehensive API for the gig work and task-based job platform. It supports all core features including escrow payments, intelligent job matching, document verification, SMS notifications, and subscription management.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                     API Gateway (Supabase)                      │
├─────────────────────────────────────────────────────────────────┤
│                        Edge Functions                           │
│  ┌───────────────┬───────────────┬─────────────┬─────────────────┤
│  │ Escrow        │ Job Matching  │ Verification │ Notification   │
│  │ Payments      │ & AI Search   │ System       │ System         │
│  └───────────────┴───────────────┴─────────────┴─────────────────┤
├─────────────────────────────────────────────────────────────────┤
│                    PostgreSQL Database                          │
│  ┌─────────────┬─────────────┬─────────────┬──────────────────── │
│  │ Users &     │ Jobs &      │ Payments &  │ Notifications &    │
│  │ Profiles    │ Applications│ Transactions│ SMS                │
│  └─────────────┴─────────────┴─────────────┴──────────────────── │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Key Features

### 1. **Escrow Payment System**
- Secure payment holding and release
- Dynamic platform fee calculation (3-6% based on amount)
- Automatic refund processing with dispute handling
- Full transaction history and reporting

### 2. **Intelligent Job Matching**
- AI-powered skill and location matching
- Auto-application for high-match jobs
- Personalized job recommendations
- Real-time match score calculation

### 3. **Document Verification System**
- Support for Aadhar, PAN, driving license verification
- Auto-verification with government API simulation
- Manual verification workflow for admins
- Comprehensive verification status tracking

### 4. **Multi-Channel Notification System**
- In-app notifications
- SMS notifications for non-tech users
- Bulk SMS campaigns for job alerts
- Mee Seva center integration support

### 5. **Subscription & Revenue Management**
- Multiple pricing tiers (Basic, Premium, Enterprise)
- Usage limit enforcement
- Featured job listings
- Revenue analytics and MRR tracking

## 📊 Database Schema

### Core Tables

#### **profiles** - Enhanced user profiles
```sql
- Basic user info (name, email, phone, location)
- Verification status and documents
- Subscription details and limits
- Earnings and job completion stats
- Bank account information for payments
```

#### **jobs** - Enhanced job postings
```sql
- Job details (title, description, location, salary)
- Duration and urgency information
- Required skills and worker count
- Payment status and featured status
- Auto-matching preferences
```

#### **escrow_payments** - Payment management
```sql
- Secure payment holding between parties
- Platform fee tracking
- Payment status (pending/escrowed/released/refunded)
- Transaction IDs and payment methods
```

#### **document_verifications** - Document verification
```sql
- Document type (aadhar/pan/driving_license/etc.)
- Verification status and notes
- Auto-verification confidence scores
- Verifier information
```

#### **subscriptions** - User subscriptions
```sql
- Plan type and duration
- Payment amount and status
- Auto-renewal preferences
- Expiration tracking
```

## 🔧 API Endpoints

### **Escrow Payment API** (`/escrow-payment`)

#### Deposit Payment
```javascript
POST /functions/v1/escrow-payment
{
  "action": "deposit",
  "jobId": "uuid",
  "workerId": "uuid",
  "amount": 5000,
  "paymentMethod": "upi"
}
```

#### Release Payment
```javascript
POST /functions/v1/escrow-payment
{
  "action": "release",
  "jobId": "uuid"
}
```

#### Request Refund
```javascript
POST /functions/v1/escrow-payment
{
  "action": "refund",
  "jobId": "uuid",
  "reason": "Worker did not show up"
}
```

### **Job Matching API** (`/job-matching`)

#### Find Matches for Worker
```javascript
POST /functions/v1/job-matching
{
  "action": "find_matches",
  "filters": {
    "location": "Mumbai",
    "categories": ["Agriculture", "Driving"],
    "minSalary": 500,
    "maxSalary": 2000
  }
}
```

#### Auto-Apply to Job
```javascript
POST /functions/v1/job-matching
{
  "action": "auto_apply",
  "jobId": "uuid"
}
```

#### Get Personalized Recommendations
```javascript
POST /functions/v1/job-matching
{
  "action": "get_recommendations"
}
```

### **Verification System API** (`/verification-system`)

#### Submit Document
```javascript
POST /functions/v1/verification-system
{
  "action": "submit_document",
  "documentType": "aadhar",
  "documentUrl": "https://storage.url/document.pdf"
}
```

#### Verify Document (Admin)
```javascript
POST /functions/v1/verification-system
{
  "action": "verify_document",
  "verificationId": "uuid",
  "verificationStatus": "verified",
  "notes": "Document verified successfully"
}
```

#### Get Verification Status
```javascript
POST /functions/v1/verification-system
{
  "action": "get_verification_status"
}
```

### **Notification System API** (`/notification-system`)

#### Send Notification
```javascript
POST /functions/v1/notification-system
{
  "action": "send_notification",
  "userId": "uuid",
  "title": "New Job Match!",
  "message": "We found a job that matches your skills",
  "type": "job_match"
}
```

#### Send SMS
```javascript
POST /functions/v1/notification-system
{
  "action": "send_sms",
  "phoneNumber": "+911234567890",
  "message": "New job available in your area. Visit empower.com"
}
```

#### Send Bulk SMS
```javascript
POST /functions/v1/notification-system
{
  "action": "send_bulk_sms",
  "message": "New jobs available!",
  "filters": {
    "location": "Mumbai",
    "userType": "worker",
    "skills": ["driving"]
  }
}
```

### **Subscription Management API** (`/subscription-management`)

#### Create Subscription
```javascript
POST /functions/v1/subscription-management
{
  "action": "create_subscription",
  "planType": "premium",
  "planDuration": "monthly",
  "paymentMethod": "credit_card"
}
```

#### Feature Job
```javascript
POST /functions/v1/subscription-management
{
  "action": "feature_job",
  "jobId": "uuid",
  "featureDuration": 7
}
```

#### Get Revenue Stats (Admin)
```javascript
POST /functions/v1/subscription-management
{
  "action": "get_revenue_stats",
  "dateRange": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

## 💰 Revenue Model Implementation

### 1. **Commission-Based Model (3-6%)**
- Automatically calculated based on job amount
- Lower rates for smaller jobs to encourage adoption
- Transparent fee structure for users

### 2. **Subscription Plans**
| Plan | Monthly | Features |
|------|---------|----------|
| Basic | ₹299 | 5 job posts, basic matching |
| Premium | ₹599 | 20 job posts, AI matching, analytics |
| Enterprise | ₹1999 | Unlimited posts, custom branding |

### 3. **Featured Listings**
- ₹50 per day for featured job posts
- Increased visibility in search results
- Priority in auto-matching algorithm

### 4. **Identity Verification Services**
- ₹100 per document verification
- Faster verification for premium users
- Skill certification programs

## 🔐 Security Features

### 1. **Row Level Security (RLS)**
- Users can only access their own data
- Admin-only functions for verification and revenue
- Secure payment handling with escrow system

### 2. **Authentication & Authorization**
- Supabase Auth with JWT tokens
- Role-based access control
- API rate limiting

### 3. **Data Validation**
- Input sanitization and validation
- File type and size restrictions
- SQL injection prevention

## 📱 SMS Integration for Non-Tech Users

### Mee Seva Center Support
The platform includes special features for reaching non-tech users:

1. **SMS Job Alerts**: Automatic notifications in local language
2. **Voice Support**: Templates for Mee Seva operators
3. **Simple Application Process**: SMS-based job applications
4. **Payment Notifications**: SMS confirmations for all transactions

### SMS Templates
```javascript
// Job Alert
"Hi {name}, new job: {title} in {location}. Salary: ₹{salary}. Call 1800-123-4567"

// Payment Received
"Hi {name}, you received ₹{amount} for job: {title}. Check empower.com"

// Application Status
"Your application for {job} was {status}. Details at empower.com"
```

## 🛠️ Setup Instructions

### 1. **Database Setup**
```bash
# Run migrations
supabase db push

# Apply schema enhancements
psql -f supabase/migrations/001_empower_schema_enhancement.sql
psql -f supabase/migrations/002_additional_functions.sql
```

### 2. **Environment Variables**
```bash
# Add to your .env file
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SMS_API_KEY=your_sms_provider_key
SMS_SENDER_ID=EMPOWER
OPENAI_API_KEY=your_openai_key  # For AI job search
```

### 3. **Deploy Edge Functions**
```bash
# Deploy all functions
supabase functions deploy escrow-payment
supabase functions deploy job-matching
supabase functions deploy verification-system
supabase functions deploy notification-system
supabase functions deploy subscription-management
```

## 📈 Usage Examples

### Complete Job Posting & Payment Flow

```javascript
// 1. Employer posts job
const job = await supabase.from('jobs').insert({
  title: "Rice Harvesting Workers Needed",
  description: "Need 10 workers for rice harvesting",
  location: "Punjab, India",
  salary_min: 800,
  salary_max: 1200,
  category: "Agriculture",
  skills: ["Farming", "Crop Harvesting"],
  workers_needed: 10,
  auto_match: true
});

// 2. System auto-matches workers
await fetch('/functions/v1/job-matching', {
  method: 'POST',
  body: JSON.stringify({
    action: 'auto_apply',
    jobId: job.id
  })
});

// 3. Employer deposits payment
await fetch('/functions/v1/escrow-payment', {
  method: 'POST',
  body: JSON.stringify({
    action: 'deposit',
    jobId: job.id,
    amount: 12000, // Total for 10 workers
    paymentMethod: 'bank_transfer'
  })
});

// 4. Job completed, payment released
await fetch('/functions/v1/escrow-payment', {
  method: 'POST',
  body: JSON.stringify({
    action: 'release',
    jobId: job.id
  })
});
```

## 🔄 Daily Maintenance

The system includes automated maintenance tasks:

```sql
-- Run daily maintenance (can be scheduled with cron)
SELECT daily_maintenance();
```

This function:
- Expires featured job listings
- Updates subscription statuses
- Sends application reminders
- Cleans up old notifications

## 🚀 Scaling Considerations

1. **Database Indexing**: All frequently queried columns are indexed
2. **Connection Pooling**: Supabase handles database connections
3. **Edge Functions**: Automatically scale with demand
4. **CDN Integration**: For document storage and delivery
5. **Monitoring**: Built-in logging and analytics

## 📞 Support for Non-Tech Users

### Mee Seva Integration Points
1. **Registration**: Operators can register users via web interface
2. **Job Applications**: Phone-based application process
3. **Status Updates**: Regular SMS updates in local language
4. **Payment Assistance**: Help with bank account setup

### Voice Scripts (Hindi/Local Languages)
```
Job Alert: "Namaste, aapke liye nayi naukri mili hai..."
Payment: "Aapko paisa mil gaya hai..."
Application: "Aapka application accept ho gaya hai..."
```

This backend architecture fully supports your vision of the Empower platform, providing a robust foundation for connecting employers with workers across all sectors while ensuring security, scalability, and accessibility for all user types.

---

**Ready to empower the workforce!** 🚀