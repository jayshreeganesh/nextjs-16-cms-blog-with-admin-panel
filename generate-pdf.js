const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function getBase64Image(file) {
  try {
    const bitmap = fs.readFileSync(file);
    return `data:image/png;base64,${bitmap.toString('base64')}`;
  } catch(e) {
    return "";
  }
}

(async () => {
  console.log("Starting browser to capture screenshots from Vercel...");
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  // 1. Capture Screenshots
  const capturePage = await browser.newPage();
  await capturePage.setViewport({ width: 1440, height: 900 });
  const baseUrl = 'https://nextjs-16-cms-blog-with-admin-panel.vercel.app';

  try {
    console.log("Capturing Home Page...");
    await capturePage.goto(baseUrl, { waitUntil: 'networkidle2' });
    await capturePage.screenshot({ path: 'public/shot-home.png' });

    console.log("Logging into Admin...");
    await capturePage.goto(`${baseUrl}/auth/login`, { waitUntil: 'networkidle2' });
    await capturePage.type('input[name="email"]', 'admin@example.com');
    await capturePage.type('input[name="password"]', 'password123');
    await capturePage.click('button[type="submit"]');
    
    // Wait for the redirect to admin page
    await capturePage.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Go specifically to posts dashboard
    await capturePage.goto(`${baseUrl}/admin/posts`, { waitUntil: 'networkidle2' });
    console.log("Capturing Admin Dashboard...");
    await capturePage.screenshot({ path: 'public/shot-admin.png' });

    console.log("Capturing Editor...");
    await capturePage.goto(`${baseUrl}/admin/posts/new`, { waitUntil: 'networkidle2' });
    await capturePage.screenshot({ path: 'public/shot-editor.png' });
    
  } catch (error) {
    console.error("Screenshot capture failed. Note: The Vercel app might be sleeping or deploying.", error);
  }
  await capturePage.close();

  // 2. Load images as base64
  console.log("Generating PDF...");
  const homeImg = getBase64Image('public/shot-home.png');
  const adminImg = getBase64Image('public/shot-admin.png');
  const editorImg = getBase64Image('public/shot-editor.png');

  // 3. Generate PDF
  const pdfPage = await browser.newPage();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f3f4f6; }
      .slide { 
        width: 1080px; height: 1080px; 
        background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); 
        margin: 0; padding: 60px; box-sizing: border-box; 
        display: flex; flex-direction: column; justify-content: flex-start; align-items: center; text-align: center; 
        page-break-after: always;
      }
      .slide-title { justify-content: center; }
      h1 { font-size: 70px; color: #111827; margin-bottom: 20px; font-weight: 800; line-height: 1.2; }
      h2 { font-size: 55px; color: #1f2937; margin-bottom: 30px; font-weight: 700; margin-top: 20px; }
      p { font-size: 35px; color: #4b5563; line-height: 1.5; }
      .highlight { color: #4f46e5; }
      .screenshot-container { 
        width: 100%; flex-grow: 1; display: flex; align-items: center; justify-content: center; 
        background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
        border: 2px solid #e5e7eb; margin-top: 20px; padding: 10px;
      }
      img.screenshot { width: 100%; max-height: 700px; object-fit: contain; object-position: top center; border-radius: 10px; }
      .footer { font-size: 25px; color: #9ca3af; margin-top: 30px; font-weight: 600; }
    </style>
    </head>
    <body>
      <!-- Slide 1 -->
      <div class="slide slide-title">
        <h1>Building a Custom CMS & Blog with <span class="highlight">Next.js 16 🚀</span></h1>
        <p style="text-align: center; max-width: 800px; margin-top: 20px;">Complete with a secure Admin Panel, Prisma ORM, and modern web architecture.</p>
        <div class="footer">Swipe to learn more ➡️</div>
      </div>
      
      <!-- Slide 2 -->
      <div class="slide">
        <h2>Beautiful Public Blog 🌐</h2>
        <div class="screenshot-container">
            ${homeImg ? `<img src="${homeImg}" class="screenshot"/>` : '<p>Screenshot Failed</p>'}
        </div>
        <div class="footer">Fully responsive frontend built with Tailwind CSS v4</div>
      </div>
      
      <!-- Slide 3 -->
      <div class="slide">
        <h2>Secure Admin Dashboard 🔐</h2>
        <div class="screenshot-container">
            ${adminImg ? `<img src="${adminImg}" class="screenshot"/>` : '<p>Screenshot Failed</p>'}
        </div>
        <div class="footer">Role-based authentication powered by NextAuth.js (v5)</div>
      </div>
      
      <!-- Slide 4 -->
      <div class="slide">
        <h2>Seamless Content Editor 📝</h2>
        <div class="screenshot-container">
            ${editorImg ? `<img src="${editorImg}" class="screenshot"/>` : '<p>Screenshot Failed</p>'}
        </div>
        <div class="footer">Form validation with Zod & React Hook Form</div>
      </div>
      
      <!-- Slide 5 -->
      <div class="slide slide-title">
        <h2>Check out the Code! 💻</h2>
        <div style="background: white; padding: 40px; border-radius: 20px; width: 80%; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); margin-top: 40px;">
            <p style="text-align: center; margin-bottom: 20px;">The project is completely <span class="highlight">Open Source</span>.</p>
            <p style="font-size: 30px; text-align: center; margin-bottom: 10px;"><b>Live Demo:</b><br/> <span style="color: #4f46e5;">nextjs-16-cms-blog-with-admin-panel.vercel.app</span></p>
            <p style="font-size: 30px; text-align: center;"><b>Demo Login:</b><br/> <span>admin@example.com / password123</span></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await pdfPage.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await pdfPage.setViewport({ width: 1080, height: 1080 });
  
  await pdfPage.pdf({
    path: 'public/linkedin-carousel.pdf',
    width: '1080px',
    height: '1080px',
    printBackground: true,
  });
  
  await browser.close();
  console.log("PDF successfully generated with Live Screenshots at public/linkedin-carousel.pdf!");
})();
