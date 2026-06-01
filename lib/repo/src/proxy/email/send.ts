import config from "@lib/internal/config";


export function getSubscriptionHTML(amount: string, orderBizId: string, time: string, nextTime: string) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Subscription Confirmation</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    body {
      background-color: #f7f8fa;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    h1 {
      font-size: 24px;
      color: #333;
      margin-bottom: 16px;
    }
    .desc {
      color: #666;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .label {
      color: #666;
    }
    .value {
      color: #333;
      font-weight: 500;
    }
    .footer {
      margin-top: 30px;
      color: #666;
      line-height: 1.7;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Subscription successful</h1>
    <p class="desc">Thank you for subscribing to our product, Your plan is now active.</p>

    <div class="info-row">
      <span class="label">amount</span>
      <span class="value">R$${amount}</span>
    </div>
    <div class="info-row">
      <span class="label">time</span>
      <span class="value">${time}</span>
    </div>
    <div class="info-row">
      <span class="label">order number</span>
      <span class="value">${orderBizId}</span>
    </div>
    <div class="info-row">
      <span class="label">next time</span>
      <span class="value">${nextTime}</span>
    </div>
    <div class="info-row">
      <span class="label">next amount</span>
      <span class="value">R$${amount}</span>
    </div>

    <div class="footer">
      <p>We're excited to have you on board!</p>
      <br>
      <p>if you need to unsubscribe, please send an email to unsubscribe. <a href="mailto:support@bluearcshow.com">support@bluearcshow.com</a></p>
      <br>
      <p>Best regards</p>
    </div>
  </div>
</body>
</html>
`
}

export async function sendEmail(email: string, subject: string, html: string) {
    const resp = await fetch(config.EmailResendHost, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.EmailResendKey}`
        },
        body: JSON.stringify({
            from: `Blue Arc <${config.EmailResendFrom}>`,
            to: email,
            subject: subject,
            html: html,
        })
    });

    const data = await resp.json();
    console.log(data);
}

export async function sendEmailVerify(email: string, code: string) {
    const resp = await fetch(config.EmailResendHost, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.EmailResendKey}`
        },
        body: JSON.stringify({
            from: `Blue Arc <${config.EmailResendFrom}>`,
            to: email,
            subject: 'Blue Arc - Verify Email',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification Code Email</title>
            </head>
            <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #ffffff;">
                <div style="max-width: 600px; margin: 0 auto;">
                    <p>Dear User,</p>

                    <p>You are requesting to log in or perform a verification operation. Please use the following verification code to complete your action:</p>

                    <p style="font-size: 24px; font-weight: bold; margin: 20px 0;">Verification Code: ${code}</p>

                    <p>This code is valid for <strong>15 minutes</strong>.  Please use it as soon as possible. If you did not make this request, please ignore this email and ensure the security of your account.</p>

                    <p>Thank you for your support!</p>

                    <p>If you have any questions, please feel free to contact our customer support team.</p>

                    <p>Sincerely,<br>Blue Arc Team</p>
                </div>
            </body>
            </html>
            `
        })
    });

    const data = await resp.json();
    console.log(data);
}
