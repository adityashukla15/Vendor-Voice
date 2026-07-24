const otpTemplate = (name, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Vendor Voice OTP</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
background:#f4f7fb;
font-family:
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
Roboto,
Helvetica,
Arial,
sans-serif;
padding:40px;
}

.container{

max-width:620px;
margin:auto;
background:white;
border-radius:18px;
overflow:hidden;
box-shadow:
0 10px 30px rgba(0,0,0,.08);

}

.header{

background:linear-gradient(135deg,#2563eb,#4f46e5);
padding:35px;
text-align:center;

}

.logo{

font-size:34px;
font-weight:700;
color:white;

}

.subtitle{

margin-top:10px;
color:#dbeafe;
font-size:16px;

}

.content{

padding:40px;

}

.heading{

font-size:28px;
color:#111827;
margin-bottom:20px;

}

.text{

font-size:16px;
line-height:28px;
color:#4b5563;

}

.otp-box{

margin:35px 0;

background:#eff6ff;

border:2px dashed #2563eb;

border-radius:14px;

padding:25px;

text-align:center;

}

.otp-title{

font-size:14px;

letter-spacing:2px;

text-transform:uppercase;

color:#6b7280;

}

.otp{

font-size:42px;

font-weight:700;

letter-spacing:12px;

margin-top:15px;

color:#2563eb;

}

.footer{

background:#f9fafb;

padding:25px;

text-align:center;

font-size:13px;

color:#9ca3af;

}

</style>

</head>

<body>

<div class="container">

<div class="header">

<div class="logo">
🛒 Vendor Voice
</div>

<div class="subtitle">
AI Powered Smart Kirana Assistant
</div>

</div>

<div class="content">

<div class="heading">

Hello ${name},

</div>

<p class="text">

Welcome to
<strong>Vendor Voice</strong>.

Use the verification code below to complete your registration.

</p>

<div class="otp-box">

<div class="otp-title">

Verification Code

</div>

<div class="otp">

${otp}

</div>

</div>

<p class="text">

⏳ This OTP will expire in
<strong>5 minutes</strong>.

</p>

<br>

<p class="text">

If you didn't request this email,
please ignore it.

</p>

</div>

<div class="footer">

© ${new Date().getFullYear()} Vendor Voice

<br><br>

Empowering Local Businesses with AI ❤️

</div>

</div>

</body>

</html>
`;
};

export default otpTemplate;