let scriptLoadingPromise: Promise<void> | null = null;

export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  // @ts-expect-error google is injected by the script
  if (window.google?.accounts?.id) return Promise.resolve();

  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google script")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

type GoogleCredentialResponse = { credential?: string };

type RenderButtonOptions = {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "continue_with" | "signin_with" | "signup_with";
  width?: string;
};

export async function renderGoogleButton(
  container: HTMLElement,
  onCredential: (idToken: string) => void,
  opts: RenderButtonOptions = {},
) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");

  await loadGoogleIdentityScript();

  // @ts-expect-error google is injected by the script
  const google = window.google;
  if (!google?.accounts?.id) throw new Error("Google Identity Services not available");

  google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: GoogleCredentialResponse) => {
      if (response?.credential) onCredential(response.credential);
    },

    // FedCM: do NOT force-enable. Some browsers/setups error with CORS/IdentityCredentialError.
    // Let GIS pick the best available flow by default.

    auto_select: false,
    cancel_on_tap_outside: false,
  });

  // Clear container and render the official button
  container.innerHTML = "";
  google.accounts.id.renderButton(container, {
    theme: opts.theme ?? "outline",
    size: opts.size ?? "large",
    text: opts.text ?? "continue_with",
    width: opts.width ?? "100%",
  });
}
