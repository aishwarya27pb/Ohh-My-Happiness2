"use client";

/* eslint-disable */
import { useEffect } from 'react';
import { env } from '@/env';

export default function Analytics() {
  useEffect(() => {
    interface AnalyticsWindow extends Window {
      dataLayer?: unknown[];
      fbq?: (action: string, eventName: string, data?: unknown) => void;
    }

    const win = window as unknown as AnalyticsWindow;

    // Google Analytics 4
    if (env.NEXT_PUBLIC_GA4_ID) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA4_ID}`;
      document.head.appendChild(gaScript);
      win.dataLayer = win.dataLayer || [];
      const gtag = (...args: unknown[]) => {
        win.dataLayer?.push(args);
      };
      gtag('js', new Date());
      gtag('config', env.NEXT_PUBLIC_GA4_ID);
    }

    // Facebook Pixel
    if (env.NEXT_PUBLIC_FB_PIXEL_ID) {
      (function(f: any,b,e,v,n?: any,t?: any,s?: any){
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s);
      })(win, document,'script','https://connect.facebook.net/en_US/fbevents.js');
      win.fbq?.('init', env.NEXT_PUBLIC_FB_PIXEL_ID);
      win.fbq?.('track', 'PageView');
    }
  }, []);

  return null;
}

