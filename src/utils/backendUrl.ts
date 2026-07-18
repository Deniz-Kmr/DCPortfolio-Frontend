import { appConfig } from '../config';

export function buildBackendFileUrl(path: string) {
  const normalizedBaseUrl = appConfig.apiBaseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}
