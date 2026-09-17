module.exports = async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, 'http://localhost');
    const pathParam = parsedUrl.searchParams.get('path');

    let targetPath = '';
    if (pathParam !== null && pathParam !== undefined) {
      let cleanPath = pathParam.replace(/^\/+/, '');
      if (cleanPath && !cleanPath.endsWith('/') && !cleanPath.includes('.')) {
        cleanPath += '/';
      }
      targetPath = cleanPath ? `/api/${cleanPath}` : '/api/';
    } else if (parsedUrl.pathname.startsWith('/api') && !parsedUrl.pathname.startsWith('/api/index')) {
      let cleanPath = parsedUrl.pathname;
      if (!cleanPath.endsWith('/') && !cleanPath.includes('.')) {
        cleanPath += '/';
      }
      targetPath = cleanPath;
    } else {
      targetPath = '/api/';
    }

    const queryParams = new URLSearchParams();
    for (const [key, value] of parsedUrl.searchParams.entries()) {
      if (key !== 'path') {
        queryParams.append(key, value);
      }
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const targetUrl = `http://api.maxrdzs.com:1450${targetPath}${queryString}`;

    // Filter incoming headers
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      const lowerKey = key.toLowerCase();
      if (!['host', 'connection', 'content-length'].includes(lowerKey)) {
        headers[lowerKey] = value;
      }
    }

    // Security headers for backend whitelist verification
    headers['origin'] = 'https://gtopagos.maxrdzs.com';
    headers['x-gtopagos-proxy-key'] = 'gtopagos-prod-vault-key-7712';

    // Build fetch options
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    // Handle body for non-GET/HEAD methods
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      let bodyData;
      if (req.body !== undefined && req.body !== null) {
        if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
          bodyData = JSON.stringify(req.body);
          if (!headers['content-type']) {
            headers['content-type'] = 'application/json';
          }
        } else {
          bodyData = req.body;
        }
      } else {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        if (chunks.length > 0) {
          bodyData = Buffer.concat(chunks);
        }
      }

      if (bodyData) {
        fetchOptions.body = bodyData;
      }
    }

    const response = await fetch(targetUrl, fetchOptions);

    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!['transfer-encoding', 'content-encoding', 'content-length'].includes(lowerKey)) {
        res.setHeader(key, value);
      }
    });

    const buffer = await response.arrayBuffer();
    return res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error('Proxy Error:', err);
    return res.status(502).json({
      error: 'Proxy Error',
      message: 'No se pudo conectar con el backend en http://api.maxrdzs.com:1450',
      details: err.message
    });
  }
};
