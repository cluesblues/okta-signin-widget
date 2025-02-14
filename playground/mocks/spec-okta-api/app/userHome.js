const apis = [
  {
    delay: [1000, 3000],
    proxy: false,
    path: '/app/UserHome',
    method: 'GET',
    template(params, query) {
      return `
        <h1>Mock User Dashboard</h1>
        <h2>Query parameters</h2>
        <pre id="preview-query">${JSON.stringify(query, null, 2)}</pre>
        <a href="/">Back to Login</a>`;
    }
  },
];

module.exports = apis;
