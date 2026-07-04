const GITHUB_OWNER = 'b1-ack';
const GITHUB_REPO = 'operating-system';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  // GET /api/issues — получить список issues
  if (request.method === 'GET') {
    try {
      const headers = { Accept: 'application/vnd.github+json' };
      if (env.GITHUB_TOKEN) {
        headers.Authorization = `token ${env.GITHUB_TOKEN}`;
      }

      const response = await fetch(GITHUB_API, { headers });
      if (!response.ok) {
        return jsonResponse({ error: `GitHub API error: ${response.status}` }, response.status);
      }

      const data = await response.json();
      return jsonResponse(data);
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  }

  // POST /api/issues — создать новый issue
  if (request.method === 'POST') {
    try {
      if (!env.GITHUB_TOKEN) {
        return jsonResponse({ error: 'GITHUB_TOKEN not configured' }, 500);
      }

      const body = await request.json();

      const response = await fetch(GITHUB_API, {
        method: 'POST',
        headers: {
          Authorization: `token ${env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          title: body.title,
          body: body.body,
          labels: body.labels || ['question'],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return jsonResponse({ error: data.message || 'Failed to create issue' }, response.status);
      }

      return jsonResponse(data, 201);
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  }

  // Неподдерживаемый метод
  return jsonResponse({ error: 'Method not allowed' }, 405);
}
