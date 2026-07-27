const GITHUB_OWNER = 'b1-ack';
const GITHUB_REPO = 'operating-system';
const GITHUB_TOKEN = 'github_pat_TOKEN';
const ALLOWED_ORIGINS = [
  'https://b1ack.net',
  'https://os.b1ack.net',
  'http://localhost:5500'
];

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : 'https://b1ack.net';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...extraHeaders, 'Content-Type': 'application/json' },
  });
}

function handleIP(request, headers) {
  const ip = request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
    || 'Unknown';
  return jsonResponse({ ip }, 200, headers);
}

function handleTrace(request, headers) {
  const url = new URL(request.url);
  const cf = request.cf || {};
  const body = [
    'fl=74f154',
    'h=' + (request.headers.get('Host') || url.hostname),
    'ip=' + (request.headers.get('CF-Connecting-IP') || 'Unknown'),
    'ts=' + (Date.now() / 1000).toFixed(3),
    'visit_scheme=' + url.protocol.replace(':', ''),
    'uag=' + (request.headers.get('User-Agent') || ''),
    'colo=' + (cf.colo || 'N/A'),
    'sliver=none',
    'http=' + (cf.httpProtocol || 'http/1.1'),
    'loc=' + (cf.country || 'XX'),
    'tls=' + (cf.tlsVersion || 'N/A'),
    'sni=' + (cf.tlsClientHello?.sni ? 'on' : 'off'),
    'warp=off',
    'gateway=off',
    'rbi=off',
    'kex=' + (cf.tlsKeyExchange || 'N/A'),
  ].join('\n') + '\n';

  return new Response(body, {
    status: 200,
    headers: { ...headers, 'Content-Type': 'text/plain' },
  });
}

async function handleWeather(request, headers) {
  const url = new URL(request.url);
  const apiUrl = 'https://api.open-meteo.com/v1/forecast?' + url.searchParams.toString();
  const response = await fetch(apiUrl);
  const data = await response.json();
  return jsonResponse(data, response.status, headers);
}

async function handleIssue(request, headers) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, headers);
  }

  const title = (body.title || '').trim();
  if (!title) {
    return jsonResponse({ error: 'Title is required' }, 400, headers);
  }

  if (title.length > 256) {
    return jsonResponse({ error: 'Title is too long' }, 400, headers);
  }

  const description = (body.body || '').trim();
  if (description.length > 50000) {
    return jsonResponse({ error: 'Description is too long' }, 400, headers);
  }

  const labels = Array.isArray(body.labels) ? body.labels.slice(0, 10) : ['question'];

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'b1ack-api-worker',
        },
        body: JSON.stringify({ title, body: description, labels }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return jsonResponse({ error: data.message || 'GitHub API error' }, response.status, headers);
    }

    return jsonResponse({
      html_url: data.html_url,
      number: data.number,
      title: data.title,
    }, 201, headers);
  } catch (err) {
    return jsonResponse({ error: 'Internal server error' }, 500, headers);
  }
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || '';
  const headers = corsHeaders(origin);
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const path = url.pathname;

  if (path === '/trace') {
    return handleTrace(request, headers);
  }

  if (path === '/ip') {
    return handleIP(request, headers);
  }

  if (path === '/weather') {
    return handleWeather(request, headers);
  }

  if (method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, headers);
  }

  return handleIssue(request, headers);
}

export default {
  fetch(request, env, ctx) {
    return handleRequest(request, env);
  },
};
