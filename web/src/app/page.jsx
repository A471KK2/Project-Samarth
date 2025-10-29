"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Loader,
  AlertCircle,
  BarChart3,
  Leaf,
  Cloud,
  TrendingUp,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!input.trim() || loading) return;

      setError(null);
      const userMessage = input.trim();
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setLoading(true);
      setStreamingMessage("");

      try {
        const response = await fetch("/api/samarth/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMessage }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to process question");
        }

        const data = await response.json();

        const formattedAnswer = `${data.answer}\n\n---\n**Data Sources Used:**\n${data.citations.length > 0 ? data.citations.map((c) => `• ${c}`).join("\n") : "No specific sources cited"}\n\n**Data Collection Summary:**\n• Agricultural Data Points: ${data.dataUsed.agriculturalDataPoints}\n• Climate Data Points: ${data.dataUsed.climateDataPoints}\n• States Analyzed: ${data.dataUsed.statesQueried}\n• Crops Analyzed: ${data.dataUsed.cropsQueried}`;

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: formattedAnswer,
            isStreaming: false,
            citations: data.citations,
          },
        ]);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "An error occurred. Please try again.");
        setLoading(false);
        setStreamingMessage("");
      }
    },
    [input, loading],
  );

  const sampleQuestions = [
    "Compare the average annual rainfall in Punjab and Maharashtra for the last 2 years.",
    "What are the top crops produced in Uttar Pradesh in 2023?",
    "Analyze the rainfall patterns in Karnataka during the monsoon season.",
    "How has wheat production changed in Punjab from 2022 to 2023?",
  ];

  // Landing Section
  if (activeSection === "home") {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-green-600" size={32} />
                <span className="text-2xl font-bold text-gray-900">
                  Samarth
                </span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex gap-8">
                <button
                  onClick={() => setActiveSection("home")}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveSection("platform")}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Platform
                </button>
                <button
                  onClick={() => setActiveSection("about")}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => setActiveSection("chat")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Start Now
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden pb-4 space-y-2">
                <button
                  onClick={() => {
                    setActiveSection("home");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveSection("platform");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Platform
                </button>
                <button
                  onClick={() => {
                    setActiveSection("about");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    setActiveSection("chat");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Start Now
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Intelligent Agricultural Intelligence
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Ask natural language questions about India's agricultural
                production and climate patterns. Get data-backed answers with
                proper citations from government sources.
              </p>
              <button
                onClick={() => setActiveSection("chat")}
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 text-lg font-semibold flex items-center gap-2 mx-auto"
              >
                Start Asking Questions <ArrowRight size={20} />
              </button>
            </div>

            {/* Key Stats */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <BarChart3 className="text-green-600 mx-auto mb-4" size={40} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
                <p className="text-gray-600">Agricultural datasets</p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <Cloud className="text-blue-600 mx-auto mb-4" size={40} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                <p className="text-gray-600">Climate records</p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <Leaf className="text-orange-600 mx-auto mb-4" size={40} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">28</h3>
                <p className="text-gray-600">Indian states</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
              Why Samarth?
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Cross-Domain Analysis
                  </h3>
                  <p className="text-gray-600">
                    Correlate agricultural production with climate patterns to
                    understand dependencies and derive actionable insights.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <BarChart3 size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Source Attribution
                  </h3>
                  <p className="text-gray-600">
                    Every claim is backed by citations to official government
                    data sources, ensuring accuracy and traceability.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-600 text-white">
                    <Leaf size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Natural Language Queries
                  </h3>
                  <p className="text-gray-600">
                    Ask questions in plain English. Our AI understands context
                    and retrieves the right data automatically.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                    <Cloud size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Real-Time Synthesis
                  </h3>
                  <p className="text-gray-600">
                    Get synthesized insights instantly by combining data from
                    multiple government ministries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
              Who Benefits?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Policy Makers
                </h3>
                <p className="text-gray-600">
                  Make informed decisions on agricultural policies backed by
                  comprehensive data analysis and climate correlations.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Researchers
                </h3>
                <p className="text-gray-600">
                  Access integrated datasets from multiple government sources to
                  conduct cross-domain research.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Farmers & Cooperatives
                </h3>
                <p className="text-gray-600">
                  Understand production trends, climate patterns, and make
                  better decisions for crop selection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to explore agricultural data?
            </h2>
            <p className="text-xl text-green-50 mb-8">
              Start asking questions and get data-backed insights instantly.
            </p>
            <button
              onClick={() => setActiveSection("chat")}
              className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 text-lg font-semibold"
            >
              Launch Platform
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={24} />
                  <span className="text-xl font-bold">Samarth</span>
                </div>
                <p className="text-gray-400">
                  Intelligent Q&A over Indian agricultural and climate data.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Navigation</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button
                      onClick={() => setActiveSection("home")}
                      className="hover:text-white"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection("platform")}
                      className="hover:text-white"
                    >
                      Platform
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection("about")}
                      className="hover:text-white"
                    >
                      About
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Data Sources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Ministry of Agriculture
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      IMD Climate Data
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      data.gov.in
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>
                &copy; 2025 Samarth. All rights reserved. Data from Ministry of
                Agriculture & Farmers Welfare and IMD.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Platform/Chat Section
  if (activeSection === "chat") {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header with Navigation */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart3 size={32} className="text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Samarth</h1>
          </div>
          <button
            onClick={() => setActiveSection("home")}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && !loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <BarChart3 size={48} className="text-indigo-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Samarth
                </h2>
                <p className="text-gray-600 mb-8 max-w-md">
                  Ask questions about agricultural production, crop yields, and
                  climate patterns across Indian states. Get data-backed answers
                  with proper citations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  {sampleQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => {
                          document
                            .querySelector("form")
                            ?.dispatchEvent(
                              new Event("submit", { bubbles: true }),
                            );
                        }, 100);
                      }}
                      className="p-3 text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-400 transition text-sm text-gray-700 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-2xl px-4 py-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm md:text-base whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}

                {streamingMessage && (
                  <div className="flex justify-start">
                    <div className="max-w-2xl px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-200 rounded-bl-none">
                      <p className="text-sm md:text-base whitespace-pre-wrap">
                        {streamingMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Loader
                          size={16}
                          className="animate-spin text-indigo-600"
                        />
                        <span className="text-xs text-gray-500">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {loading && !streamingMessage && (
                  <div className="flex justify-start">
                    <div className="max-w-2xl px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-200 rounded-bl-none">
                      <div className="flex items-center gap-2">
                        <Loader
                          size={16}
                          className="animate-spin text-indigo-600"
                        />
                        <span className="text-sm text-gray-600">
                          Processing your question...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-center">
                    <div className="max-w-2xl px-4 py-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                      <AlertCircle
                        size={20}
                        className="text-red-600 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-4 md:px-8 md:py-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about agricultural production, climate patterns, crop yields..."
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm md:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2 text-sm md:text-base"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Data sources: Ministry of Agriculture & Farmers Welfare, India
              Meteorological Department
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Platform Info Section
  if (activeSection === "platform") {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-green-600" size={32} />
                <span className="text-2xl font-bold text-gray-900">
                  Samarth
                </span>
              </div>
              <div className="hidden md:flex gap-8">
                <button
                  onClick={() => setActiveSection("home")}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveSection("platform")}
                  className="text-green-600 font-medium"
                >
                  Platform
                </button>
                <button
                  onClick={() => setActiveSection("about")}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => setActiveSection("chat")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              How Samarth Works
            </h1>

            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Data Integration
                </h2>
                <p className="text-gray-600 mb-4">
                  Samarth integrates data from multiple government sources:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Ministry of Agriculture & Farmers Welfare</li>
                  <li>✓ India Meteorological Department</li>
                  <li>✓ National Sample Survey Office</li>
                  <li>✓ State Agricultural Departments</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Data Coverage
                </h2>
                <ul className="space-y-2">
                  <li className="text-gray-600">
                    <strong>28</strong> States and Union Territories
                  </li>
                  <li className="text-gray-600">
                    <strong>100+</strong> Districts
                  </li>
                  <li className="text-gray-600">
                    <strong>50+</strong> Major Crops
                  </li>
                  <li className="text-gray-600">
                    <strong>10+ Years</strong> of Historical Data
                  </li>
                  <li className="text-gray-600">
                    <strong>Monthly</strong> Climate Records
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-12 rounded-lg mb-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                The Process
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    1
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Parse Question
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI understands your question and extracts key parameters
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    2
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Fetch Data</h3>
                  <p className="text-sm text-gray-600">
                    Query multiple databases for relevant information
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    3
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Analyze</h3>
                  <p className="text-sm text-gray-600">
                    Synthesize data and identify patterns and insights
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    4
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Answer with Citations
                  </h3>
                  <p className="text-sm text-gray-600">
                    Provide accurate answer with source attribution
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveSection("chat")}
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 font-semibold text-lg"
            >
              Try Samarth Now
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <p>
              &copy; 2025 Samarth. Intelligent Agricultural Intelligence
              Platform.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // About Section
  if (activeSection === "about") {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-green-600" size={32} />
                <span className="text-2xl font-bold text-gray-900">
                  Samarth
                </span>
              </div>
              <div className="hidden md:flex gap-8">
                <button
                  onClick={() => setActiveSection("home")}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveSection("platform")}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Platform
                </button>
                <button
                  onClick={() => setActiveSection("about")}
                  className="text-green-600 font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => setActiveSection("chat")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              About Samarth
            </h1>

            <div className="space-y-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 mb-6">
                  Samarth was created to solve a critical challenge: India's
                  government releases thousands of valuable, high-granularity
                  datasets through data.gov.in, but these datasets are
                  fragmented across different ministries and in varied formats.
                  This makes it nearly impossible for policymakers and
                  researchers to derive cross-domain insights needed for
                  effective decision-making.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  The Problem
                </h2>
                <p className="text-gray-600 mb-6">
                  Agricultural data exists in one format, climate data in
                  another. Data from different years may use different coding
                  schemes. The sheer volume and complexity of integrating these
                  datasets means that valuable insights remain locked away,
                  inaccessible to those who need them most.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Our Solution
                </h2>
                <p className="text-gray-600 mb-6">
                  Samarth provides an intelligent Q&A interface that:
                </p>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li>
                    ✓ <strong>Understands Natural Language</strong> - Ask
                    questions in plain English
                  </li>
                  <li>
                    ✓ <strong>Integrates Multiple Sources</strong> - Seamlessly
                    combines agricultural and climate data
                  </li>
                  <li>
                    ✓ <strong>Provides Citations</strong> - Every answer
                    includes source attribution
                  </li>
                  <li>
                    ✓ <strong>Enables Cross-Domain Analysis</strong> - Correlate
                    data across domains in real-time
                  </li>
                  <li>
                    ✓ <strong>Maintains Data Sovereignty</strong> - Can be
                    deployed in secure, private environments
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Data Integrity
                </h2>
                <p className="text-gray-600 mb-6">
                  We are committed to accuracy and traceability. Every data
                  point in our responses is sourced directly from official
                  government datasets. We clearly cite which ministry and
                  dataset each claim comes from, ensuring transparency and
                  accountability.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Who Can Benefit?
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <strong>Policy Makers</strong> - Make informed decisions
                    with data-backed insights
                  </li>
                  <li>
                    <strong>Researchers</strong> - Access integrated datasets
                    for cross-domain studies
                  </li>
                  <li>
                    <strong>Farmers & Cooperatives</strong> - Understand
                    production trends and climate patterns
                  </li>
                  <li>
                    <strong>Agricultural Economists</strong> - Analyze complex
                    relationships between climate and yield
                  </li>
                  <li>
                    <strong>NGOs & Development Organizations</strong> - Support
                    evidence-based programs
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setActiveSection("chat")}
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 font-semibold text-lg"
            >
              Start Exploring
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <p>
              &copy; 2025 Samarth. Intelligent Agricultural Intelligence
              Platform.
            </p>
          </div>
        </footer>
      </div>
    );
  }
}
