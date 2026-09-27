const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f3f4f6; }
      .slide { 
        width: 1080px; height: 1080px; 
        background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); 
        margin: 0; padding: 100px; box-sizing: border-box; 
        display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; 
        page-break-after: always;
      }
      h1 { font-size: 80px; color: #111827; margin-bottom: 20px; font-weight: 800; line-height: 1.2; }
      h2 { font-size: 65px; color: #1f2937; margin-bottom: 60px; font-weight: 700; }
      p, li { font-size: 45px; color: #4b5563; line-height: 1.6; text-align: left; }
      ul { width: 90%; margin-top: 20px; }
      li { margin-bottom: 35px; }
      .highlight { color: #4f46e5; }
      .footer { font-size: 35px; color: #9ca3af; margin-top: auto; font-weight: 600; }
      .box { background: white; padding: 50px; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); width: 100%; border: 1px solid #e5e7eb; }
    </style>
    </head>
    <body>
      <div class="slide">
        <h1>Building a Custom CMS & Blog with <span class="highlight">Next.js 16 🚀</span></h1>
        <p style="text-align: center; max-width: 800px; margin-top: 40px; font-size: 50px;">Complete with a secure Admin Panel, Prisma ORM, and modern web architecture.</p>
        <div class="footer">Swipe to learn more ➡️</div>
      </div>
      
      <div class="slide">
        <h2>The Problem with Traditional CMS</h2>
        <div class="box">
            <ul>
            <li>Sometimes you don't need a heavy, bloated platform.</li>
            <li>You want complete control over your database schemas and UI.</li>
            <li>You want to leverage the latest Next.js 16 and React 19 features for maximum performance.</li>
            </ul>
        </div>
      </div>
      
      <div class="slide">
        <h2>Under the Hood 🛠️</h2>
        <div class="box">
            <ul>
            <li><b>Framework:</b> Next.js 16 & React 19</li>
            <li><b>Styling:</b> Tailwind CSS v4</li>
            <li><b>Database & ORM:</b> Prisma ORM</li>
            <li><b>Auth:</b> NextAuth.js (Auth.js v5)</li>
            <li><b>Validation:</b> Zod + React Hook Form</li>
            </ul>
        </div>
      </div>
      
      <div class="slide">
        <h2>Seamless Content Management</h2>
        <div class="box">
            <ul>
            <li>Secure login and registration system.</li>
            <li>Intuitive dashboard to Create, Read, Update, and Delete posts.</li>
            <li>Real-time cache revalidation when posts are published.</li>
            </ul>
        </div>
      </div>
      
      <div class="slide">
        <h2>Built for Scale ⚡</h2>
        <div class="box">
            <ul>
            <li>Full TypeScript support for type safety.</li>
            <li>Robust end-to-end testing integrated using Playwright.</li>
            <li>Database seeding with Faker.js for local development.</li>
            </ul>
        </div>
      </div>
      
      <div class="slide">
        <h2>Check out the Code! 💻</h2>
        <div class="box">
            <ul>
            <li>The project is completely <span class="highlight">Open Source</span>.</li>
            <li><b>Live Demo:</b><br/> <span style="font-size: 40px; color: #4f46e5;">nextjs-16-cms-blog-with-admin-panel.vercel.app</span></li>
            <li><b>Demo Login:</b><br/> <span style="font-size: 40px;">admin@example.com / password123</span></li>
            </ul>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  // Set the viewport to exactly 1080x1080
  await page.setViewport({ width: 1080, height: 1080 });
  
  await page.pdf({
    path: 'public/linkedin-carousel.pdf',
    width: '1080px',
    height: '1080px',
    printBackground: true,
    pageRanges: '1-6',
  });
  
  await browser.close();
  console.log("PDF generated successfully at public/linkedin-carousel.pdf!");
})();
