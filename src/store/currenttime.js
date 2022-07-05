import { atom } from "jotai";

export const currentTimeAtom = atom(localStorage.getItem('currentTime')? localStorage.getItem('currentTime') : 0);