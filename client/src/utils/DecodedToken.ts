export function DecodedToken(token: string) {
  try {
    // Check if token exists and has the expected format
    if (!token || typeof token !== 'string') {
      return { success: false, error: new Error('Invalid token: token is missing or not a string') };
    }

    const tokenParts = token.split('.');
    
    // JWT tokens should have 3 parts separated by dots
    if (tokenParts.length !== 3) {
      return { success: false, error: new Error('Invalid token format: expected 3 parts') };
    }

    const base64Url = tokenParts[1];
    
    if (!base64Url) {
      return { success: false, error: new Error('Invalid token: payload is missing') };
    }

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    
    const decodedToken = JSON.parse(jsonPayload);

    // Check if the expected field exists in the decoded token
    if (!decodedToken.value) {
      return { success: false, error: new Error('Token payload missing required field: value') };
    }

    return { success: true, id: decodedToken.value };
  } catch (error) {
    return { success: false, error };
  }
}
