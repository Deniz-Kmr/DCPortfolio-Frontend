import { appConfig } from '../../config';

export function AdminEnvironmentBanner() {
  if (!appConfig.enableAdminUi) {
    return null;
  }

  if (!appConfig.isProductionApiTarget) {
    return null;
  }

  return (
    <div className="border-b border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
      <div className="mx-auto max-w-7xl">
        <strong className="font-semibold">Production API target active.</strong>{' '}
        Changes made from this admin UI may affect live portfolio data.
      </div>
    </div>
  );
}
