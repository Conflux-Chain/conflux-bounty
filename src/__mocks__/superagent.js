let mockDelay;
let mockError;
let mockResponse = {
  body: { result: {}, code: 0, message: '' },
};

// TODO: add support to mock data depends on api or just use fetch and mock-fetch
const Request = {
  text: JSON.stringify(mockResponse),
  body: mockResponse,

  post: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  query: jest.fn().mockReturnThis(),
  field: jest.fn().mockReturnThis(),
  type: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  accept: jest.fn().mockReturnThis(),
  timeout: jest.fn().mockReturnThis(),
  responseType: jest.fn().mockImplementation(function responseType() {
    const p = Promise.resolve(mockResponse);
    return p;
  }),
  end: jest.fn().mockImplementation(callback => {
    if (mockDelay) {
      this.delayTimer = setTimeout(callback, 0, mockError, mockResponse);
      return;
    }
    callback(mockError, mockResponse);
  }),

  __setMockDelay: boolValue => {
    mockDelay = boolValue;
  },
  __setMockResponse: mockRes => {
    mockResponse = mockRes;
  },
  __setMockError: mockErr => {
    mockError = mockErr;
  },
  __setMockResponseBody: body => {
    mockResponse.body = body;
  },
};

function request(method, url) {
  // callback
  if (typeof url === 'function') {
    return Request.get(method).end(url);
  }

  if (arguments.length === 1) {
    return Request.get(method);
  }

  return Request[method.toLowerCase()](url);
}

module.exports = request;
