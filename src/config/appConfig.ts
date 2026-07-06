function readBooleanEnv(value: string | undefined, defaultValue: boolean) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return defaultValue;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const appEnvironment = import.meta.env.VITE_APP_ENV ?? 'local';
const apiTarget = import.meta.env.VITE_API_TARGET ?? 'local';

export const appConfig = {
  apiBaseUrl,
  appEnvironment,
  apiTarget,
  enableAdminUi: readBooleanEnv(import.meta.env.VITE_ENABLE_ADMIN_UI, true),
  isProductionApp: appEnvironment === 'production',
  isProductionApiTarget: apiTarget === 'production',
} as const;
