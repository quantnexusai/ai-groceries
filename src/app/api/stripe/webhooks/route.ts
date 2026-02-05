import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!secretKey || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe webhook is not configured.' },
        { status: 400 }
      )
    }

    const stripe = new Stripe(secretKey)

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header.' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed.' },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // In a production integration you would:
        // 1. Extract order metadata from the session
        // 2. Create the order record in Supabase
        // 3. Send confirmation email to the buyer
        // 4. Notify the store of the new order
        //
        // Example pattern:
        // const { userId, storeId, deliveryDate, deliveryTimingId } = session.metadata || {}
        // await supabase.from('orders').insert({
        //   user_id: userId,
        //   store_id: storeId,
        //   status_id: 'status-1', // New
        //   delivery_date: deliveryDate,
        //   delivery_timing_id: deliveryTimingId,
        //   subtotal: (session.amount_subtotal || 0) / 100,
        //   platform_fee: platformFee,
        //   total: (session.amount_total || 0) / 100,
        //   stripe_session_id: session.id,
        //   stripe_payment_intent: session.payment_intent as string,
        // })

        console.log('Checkout session completed:', session.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed.' },
      { status: 500 }
    )
  }
}
