import { cookies } from 'next/headers'

interface cookieParams {
    nameCookie: string;
    value: string;
}

export function addCookie ( {nameCookie, value} : cookieParams) {
    const cookieStore = cookies();
    cookieStore.set(nameCookie, value);
}