"use client";

import { useState, useEffect } from "react";
import { Loader, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/api/samarth/metadata");
        if (!response.ok) throw new Error("Failed to fetch metadata");
        const data = await response.json();
        setMetadata(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Samarth Admin Dashboard
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {metadata && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* States */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Available States ({metadata.states?.length || 0})
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {metadata.states?.map((state) => (
                  <div
                    key={state.state}
                    className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700"
                  >
                    {state.state}
                  </div>
                ))}
              </div>
            </div>

            {/* Crops */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Available Crops ({metadata.crops?.length || 0})
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {metadata.crops?.map((crop) => (
                  <div
                    key={crop.crop_name}
                    className="px-3 py-2 bg-green-50 border border-green-200 rounded text-sm text-gray-700"
                  >
                    {crop.crop_name}
                    <span className="text-xs text-gray-500 ml-2">
                      ({crop.crop_type})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Data Sources ({metadata.dataSources?.length || 0})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {metadata.dataSources?.map((source) => (
                  <div
                    key={source.id}
                    className="p-3 bg-purple-50 border border-purple-200 rounded text-sm"
                  >
                    <div className="font-semibold text-gray-900">
                      {source.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {source.ministry}
                    </div>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 block"
                      >
                        View Source
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Info */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">System Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Components</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>✅ Database (PostgreSQL)</li>
                <li>✅ Backend API Endpoints</li>
                <li>✅ AI Integration (ChatGPT)</li>
                <li>✅ Frontend Chat Interface</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                API Endpoints
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>/api/samarth/ask - Q&A</li>
                <li>/api/samarth/search - Data Search</li>
                <li>/api/samarth/metadata - Metadata</li>
                <li>/admin - Admin Dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Test */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Quick Test Queries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/?q=What%20are%20the%20top%20crops%20in%20Punjab%202023"
              className="p-4 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition"
            >
              <div className="font-semibold text-gray-900">
                Top Crops in Punjab
              </div>
              <div className="text-sm text-gray-600">
                What are the top crops produced in Punjab in 2023?
              </div>
            </a>
            <a
              href="/?q=Compare%20rainfall%20Punjab%20Maharashtra"
              className="p-4 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition"
            >
              <div className="font-semibold text-gray-900">
                Rainfall Comparison
              </div>
              <div className="text-sm text-gray-600">
                Compare rainfall in Punjab vs Maharashtra
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
