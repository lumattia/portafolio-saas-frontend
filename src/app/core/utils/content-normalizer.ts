import { PageRenderer, SectionRenderer } from '../models/page.model';
import { getSectionDefinition } from '../constants/component-maps';

function syncWithDefaults(current: any, defaults: any): any {
  const result: any = {};
  for (const key in defaults) {
    if (!defaults.hasOwnProperty(key)) continue;
    const def = defaults[key];
    result[key] = (typeof def === 'object' && def !== null && !Array.isArray(def))
      ? syncWithDefaults(current?.[key] || {}, def)
      : (current?.[key] !== undefined && current?.[key] !== null ? current[key] : def);
  }
  return result;
}

function normalizeSection(section: SectionRenderer): void {
  const defaults = getSectionDefinition(section.componentSelector)?.defaultContent;
  if (defaults) {
    section.contentJson = syncWithDefaults(section.contentJson, defaults);
  }
  section.subSections?.forEach(normalizeSection);
}

export function normalizePageContent(page: PageRenderer): PageRenderer {
  page.sections?.forEach(normalizeSection);
  return page;
}
