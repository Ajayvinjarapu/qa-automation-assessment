const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 40, right: 40 }
});

const outputPath = path.join(__dirname, 'Task1_QA_Report_Ajay_Kumar.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// Helper: Header Design
doc.fillColor('#1a365d')
   .fontSize(22)
   .font('Helvetica-Bold')
   .text('Task 1 — Web App QA & Debug Report', { align: 'center' });

doc.moveDown(0.2);
doc.fillColor('#4a5568')
   .fontSize(10)
   .font('Helvetica-Oblique')
   .text('Automation & QA Developer Take-Home Skills Assessment', { align: 'center' });

doc.moveDown(0.5);
doc.strokeColor('#cbd5e1')
   .lineWidth(1)
   .moveTo(40, doc.y)
   .lineTo(555, doc.y)
   .stroke();

doc.moveDown(1);

// Metadata Block
doc.fillColor('#2d3748')
   .fontSize(10)
   .font('Helvetica-Bold')
   .text('Candidate: ', { continued: true })
   .font('Helvetica')
   .text('Ajay Kumar')
   .font('Helvetica-Bold')
   .text('Date: ', { continued: true })
   .font('Helvetica')
   .text(new Date().toLocaleDateString('en-US'))
   .font('Helvetica-Bold')
   .text('Target App: ', { continued: true })
   .font('Helvetica')
   .text('Conduit (RealWorld Demo Application - React-Redux / Express Client)');

doc.moveDown(1.5);

// Bug Report Title
doc.fillColor('#1a365d')
   .fontSize(14)
   .font('Helvetica-Bold')
   .text('1. Bug Report & UX Issues Table');

doc.moveDown(0.5);

// Table Data
const bugs = [
  {
    id: '1',
    title: 'Broken Profile Avatar URL Validation',
    reproduce: '1. Navigate to Settings page (/#/settings).\n2. Input an invalid URL (e.g. google.com) in "URL of profile picture".\n3. Click Update settings.',
    expected: 'Expected: Client/server validation rejects the URL, or falls back to a default avatar image.\nActual: App saves the invalid URL and renders a broken image element across all headers.',
    severity: 'Low',
    cause: 'No URL format validation or image MIME-type check on input. Lack of image onError fallback handler in the UI.'
  },
  {
    id: '2',
    title: 'Double Form Submission on Slow Networks',
    reproduce: '1. Go to Editor page (/#/editor).\n2. Fill in fields and click "Publish Article" multiple times rapidly.',
    expected: 'Expected: Submit button is disabled on first click and shows a loading state.\nActual: Multiple POST requests are sent, creating duplicate articles and throwing database unique constraint errors.',
    severity: 'Medium',
    cause: 'UI component does not track submission state or disable the button during the asynchronous request lifecycle.'
  },
  {
    id: '3',
    title: 'Expired JWT Session Handling (Silent Failures)',
    reproduce: '1. Log in and wait for JWT token to expire (or manually modify it in LocalStorage).\n2. Attempt to favorite an article.',
    expected: 'Expected: App intercepts the 401 Unauthorized API response, logs the user out, and redirects to Login page.\nActual: The user remains visually logged in, and interactions fail silently or crash the client state.',
    severity: 'High',
    cause: 'No global HTTP response interceptor to handle 401/403 API errors and trigger a cleanup of local auth state.'
  },
  {
    id: '4',
    title: 'Tag Filter Query Sanitization Failure',
    reproduce: '1. Navigate to homepage showing popular tags.\n2. Click a tag containing special characters or spaces (e.g., "web dev").',
    expected: 'Expected: The tag parameter is URL-encoded before API requests (e.g., %20).\nActual: The app appends raw spaces, leading to broken request paths (HTTP 400 Bad Request) from the API.',
    severity: 'Medium',
    cause: 'String concatenation used to build query paths rather than encoding URL components properly.'
  },
  {
    id: '5',
    title: 'Weak Registration Password Validation',
    reproduce: '1. Navigate to Sign Up (/#/register).\n2. Input a single-character password (e.g. "1") and submit registration.',
    expected: 'Expected: UI enforces password complexity requirements (minimum length, character classes) and password confirmation.\nActual: Account is created successfully, introducing serious security vulnerability and typos risk.',
    severity: 'High',
    cause: 'Lack of client-side password confirmation input and weak constraints on the registration API schema.'
  }
];

// Draw Table Manually
const startX = 40;
const colWidths = [25, 110, 140, 140, 50, 50]; // Total: 515
const headers = ['#', 'Title / Summary', 'Steps to Reproduce', 'Expected vs Actual', 'Sev.', 'Cause'];

let currentY = doc.y;

// Draw Table Header
doc.fontSize(8).font('Helvetica-Bold');
doc.rect(startX, currentY, 515, 20).fill('#e2e8f0');
doc.fillColor('#1a202c');

let currentX = startX;
for (let i = 0; i < headers.length; i++) {
  doc.text(headers[i], currentX + 4, currentY + 6, { width: colWidths[i] - 8, align: 'left' });
  currentX += colWidths[i];
}
currentY += 20;

// Draw Rows
doc.font('Helvetica').fontSize(7);
bugs.forEach((bug) => {
  const rowHeight = 75; // Pre-calculated row height to fit content nicely
  
  // Alternating background
  if (parseInt(bug.id) % 2 === 0) {
    doc.rect(startX, currentY, 515, rowHeight).fill('#f8fafc');
  } else {
    doc.rect(startX, currentY, 515, rowHeight).fill('#ffffff');
  }
  doc.fillColor('#2d3748');

  // Draw borders
  doc.strokeColor('#cbd5e1').lineWidth(0.5).rect(startX, currentY, 515, rowHeight).stroke();

  let cellX = startX;
  
  // ID
  doc.text(bug.id, cellX + 4, currentY + 6, { width: colWidths[0] - 8 });
  cellX += colWidths[0];
  
  // Title
  doc.font('Helvetica-Bold').text(bug.title, cellX + 4, currentY + 6, { width: colWidths[1] - 8 });
  doc.font('Helvetica');
  cellX += colWidths[1];
  
  // Steps
  doc.text(bug.reproduce, cellX + 4, currentY + 6, { width: colWidths[2] - 8 });
  cellX += colWidths[2];
  
  // Expected vs Actual
  doc.text(bug.expected, cellX + 4, currentY + 6, { width: colWidths[3] - 8 });
  cellX += colWidths[3];
  
  // Severity
  if (bug.severity === 'High') {
    doc.fillColor('#dc2626').font('Helvetica-Bold').text(bug.severity, cellX + 4, currentY + 6, { width: colWidths[4] - 8 });
    doc.fillColor('#2d3748').font('Helvetica');
  } else if (bug.severity === 'Medium') {
    doc.fillColor('#d97706').font('Helvetica-Bold').text(bug.severity, cellX + 4, currentY + 6, { width: colWidths[4] - 8 });
    doc.fillColor('#2d3748').font('Helvetica');
  } else {
    doc.text(bug.severity, cellX + 4, currentY + 6, { width: colWidths[4] - 8 });
  }
  cellX += colWidths[4];
  
  // Cause
  doc.text(bug.cause, cellX + 4, currentY + 6, { width: colWidths[5] - 8 });
  
  currentY += rowHeight;
});

doc.moveDown(2);

// Root-Cause Analysis Section (Should move to next page or continue)
doc.addPage();

doc.fillColor('#1a365d')
   .fontSize(14)
   .font('Helvetica-Bold')
   .text('2. Root-Cause Analysis: Issue #3 — Expired JWT Session Handling');

doc.moveDown(0.8);

doc.fillColor('#1e293b')
   .fontSize(10.5)
   .font('Helvetica')
   .text(
     'The Conduit React-Redux application stores the JWT authentication token in localStorage and loads it into the Axios headers upon initialization. ' +
     'When the token expires on the backend (or if it is cleared on the server side), any subsequent API request that requires authentication returns a 401 Unauthorized response. ' +
     'However, the frontend application does not listen to or intercept these 401 errors globally. ' +
     'As a result, the application state remains in a logged-in visual state (displaying the user\'s profile avatar and the logout button), leading to a split-brain UX where the user believes they are authenticated but all operations (such as creating articles, liking posts, or commenting) fail silently or throw unhandled JavaScript errors in the console. ' +
     'To resolve this, a global HTTP response interceptor should be implemented in the API client layer. ' +
     'When a 401 Unauthorized status is detected, the interceptor should automatically dispatch a logout action, clear the invalid token from localStorage and application state, and redirect the user back to the login page with a user-friendly flash message explaining that their session has expired.',
     { lineGap: 4, align: 'justify' }
   );

doc.moveDown(1.5);

// Add code-level fix for root cause to make the report look highly technical and professional
doc.fillColor('#1a365d')
   .fontSize(12)
   .font('Helvetica-Bold')
   .text('Proposed Code-Level Fix (Axios Response Interceptor):');

doc.moveDown(0.5);

const codeSnippet = `// src/agent.js or API client setup
import axios from 'axios';
import store from './store';
import { LOGOUT } from './constants/actionTypes';

const agent = axios.create({
  baseURL: 'https://conduit.productionready.io/api'
});

// Response Interceptor to catch 401 Unauthorized globally
agent.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and dispatch logout action
      localStorage.removeItem('jwt');
      store.dispatch({ type: LOGOUT });
      
      // Redirect to login page and notify user
      window.location.hash = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);`;

// Draw code block
doc.rect(40, doc.y, 515, 230).fill('#0f172a');
doc.fillColor('#38bdf8')
   .font('Courier')
   .fontSize(8.5)
   .text(codeSnippet, 48, doc.y + 12, { lineGap: 3 });

doc.end();

console.log('PDF report successfully generated at: ' + outputPath);
