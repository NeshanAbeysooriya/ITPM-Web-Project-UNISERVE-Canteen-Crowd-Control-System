// Function to generate UniServe OTP email HTML
export default function getDesignEmail({ otp, userName = "Student", companyName = "UniServe", validityMinutes = 10 }) {
  // Mapping your Tailwind theme variables to hex codes for Email Client Compatibility
  const colors = {
    primary: "#F8FAFC",    // light background
    secondary: "#1F2937",  // dark text
    accent: "#22C55E",     // fresh green
    highlight: "#F59E0B",  // food highlight (orange)
    bordercolor: "#E5E7EB" // soft border
  };

  return `
  <div style="background-color:${colors.primary}; padding:30px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="
      max-width:500px;
      margin:auto;
      background-color:#ffffff;
      border-radius:16px;
      border:1px solid ${colors.bordercolor};
      box-shadow:0 10px 25px rgba(0,0,0,0.05);
      overflow:hidden;
    ">
      
      <div style="
        background-color:${colors.secondary};
        padding:25px;
        text-align:center;
        color:#ffffff;
      ">
        <h2 style="margin:0; font-size:24px; letter-spacing:1px;">${companyName}</h2>
        <p style="margin:5px 0 0; font-size:13px; color:${colors.accent}; font-weight:bold; text-transform:uppercase;">
          Canteen Pre-Order & Crowd Control
        </p>
      </div>

      <div style="padding:35px; color:${colors.secondary};">
        <p style="font-size:18px; font-weight:600; margin-bottom:10px;">Hi ${userName} 🍔</p>

        <p style="font-size:15px; line-height:1.6; color:#4B5563;">
          Security first! To verify your identity and keep your UniServe account safe, 
          please use the following one-time passcode:
        </p>

        <div style="margin:30px 0; text-align:center;">
          <div style="
            display:inline-block;
            padding:18px 40px;
            font-size:32px;
            font-family: 'Courier New', monospace;
            font-weight:bold;
            letter-spacing:8px;
            color:${colors.secondary};
            background-color:#ffffff;
            border:2px solid ${colors.accent};
            border-radius:12px;
          ">
            ${otp}
          </div>
        </div>

        <div style="
          background-color:#FFFBEB; 
          padding:12px; 
          border-left:4px solid ${colors.highlight};
          margin-bottom:20px;
          border-radius:4px;
        ">
          <p style="font-size:13px; color:#92400E; margin:0;">
            ⏰ <strong>Validity:</strong> This code expires in <strong>${validityMinutes} minutes</strong>.
          </p>
        </div>

        <p style="font-size:14px; color:#6B7280;">
          If you did not request this code, your account might be accessed by someone else. Please change your password immediately.
        </p>

        <hr style="border:none; border-top:1px solid ${colors.bordercolor}; margin:30px 0;">

        <p style="font-size:13px; color:#9CA3AF; text-align:center; line-height:1.5;">
          Skip the queue, enjoy your meal. <br>
          Thank you for using <strong>${companyName}</strong>. 🥗
        </p>
      </div>

      <div style="
        background-color:#F1F5F9;
        padding:20px;
        text-align:center;
        font-size:11px;
        color:#94A3B8;
        border-top:1px solid ${colors.bordercolor};
      ">
        © ${new Date().getFullYear()} ${companyName} | Smart Canteen Ecosystem <br>
        All rights reserved.
      </div>

    </div>
  </div>
  `;
}