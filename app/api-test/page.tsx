"use client"

import { useState } from "react"

interface ApiResponse {
  success: boolean
  count?: number
  query?: string
  data?: unknown
  error?: string
  code?: string
}

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, ApiResponse | null>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [meditationId, setMeditationId] = useState("0")

  const testEndpoint = async (name: string, url: string) => {
    setLoading((prev) => ({ ...prev, [name]: true }))
    try {
      const response = await fetch(url)
      const data = await response.json()
      setResults((prev) => ({ ...prev, [name]: data }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [name]: { success: false, error: String(error) },
      }))
    }
    setLoading((prev) => ({ ...prev, [name]: false }))
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-foreground mb-2">API Test Dashboard</h1>
        <p className="text-muted-foreground mb-8">Test the meditation REST API endpoints below.</p>

        <div className="space-y-6">
          {/* Test 1: Get All Meditations */}
          <div className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-foreground">Get All Meditations</h2>
                <code className="text-sm text-muted-foreground">GET /api/meditations</code>
              </div>
              <button
                onClick={() => testEndpoint("all", "/api/meditations")}
                disabled={loading.all}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading.all ? "Loading..." : "Test"}
              </button>
            </div>
            {results.all && (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto">
                {JSON.stringify(results.all, null, 2)}
              </pre>
            )}
          </div>

          {/* Test 2: Search Meditations */}
          <div className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-foreground">Search Meditations</h2>
                <code className="text-sm text-muted-foreground">GET /api/meditations?q=keyword</code>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search keyword..."
                  className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
                />
                <button
                  onClick={() => testEndpoint("search", `/api/meditations?q=${encodeURIComponent(searchQuery)}`)}
                  disabled={loading.search}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {loading.search ? "Loading..." : "Test"}
                </button>
              </div>
            </div>
            {results.search && (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto">
                {JSON.stringify(results.search, null, 2)}
              </pre>
            )}
          </div>

          {/* Test 3: Pagination */}
          <div className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-foreground">Pagination</h2>
                <code className="text-sm text-muted-foreground">GET /api/meditations?limit=2&offset=0</code>
              </div>
              <button
                onClick={() => testEndpoint("paginated", "/api/meditations?limit=2&offset=0")}
                disabled={loading.paginated}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading.paginated ? "Loading..." : "Test"}
              </button>
            </div>
            {results.paginated && (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto">
                {JSON.stringify(results.paginated, null, 2)}
              </pre>
            )}
          </div>

          {/* Test 4: Get Single Meditation */}
          <div className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-foreground">Get Single Meditation</h2>
                <code className="text-sm text-muted-foreground">GET /api/meditations/[id]</code>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={meditationId}
                  onChange={(e) => setMeditationId(e.target.value)}
                  placeholder="ID"
                  min="0"
                  className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground w-20"
                />
                <button
                  onClick={() => testEndpoint("single", `/api/meditations/${meditationId}`)}
                  disabled={loading.single}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {loading.single ? "Loading..." : "Test"}
                </button>
              </div>
            </div>
            {results.single && (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto">
                {JSON.stringify(results.single, null, 2)}
              </pre>
            )}
          </div>

          {/* Test 5: Not Found */}
          <div className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-foreground">Error Handling (Not Found)</h2>
                <code className="text-sm text-muted-foreground">GET /api/meditations/999</code>
              </div>
              <button
                onClick={() => testEndpoint("notfound", "/api/meditations/999")}
                disabled={loading.notfound}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading.notfound ? "Loading..." : "Test"}
              </button>
            </div>
            {results.notfound && (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto">
                {JSON.stringify(results.notfound, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-12 border border-border rounded-xl p-6 bg-card">
          <h2 className="text-xl font-medium text-foreground mb-4">API Documentation</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground">Base URL</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">/api/meditations</code>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Endpoints</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4">Method</th>
                    <th className="py-2 pr-4">Endpoint</th>
                    <th className="py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code className="bg-muted px-1 rounded">GET</code>
                    </td>
                    <td className="py-2 pr-4">/api/meditations</td>
                    <td className="py-2">List all meditations</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code className="bg-muted px-1 rounded">GET</code>
                    </td>
                    <td className="py-2 pr-4">/api/meditations?q=keyword</td>
                    <td className="py-2">Search by title or description</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code className="bg-muted px-1 rounded">GET</code>
                    </td>
                    <td className="py-2 pr-4">/api/meditations?limit=n&offset=n</td>
                    <td className="py-2">Paginate results</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <code className="bg-muted px-1 rounded">GET</code>
                    </td>
                    <td className="py-2 pr-4">/api/meditations/[id]</td>
                    <td className="py-2">Get single meditation by ID</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
