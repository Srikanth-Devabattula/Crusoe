const { sendEmail } = require("../config/mail");

const generateOTPEmailHTML = (otp, expiryMinutes = 5) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Crusoe Login Code</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #6CBF2A 0%, #5ba023 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 20px; }
            .otp-box { background-color: #f8f9fa; border: 2px dashed #6CBF2A; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #6CBF2A; letter-spacing: 8px; margin: 10px 0; font-family: 'Courier New', monospace; }
            .expiry-text { color: #dc3545; font-weight: 500; margin-top: 15px; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
            .security-note { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; }
            .security-note strong { color: #856404; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Crusoe Technologies</h1>
            </div>
            
            <div class="content">
                <h2 style="color: #333; margin-top: 0;">Your Login Verification Code</h2>
                
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Hello! You requested to sign in to your Crusoe Technologies account. 
                    Use the verification code below to complete your login:
                </p>
                
                <div class="otp-box">
                    <div style="color: #333; font-size: 18px; margin-bottom: 10px;">Your verification code is:</div>
                    <div class="otp-code">${otp}</div>
                    <div class="expiry-text">⏰ Expires in ${expiryMinutes} minutes</div>
                </div>
                
                <div class="security-note">
                    <strong>🔒 Security Notice:</strong> If you didn't request this code, please ignore this email. 
                    This code is valid for ${expiryMinutes} minutes only and can only be used once.
                </div>
                
                <p style="color: #555; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                    Having trouble? Contact our support team at 
                    <a href="mailto:support@crusoetec.com" style="color: #6CBF2A;">support@crusoetec.com</a>
                </p>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Crusoe Technologies. All rights reserved.</p>
                <p>Professional technology solutions for your business needs.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const generateOTPEmailText = (otp, expiryMinutes = 5) => {
  return `
    Your Crusoe Technologies Login Code
    
    Your verification code is: ${otp}
    
    This code expires in ${expiryMinutes} minutes and can only be used once.
    
    If you didn't request this code, please ignore this email.
    
    Having trouble? Contact support@crusoetec.com
    
    © ${new Date().getFullYear()} Crusoe Technologies
  `.trim();
};

const sendOTPEmail = async (email, otp, options = {}) => {
  const { expiryMinutes = 5, userName = null } = options;

  const subject = `Your Crusoe Login Code: ${otp}`;
  const html = generateOTPEmailHTML(otp, expiryMinutes);
  const text = generateOTPEmailText(otp, expiryMinutes);

  try {
    const result = await sendEmail({
      to: email,
      subject,
      html,
      text,
    });

    // Log email success without exposing email in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`OTP email sent successfully to ${email}`);
    } else {
      console.log('OTP email sent successfully');
    }
    return result;
  } catch (error) {
    // Log email failure - keep error details but sanitize email in production
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to send OTP email to ${email}:`, error);
    } else {
      console.error('Failed to send OTP email:', error.message);
    }
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

const sendOTPRequestConfirmation = async (email) => {
  const subject = "Login Code Requested - Crusoe Technologies";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6CBF2A;">Login Code Requested</h2>
      <p>A login code has been requested for your email address: <strong>${email}</strong></p>
      <p>If this wasn't you, please ignore this email or contact support.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">Crusoe Technologies - Professional Technology Solutions</p>
    </div>
  `;

  const text = `
    Login Code Requested
    
    A login code has been requested for: ${email}
    
    If this wasn't you, please ignore this email.
    
    Crusoe Technologies
  `;

  try {
    return await sendEmail({ to: email, subject, html, text });
  } catch (error) {
    // Log confirmation email failure - sanitize in production
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to send confirmation email to ${email}:`, error);
    } else {
      console.error('Failed to send confirmation email:', error.message);
    }
    return null;
  }
};

module.exports = {
  sendOTPEmail,
  sendOTPRequestConfirmation,
  generateOTPEmailHTML,
  generateOTPEmailText,
};
