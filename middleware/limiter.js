import { MemoryStore, rateLimit } from 'express-rate-limit'

export const store = new MemoryStore();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 7,
  skipSuccessfulRequests: true,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
  message: {error: "for real? username OR email... wait 15 minutes for another few guesses"},
  store,
})

export default limiter;