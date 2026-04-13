function notFound(request, response, _next) {
  response.status(404).json({
    message: `Route ${request.originalUrl} not found`
  });
}

module.exports = notFound;
