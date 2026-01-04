# 📚 CaselogPro2 Comprehensive User Manual

## 🎯 Table of Contents

1. [Getting Started](#getting-started)
2. [System Login](#system-login)
3. [Dashboard Navigation](#dashboard-navigation)
4. [Case Management](#case-management)
5. [Search Functionality](#search-functionality)
6. [User Management](#user-management)
7. [Investigator Management](#investigator-management)
8. [Prosecutor Assignment](#prosecutor-assignment)
9. [Evidence Management](#evidence-management)
10. [Document Management](#document-management)
11. [Witness Management](#witness-management)
12. [Victim Management](#victim-management)
13. [Reports and Analytics](#reports-and-analytics)
14. [Notifications and Alerts](#notifications-and-alerts)
15. [Audit Trail](#audit-trail)
16. [System Settings](#system-settings)
17. [Mobile Access](#mobile-access)
18. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### **System Requirements**
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet**: Stable connection (minimum 2 Mbps)
- **Screen Resolution**: 1024x768 minimum
- **JavaScript**: Must be enabled
- **Cookies**: Must be enabled

### **First-Time Setup**
1. **System URL**: `http://localhost:3550` (or your organization's URL)
2. **Bookmark the page** for easy access
3. **Check browser compatibility**:
   - Click "Test Browser" on login page
   - Resolve any compatibility issues
4. **Clear browser cache** (recommended):
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Select "All time"
   - Check "Cached images and files"
   - Click "Clear data"

---

## 🔐 System Login

### **Step 1: Access Login Page**
1. Open browser
2. Enter system URL: `http://localhost:3550`
3. Press Enter
4. Login page will appear

### **Step 2: Enter Credentials**
```
Username Field: [Type your username]
Password Field: [Type your password]
Remember Me: [Optional - Check for 30 days]
```

### **Step 3: Login Process**
1. **Enter Username**:
   - Format examples:
     - `lagos.admin` (State Admin)
     - `john.doe` (Case Worker)
     - `nadmin.admin` (Federal Admin)
2. **Enter Password**:
   - Default: `admin123` (change on first login)
   - Case-sensitive
   - Minimum 8 characters
3. **Click "Sign In"** button
4. **Wait for authentication** (2-5 seconds)

### **Step 4: Successful Login**
- **Redirect**: You'll go to your dashboard
- **Welcome Message**: Shows your name and role
- **Session**: Active for 8 hours
- **Last Login**: Displayed in profile

### **Login Issues - Step-by-Step Solutions**

#### **Problem: Invalid Credentials**
1. **Check Username Spelling**:
   - Verify no spaces before/after
   - Check for typos
   - Confirm correct format
2. **Check Password**:
   - Ensure Caps Lock is OFF
   - Try password reset if forgotten
3. **Try Again**: Click "Sign In" again
4. **Contact Admin**: If still fails

#### **Problem: Account Locked**
1. **Wait 15 Minutes**: Automatic unlock
2. **Contact Administrator**: For immediate unlock
3. **Reset Password**: If you suspect security issue

#### **Problem: Page Not Loading**
1. **Check Internet Connection**
2. **Try Different Browser**
3. **Clear Browser Cache**
4. **Check System Status**: Contact IT

---

## 🎮 Dashboard Navigation

### **Dashboard Layout Overview**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo | Breadcrumbs | User Profile | Logout     │
├─────────────────────────────────────────────────────────┤
│ Sidebar              │ Main Content Area                │
│ ├ Dashboard          │                                  │
│ ├ Cases              │                                  │
│ ├ Search             │                                  │
│ ├ Reports            │                                  │
│ ├ Users              │                                  │
│ ├ Settings           │                                  │
│ └ Help               │                                  │
└─────────────────────────────────────────────────────────┘
```

### **Step 1: Understanding the Sidebar**
1. **Main Navigation** (Left side):
   - 🏠 **Dashboard**: Your main landing page
   - 📁 **Cases**: Case management hub
   - 🔍 **Search**: Advanced search functionality
   - 📊 **Reports**: Analytics and reporting
   - 👥 **Users**: User management (if authorized)
   - ⚙️ **Settings**: System configuration
   - ❓ **Help**: Support and documentation

2. **Click on Menu Items**:
   - Single click opens the section
   - Active item highlighted in blue
   - Content loads in main area

### **Step 2: Header Navigation**
1. **Breadcrumbs**: Shows current location
   - Example: `Dashboard > Cases > New Case`
2. **User Profile** (Top-right):
   - Click your name to see profile options
   - View access level and tenant
   - Change password
   - View activity log

### **Step 3: Main Content Area**
1. **Dynamic Content**: Changes based on menu selection
2. **Tabs and Forms**: Interactive elements
3. **Tables and Lists**: Data display
4. **Action Buttons**: Primary and secondary actions

### **Step 4: Keyboard Shortcuts**
- **Ctrl+K**: Quick search
- **Ctrl+N**: New case (if permitted)
- **Esc**: Close modal/popup
- **Tab**: Navigate between fields
- **Enter**: Submit forms

---

## 📁 Case Management

### **🔍 Viewing Cases - Step by Step**

#### **Step 1: Access Case List**
1. Click **"Cases"** in sidebar
2. Case list loads with default filters:
   ```
   Status: All
   Date Range: Last 30 days
   Assigned to: Me
   ```
3. Review list columns:
   - Case Number (click to view)
   - Title
   - Status (color-coded)
   - Priority (High/Medium/Low)
   - Created Date
   - Assigned To
   - Actions

#### **Step 2: Filter Cases**
1. **Status Filter**:
   - Click "All Statuses" dropdown
   - Select: New, Under Investigation, Pending Approval, Approved, Closed
2. **Priority Filter**:
   - Click "Priority" dropdown
   - Select: Low, Medium, High, Urgent
3. **Date Range**:
   - Click "Start Date" field
   - Select date from calendar
   - Click "End Date" field
   - Select end date
4. **Assigned To**:
   - Click "Assigned To" dropdown
   - Select user or "All Users"
5. **Click "Apply Filters"**

#### **Step 3: Sort Cases**
1. **Click Column Headers**:
   - Case Number: Sort A-Z or Z-A
   - Created Date: Sort newest or oldest
   - Priority: Sort by urgency
2. **Sort Direction**: Click again to reverse

#### **Step 4: View Case Details**
1. **Click Case Number** (blue link)
2. **Case Overview Loads**:
   ```
   Case Number: LA-2026-001234
   Status: Under Investigation
   Priority: High
   Created: Jan 4, 2026
   Assigned To: John Doe
   ```
3. **Review Case Sections**:
   - **Overview**: Basic case information
   - **Victims**: Victim details
   - **Perpetrators**: Accused information
   - **Evidence**: Collected evidence
   - **Witnesses**: Witness statements
   - **Documents**: Related files
   - **Activities**: Investigation log
   - **Notes**: Internal notes

### **➕ Creating New Cases - Step by Step**

#### **Step 1: Start New Case**
1. Click **"New Case"** button (top right)
2. **OR** use keyboard shortcut **Ctrl+N**
3. **New Case Form Opens** with tabs

#### **Step 2: Basic Information Tab**
1. **Case Title**:
   ```
   Enter: "SGBV Case - Victim Name - Location"
   Example: "SGBV Case - Jane Doe - Lagos Island"
   ```
2. **Description**:
   ```
   Write detailed description:
   - What happened
   - When it happened
   - Where it happened
   - How it was reported
   ```
3. **Incident Date**:
   - Click date field
   - Select date from calendar
   - Time auto-sets to current time
4. **Incident State**:
   - Click dropdown
   - Select state from list
5. **Incident LGA**:
   - Click dropdown
   - Select local government
6. **Incident Address**:
   ```
   Enter full address:
   House Number, Street Name
   Area, City
   State, Postal Code
   ```
7. **Case Type**:
   - Click dropdown
   - Select appropriate SGBV type
8. **Priority**:
   - Select: Low, Medium, High, Urgent
   - Consider: Victim safety, evidence preservation
9. **Click "Next"**

#### **Step 3: Victim Information Tab**
1. **Click "Add Victim"**
2. **Fill Victim Details**:
   ```
   First Name: [Victim's first name]
   Last Name: [Victim's last name]
   Middle Name: [Optional]
   Date of Birth: [DD/MM/YYYY]
   Age: [Calculated automatically]
   Gender: [Select from dropdown]
   Nationality: [Default: Nigerian]
   State of Origin: [Select state]
   LGA of Origin: [Select LGA]
   Address: [Full residential address]
   Phone Number: [With country code]
   Email: [If available]
   Occupation: [Victim's occupation]
   Marital Status: [Select from dropdown]
   Religion: [Optional]
   Education Level: [Select highest level]
   Disability: [If any]
   Relationship to Perpetrator: [Select relationship]
   ```
3. **Click "Save Victim"**
4. **Add Multiple Victims** (if applicable):
   - Click "Add Another Victim"
   - Repeat process
5. **Click "Next"**

#### **Step 4: Perpetrator Information Tab**
1. **Click "Add Perpetrator"**
2. **Fill Perpetrator Details**:
   ```
   First Name: [Perpetrator's first name]
   Last Name: [Perpetrator's last name]
   Middle Name: [Optional]
   Date of Birth: [If known]
   Age: [If known]
   Gender: [Select from dropdown]
   Nationality: [If known]
   Address: [Last known address]
   Phone Number: [If known]
   Email: [If known]
   Occupation: [Perpetrator's occupation]
   Relationship to Victim: [Select from dropdown]
   Known Information: [Describe what you know]
   Risk Level: [Low/Medium/High]
   ```
3. **Click "Save Perpetrator"**
4. **Add Multiple Perpetrators** (if applicable):
   - Click "Add Another Perpetrator"
   - Repeat process
5. **Click "Next"**

#### **Step 5: Initial Evidence Tab**
1. **Click "Add Evidence"**
2. **Fill Evidence Details**:
   ```
   Evidence Type: [Document/Photo/Video/Physical/Testimony]
   Description: [Describe the evidence]
   Collection Date: [Date collected]
   Collected By: [Your name]
   Location: [Where evidence was found]
   Chain of Custody: [Who handled evidence]
   Storage Location: [Where evidence is stored]
   ```
3. **Upload Digital Evidence** (if applicable):
   - Click "Choose File"
   - Select file from computer
   - Wait for upload completion
4. **Click "Save Evidence"**
5. **Click "Next"**

#### **Step 6: Review and Submit**
1. **Review All Information**:
   - Check for completeness
   - Verify accuracy
   - Ensure sensitive data is protected
2. **Add Internal Notes** (optional):
   ```
   Initial assessment notes:
   - Immediate actions taken
   - Victim protection measures
   - Evidence preservation steps
   - Next steps planned
   ```
3. **Click "Create Case"**
4. **Case Created Successfully**:
   - Case number generated
   - Case assigned to you
   - Initial status: "New"

### **✏️ Editing Cases - Step by Step**

#### **Step 1: Open Case for Editing**
1. Navigate to case list
2. Find the case to edit
3. Click case number
4. Click **"Edit Case"** button

#### **Step 2: Edit Basic Information**
1. **Modify Fields**:
   - Update case title
   - Edit description
   - Change priority
   - Update status
2. **Add to Description**:
   - Click "Add Update"
   - Enter new information
   - Mark as "Significant Update" if important
3. **Click "Save Changes"**

#### **Step 3: Edit Victim Information**
1. Go to "Victims" tab
2. Click **"Edit"** next to victim
3. **Update Information**:
   - Correct personal details
   - Add contact information
   - Update protection status
4. **Click "Update Victim"**

#### **Step 4: Manage Evidence**
1. Go to "Evidence" tab
2. **Add New Evidence**:
   - Click "Add Evidence"
   - Fill evidence details
   - Upload files if needed
3. **Edit Existing Evidence**:
   - Click "Edit" next to evidence
   - Update information
   - Add additional notes

### **🗑️ Deleting Cases - Step by Step**

#### **Step 1: Request Case Deletion**
1. Open the case
2. Click **"Actions"** dropdown
3. Select **"Request Deletion"**
4. **Fill Deletion Request**:
   ```
   Reason for Deletion:
   [Select reason from dropdown]
   - Duplicate case
   - Incorrect information
   - Not SGBV related
   - Other (specify)
   
   Justification:
   [Detailed explanation]
   ```
5. **Click "Submit Request"**

#### **Step 2: Approval Process**
1. **Request Sent to Supervisor**
2. **Supervisor Review**:
   - Reviews deletion request
   - Approves or rejects
   - Adds comments if rejected
3. **Notification**:
   - You receive email notification
   - Check case status

---

## 🔍 Search Functionality

### **🎯 Basic Search - Step by Step**

#### **Step 1: Access Search**
1. Click **"Search"** in sidebar
2. **OR** press **Ctrl+K** from anywhere
3. **Search Panel Opens**

#### **Step 2: Basic Search**
1. **Enter Search Terms**:
   ```
   Examples:
   - Case number: "LA-2026-001234"
   - Victim name: "Jane Doe"
   - Location: "Lagos Island"
   - Partial match: "Jane"
   ```
2. **Select Search Type**:
   - All Fields (default)
   - Case Number Only
   - Victim Name Only
   - Location Only
3. **Click "Search"** or press **Enter**

#### **Step 3: Review Results**
1. **Results Display**:
   - Total results found
   - List of matching cases
   - Relevance score
2. **Sort Results**:
   - By relevance (default)
   - By date (newest/oldest)
   - By priority

### **🔍 Advanced Search - Step by Step**

#### **Step 1: Open Advanced Search**
1. Click **"Advanced Search"** tab
2. **Multiple Search Fields Appear**

#### **Step 2: Case Information Search**
1. **Case Number**:
   - Exact match: "LA-2026-001234"
   - Partial match: "LA-2026"
   - Wildcard: "LA-*"
2. **Case Title**:
   - Keywords: "sexual assault"
   - Exact phrase: "sexual violence"
3. **Date Range**:
   - Start Date: Click calendar, select date
   - End Date: Click calendar, select date
4. **Status**:
   - Multiple selection allowed
   - Check all applicable statuses
5. **Priority**:
   - Single or multiple selection
6. **Case Type**:
   - Select SGBV categories

#### **Step 3: Location Search**
1. **Incident State**:
   - Select one or multiple states
2. **Incident LGA**:
   - Select local government areas
3. **Address Search**:
   - Street name: "Allen Avenue"
   - Area: "Victoria Island"
   - Full address: "123 Allen Avenue, Lagos"

#### **Step 4: People Search**
1. **Victim Information**:
   - Name: "Jane Doe"
   - Age Range: "18-25"
   - Gender: "Female"
2. **Perpetrator Information**:
   - Name: "John Smith"
   - Known aliases: "Johnny"
3. **Witness Information**:
   - Name: "Witness Name"
   - Contact information

#### **Step 5: Evidence and Documents**
1. **Evidence Type**:
   - Document, Photo, Video, Physical
2. **Document Search**:
   - File name: "medical_report.pdf"
   - Document type: "Medical Report"
3. **Upload Date Range**:
   - When evidence was added

#### **Step 6: Assigned Personnel**
1. **Investigator**:
   - Name: "John Doe"
   - Badge number: "12345"
2. **Prosecutor**:
   - Name: "Jane Smith"
   - Bar number: "NG/98765"
3. **Supervisor**:
   - Name: "Admin User"

#### **Step 7: Execute Search**
1. **Review All Criteria**:
   - Check all filled fields
   - Ensure correct dates
   - Verify spelling
2. **Click "Advanced Search"**
3. **Wait for Results** (5-30 seconds)

#### **Step 8: Save Search**
1. **Click "Save Search"**
2. **Name Your Search**:
   ```
   Examples:
   - "High Priority Cases - Lagos"
   - "Cases Assigned to John Doe"
   - "Last Month's Sexual Assault Cases"
   ```
3. **Set Notification** (optional):
   - Email when new matches found
   - Daily/Weekly/Monthly
4. **Click "Save Search"**

### **📊 Search Results Management**

#### **Step 1: Filter Results**
1. **Quick Filters**:
   - My Cases Only
   - Last 7 Days
   - High Priority
2. **Custom Filters**:
   - Add/remove criteria
   - Adjust date ranges
   - Modify search terms

#### **Step 2: Export Results**
1. **Select Export Format**:
   - Excel (.xlsx)
   - PDF (.pdf)
   - CSV (.csv)
2. **Choose Columns**:
   - Case Number
   - Title
   - Status
   - Priority
   - Assigned To
   - Created Date
3. **Click "Export"**
4. **Download File**

#### **Step 3: Save to Case List**
1. **Select Cases**:
   - Check individual cases
   - Check "Select All"
2. **Click "Add to Case List"**
3. **Name the List**:
   ```
   Examples:
   - "Cases for Review"
   - "Urgent Cases"
   - "Monthly Report Cases"
   ```
4. **Access Saved Lists**:
   - Click "My Lists" in sidebar
   - Select list to view

---

## 👥 User Management

### **👤 Viewing Users - Step by Step**

#### **Step 1: Access User Management**
1. Click **"Users"** in sidebar
2. **User List Loads** (if you have permission)
3. **Review User Columns**:
   - Name
   - Username
   - Email
   - Access Level
   - Status (Active/Inactive)
   - Last Login
   - Actions

#### **Step 2: Filter Users**
1. **Access Level Filter**:
   - Select specific levels
   - Multiple selection allowed
2. **Status Filter**:
   - Active Users
   - Inactive Users
   - Locked Accounts
3. **Department Filter**:
   - Select departments
4. **Search Users**:
   - By name
   - By username
   - By email

### **➕ Creating New Users - Step by Step**

#### **Step 1: Start User Creation**
1. Click **"Add New User"** button
2. **User Creation Form Opens**

#### **Step 2: Basic Information**
1. **Personal Details**:
   ```
   First Name: [User's first name]
   Last Name: [User's last name]
   Middle Name: [Optional]
   Email: [Official email address]
   Phone Number: [With country code]
   ```
2. **Account Information**:
   ```
   Username: [Format: firstname.lastname]
   Temporary Password: [Auto-generated]
   Access Level: [Select appropriate level]
   Department: [Select department]
   ```
3. **Contact Information**:
   ```
   Office Address: [Office location]
   Office Phone: [Office number]
   Mobile: [Personal number]
   Emergency Contact: [Name and phone]
   ```

#### **Step 3: Access Permissions**
1. **Select Access Level**:
   - Level 1: Basic Access
   - Level 2: Case Worker
   - Level 3: Supervisor
   - Level 4: State Administrator
   - Level 5: Director
   - Super Admin: System Administrator
2. **Review Permissions**:
   - System shows permissions for selected level
   - Check if appropriate for role
3. **Special Permissions** (if applicable):
   - Cross-state access
   - Administrative privileges
   - System configuration access

#### **Step 4: Account Settings**
1. **Login Settings**:
   ```
   Require password change on first login: [Yes/No]
   Account expiration: [Select date or never]
   Login restrictions: [IP addresses, time limits]
   ```
2. **Notification Settings**:
   ```
   Email notifications: [Yes/No]
   SMS notifications: [Yes/No]
   In-app notifications: [Yes/No]
   ```

#### **Step 5: Create User Account**
1. **Review All Information**:
   - Check for accuracy
   - Verify permissions
   - Confirm contact details
2. **Click "Create User"**
3. **Success Message**:
   - User account created
   - Credentials displayed
   - Send credentials to user

#### **Step 6: Send Credentials**
1. **Secure Delivery Options**:
   - Email (encrypted)
   - SMS (secure)
   - In-person delivery
2. **Include Instructions**:
   - Login URL
   - Username
   - Temporary password
   - First login steps
3. **Require Acknowledgment**:
   - User must confirm receipt
   - User must change password

### **✏️ Editing User Accounts - Step by Step**

#### **Step 1: Find User to Edit**
1. Search for user by name or username
2. Click **"Edit"** next to user
3. **User Edit Form Opens**

#### **Step 2: Update Information**
1. **Personal Information**:
   - Update name changes
   - Correct contact details
   - Modify department assignments
2. **Access Level Changes**:
   - Promote user (increase level)
   - Demote user (decrease level)
   - Special permissions
3. **Account Settings**:
   - Reset password
   - Lock/unlock account
   - Set expiration date

#### **Step 3: Save Changes**
1. **Review Modifications**:
   - Check all changed fields
   - Verify permissions
   - Confirm accuracy
2. **Add Change Notes**:
   ```
   Reason for change:
   - Promotion to Supervisor
   - Department transfer
   - Contact information update
   ```
3. **Click "Save Changes"**
4. **Notify User**:
   - Send email notification
   - Include details of changes

### **🗑️ Deactivating Users - Step by Step**

#### **Step 1: Initiate Deactivation**
1. Find user in user list
2. Click **"Actions"** dropdown
3. Select **"Deactivate User"**

#### **Step 2: Deactivation Process**
1. **Select Deactivation Reason**:
   ```
   - Employment terminated
   - Role change
   - Long-term leave
   - Security concern
   - Other (specify)
   ```
2. **Effective Date**:
   - Immediate
   - Future date
3. **Data Handling**:
   - Reassign cases to another user
   - Archive user data
   - Preserve audit trail

#### **Step 3: Confirm Deactivation**
1. **Review Deactivation Summary**:
   - User details
   - Reason for deactivation
   - Data handling plan
2. **Click "Confirm Deactivation"**
3. **Final Confirmation**:
   - "Are you sure?" dialog
   - Type "DEACTIVATE" to confirm
4. **User Account Deactivated**

---

## 🕵️ Investigator Management

### **👥 Viewing Investigators - Step by Step**

#### **Step 1: Access Investigator List**
1. Click **"Investigators"** in sidebar
2. **Investigator List Loads**:
   ```
   Name | Badge Number | Status | Current Cases | Specialization
   ```
3. **Review Investigator Information**:
   - Contact details
   - Current workload
   - Case history
   - Performance metrics

#### **Step 2: Filter Investigators**
1. **Status Filter**:
   - Available
   - Busy (5+ cases)
   - On Leave
   - Inactive
2. **Specialization Filter**:
   - SGBV Specialist
   - Child Protection
   - Domestic Violence
   - General Investigation
3. **Workload Filter**:
   - No cases assigned
   - 1-3 cases
   - 4-6 cases
   - 7+ cases

### **➕ Adding Investigators - Step by Step**

#### **Step 1: Start Investigator Creation**
1. Click **"Add Investigator"** button
2. **Investigator Form Opens**

#### **Step 2: Basic Information**
1. **Personal Details**:
   ```
   First Name: [Investigator's first name]
   Last Name: [Investigator's last name]
   Badge Number: [Unique identifier]
   Email: [Official email]
   Phone: [Official phone]
   ```
2. **Professional Information**:
   ```
   Rank/Grade: [Select from dropdown]
   Department: [Select department]
   Specialization: [Select primary specialization]
   Secondary Specialization: [Optional]
   Years of Experience: [Number]
   Certifications: [List relevant certifications]
   Training Completed: [Check boxes]
   ```

#### **Step 3: Assignment Preferences**
1. **Case Type Preferences**:
   ```
   Preferred Case Types:
   ☐ Sexual Assault
   ☐ Domestic Violence
   ☐ Child Abuse
   ☐ Human Trafficking
   ☐ Elder Abuse
   ```
2. **Geographic Preferences**:
   ```
   Preferred LGAs:
   ☐ Lagos Mainland
   ☐ Lagos Island
   ☐ Ikeja
   ☐ Surulere
   ```
3. **Workload Preferences**:
   ```
   Maximum Concurrent Cases: [Number]
   Preferred Case Complexity: [Low/Medium/High]
   Available for Emergency: [Yes/No]
   ```

#### **Step 4: Create Investigator Profile**
1. **Review All Information**:
   - Check for completeness
   - Verify certifications
   - Confirm contact details
2. **Set Initial Status**:
   - Available for assignment
   - On training
   - Temporary leave
3. **Click "Create Investigator"**
4. **Success Confirmation**:
   - Investigator profile created
   - Badge number assigned
   - Account setup initiated

### **🔄 Assigning Investigators - Step by Step**

#### **Step 1: Select Case for Assignment**
1. Navigate to case list
2. Find unassigned case
3. Click **"Assign Investigator"**

#### **Step 2: Choose Investigator**
1. **Available Investigators Display**:
   ```
   Name: John Doe
   Badge: INV-001
   Current Cases: 2
   Specialization: SGBV
   Rating: 4.5/5
   ```
2. **Filter Options**:
   - Available only
   - Matching specialization
   - Geographic preference
   - Workload capacity
3. **Select Best Match**:
   - Consider case complexity
   - Match specialization
   - Check availability
   - Review performance

#### **Step 3: Assignment Details**
1. **Assignment Information**:
   ```
   Case Number: LA-2026-001234
   Investigator: John Doe (INV-001)
   Assignment Date: [Current date]
   Expected Duration: [Estimated days]
   Priority Level: [Case priority]
   Special Instructions: [Specific requirements]
   ```
2. **Resource Allocation**:
   - Vehicle needed: [Yes/No]
   - Equipment needed: [List]
   - Backup support: [Yes/No]
   - Budget allocation: [Amount]

#### **Step 4: Confirm Assignment**
1. **Review Assignment Summary**:
   - Case details
   - Investigator information
   - Resource requirements
   - Timeline expectations
2. **Notify Investigator**:
   - Send email notification
   - Include case details
   - Provide contact information
3. **Click "Confirm Assignment"**

### **📊 Managing Investigator Workload - Step by Step**

#### **Step 1: Review Workload Dashboard**
1. Click **"Investigator Workload"**
2. **Dashboard Shows**:
   ```
   Total Investigators: 25
   Available: 8
   Busy (1-3 cases): 12
   Overloaded (4+ cases): 5
   On Leave: 3
   ```

#### **Step 2: Analyze Individual Workload**
1. **Click Investigator Name**
2. **View Detailed Workload**:
   ```
   Current Cases: 4
   - LA-2026-001234 (High Priority)
   - LA-2026-001235 (Medium Priority)
   - LA-2026-001236 (Low Priority)
   - LA-2026-001237 (High Priority)
   
   Average Case Duration: 15 days
   Success Rate: 94%
   Client Satisfaction: 4.6/5
   ```

#### **Step 3: Rebalance Workload**
1. **Identify Overloaded Investigators**:
   - 4+ active cases
   - High priority cases only
   - Complex cases
2. **Redistribution Options**:
   - Transfer cases to available investigators
   - Provide backup support
   - Extend deadlines
   - Add temporary staff
3. **Implement Changes**:
   - Select cases to reassign
   - Choose new investigators
   - Update case assignments
   - Notify all parties

---

## ⚖️ Prosecutor Assignment

### **👥 Viewing Prosecutors - Step by Step**

#### **Step 1: Access Prosecutor List**
1. Click **"Prosecutors"** in sidebar
2. **Prosecutor List Loads**:
   ```
   Name | Bar Number | Specialization | Active Cases | Success Rate
   ```
3. **Review Prosecutor Profiles**:
   - Contact information
   - Legal specialization
   - Case history
   - Performance metrics

#### **Step 2: Filter Prosecutors**
1. **Specialization Filter**:
   - SGBV Law
   - Criminal Law
   - Family Law
   - Human Rights Law
2. **Availability Filter**:
   - Available for new cases
   - Limited availability
   - Not available
3. **Experience Filter**:
   - Junior (0-5 years)
   - Mid-level (5-15 years)
   - Senior (15+ years)

### **⚖️ Assigning Prosecutors - Step by Step**

#### **Step 1: Select Case for Prosecution**
1. Navigate to case list
2. Filter for "Approved" cases
3. Find case needing prosecutor
4. Click **"Assign Prosecutor"**

#### **Step 2: Choose Prosecutor**
1. **Available Prosecutors Display**:
   ```
   Name: Jane Smith
   Bar Number: NG/98765
   Specialization: SGBV Law
   Active Cases: 3
   Success Rate: 96%
   Experience: 12 years
   ```
2. **Selection Criteria**:
   - Legal specialization matches case type
   - Experience level appropriate
   - Current workload allows new case
   - Historical success rate
3. **View Prosecutor Profile**:
   - Click prosecutor name
   - Review case history
   - Check specialization
   - Verify availability

#### **Step 3: Assignment Details**
1. **Legal Assignment Information**:
   ```
   Case Number: LA-2026-001234
   Prosecutor: Jane Smith (NG/98765)
   Assignment Date: [Current date]
   Legal Basis: [Relevant laws]
   Case Complexity: [Low/Medium/High]
   Expected Trial Date: [Estimated date]
   ```
2. **Case File Transfer**:
   - Evidence list
   - Witness statements
   - Police reports
   - Medical reports
   - Previous legal actions
3. **Resource Requirements**:
   - Legal research support
   - Expert witnesses needed
   - Specialized equipment
   - Travel requirements

#### **Step 4: Legal Instructions**
1. **Prosecution Strategy**:
   ```
   Primary Charges: [List charges]
   Secondary Charges: [List additional charges]
   Evidence Priority: [Key evidence to focus on]
   Witness Preparation: [Witnesses needing preparation]
   Legal Precedents: [Relevant case law]
   ```
2. **Timeline Requirements**:
   - File charges by: [Date]
   - Witness preparation: [Date]
   - Pre-trial motions: [Date]
   - Trial date: [Date]

#### **Step 5: Confirm Assignment**
1. **Review Legal Assignment**:
   - Prosecutor qualifications
   - Case complexity match
   - Resource availability
   - Timeline feasibility
2. **Legal Documentation**:
   - Generate assignment letter
   - Include case file summary
   - Provide legal authority
   - Set expectations
3. **Notify Prosecutor**:
   - Send official assignment
   - Include case file access
   - Provide contact information
   - Set up initial meeting

### **📊 Managing Prosecutor Caseload - Step by Step**

#### **Step 1: Review Prosecutor Dashboard**
1. Click **"Prosecutor Management"**
2. **Dashboard Shows**:
   ```
   Total Prosecutors: 12
   Available: 4
   Moderate Load (1-3 cases): 6
   Heavy Load (4+ cases): 2
   On Leave: 1
   ```

#### **Step 2: Analyze Case Distribution**
1. **Case Type Distribution**:
   ```
   Sexual Assault: 45%
   Domestic Violence: 30%
   Child Abuse: 15%
   Human Trafficking: 10%
   ```
2. **Success Rate Analysis**:
   - By prosecutor
   - By case type
   - By complexity
   - By time period

#### **Step 3: Optimize Assignments**
1. **Identify Issues**:
   - Overloaded prosecutors
   - Case type mismatches
   - Success rate concerns
   - Timeline delays
2. **Redistribution Strategy**:
   - Reassign complex cases
   - Balance workload
   - Provide support resources
   - Adjust timelines

---

## 📁 Evidence Management

### **🔍 Viewing Evidence - Step by Step**

#### **Step 1: Access Case Evidence**
1. Open the relevant case
2. Click **"Evidence"** tab
3. **Evidence List Displays**:
   ```
   Evidence ID | Type | Description | Collection Date | Chain of Custody
   ```

#### **Step 2: Filter Evidence**
1. **Evidence Type Filter**:
   - Documents
   - Photos
   - Videos
   - Physical Evidence
   - Testimony
2. **Date Range Filter**:
   - Collection date range
   - Upload date range
3. **Status Filter**:
   - Processed
   - Pending Analysis
   - In Storage
   - Presented in Court

### **➕ Adding Evidence - Step by Step**

#### **Step 1: Start Evidence Addition**
1. Open case
2. Click **"Evidence"** tab
3. Click **"Add Evidence"** button

#### **Step 2: Evidence Details**
1. **Basic Information**:
   ```
   Evidence Type: [Select from dropdown]
   Description: [Detailed description]
   Collection Date: [Date/time collected]
   Collection Location: [Where evidence was found]
   Collected By: [Name of collector]
   Witness Present: [Names of witnesses]
   ```
2. **Physical Evidence**:
   ```
   Item Description: [Physical description]
   Serial Numbers: [If applicable]
   Condition: [Good/Fair/Poor/Damaged]
   Storage Requirements: [Special storage needs]
   Handling Instructions: [Special handling needed]
   ```
3. **Digital Evidence**:
   ```
   File Type: [Document/Image/Video/Audio]
   File Size: [Auto-calculated]
   Original Format: [File format]
   Metadata: [Technical details]
   Hash Value: [Auto-generated]
   ```

#### **Step 3: Chain of Custody**
1. **Custody Information**:
   ```
   Current Custodian: [Name]
   Storage Location: [Secure location]
   Access Log: [Who accessed when]
   Transfer History: [Chain of transfers]
   ```
2. **Security Measures**:
   - Access restrictions
   - Storage requirements
   - Handling protocols
   - Backup procedures

#### **Step 4: Upload Digital Evidence**
1. **Select Files**:
   - Click "Choose Files"
   - Select one or multiple files
   - Maximum file size: 100MB per file
2. **Upload Process**:
   - Files upload with progress bar
   - Virus scan performed
   - Hash values calculated
   - Metadata extracted
3. **Verification**:
   - Review uploaded files
   - Confirm file integrity
   - Check for completeness

#### **Step 5: Save Evidence**
1. **Review All Information**:
   - Check evidence details
   - Verify chain of custody
   - Confirm file uploads
2. **Add Internal Notes**:
   ```
   Evidence Notes:
   - Initial assessment
   - Preservation methods used
   - Analysis requirements
   - Legal significance
   ```
3. **Click "Save Evidence"**
4. **Evidence Added Successfully**:
   - Evidence ID assigned
   - Added to evidence log
   - Notifications sent

### **✏️ Managing Evidence - Step by Step**

#### **Step 1: Edit Evidence Information**
1. Find evidence in list
2. Click **"Edit"** next to evidence
3. **Update Information**:
   - Correct descriptions
   - Add collection details
   - Update chain of custody
   - Modify storage requirements

#### **Step 2: Evidence Analysis**
1. **Request Analysis**:
   - Click "Request Analysis"
   - Select analysis type:
     - Forensic analysis
     - Digital examination
     - Chemical testing
     - Expert review
2. **Track Analysis Progress**:
   - Pending requests
   - In-progress analysis
   - Completed reports
   - Expert findings

#### **Step 3: Evidence Presentation**
1. **Mark for Court**:
   - Select evidence for trial
   - Add presentation notes
   - Prepare exhibit list
2. **Court Preparation**:
   - Generate exhibit labels
   - Prepare presentation materials
   - Create evidence summaries

---

## 📄 Document Management

### **📁 Viewing Documents - Step by Step**

#### **Step 1: Access Case Documents**
1. Open the relevant case
2. Click **"Documents"** tab
3. **Document List Displays**:
   ```
   Document Name | Type | Upload Date | Size | Uploaded By | Status
   ```

#### **Step 2: Filter Documents**
1. **Document Type Filter**:
   - Police Reports
   - Medical Reports
   - Court Documents
   - Victim Statements
   - Evidence Photos
   - Legal Documents
2. **Date Range Filter**:
   - Upload date range
   - Document date range
3. **Status Filter**:
   - Processed
   - Pending Review
   - Approved
   - Archived

### **➕ Uploading Documents - Step by Step**

#### **Step 1: Start Document Upload**
1. Open case
2. Click **"Documents"** tab
3. Click **"Upload Document"** button

#### **Step 2: Document Information**
1. **Basic Details**:
   ```
   Document Title: [Descriptive title]
   Document Type: [Select from dropdown]
   Document Date: [Date document was created]
   Description: [Detailed description]
   Keywords: [Search terms]
   ```
2. **Classification**:
   ```
   Sensitivity Level: [Public/Internal/Confidential]
   Access Restrictions: [Who can view]
   Retention Period: [How long to keep]
   Legal Hold: [Required for litigation]
   ```

#### **Step 3: File Upload**
1. **Select Files**:
   - Click "Choose Files"
   - Select one or multiple files
   - Supported formats: PDF, DOC, DOCX, JPG, PNG, MP4
   - Maximum size: 50MB per file
2. **Upload Process**:
   - Files upload with progress indicator
   - Virus scanning performed
   - File validation completed
   - Thumbnails generated (for images)

#### **Step 4: Document Processing**
1. **OCR Processing** (for scanned documents):
   - Text extraction
   - Searchable content
   - Indexing for search
2. **Metadata Extraction**:
   - Author information
   - Creation date
   - Modification history
3. **Quality Check**:
   - File integrity verified
   - Content quality assessed
   - Format compatibility checked

#### **Step 5: Save Document**
1. **Review Document Information**:
   - Check title and description
   - Verify classification
   - Confirm access settings
2. **Add Tags**:
   - Add relevant keywords
   - Categorize for easy search
   - Link to related documents
3. **Click "Upload Document"**
4. **Document Uploaded Successfully**:
   - Document ID assigned
   - Added to document index
   - Notifications sent

### **📊 Document Management - Step by Step**

#### **Step 1: Organize Documents**
1. **Create Folders**:
   - Click "Create Folder"
   - Name folder descriptively
   - Set access permissions
2. **Move Documents**:
   - Select documents
   - Choose destination folder
   - Confirm move operation
3. **Tag Documents**:
   - Add descriptive tags
   - Categorize by type
   - Mark for quick access

#### **Step 2: Document Search**
1. **Basic Search**:
   - Search by title
   - Search by content
   - Search by tags
2. **Advanced Search**:
   - Filter by document type
   - Filter by date range
   - Filter by author
   - Filter by classification

#### **Step 3: Document Sharing**
1. **Internal Sharing**:
   - Select documents
   - Choose recipients
   - Set permission level
   - Add expiration date
2. **External Sharing**:
   - Create secure link
   - Set access restrictions
   - Monitor access logs
   - Revoke access when needed

---

## 📊 Reports and Analytics

### **📈 Generating Reports - Step by Step**

#### **Step 1: Access Reports**
1. Click **"Reports"** in sidebar
2. **Report Dashboard Opens**:
   ```
   Available Reports:
   - Summary Reports
   - Case Reports
   - Analytics Reports
   - Export Data
   ```

#### **Step 2: Summary Report**
1. **Select Summary Report**:
   - Click "Generate Summary"
2. **Set Report Parameters**:
   ```
   Date Range: [Start date to End date]
   Jurisdiction: [Select state/LGA]
   Case Status: [Select statuses]
   Include Charts: [Yes/No]
   ```
3. **Generate Report**:
   - Click "Generate Report"
   - Wait for processing (10-30 seconds)
   - Report displays with:
     - Total cases
     - Status breakdown
     - Priority distribution
     - Trend analysis

#### **Step 3: Detailed Case Report**
1. **Select Case Report**:
   - Click "Detailed Cases"
2. **Configure Report**:
   ```
   Include Fields:
   ☐ Case Details
   ☐ Victim Information
   ☐ Perpetrator Information
   ☐ Evidence List
   ☐ Investigation Notes
   ☐ Legal Actions
   ```
3. **Set Filters**:
   - Date range
   - Case status
   - Priority level
   - Assigned investigator
4. **Generate Report**:
   - Click "Generate Report"
   - Review results
   - Export if needed

#### **Step 4: Analytics Report**
1. **Select Analytics**:
   - Click "Analytics Report"
2. **Choose Analysis Type**:
   ```
   Trend Analysis:
   - Case volume trends
   - Resolution time trends
   - Geographic distribution
   
   Performance Analysis:
   - Investigator performance
   - Prosecutor success rates
   - System performance
   
   Compliance Analysis:
   - Policy compliance
   - Timeline adherence
   - Quality metrics
   ```
3. **Set Analysis Parameters**:
   - Time period
   - Comparison periods
   - Metrics to include
4. **Generate Analysis**:
   - Click "Generate Analysis"
   - View interactive charts
   - Drill down into details

#### **Step 5: Export Data**
1. **Select Export Format**:
   - Excel (.xlsx)
   - PDF (.pdf)
   - CSV (.csv)
2. **Choose Data to Export**:
   ```
   Export Options:
   ☐ Case Data
   ☐ User Information
   ☐ Financial Data
   ☐ Audit Logs
   ```
3. **Configure Export**:
   - Date range
   - Data fields
   - Format options
4. **Execute Export**:
   - Click "Export Data"
   - Wait for processing
   - Download file

### **📊 Custom Reports - Step by Step**

#### **Step 1: Create Custom Report**
1. Click **"Custom Reports"**
2. **Click "Create New Report"**
3. **Report Builder Opens**

#### **Step 2: Define Report Structure**
1. **Basic Information**:
   ```
   Report Name: [Descriptive name]
   Description: [Report purpose]
   Category: [Select category]
   Schedule: [Run frequency]
   ```
2. **Data Source**:
   - Select tables to query
   - Define relationships
   - Set join conditions
3. **Fields Selection**:
   - Choose display fields
   - Set field aliases
   - Define calculations

#### **Step 3: Add Filters and Conditions**
1. **Filter Configuration**:
   ```
   Dynamic Filters:
   - Date Range (User selectable)
   - Status (User selectable)
   - Location (User selectable)
   
   Static Filters:
   - Specific conditions
   - Fixed values
   - System constraints
   ```
2. **Conditional Logic**:
   - Set IF/THEN conditions
   - Define business rules
   - Create calculated fields

#### **Step 4: Design Report Layout**
1. **Layout Options**:
   - Table format
   - Chart format
   - Summary format
   - Custom format
2. **Visual Design**:
   - Choose color scheme
   - Set font preferences
   - Configure headers/footers
3. **Interactive Elements**:
   - Drill-down capabilities
   - Filter controls
   - Export options

#### **Step 5: Save and Schedule**
1. **Save Report**:
   - Click "Save Report"
   - Test report generation
   - Validate results
2. **Schedule Report**:
   - Set run frequency
   - Define recipients
   - Configure delivery
3. **Share Report**:
   - Set access permissions
   - Share with users
   - Monitor usage

---

## 📱 Mobile Access

### **📲 Accessing System on Mobile - Step by Step**

#### **Step 1: Mobile Browser Setup**
1. **Open Mobile Browser**:
   - Safari (iPhone/iPad)
   - Chrome (Android)
   - Edge (Windows Phone)
2. **Enter System URL**:
   - Type: `http://localhost:3550`
   - Add to home screen (optional)
3. **Login**:
   - Enter credentials
   - Click "Sign In"

#### **Step 2: Mobile Navigation**
1. **Responsive Layout**:
   - Menu collapses to hamburger
   - Content adjusts to screen
   - Touch-friendly buttons
2. **Swipe Gestures**:
   - Swipe left/right for navigation
   - Pull to refresh
   - Pinch to zoom

#### **Step 3: Mobile Features**
1. **Quick Actions**:
   - Create new case
   - Upload photos
   - Add notes
   - Search cases
2. **Field Work**:
   - GPS location capture
   - Photo evidence upload
   - Offline mode (limited)
   - Voice notes

---

## 🔧 Troubleshooting

### **🌐 Common Issues and Solutions**

#### **Login Problems**
1. **Forgot Password**:
   - Click "Forgot Password"
   - Enter email/username
   - Check email for reset link
   - Create new password
2. **Account Locked**:
   - Wait 15 minutes
   - Contact administrator
   - Reset password if needed
3. **Browser Issues**:
   - Clear cache and cookies
   - Try different browser
   - Check JavaScript enabled
   - Disable pop-up blockers

#### **Performance Issues**
1. **Slow Loading**:
   - Check internet speed
   - Close other tabs
   - Clear browser cache
   - Try off-peak hours
2. **Search Not Working**:
   - Check spelling
   - Use broader terms
   - Clear filters
   - Contact support

#### **Data Issues**
1. **Case Not Saving**:
   - Check required fields
   - Verify file formats
   - Check file sizes
   - Try again later
2. **Upload Fails**:
   - Check file size (max 50MB)
   - Verify file format
   - Check internet connection
   - Try smaller files

### **📞 Getting Help**

#### **Self-Service Options**
1. **Online Help**:
   - Click "Help" in sidebar
   - Search knowledge base
   - Watch video tutorials
2. **User Manual**:
   - Download PDF manual
   - Bookmark important sections
   - Print quick reference

#### **Contact Support**
1. **Help Desk**:
   - Phone: [Support Number]
   - Email: support@sgbv.gov.ng
   - Hours: 8 AM - 5 PM, Mon-Fri
2. **Emergency Support**:
   - 24/7 Hotline: [Emergency Number]
   - On-call administrator: [Contact]

#### **Information to Provide**
When requesting help, provide:
- Your username and access level
- Description of the problem
- Error messages (screenshots helpful)
- Steps you've tried
- Urgency level

---

## ✅ Quick Reference Guide

### **Keyboard Shortcuts**
- **Ctrl+K**: Quick search
- **Ctrl+N**: New case
- **Ctrl+S**: Save
- **Ctrl+E**: Export
- **Esc**: Close modal
- **F1**: Help

### **Common Tasks**
1. **Create Case**: Cases → New Case → Fill form → Save
2. **Search Cases**: Search → Enter terms → Filter → View
3. **Assign Investigator**: Case → Assign → Select → Confirm
4. **Generate Report**: Reports → Select type → Set filters → Generate

### **Contact Information**
- **System URL**: `http://localhost:3550`
- **Support Email**: support@sgbv.gov.ng
- **Emergency**: [Emergency Number]

---

**Manual Version**: 2.0  
**Last Updated**: January 4, 2026  
**Next Review**: March 4, 2026

---

*This comprehensive user manual covers all aspects of the CaselogPro2 system. For additional training or support, please contact the help desk.*
