/**
 * Cloudflare Functions API proxy for CoinMarketCap
 * Handles CORS and API key security for production deployment
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Extract the path after /api/cmc/
  const cmcPath = url.pathname.replace('/api/cmc/', '');
  const cmcUrl = `https://pro-api.coinmarketcap.com/${cmcPath}${url.search}`;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CMC_PRO_API_KEY',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    // Forward the request to CoinMarketCap API
    const headers = new Headers();

    // Copy relevant headers from original request
    const apiKey = request.headers.get('X-CMC_PRO_API_KEY');
    if (apiKey) {
      headers.set('X-CMC_PRO_API_KEY', apiKey);
    }
    headers.set('Accept', 'application/json');

    const response = await fetch(cmcUrl, {
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CMC_PRO_API_KEY',
      },
    });

  } catch (error) {
    console.error('CMC API proxy error:', error);

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
