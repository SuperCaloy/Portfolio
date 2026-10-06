<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 20px; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #18181b; padding: 24px; text-align: left;">
            <h1 style="color: #ffffff; font-size: 18px; margin: 0; font-weight: 600;">New Portfolio Message</h1>
        </div>

        <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                    <td style="padding: 8px 0; color: #71717a; font-size: 13px; width: 80px; font-weight: 600;">FROM:</td>
                    <td style="padding: 8px 0; color: #09090b; font-size: 14px; font-weight: 500;">
                        {{ $data['name'] }}
                        <a href="mailto:{{ $data['email'] }}" style="color: #2563eb; text-decoration: none;">&lt;{{ $data['email'] }}&gt;</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #71717a; font-size: 13px; font-weight: 600;">SUBJECT:</td>
                    <td style="padding: 8px 0; color: #09090b; font-size: 14px; font-weight: 500;">{{ $data['subject'] ?? 'No Subject Provided' }}</td>
                </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #f4f4f5; margin: 16px 0;" />

            <div style="margin-top: 16px;">
                <div style="color: #71717a; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Message</div>
                <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; color: #18181b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">{{ $data['message'] }}</div>
            </div>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f4f4f5; text-align: center; color: #a1a1aa; font-size: 12px;">
                Received from your portfolio contact form
            </div>
        </div>
    </div>
</body>
</html>
