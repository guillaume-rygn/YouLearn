import { atom } from "jotai";

export const currentTimeAtom = atom(localStorage.getItem('currentTime')? localStorage.getItem('currentTime') : 0);
export const globalTimeAtom = atom(localStorage.getItem('currentTime')? localStorage.getItem('currentTime') : 0);