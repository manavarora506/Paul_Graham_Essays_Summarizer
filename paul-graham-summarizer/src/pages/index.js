// src/app/pages/page.js
// src/pages/index.js
import * as React from "react";
import Essays from "../components/Essays";


export default function Home() {
  return (
    <div>
      <h1>Welcome to My Next.js App</h1>
      <p>This is the home page of my app.</p>
      {/* Add more components or content here */}
      <Essays/>
    </div>
  );
}
