import React, { useEffect, useState } from "react";
import Link from "next/link";

function Essay({ title, date, body }) {
  return (
    <div className="px-2 md:px-8 py-4" id={title.replaceAll(" ", "-")}>
      {/* Title */}
      <div className="flex">
        <p className="text-3xl font-semibold max-w-max dark:text-gray-200">
          {title}
        </p>
      </div>

      {/* Date */}
      <div className="mb-2 overflow-hidden">
        <p className="text-xl py-1 dark:text-gray-300">{date}</p>
      </div>

      {/* Body */}
      <div className="mb-2 overflow-hidden">
        <p className="text-xl py-1 dark:text-gray-300">{body}</p>
      </div>
    </div>
  );
}

function Essays() {
  const [essays, setEssays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/.netlify/functions/fetchEssays");
        const data = await response.json();
        console.log(data)

        const structuredData = data.results.map((page) => {
          // Check and extract title
          const title = page.properties.Title 
            && Array.isArray(page.properties.Title.title) 
            && page.properties.Title.title[0] 
            && page.properties.Title.title[0].text
            ? page.properties.Title.title[0].text.content
            : "";
        
          // Check and extract date
          const date = page.properties.Date 
            && Array.isArray(page.properties.Date.rich_text) 
            && page.properties.Date.rich_text[0] 
            && page.properties.Date.rich_text[0].text
            ? page.properties.Date.rich_text[0].text.content
            : "";
        
          // Check and extract body
          const body = page.properties.Body 
            && Array.isArray(page.properties.Body.rich_text)
            ? page.properties.Body.rich_text.map(text => text.text ? text.text.content : "").join(" ")
            : "";
        
          return { title, date, body };
        });

        setEssays(structuredData);
        console.log(structuredData)
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-dark-gray p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[80vh]">
        {essays.map((essay, index) => (
          <div
            key={index}
            className="bg-gray-950 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Essay
              title={essay.title}
              date={essay.date}
              body={essay.body}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Essays;