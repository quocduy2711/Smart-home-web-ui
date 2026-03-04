
import { nanoid } from 'nanoid';

// Polyfill for nanoid in CommonJS environment if needed, but here we just export simple
// We can actually just use crypto.randomUUID for modern node
export { nanoid };
