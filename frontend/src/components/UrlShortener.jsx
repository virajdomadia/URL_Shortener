import React, { useEffect, useState } from "react";
import axios from "axios";

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [allUrls, setAllUrls] = useState([]);

  // Fetch all URL analytics on component mount
  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  // Shorten a new URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    try {
      const res = await axios.post(
        "https://url-shortener-backend-yjha.onrender.com/api/shorten",
        {
          originalUrl,
        }
      );
      setShortUrl(res.data.shortUrl);
      fetchAllAnalytics(); // Refresh analytics after new URL is created
    } catch (err) {
      console.error(err);
      setError("Failed to shorten URL. Please try again.");
    }
  };

  // Copy short URL to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `https://url-shortener-backend-yjha.onrender.com/${shortUrl}`
    );
    alert("Short URL copied to clipboard!");
  };

  // Fetch all URLs & analytics
  const fetchAllAnalytics = async () => {
    try {
      const res = await axios.get(
        "https://url-shortener-backend-yjha.onrender.com/api/shorten/analytics"
      );
      setAllUrls(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch analytics. Please try again.");
    }
  };

  // Fetch analytics for a single URL
  const fetchAnalytics = async (shortUrl) => {
    try {
      const res = await axios.get(
        `https://url-shortener-backend-yjha.onrender.com/api/shorten/analytics/${shortUrl}`
      );
      setAnalytics(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch analytics. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">URL Shortener</h1>

      {/* URL Shortener Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="url"
          placeholder="Enter long URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          className="w-full p-3 border rounded-md mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
        >
          Shorten URL
        </button>
      </form>

      {/* Display Shortened URL */}
      {shortUrl && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md text-center">
          <p className="mb-2 font-semibold">Short URL:</p>
          <a
            href={`https://url-shortener-backend-yjha.onrender.com/${shortUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {`https://url-shortener-backend-yjha.onrender.com/${shortUrl}`}
          </a>
          <div className="flex justify-center gap-4 mt-3">
            <button
              onClick={handleCopy}
              className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400 transition"
            >
              Copy
            </button>
            <button
              onClick={() => fetchAnalytics(shortUrl)}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
            >
              View Analytics
            </button>
          </div>
        </div>
      )}

      {/* Display Analytics for a Single URL */}
      {analytics && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md text-center">
          <h3 className="font-bold mb-2">Analytics:</h3>
          <p>
            <strong>Original URL:</strong> {analytics.originalUrl}
          </p>
          <p>
            <strong>Total Clicks:</strong> {analytics.clicks}
          </p>
          <p>
            <strong>Created On:</strong>{" "}
            {new Date(analytics.creationDate).toDateString()}
          </p>
        </div>
      )}

      {/* Display All URLs with Analytics */}
      <h2 className="text-xl font-bold mt-8 mb-3">All Shortened URLs</h2>
      <div className="overflow-x-auto">
        {allUrls.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Original URL</th>
                <th className="border p-2">Short URL</th>
                <th className="border p-2">Clicks</th>
                <th className="border p-2">Created On</th>
              </tr>
            </thead>
            <tbody>
              {allUrls.map((url) => (
                <tr key={url._id} className="text-center">
                  <td className="border p-2">{url.originalUrl}</td>
                  <td className="border p-2">
                    <a
                      href={`https://url-shortener-backend-yjha.onrender.com/${url.shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {`/${url.shortUrl}`}
                    </a>
                  </td>
                  <td className="border p-2">{url.clicks}</td>
                  <td className="border p-2">
                    {new Date(url.creationDate).toDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No URLs found</p>
        )}
      </div>

      {/* Error Message */}
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
    </div>
  );
};

export default UrlShortener;
