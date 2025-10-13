import { MemoryStore, rateLimit } from 'express-rate-limit'

export const store = new MemoryStore();

// export rate limiter for login and request attempts
// will eventually be used for AI endpoints as well

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
  skipSuccessfulRequests: true, // required for testing, needs to be false for registration
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
  message: {error: "slowwwwwwww down chief, wait about 15 mintues and try again"},
  store,
})

export default limiter;