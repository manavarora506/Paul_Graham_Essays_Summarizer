import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";

function truncateText(text, sentenceCount) {
  const sentences = text.split(/[.!?]\s/);  // Splits the text by sentence delimiters
  return sentences.slice(0, sentenceCount).join('. ') + (sentences.length > sentenceCount ? '...' : '');
}

function Essay({ title, date, body }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const displayedBody = truncateText(body, 3); // Display first 3 sentences, for example

  const getSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/summarize_essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: body }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error during summary fetch: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-8 py-4 bg-white rounded-lg shadow-md transition-all hover:shadow-lg">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{date}</p>
      <p className="text-base text-gray-700 mb-4">{displayedBody}</p>
      <button 
        onClick={getSummary} 
        className={`text-white font-bold py-2 px-4 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
        disabled={loading}
      >
        {loading ? "Loading..." : "Summarize"}
      </button>
      {summary && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-base text-gray-700">{summary}</p>
        </div>
      )}
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

  const renderedEssays = useMemo(() => essays.map((essay, index) => (
    <Essay
      key={index}
      title={essay.title}
      date={essay.date}
      body={essay.body}
    />
  )), [essays]);

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderedEssays}
        </div>
      </div>
    </div>
  );
}

export default Essays;