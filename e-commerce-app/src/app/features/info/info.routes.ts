import { Routes } from '@angular/router';
import { InfoPageKey, INFO_PAGES } from './info-pages.data';

const loadInfoPage = () => import('./pages/info-page/info-page').then((m) => m.InfoPage);

function infoRoute(page: InfoPageKey) {
  return {
    path: page,
    loadComponent: loadInfoPage,
    data: { page },
    title: `Aurelia — ${INFO_PAGES[page].title}`
  };
}

export const INFO_ROUTES: Routes = (Object.keys(INFO_PAGES) as InfoPageKey[]).map(infoRoute);
