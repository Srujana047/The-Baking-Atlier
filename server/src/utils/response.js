export function sendError(res, statusCode, message, errors = []) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}

export function sendSuccess(res, payload = {}, message = "Success") {
  return res.status(200).json({
    success: true,
    message,
    ...payload
  });
}
