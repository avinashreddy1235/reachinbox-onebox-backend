# Gmail Setup Guide

## Step 1: Create Test Gmail Accounts
1. Go to https://accounts.google.com/signup
2. Create two Gmail accounts for testing:
   - One for outbound emails
   - One for inbound emails

## Step 2: Enable IMAP for Both Accounts
1. Log into Gmail
2. Click the gear icon ⚙️ (Settings)
3. Click "See all settings"
4. Go to the "Forwarding and POP/IMAP" tab
5. In the "IMAP Access" section:
   - Select "Enable IMAP"
   - Click "Save Changes"

## Step 3: Generate App Passwords
1. Go to Google Account settings: https://myaccount.google.com/
2. Click on "Security"
3. Enable "2-Step Verification" if not already enabled
4. Go back to Security and click on "App passwords"
5. Select "Mail" as the app
6. Select "Other" as the device
7. Name it "ReachInbox"
8. Copy the generated 16-character password

## Step 4: Update Environment Variables
1. Open `backend/.env`
2. Update these variables:
   ```
   EMAIL_1=your-first-email@gmail.com
   EMAIL_1_PASSWORD=your-first-app-password
   EMAIL_2=your-second-email@gmail.com
   EMAIL_2_PASSWORD=your-second-app-password
   ```

## Step 5: Test Connection
1. Save the changes
2. Restart the backend server
3. Check the logs for successful connection

## Troubleshooting
If you get authentication errors:
1. Verify the app passwords are correct
2. Ensure IMAP is enabled
3. Check if 2-Step Verification is enabled
4. Try generating new app passwords