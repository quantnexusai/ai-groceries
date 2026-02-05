import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_placeholder'

export const stripePromise = loadStripe(
  stripePublishableKey.includes('placeholder') ? '' : stripePublishableKey
)

export const isStripeConfigured = () => {
  return (
    stripePublishableKey &&
    stripePublishableKey !== '' &&
    !stripePublishableKey.includes('placeholder')
  )
}
