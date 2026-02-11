const ApiService = {
    async request(endpoint, method = 'GET', body = null, isAdmin = false) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (isAdmin) {
            headers['x-role'] = 'admin'; // Hii ni muhimu
        }

        const res = await fetch(`http://localhost:3000/api${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Request failed');
        }

        return res.json();
    }
};
