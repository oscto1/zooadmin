const response = await fetch('/lista-cuidadores', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    // body: JSON.stringify({ username, password })
  });