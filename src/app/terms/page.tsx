import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-sunbeam-50">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-earth-600 mb-10">
            Terms of Service
          </h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 space-y-8">
            {/* 1. Introduction */}
            <section>
              <h2 className="font-display font-semibold text-xl text-earth-600 mb-3">
                1. Introduction
              </h2>
              <p className="text-sm text-earth-500 font-body leading-relaxed">
                Welcome to AI Groceries. These Terms of Service (&quot;Terms&quot;) govern your use
                of the AI Groceries platform, including our website, mobile applications, and all
                related services (collectively, the &quot;Service&quot;). By accessing or using the
                Service, you agree to be bound by these Terms. If you do not agree, please do not
                use the Service.
              </p>
              <p className="text-sm text-earth-500 font-body leading-relaxed mt-3">
                AI Groceries is a marketplace that connects customers with local grocery stores and
                provides AI-powered shopping assistance, product recommendations, and delivery
                logistics. We act as an intermediary between you and participating stores.
              </p>
            </section>

            {/* 2. Account Terms */}
            <section>
              <h2 className="font-display font-semibold text-xl text-earth-600 mb-3">
                2. Account Terms
              </h2>
              <p className="text-sm text-earth-500 font-body leading-relaxed">
                To place orders through AI Groceries, you must create an account. You agree to
                provide accurate, current, and complete information during the registration process
                and to keep your account information up to date.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-earth-500 font-body leading-relaxed list-disc list-inside">
                <li>You must be at least 18 years old to create an account.</li>
                <li>You are responsible for maintaining the confidentiality of your password.</li>
                <li>
                  You are responsible for all activities that occur under your account, whether or
                  not you authorized them.
                </li>
                <li>
                  You must notify us immediately of any unauthorized use of your account or any
                  other breach of security.
                </li>
                <li>
                  We reserve the right to suspend or terminate accounts that violate these Terms or
                  for any other reason at our sole discretion.
                </li>
              </ul>
            </section>

            {/* 3. Ordering & Delivery */}
            <section>
              <h2 className="font-display font-semibold text-xl text-earth-600 mb-3">
                3. Ordering &amp; Delivery
              </h2>
              <p className="text-sm text-earth-500 font-body leading-relaxed">
                When you place an order through AI Groceries, you are requesting that a
                participating store prepare and deliver your selected items. Please note the
                following:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-earth-500 font-body leading-relaxed list-disc list-inside">
                <li>
                  Product availability is subject to change. If an item is out of stock, our AI may
                  suggest substitutions, which you can accept or decline.
                </li>
                <li>
                  Delivery times are estimates. While we use AI-optimized routing to provide the
                  most accurate delivery windows, actual delivery times may vary due to traffic,
                  weather, or other factors.
                </li>
                <li>
                  You must provide an accurate delivery address and be available to receive your
                  order during the selected delivery window.
                </li>
                <li>
                  Product images are for illustration purposes. Actual items may vary slightly in
                  appearance from what is shown on the platform.
                </li>
                <li>
                  Perishable items should be refrigerated promptly upon delivery. AI Groceries is
                  not responsible for spoilage that occurs after delivery has been completed.
                </li>
              </ul>
            </section>

            {/* 4. Payments */}
            <section>
              <h2 className="font-display font-semibold text-xl text-earth-600 mb-3">
                4. Payments
              </h2>
              <p className="text-sm text-earth-500 font-body leading-relaxed">
                All payments are processed securely through Stripe. By placing an order, you
                authorize us to charge the payment method you provide for the total amount of your
                order, including item prices, applicable taxes, and a platform and delivery fee.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-earth-500 font-body leading-relaxed list-disc list-inside">
                <li>
                  Prices displayed on the platform are set by individual stores and may change
                  without notice.
                </li>
                <li>
                  A platform fee is applied to each order to cover delivery logistics and service
                  costs. This fee is clearly displayed before checkout.
                </li>
                <li>
                  If a substitution results in a price difference, your total will be adjusted
                  accordingly.
                </li>
                <li>
                  Refunds for quality issues or missing items will be handled on a case-by-case
                  basis. Please contact support within 24 hours of delivery.
                </li>
              </ul>
            </section>

            {/* 5. Cancellation Policy */}
            <section>
              <h2 className="font-display font-semibold text-xl text-earth-600 mb-3">
                5. Cancellation Policy
              </h2>
              <p className="text-sm text-earth-500 font-body leading-relaxed">
                You may cancel an order at no charge if the store has not yet begun assembling it.
                Once assembly has started, a cancellation fee may apply depending on the stage of
                preparation:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-earth-500 font-body leading-relaxed list-disc list-inside">
                <li>
                  <strong>Before assembly:</strong> Full refund, no cancellation fee.
                </li>
                <li>
                  <strong>During assembly:</strong> Partial refund. You may be charged for items
                  already prepared.
                </li>
                <li>
                  <strong>After pickup/in transit:</strong> No refund available. You may contact
                  support to discuss options.
                </li>
              </ul>
              <p className="text-sm text-earth-500 font-body leading-relaxed mt-3">
                To cancel an order, visit your order details page or contact our support team. We
                will process cancellations as quickly as possible.
              </p>
            </section>

            {/* 6. Privacy */}
            <section>
              <h2 className="font-display font-semibold text-xl text-earth-600 mb-3">
                6. Privacy
              </h2>
              <p className="text-sm text-earth-500 font-body leading-relaxed">
                Your privacy is important to us. Our use of your personal information is governed
                by our Privacy Policy. By using the Service, you consent to the collection, use,
                and sharing of your information as described therein.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-earth-500 font-body leading-relaxed list-disc list-inside">
                <li>
                  We collect information you provide (name, email, address, payment details) and
                  information generated through your use of the Service (order history, preferences,
                  browsing activity).
                </li>
                <li>
                  AI features analyze your order history and preferences to provide personalized
                  recommendations. This data is processed securely and is not sold to third parties.
                </li>
                <li>
                  We share necessary information with participating stores to fulfill your orders
                  and with payment processors to handle transactions.
                </li>
                <li>
                  You may request deletion of your account and personal data at any time by
                  contacting support.
                </li>
              </ul>
            </section>

            {/* 7. Contact */}
            <section>
              <h2 className="font-display font-semibold text-xl text-earth-600 mb-3">
                7. Contact
              </h2>
              <p className="text-sm text-earth-500 font-body leading-relaxed">
                If you have questions about these Terms or need to contact us for any reason,
                please reach out:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-earth-500 font-body leading-relaxed list-disc list-inside">
                <li>
                  <strong>Email:</strong> support@aigroceries.com
                </li>
                <li>
                  <strong>Phone:</strong> (800) 555-GROC
                </li>
                <li>
                  <strong>Mail:</strong> AI Groceries, 123 Market Street, Suite 100, New York, NY
                  10001
                </li>
              </ul>
              <p className="text-sm text-earth-500 font-body leading-relaxed mt-3">
                We aim to respond to all inquiries within one business day.
              </p>
            </section>

            {/* Last updated */}
            <div className="pt-6 border-t border-orchard-100">
              <p className="text-xs text-orchard-400 font-body">
                Last updated: February 2026
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
