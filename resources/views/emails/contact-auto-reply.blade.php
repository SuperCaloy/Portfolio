<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 20px; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e4e4e7;">
        <h2 style="color: #18181b; font-size: 18px; margin-top: 0;">Hi {{ $data['name'] }},</h2>
        <p style="color: #3f3f46; font-size: 14px; line-height: 1.6;">
            Thanks for reaching out through my portfolio. I have received your message and will get back to you as soon as possible.
        </p>
        <div style="background-color: #fafafa; border-left: 3px solid #18181b; padding: 12px 16px; margin: 20px 0; color: #52525b; font-size: 13px;">
            <strong>Your message copy:</strong><br/>
            <em>&quot;{{ $data['message'] }}&quot;</em>
        </div>
        <p style="color: #71717a; font-size: 13px; margin-bottom: 0;">
            Best regards,<br/>
            <strong>Ramon Carlos E. Pacilona</strong>
        </p>
    </div>
</body>
</html>
