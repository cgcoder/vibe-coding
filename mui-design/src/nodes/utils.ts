import type { Node } from "./node";

function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  return function (...args: Parameters<T>): void {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}


export function safeJson(s: string): any {
  if (s) {
    try {
      return JSON.parse(s);
    }
    catch (e) {
        console.log(`unable to parse json`);
    }
  }
}

export function nodeStyle(n: Node): any {
  const s = n.properties["styleOverrides"];
  if (s) {
    try {
      return JSON.parse(s);
    }
    catch (e) {
        console.log(`unable to parse style json for node id ${n.id} with name ${n.properties["name"]}`);
    }
  }
}

export function arrToObj(arr: string[], ...keys: string[]): any {
    const obj: Record<string, string> = {};
    if (arr.length != keys.length) throw new Error(`arrToObj: ${arr.length} does not match ${keys.length}`);
    for (let i = 0; i < keys.length; i++) {
        obj[keys[i]] = arr[i];
    }
    return obj;
}
