// Email service - Resend integration
// Handles missing API key gracefully

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

// Lazy-load Resend only when needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let resendClient: any = null;

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return null;
    }
    // Dynamic import to avoid build errors when API key is missing
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Resend } = require('resend');
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// From email address
const FROM_EMAIL = 'FieldFlow <onboarding@resend.dev>';

// Generic send email function
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const resend = getResendClient();
    
    if (!resend) {
      console.log('Email not sent - RESEND_API_KEY not configured');
      return { 
        success: false, 
        error: 'Email service not configured. Add RESEND_API_KEY to environment variables.' 
      };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Send email error:', error);
    return { success: false, error };
  }
}

// Welcome email for new users
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to FieldFlow</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0B; color: #FAFAFA; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #141416; border-radius: 16px; padding: 40px; border: 1px solid #27272A;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #00c2ff; margin: 0; font-size: 28px;">⚡ FieldFlow</h1>
        </div>
        
        <h2 style="color: #FAFAFA; font-size: 24px; margin-bottom: 16px;">Welcome, ${name}!</h2>
        
        <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Thanks for joining FieldFlow Pro! You're now ready to start managing your field service business.
        </p>
        
        <div style="background-color: #1C1C1F; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: #FAFAFA; font-size: 18px; margin: 0 0 16px 0;">Here's what you can do:</h3>
          <ul style="color: #A1A1AA; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Schedule jobs from your phone</li>
            <li>Send invoices in seconds</li>
            <li>Document work with photos</li>
            <li>Manage your customers</li>
          </ul>
        </div>
        
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/app" style="display: inline-block; background: #00c2ff; color: #1a1a1a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Go to Dashboard
        </a>
        
        <p style="color: #71717A; font-size: 14px; margin-top: 40px; text-align: center;">
          Questions? Reply to this email anytime.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to FieldFlow Pro!',
    html,
  });
}

// Invoice email
export async function sendInvoiceEmail(
  email: string, 
  customerName: string, 
  invoiceNumber: string, 
  total: number,
  businessName: string,
  items: { description: string; quantity: number; unitPrice: number; total: number }[]
) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #27272A; color: #FAFAFA;">${item.description}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #27272A; color: #A1A1AA; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #27272A; color: #A1A1AA; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #27272A; color: #FAFAFA; text-align: right;">$${item.total.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoiceNumber}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0B; color: #FAFAFA; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #141416; border-radius: 16px; padding: 40px; border: 1px solid #27272A;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
          <h1 style="color: #00c2ff; margin: 0; font-size: 24px;">⚡ FieldFlow</h1>
          <span style="color: #A1A1AA; font-size: 14px;">${invoiceNumber}</span>
        </div>
        
        <h2 style="color: #FAFAFA; font-size: 20px; margin-bottom: 8px;">Invoice from ${businessName || 'FieldFlow User'}</h2>
        <p style="color: #A1A1AA; font-size: 16px; margin-bottom: 32px;">Hi ${customerName}, here's your invoice.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr>
              <th style="padding: 12px 0; border-bottom: 2px solid #27272A; color: #A1A1AA; text-align: left; font-weight: 500;">Description</th>
              <th style="padding: 12px 0; border-bottom: 2px solid #27272A; color: #A1A1AA; text-align: center; font-weight: 500;">Qty</th>
              <th style="padding: 12px 0; border-bottom: 2px solid #27272A; color: #A1A1AA; text-align: right; font-weight: 500;">Price</th>
              <th style="padding: 12px 0; border-bottom: 2px solid #27272A; color: #A1A1AA; text-align: right; font-weight: 500;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="text-align: right; margin-bottom: 32px;">
          <p style="color: #A1A1AA; font-size: 16px;">Total: <span style="color: #00c2ff; font-size: 24px; font-weight: 700;">$${total.toFixed(2)}</span></p>
        </div>
        
        <div style="background-color: #1C1C1F; border-radius: 12px; padding: 24px; text-align: center;">
          <p style="color: #A1A1AA; font-size: 14px; margin: 0;">
            Payment instructions will be provided by ${businessName || 'your service provider'}.
          </p>
        </div>
        
        <p style="color: #71717A; font-size: 14px; margin-top: 40px; text-align: center;">
          Questions about this invoice? Contact ${businessName || 'your service provider'}.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Invoice ${invoiceNumber} from ${businessName || 'FieldFlow User'} - $${total.toFixed(2)}`,
    html,
  });
}

// Password reset email
export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0B; color: #FAFAFA; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #141416; border-radius: 16px; padding: 40px; border: 1px solid #27272A;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #00c2ff; margin: 0; font-size: 28px;">⚡ FieldFlow</h1>
        </div>
        
        <h2 style="color: #FAFAFA; font-size: 24px; margin-bottom: 16px;">Reset Your Password</h2>
        
        <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${name}, we received a request to reset your password. Click the button below to create a new one.
        </p>
        
        <a href="${resetUrl}" style="display: inline-block; background: #00c2ff; color: #1a1a1a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Reset Password
        </a>
        
        <p style="color: #71717A; font-size: 14px; margin-top: 24px;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        
        <p style="color: #71717A; font-size: 14px; margin-top: 40px; text-align: center;">
          Questions? Reply to this email anytime.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your FieldFlow Password',
    html,
  });
}
