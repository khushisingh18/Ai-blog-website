import React, { useState } from 'react';
import { Copy, Check, Sparkles, Loader2, FileText } from 'lucide-react';

const ArticleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // NOTE: In a real app, use environment variables (e.g., import.meta.env.VITE_API_KEY)
  const API_KEY = "AIzaSyDOpP2ewW1yNG9xw6pEag80mN5_7xXewps"; 
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const generateArticle = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic for your article!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setArticleContent('');

    const prompt = `Write a comprehensive, well-structured article about "${topic}". 
    The article should include:
    - An engaging introduction
    - Multiple detailed sections with subheadings
    - Key points and insights
    - A thoughtful conclusion
    
    Make it informative, engaging, and around 500-800 words. Format it with Markdown (using ** for bold).`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch response");
      }

      const generatedText = data.candidates[0].content.parts[0].text.trim();
      setArticleContent(generatedText);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(articleContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy article.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && topic.trim()) {
      generateArticle();
    }
  };

  // Helper to convert simple Markdown bold (**text**) to HTML strong tags
  const formatText = (text) => {
    if (!text) return { __html: '' };
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: formatted };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            AI Article Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate professional articles instantly with AI-powered content creation
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Create Your Article</h2>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Input Section */}
            <div className="space-y-3">
              <label htmlFor="topic-input" className="block text-lg font-semibold">
                Enter Your Article Topic:
              </label>
              <input
                type="text"
                id="topic-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., The Future of Artificial Intelligence, Benefits of Meditation..."
                className="w-full px-4 py-3 rounded-lg border-2 border-input bg-background focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={isLoading}
              />
              
              <button
                onClick={generateArticle}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Article
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            {(isLoading || articleContent || error) && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b-2 border-blue-600 pb-2">
                  <h3 className="text-lg font-semibold">Generated Article</h3>
                  {articleContent && !isLoading && (
                    <button
                      onClick={handleCopy}
                      className={`
                        px-4 py-2 rounded-lg font-medium text-sm border-2 transition-all flex items-center gap-2
                        ${isCopied 
                          ? 'bg-green-500 text-white border-green-500' 
                          : 'bg-white dark:bg-gray-800 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}
                      `}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Content Box */}
                <div className="bg-muted rounded-lg p-6 min-h-[200px]">
                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 py-8">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg border-l-4 border-destructive">
                      <strong>Error:</strong> {error}
                    </div>
                  )}

                  {!isLoading && !error && articleContent && (
                    <div 
                      className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed"
                      dangerouslySetInnerHTML={formatText(articleContent)} 
                    />
                  )}
                </div>

                {articleContent && !isLoading && (
                  <p className="text-sm text-muted-foreground italic">
                    💡 Tip: Click "Copy" button above to use this content in your blog posts
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleGenerator;