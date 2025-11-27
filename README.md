# Contact Form API Server

Express.js server with Nodemailer integration for handling contact form submissions.

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your email credentials.

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Test the API**:
   ```bash
   ./curl-example.sh
   ```

## 📋 API Endpoints

### POST /contact
Send a contact form submission.

**Request Body:**
```json
{
  "name": "John Doe",           // Required
  "email": "john@example.com",  // Required
  "company": "Acme Inc",        // Optional
  "title": "Inquiry",           // Optional
  "message": "Hello!"           // Required
}
```

**Response:**
```json
{
  "ok": true
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## 🌐 Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed Vercel deployment instructions.

## 📧 Email Configuration

The server uses Nodemailer to send emails. Configure your SMTP settings in `.env`:

- **Gmail**: Use App Password (not regular password)
- **Other SMTP**: Set MAIL_HOST, MAIL_PORT, MAIL_SECURE

## 🧪 Testing

Use the provided curl examples or import `postman-collection.json` into Postman.

