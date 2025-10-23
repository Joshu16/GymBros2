// Authorized domains for Firebase Auth
export const AUTHORIZED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'gym-bros2.vercel.app', // Your actual Vercel domain
  'gymbros-c21df.firebaseapp.com',
  // Add your custom domain here if you have one
];

// Check if current domain is authorized
export const isDomainAuthorized = () => {
  const currentDomain = window.location.hostname;
  return AUTHORIZED_DOMAINS.some(domain => 
    currentDomain === domain || currentDomain.endsWith(`.${domain}`)
  );
};

// Get the current domain for debugging
export const getCurrentDomain = () => {
  return {
    hostname: window.location.hostname,
    origin: window.location.origin,
    protocol: window.location.protocol
  };
};
