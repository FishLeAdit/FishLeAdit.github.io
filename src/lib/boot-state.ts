// Set once either layout finishes booting. Lives in module scope, so rotating
// a device between the phone and desktop layouts doesn't replay the boot,
// while a full page reload still does.
export const bootState = { done: false };
