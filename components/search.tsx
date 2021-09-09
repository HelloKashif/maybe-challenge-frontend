import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Airport from "../types/airport";

const Search: React.FC = (props) => {
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [hits, setHits] = useState<Airport[]>([]);

  useEffect(() => {
    if (!query || query === "") return;

    //EdgeCase: To reduce load on our backend
    //we can Debounce this query in future
    axios
      .get(`/api/search?q=${query}`)
      .then((resp) => setHits(resp.data))
      .catch((err) => setError(err.message));
  }, [query]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setQuery(e.target.value);
    if (e.target.value === "") setHits([]);
  };

  return (
    <div className="max-w-4xl w-full relative">
      <div className="relative group z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 absolute left-0 mt-2.5 ml-4 text-gray-400 group-hover:text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          name="query"
          type="text"
          autoComplete="off"
          onChange={onChange}
          placeholder="Search Airports by IATA, Name, City, or Country"
          className="py-2 pl-12 pr-4 w-full rounded border"
        />
      </div>
      {error && (
        <div className="bg-red-100 text-red-800 text-sm font-medium flex items-center justify-center">
          Error: {error}
        </div>
      )}
      {hits.length > 0 && (
        <div className="absolute mt-1 border border-gray-100 px-4 py-2 bg-white shadow-xl z-10 w-full">
          <span className="uppercase text-xs tracking-wide font-medium text-gray-400">
            Hits
          </span>
          <ul className="w-full overflow-y-auto" style={{ maxHeight: "45vh" }}>
            {hits.map((airport: Airport) => (
              <li key={airport.iata} className="w-full">
                <Link href={`/airports/${airport.iata}`}>
                  <a className="block border-t w-full pt-2 pb-3 px-2 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h4>
                        {airport.name} <span className="text-gray-400">({airport.iata})</span>
                      </h4>
                      <span className="text-xs bg-gray-50 text-indigo-700 px-2 py-1 leading-none">
                        {airport.city}/{airport.country}
                      </span>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
