/**
 * Email utility for order confirmation.
 * Uses Resend if RESEND_API_KEY is set; otherwise logs a warning and skips.
 * Resend is initialised lazily (inside the function) so a missing key
 * never crashes the module at import time.
 */

export async function sendOrderConfirmation(
  order: {
    orderId: string;
    total: number;
    items: any[];
    shippingAddress?: any;
  },
  toEmail: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY is not set – skipping order confirmation email.');
    console.log('[email] Would have sent to:', toEmail, '| Order ID:', order.orderId);
    return;
  }

  try {
    // Lazy import so the module never fails at build/startup time
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const itemsList = order.items
      .map(
        (item) =>
          `- ${item.name} (Size ${item.size}) x${item.quantity}: $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join('\n');

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#1d4ed8">Thank you for your order! 🎉</h1>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <h2>Items</h2>
        <pre style="background:#f3f4f6;padding:12px;border-radius:8px">${itemsList}</pre>
        ${
          order.shippingAddress
            ? `<h3>Shipping Address</h3><pre style="background:#f3f4f6;padding:12px;border-radius:8px">${JSON.stringify(order.shippingAddress, null, 2)}</pre>`
            : ''
        }
        <p style="color:#6b7280">We appreciate your business. Happy stepping! 👟</p>
      </div>
    `;

    await resend.emails.send({
      from: 'orders@shoestore.com',
      to: toEmail,
      subject: `Your Shoe Store Order #${order.orderId}`,
      html,
    });

    console.log('[email] Order confirmation sent to', toEmail);
  } catch (err) {
    // Never let email failure crash the checkout flow
    console.error('[email] Failed to send order confirmation email:', err);
  }
}
