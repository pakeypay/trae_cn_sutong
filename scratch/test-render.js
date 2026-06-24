const fs = require('fs');
const path = require('path');

// Mock browser globals
global.window = {};
global.document = {
  currentScript: { src: 'file://' + path.resolve(__dirname, '../shared/nav-render.js') },
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => ({ innerHTML: '', querySelector: () => null }),
  addEventListener: () => {},
  body: { dataset: { role: 'student' } }
};

// Load nav-data.js
const navDataContent = fs.readFileSync(path.resolve(__dirname, '../shared/nav-data.js'), 'utf8');
eval(navDataContent); // Populates window.RoleNav

// Load nav-render.js
let navRenderContent = fs.readFileSync(path.resolve(__dirname, '../shared/nav-render.js'), 'utf8');

// Strip IIFE wrapper
navRenderContent = navRenderContent.trim();
if (navRenderContent.startsWith('(function () {')) {
  navRenderContent = navRenderContent.substring('(function () {'.length);
}
if (navRenderContent.endsWith('}());')) {
  navRenderContent = navRenderContent.substring(0, navRenderContent.length - '}());'.length);
}

// Let's just mock document.readyState = 'loading' so it doesn't call init()
global.document.readyState = 'loading';

// Expose variables to global scope in eval
eval(navRenderContent);

const renderSidebar = renderSidebarHtml;
const roles = window.RoleNav.roles;

fs.writeFileSync(path.resolve(__dirname, 'student.html'), renderSidebar(roles.student, '工作台'), 'utf8');
fs.writeFileSync(path.resolve(__dirname, 'admin.html'), renderSidebar(roles.admin, '排课工作台'), 'utf8');
console.log('Done writing files.');
