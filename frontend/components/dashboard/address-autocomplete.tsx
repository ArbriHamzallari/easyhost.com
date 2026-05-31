"use client";

import { useEffect, useRef, useState } from "react";

interface AddressAutocompleteProps {
  defaultAddress?: string;
  defaultTimezone?: string;
}

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: object,
          ) => {
            addListener: (event: string, cb: () => void) => void;
            getPlace: () => {
              formatted_address?: string;
              geometry?: { location?: { lat: () => number; lng: () => number } };
            };
          };
        };
      };
    };
    initGoogleMapsAutocomplete?: () => void;
  }
}

export function AddressAutocomplete({
  defaultAddress = "",
  defaultTimezone = "Europe/Tirane",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [timezone, setTimezone] = useState(defaultTimezone);
  const [timezoneLoading, setTimezoneLoading] = useState(false);
  // Initialize from a function so we capture script presence on first render
  // without firing a setState inside the effect.
  const [mapsReady, setMapsReady] = useState(() => {
    if (typeof document === "undefined") return false;
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return false;
    return !!document.getElementById("google-maps-api") && !!window.google;
  });

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return; // Graceful fallback — manual input only
    if (mapsReady) return;

    const scriptId = "google-maps-api";
    if (document.getElementById(scriptId)) return; // already loading

    window.initGoogleMapsAutocomplete = () => setMapsReady(true);

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsAutocomplete`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      delete window.initGoogleMapsAutocomplete;
    };
  }, [mapsReady]);

  useEffect(() => {
    if (!mapsReady || !inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode", "establishment"],
      fields: ["formatted_address", "geometry"],
    });

    autocomplete.addListener("place_changed", async () => {
      const place = autocomplete.getPlace();
      if (!place.formatted_address) return;

      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      if (!lat || !lng) return;

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      setTimezoneLoading(true);
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`,
        );
        const data = (await res.json()) as { status: string; timeZoneId?: string };
        if (data.status === "OK" && data.timeZoneId) {
          setTimezone(data.timeZoneId);
        }
      } catch {
        // Keep current timezone on error
      } finally {
        setTimezoneLoading(false);
      }
    });
  }, [mapsReady]);

  return (
    <div className="space-y-4">
      {/* Address input */}
      <div>
        <label className="block text-[13px] font-medium text-[var(--foreground)]">
          Property address
        </label>
        <input
          ref={inputRef}
          name="address"
          type="text"
          defaultValue={defaultAddress}
          placeholder="Start typing your address…"
          autoComplete="street-address"
          className="mt-1.5 w-full rounded-[10px] border border-[var(--border)] bg-white px-4 py-3 text-[14px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
        {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            Autocomplete available once Google Maps API key is configured.
          </p>
        )}
      </div>

      {/* Timezone */}
      <input type="hidden" name="timezone" value={timezone} />
      <div>
        <label className="block text-[13px] font-medium text-[var(--foreground)]">
          Timezone
          {timezoneLoading && (
            <span className="ml-2 text-[11px] font-normal text-[var(--muted)]">Detecting…</span>
          )}
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="mt-1.5 w-full rounded-[10px] border border-[var(--border)] bg-white px-4 py-3 text-[14px] text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        >
          <optgroup label="Europe">
            <option value="Europe/Tirane">Europe/Tirane (Albania)</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Europe/Paris">Europe/Paris</option>
            <option value="Europe/Berlin">Europe/Berlin</option>
            <option value="Europe/Rome">Europe/Rome</option>
            <option value="Europe/Athens">Europe/Athens</option>
            <option value="Europe/Madrid">Europe/Madrid</option>
            <option value="Europe/Zurich">Europe/Zurich</option>
            <option value="Europe/Amsterdam">Europe/Amsterdam</option>
            <option value="Europe/Istanbul">Europe/Istanbul</option>
          </optgroup>
          <optgroup label="Americas">
            <option value="America/New_York">America/New York</option>
            <option value="America/Chicago">America/Chicago</option>
            <option value="America/Los_Angeles">America/Los Angeles</option>
            <option value="America/Toronto">America/Toronto</option>
          </optgroup>
          <optgroup label="Asia & Pacific">
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
            <option value="Asia/Singapore">Asia/Singapore</option>
            <option value="Australia/Sydney">Australia/Sydney</option>
          </optgroup>
          {!COMMON_TIMEZONES.includes(timezone) && (
            <option value={timezone}>{timezone}</option>
          )}
        </select>
        <p className="mt-1 text-[11px] text-[var(--muted)]">
          Auto-detected when address is selected. You can change it manually.
        </p>
      </div>
    </div>
  );
}

const COMMON_TIMEZONES = [
  "Europe/Tirane",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Athens",
  "Europe/Madrid",
  "Europe/Zurich",
  "Europe/Amsterdam",
  "Europe/Istanbul",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Toronto",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];
