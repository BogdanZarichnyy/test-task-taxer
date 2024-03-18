import { UserDataType } from "./types";

export const save = (key: string, value: UserDataType[]): void => {
  try {
    const serializedState: string = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error: any) {
    console.error("Set state error: ", error.message);
  }
};

export const load = (key: string): undefined | UserDataType[] => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (error: any) {
    console.error("Get state error: ", error.message);
  }
};