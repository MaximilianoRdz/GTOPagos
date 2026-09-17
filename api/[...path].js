module.exports = async (req, res) => {
  // Construir la URL destino hacia el backend local
  const targetUrl = `http://api.maxrdzs.com:1450${req.url}`;

  try {
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }

    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (typeof req.body === 'object' && req.body !== null) {
        fetchOptions.body = JSON.stringify(req.body);
        headers['content-type'] = 'application/json';
      } else if (req.body) {
        fetchOptions.body = req.body;
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
    return res.status(502).json({
      error: 'Proxy Error',
      message: 'No se pudo conectar con el backend local en http://api.maxrdzs.com:1450',
      details: err.message
    });
  }
};
