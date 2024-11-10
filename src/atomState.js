import { atom } from 'recoil';

export const timeState = atom({
  key: 'timeState', 
  default: 5000, 
});

export const typeState = atom({
    key: 'typeState',
    default: 'num',
})