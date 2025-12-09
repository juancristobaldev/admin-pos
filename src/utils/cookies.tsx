import { destroyCookie, parseCookies, setCookie } from "nookies";

export const aYear = 60 * 60 * 24 * 365 * 100;
export const aDay = 60 * 60 * 24;

export const updateCookies = (field: string, value: any, expiredIn = aDay) => {
  const config = {
    maxAge: expiredIn,
    path: "/",
    httpOnly: false,
    sameSite: "strict",
  };

  setCookie(null, field, value, config);
};

export const deleteCookies = (field: string) => {
  destroyCookie(null, field, {
    path: "/",
    httpOnly: false,
    sameSite: "strict",
  });
};

export const getCookies = (field: string) => {
  const cookies = parseCookies();

  return cookies[field];
};
