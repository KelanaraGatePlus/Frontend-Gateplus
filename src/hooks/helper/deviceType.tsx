import { useEffect, useState } from "react";

export type DeviceType = "MOBILE" | "TABLET" | "DESKTOP";

const MEDIA_QUERIES = {
  mobile: "(max-width: 767.98px)",
  tablet: "(min-width: 768px) and (max-width: 1023.98px)",
  desktop: "(min-width: 1024px)",
};

function getDeviceFromMatches(): DeviceType {
  if (typeof window === "undefined") return "DESKTOP"; // default during SSR
  const mqMobile = window.matchMedia(MEDIA_QUERIES.mobile);
  const mqTablet = window.matchMedia(MEDIA_QUERIES.tablet);
  const mqDesktop = window.matchMedia(MEDIA_QUERIES.desktop);

  if (mqMobile.matches) return "MOBILE";
  if (mqTablet.matches) return "TABLET";
  if (mqDesktop.matches) return "DESKTOP";
  return "DESKTOP";
}

/**
 * useDeviceType
 * - Mengembalikan salah satu dari: "MOBILE" | "TABLET" | "DESKTOP"
 * - Aman untuk SSR (mengembalikan default "DESKTOP" saat tidak ada window)
 */
export function useDeviceType(): DeviceType {
  const [device, setDevice] = useState<DeviceType>(() => {
    // initial read: avoid throwing in SSR
    return getDeviceFromMatches();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqMobile = window.matchMedia(MEDIA_QUERIES.mobile);
    const mqTablet = window.matchMedia(MEDIA_QUERIES.tablet);
    const mqDesktop = window.matchMedia(MEDIA_QUERIES.desktop);

    const handler = () => setDevice(getDeviceFromMatches());

    // prefer addEventListener if available
    const add = (mq: MediaQueryList) => {
      if ("addEventListener" in mq) {
        mq.addEventListener("change", handler);
      } else if ("addListener" in mq) {
        // @ts-expect-error: addListener is deprecated but still present in some browsers
        mq.addListener(handler);
      }
    };
    const remove = (mq: MediaQueryList) => {
      if ("removeEventListener" in mq) {
        mq.removeEventListener("change", handler);
      } else if ("removeListener" in mq) {
        // @ts-expect-error: removeListener is deprecated but still present in some browsers
        mq.removeListener(handler);
      }
    };

    add(mqMobile);
    add(mqTablet);
    add(mqDesktop);

    // initial sync (in case)
    handler();

    return () => {
      remove(mqMobile);
      remove(mqTablet);
      remove(mqDesktop);
    };
  }, []);

  return device;
}

/* Convenience helpers */
export const useIsMobile = () => useDeviceType() === "MOBILE";
export const useIsTablet = () => useDeviceType() === "TABLET";
export const useIsDesktop = () => useDeviceType() === "DESKTOP";
