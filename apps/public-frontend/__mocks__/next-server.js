class Headers {
  constructor(init) {
    this.headers = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value);
      });
    }
  }

  get(name) {
    return this.headers.get(name.toLowerCase()) || null;
  }

  set(name, value) {
    this.headers.set(name.toLowerCase(), value);
  }

  append(name, value) {
    this.headers.set(name.toLowerCase(), value);
  }

  delete(name) {
    this.headers.delete(name.toLowerCase());
  }
}

class NextResponse {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.headers = new Headers(init.headers);
  }

  static redirect(url, init) {
    const response = new NextResponse(null, { status: 307, ...init });
    response.headers.set('location', url.toString());
    return response;
  }

  static next(init) {
    return new NextResponse(null, { status: 200, ...init });
  }
}

class NextRequest {
  constructor(input, init = {}) {
    this.url = input;
    this.nextUrl = {
      pathname: '/',
      searchParams: new URLSearchParams(),
      ...init.nextUrl
    };
    this.headers = new Headers(init.headers);
  }

  clone() {
    return this;
  }
}

module.exports = {
  NextResponse,
  NextRequest,
};
