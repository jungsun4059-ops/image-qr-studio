type QRConfig = { apiOrigin: string; basePath: string };
declare global { interface Window { qrStudioConfig?: QRConfig } }
const config = () => typeof window === 'undefined' ? undefined : window.qrStudioConfig;
export const apiUrl = (path: string) => (config()?.apiOrigin || '') + path;
export const pageUrl = (path: string) => config() ? config()!.basePath + (path === '/' ? '/' : path.replace(/\/$/, '') + '/') : path;
export const imageUrl = (path: string) => config() ? new URL(pageUrl('/image') + '?id=' + encodeURIComponent(path.split('/').pop()!), location.origin).href : new URL(path, location.origin).href;
