import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

/**
 * Send an order confirmation email to the customer.
 * Uses Resend service. Fallback to console.log if API key missing.
 */
export async function sendOrderConfirmation(
  order: {
    orderId: string;
    total: number;
    items: any[];
    shippingAddress?: any;
  },
  toEmail: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured – skipping email send');
    console.log('Order confirmation would be sent to', toEmail, order);
    return;
  }

  const itemsList = order.items
    .map(
      (item) =>
        `- ${item.name} (Size ${item.size}) x${item.quantity}: $${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join('\n');

  const html = `
    <h1>Thank you for your order!</h1>
    <p>Order ID: <strong>${order.orderId}</strong></p>
    <p>Total: <strong>$${order.total.toFixed(2)}</strong></p>
    <h2>Items:</h2>
    <pre>${itemsList}</pre>
    ${order.shippingAddress ? `<h3>Shipping Address</h3><pre>${JSON.stringify(order.shippingAddress, null, 2)}</pre>` : ''}
    <p>We appreciate your business.</p>
  `;

  try {
    await resend.emails.send({
      from: 'orders@shoestore.com',
      to: toEmail,
      subject: `Your Shoe Store Order #${order.orderId}`,
      html,
    });
  } catch (err) {
    console.error('Failed to send order confirmation email:', err);
  }
}
