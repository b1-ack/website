export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const { method } = request;

    const GITHUB_TOKEN = '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';
    const GITHUB_OWNER = 'b1-ack';
    const GITHUB_REPO = 'operating-system';

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Max-Age': '86400',
    };

    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const githubUrl = new URL(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`);
    url.searchParams.forEach((value, key) => {
        githubUrl.searchParams.set(key, value);
    });

    try {
        const headers = {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
        };

        let body;
        if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
            headers['Content-Type'] = 'application/json';
            body = await request.text();
        }

        const ghResponse = await fetch(githubUrl.toString(), {
            method,
            headers,
            body,
        });

        const data = await ghResponse.text();

        return new Response(data, {
            status: ghResponse.status,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });
    }
}
