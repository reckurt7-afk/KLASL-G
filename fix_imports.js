const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

page = page.replace(
  'import { useState, useRef } from "react";',
  'import { useState, useRef, useEffect } from "react";'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed imports!');
