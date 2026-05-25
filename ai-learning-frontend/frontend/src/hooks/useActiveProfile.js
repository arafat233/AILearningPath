import { useAuthStore } from "../store/authStore";

// Returns the active profile — the child currently being viewed when a
// parent/teacher is in "view as child" mode, or the logged-in user otherwise.
// Use this anywhere a page reads grade / examBoard / subject / subjects /
// examDate for content fetching or display, so the UI follows the viewing
// context instead of silently falling back to the parent's profile.
export function useActiveProfile() {
  const user        = useAuthStore((s) => s.user);
  const activeChild = useAuthStore((s) => s.activeChild);
  return activeChild || user;
}
