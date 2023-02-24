export const handleError = (error, priority) => {
  return {
    success: false,
    message: error.message,
    priority: priority,
    stack: error.stack,
  };
};

export const handleSuccess = (data, token = null) => {
  return {
    success: true,
    data: data,
    token: token,
  };
};
