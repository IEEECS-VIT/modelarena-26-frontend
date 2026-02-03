export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization');
    const authToken = authHeader?.split(' ')[1];

    if (!authToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const rep = await fetch(`${process.env.BASE_URL}/user`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        const text = await rep.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.error('Backend returned non-JSON:', text.substring(0, 200));
            return new Response(JSON.stringify({ error: 'Backend service unavailable' }), { status: 502 });
        }

        if (!rep.ok) {
            return new Response(JSON.stringify(data), { status: rep.status });
        }

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error connecting to backend:', error);
        return new Response(JSON.stringify({ error: 'Failed to connect to backend' }), { status: 500 });
    }
}
