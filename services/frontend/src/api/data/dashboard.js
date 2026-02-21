const DASHBOARD_PAGE_KEY = 'dashboard_page';

const getInitialPage = () => {
  try {
    return localStorage.getItem(DASHBOARD_PAGE_KEY) || 'schedules';
  } catch {
    return 'schedules';
  }
};

const dashboardState = {
  page: getInitialPage(),
  sideMenuOpen: false,
  pageTitle: '',
};

export { dashboardState, DASHBOARD_PAGE_KEY };
