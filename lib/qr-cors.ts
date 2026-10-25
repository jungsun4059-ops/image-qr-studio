const pagesOrigin = 'https://jungsun4059-ops.github.io';
export function allowedOrigin(request: Request) {
 const origin = request.headers.get('origin');
 return !!origin && (origin === new URL(request.url).origin || origin === pagesOrigin);
}
export function corsResponse(request: Request, response: Response) {
 const headers = new Headers(response.headers);
 headers.append('Vary', 'Origin');
 if (allowedOrigin(request)) {
  headers.set('Access-Control-Allow-Origin', request.headers.get('origin')!);
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-File-Name');
  headers.set('Access-Control-Max-Age', '600');
 }
 return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}
export function preflight(request: Request) {
 return corsResponse(request, new Response(null, {status: allowedOrigin(request) ? 204 : 403}));
}
