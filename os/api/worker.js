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
    'Content-Type': 'application/json',
  };
}

function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || '';
  const headers = corsHeaders(origin);
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers,
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers,
    });
  }

  const title = (body.title || '').trim();
  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), {
      status: 400,
      headers,
    });
  }

  if (title.length > 256) {
    return new Response(JSON.stringify({ error: 'Title is too long' }), {
      status: 400,
      headers,
    });
  }

  const description = (body.body || '').trim();
  if (description.length > 50000) {
    return new Response(JSON.stringify({ error: 'Description is too long' }), {
      status: 400,
      headers,
    });
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
        body: JSON.stringify({
          title,
          body: description,
          labels,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.message || 'GitHub API error' }),
        { status: response.status, headers }
      );
    }

    return new Response(
      JSON.stringify({
        html_url: data.html_url,
        number: data.number,
        title: data.title,
      }),
      { status: 201, headers }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers }
    );
  }
}

export default {
  fetch(request, env, ctx) {
    return handleRequest(request, env);
  },
};
