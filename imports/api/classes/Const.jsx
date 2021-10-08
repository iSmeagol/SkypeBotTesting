export const ROUTES = {
  MAIN: '',
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'reset-password',
  RESET_PASSWORD: 'reset',
  VERIFY: 'verify',

};

let ROLES_ = {
  NONE: 0,
  VIEW_DASHBOARD: 0x1 << 0,
  VIEW_VIDEO: 0x1 << 1,
  VIEW_USERS: 0x1 << 2,
  ADD_COLLECTION: 0x1 << 3,
  ALL: 0xFFFFFF
};

ROLES_.GUESTS = ROLES_.NONE;
ROLES_.USER = (ROLES_.VIEW_DASHBOARD | ROLES_.VIEW_VIDEO | ROLES_.VIEW_USERS | ROLES_.ADD_COLLECTION);
ROLES_.ADMIN = (ROLES_.ALL);
ROLES_.SUPERUSER = ROLES_.ALL;

export const ROLES = ROLES_;
export const isPermitted = (role, permission) => {
  return !(!(parseInt(role) & permission));
};

export const BOOL = {
  TRUE: 1,
  FALSE: 0
};

export const VALUE = {
  TRUE: 1,
  FALSE: 0
}

export const RETIRED = {
  FALSE: 0,
  TRUE: 1
};
export const VERIFIED = {
  FALSE: false,
  TRUE: true
};

