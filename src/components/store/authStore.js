// Simple module-level store — no context needed
let currentUser = null;

export const setCurrentUser = (user) => { currentUser = user; };
export const getCurrentUser = () => currentUser;
export const clearCurrentUser = () => { currentUser = null; };