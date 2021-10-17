export class ApiHelpers {
  async decodeToken(base64token) {
    // Remove Bearer from token header
    const token = base64token?.split(' ')[1];
    // Buffer and remove : char
    return Buffer.from(token, 'base64').toString().split(':');
  }

  async validateToken(apiKey) {
    const pattern = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i');
    const validApiKey = pattern.test(apiKey);
    return validApiKey;
  }
}
