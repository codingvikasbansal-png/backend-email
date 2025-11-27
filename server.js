require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 4000;

// Rate limiting: 2 requests per hour per IP
const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 2, // Limit each IP to 2 requests per windowMs
  message: {
    ok: false,
    error: 'Too many requests from this IP, please try again after an hour.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(cors());
app.use(express.json());

// POST route /contact (with rate limiting)
app.post('/contact', contactRateLimiter, async (req, res) => {
  try {
    const { name, email, company, title, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, and message are required'
      });
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email format'
      });
    }

    // Get Nodemailer credentials from environment variables
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;
    const mailHost = process.env.MAIL_HOST;
    const mailPort = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : undefined;
    const mailSecure = process.env.MAIL_SECURE === 'true' || process.env.MAIL_SECURE === '1';
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'hr@charmai.in';

    // Validate Nodemailer credentials
    if (!mailUser || !mailPass) {
      return res.status(500).json({
        ok: false,
        error: 'Email configuration is missing. Please check environment variables (MAIL_USER, MAIL_PASS).'
      });
    }

    // Create Nodemailer transporter
    // If MAIL_HOST is provided, use host/port/secure config, otherwise use Gmail service
    const transporterConfig = mailHost
      ? {
          host: mailHost,
          port: mailPort || 587,
          secure: mailSecure,
          auth: {
            user: mailUser,
            pass: mailPass,
          },
        }
      : {
          service: 'gmail',
          auth: {
            user: mailUser,
            pass: mailPass,
          },
        };

    const transporter = nodemailer.createTransport(transporterConfig);

    // Send email using Nodemailer
    await transporter.sendMail({
      from: email,
      to: recipientEmail,
      subject: title || 'New Contact Form Submission',
      text: `
Name: ${name}
Email: ${email}
${company ? `Company: ${company}\n` : ''}${title ? `Title: ${title}\n` : ''}Message: ${message}
      `,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                📧 New Contact Form Submission
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 30px 0; color: #64748b; font-size: 16px;">
                You have received a new message from your contact form.
              </p>
              
              <!-- Contact Details Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; margin-bottom: 30px; overflow: hidden;">
                <tr>
                  <td style="padding: 25px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <!-- Name -->
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="width: 120px; color: #475569; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                Name
                              </td>
                              <td style="color: #1e293b; font-size: 16px; font-weight: 500;">
                                ${name}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Email -->
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="width: 120px; color: #475569; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                Email
                              </td>
                              <td style="color: #1e293b; font-size: 16px;">
                                <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-weight: 500;">${email}</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      ${company ? `
                      <!-- Company -->
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="width: 120px; color: #475569; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                Company
                              </td>
                              <td style="color: #1e293b; font-size: 16px; font-weight: 500;">
                                ${company}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ` : ''}
                      
                      ${title ? `
                      <!-- Title -->
                      <tr>
                        <td style="padding: 12px 0;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="width: 120px; color: #475569; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                Subject
                              </td>
                              <td style="color: #1e293b; font-size: 16px; font-weight: 500;">
                                ${title}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Message Section -->
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">
                  Message
                </h3>
                <div style="background-color: #ffffff; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px; background-color: #f8fafc;">
                  <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">${message.replace(/\n/g, '\n')}</p>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                  This email was sent from your contact form
                </p>
                <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 12px;">
                  ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    // Return success response
    return res.status(200).json({ ok: true });

  } catch (error) {
    // Handle errors
    console.error('Error sending email:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Failed to send email'
    });
  }
});

// Health check route (optional but useful)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export the app for Vercel serverless functions
module.exports = app;

// Start server only when running locally (not on Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

