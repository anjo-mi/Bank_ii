import { MemoryStore, rateLimit } from 'express-rate-limit'

export const store = new MemoryStore();

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