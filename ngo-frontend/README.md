# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

























✅ 1. Core Features Analysis
🔹 Donation System

File ke according, ye features compulsory hain:

Homepage pe Donate Now

Fixed amounts: 500, 1000, 1500, 2000

Custom Amount

Razorpay payment gateway

Auto PDF receipt email

Donation record admin me save

Crowdfunding campaigns

📌 Isme 4 modules lagenge:

Donation Form UI

Razorpay Integration

Receipt Generator (PDF)

Donation Management (Admin)

🔹 Membership System

Strong feature hai ye project ka:

Member form: Name, Email, Mobile, DOB, Address, Photo

Free & Paid option

Auto ID Card (QR code ke sath)

Auto Appointment Letter (QR code)

Member login system (ID + DOB)

Download system

📌 Isme lagenge:

Member registration UI

QR code generator

ID card + Letter PDF creator

Member DB system

🔹 Member Management

Admin / Coordinator control:

Block/Unblock/Deactivate

Certificates

Reports in Excel/PDF

Problem/Support Form

📌 Role-based access:

Role	Work
Coordinator	Add Members
Manager	Generate ID Cards
Admin	Full Control
✅ 2. Website Frontend Pages (React)

Your frontend pages list:

Page/Section	Status
Home with banner, sliders	✅
Vision/Mission/Objectives	✅
Members Carousel	✅
Campaign Page	✅
Crowdfunding page	✅
Awards/Certificates page	✅
News & Gallery	✅
Contact Page + Map + WhatsApp	✅

bonus features:

Auto Birthday Banner

PWA App Functionality

Hindi + English

📌 Matlab React me aapko approx 12–15 main pages banane honge.

✅ 3. Admin Panel Features

Admin panel ek complete CMS jaisa hoga:

Website content update

Slider, gallery, news upload

Donors / Members manage

Events / Projects upload

Audit report upload

Bank + QR + Membership fee update

Excel backup download

Coordinator reports

📌 Important: Admin panel ka role based system hoga

Admin / Manager / Coordinator





























🔥 OPTION 1 — Premium Blue + Platinum (Most Professional / Corporate NGO)
:root {
  /* MAIN COLORS */
  --primary-color: #1f3c88;    /* Deep Trust Blue */
  --secondary-color: #111111;
  --accent-color: #6dd5fa;     /* Soft Sky */
  --white-color: #ffffff;
  --dark-color: #0f172a;
  --light-bg: #f6f8fb;
  --text-color: #1e293b;
  --muted-text: #64748b;
  --danger-color: #dc2626;

  /* GRADIENTS */
  --primary-gradient: linear-gradient(135deg, #1f3c88, #6dd5fa);
  --dark-gradient: linear-gradient(45deg, #0f172a, #1e293b);

  /* FONT */
  --primary-font: "Poppins", sans-serif;

  /* SHADOWS */
  --shadow-sm: 0 2px 6px rgba(15, 23, 42, 0.08);
  --shadow-md: 0 8px 20px rgba(15, 23, 42, 0.12);
  --shadow-lg: 0 20px 45px rgba(15, 23, 42, 0.15);

  /* RADIUS */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* TRANSITION */
  --transition: all 0.25s ease;
}






🔥 OPTION 2 — Forest Green + Gold (Elegant NGO / Nature Theme)
:root {
  --primary-color: #14532d;
  --secondary-color: #1c1917;
  --accent-color: #d4af37;
  --white-color: #ffffff;
  --dark-color: #052e16;
  --light-bg: #f7faf7;
  --text-color: #1f2937;
  --muted-text: #6b7280;
  --danger-color: #b91c1c;

  --primary-gradient: linear-gradient(135deg, #14532d, #4d7c0f);
  --dark-gradient: linear-gradient(45deg, #052e16, #14532d);

  --primary-font: "Poppins", sans-serif;

  --shadow-sm: 0 2px 5px rgba(0,0,0,0.08);
  --shadow-md: 0 8px 25px rgba(0,0,0,0.12);
  --shadow-lg: 0 20px 40px rgba(0,0,0,0.15);

  --radius-sm: 6px;
  --radius-md: 14px;
  --radius-lg: 22px;

  --transition: all 0.3s ease;
}






🔥 OPTION 3 — Black + Crimson + Platinum (Ultra Premium / Boss NGO)

:root {
  --primary-color: #111111;
  --secondary-color: #1f1f1f;
  --accent-color: #b91c1c;
  --white-color: #ffffff;
  --dark-color: #000000;
  --light-bg: #f9fafb;
  --text-color: #111827;
  --muted-text: #6b7280;

  --primary-gradient: linear-gradient(135deg, #000000, #1f1f1f);
  --accent-gradient: linear-gradient(135deg, #7f1d1d, #b91c1c);

  --shadow-md: 0 10px 30px rgba(0,0,0,0.2);
  --shadow-lg: 0 20px 50px rgba(0,0,0,0.3);

  --radius-md: 12px;
  --radius-lg: 24px;

  --transition: all 0.3s ease;
}






5 → Programs / Causes Section

6 → Gallery + Lightbox

7 → Testimonials slider

8 → Donation Page UI