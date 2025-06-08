/**
 * Cloudflare Functions API proxy for CoinGecko
 * Handles CORS and API key security for production deployment
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Extract the path after /api/coingecko/
  const coingeckoPath = url.pathname.replace('/api/coingecko/', '');
  const coingeckoUrl = `https://api.coingecko.com/${coingeckoPath}${url.search}`;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-cg-pro-api-key',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    // Forward the request to CoinGecko API
    const headers = new Headers();

    // Copy relevant headers from original request
    const apiKey = request.headers.get('x-cg-pro-api-key');
    if (apiKey) {
      headers.set('x-cg-pro-api-key', apiKey);
    }
    headers.set('Accept', 'application/json');

    const response = await fetch(coingeckoUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const data = await response.text();

    // Return response with CORS headers
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-cg-pro-api-key',
      },
    });

  } catch (error) {
    console.error('CoinGecko API proxy error:', error);

    return new Response(JSON.stringify({
      error: 'API proxy failed',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
