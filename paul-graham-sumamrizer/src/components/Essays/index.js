import React, { useEffect, useState } from "react";
import Link from "next/link";

function Essay({ title, link, notes }) {
  return (
    <div className="px-2 md:px-8 py-4" id={title.replaceAll(" ", "-")}>
      {/* Title and Tag */}
      <div className="flex">
        <p className="text-3xl font-semibold max-w-max dark:text-gray-200">
          {title}
        </p>
      </div>

      {/* Notes */}
      <div className="mb-2 overflow-hidden">
        <p className="text-xl py-1 dark:text-gray-300">{notes}</p>
      </div>

      {/* Link */}
      <div className="mt-2 flex flex-wrap">
        <Link href={link}>
          <a
            className="bg-off-white border border-off-black hover:bg-off-black hover:text-off-white font-medium text-sm py-2 px-3 mr-2 rounded text-center dark:bg-off-black dark:text-off-white dark:hover:bg-off-white dark:border-off-white dark:hover:text-off-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit
          </a>
        </Link>
        
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

        const structuredData = data.results.map((page) => ({
          title: page.properties.Name.title[0].text.content,
          link: page.properties.Link.url,
          notes:
            page.properties.my_notes &&
            page.properties.my_notes.rich_text[0] &&
            page.properties.my_notes.rich_text[0].text
              ? page.properties.my_notes.rich_text[0].text.content
              : "",
        }));

        setEssays(structuredData);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  //
  return (
    <div className="bg-dark-gray p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[80vh]">
        {essays.map((essay, index) => {
            return (
              <div
                key={index}
                className="bg-gray-950 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Essay
                  title={essay.title}
                  link={essay.link}
                  notes={essay.notes}
                />
              </div>
            );
        })}
      </div>
    </div>
  );
}

export default Essays;
