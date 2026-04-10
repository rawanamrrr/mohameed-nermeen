// app/api/send-email/route.ts
import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'digitivaa@gmail.com',
    pass: 'aoqa gsal cmgn qcym',
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const toEmail = formData.get('to_email') as string || 'nermenelkhamisy006@gmail.com';
    const message = formData.get('message') as string;
    const messageType = formData.get('message_type') as string;
    const rsvpAttending = formData.get('rsvp_attending') as string;
    const rsvpName = formData.get('rsvp_name') as string;
    const rsvpPlusOne = formData.get('rsvp_plus_one') as string;
    const rsvpGuestCount = formData.get('rsvp_guest_count') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name?.trim()) {
      return Response.json(
        { success: false, message: 'Please enter your name' },
        { status: 400 }
      );
    }

    // Convert the image file to a buffer
    let attachments = [];
    if (imageFile) {
      const imageBytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageBytes);
      
      attachments.push({
        filename: 'handwritten-message.png',
        content: buffer,
        cid: 'handwritten-message',
        encoding: 'base64'
      });
    }

    // Build email content
    let emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5; text-align: center;">New Message from Your Engagement Website</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Message Type:</strong> ${messageType === 'handwritten' ? 'Handwritten' : 'Normal Message'}</p>
    `;

    // Add message content
    if (messageType === 'handwritten' && imageFile) {
      emailContent += `
        <p><strong>Handwritten Message:</strong></p>
        <div style="margin: 20px 0; padding: 15px; background: white; border-radius: 8px; border: 2px solid #e5e7eb;">
          <img src="cid:handwritten-message" alt="Handwritten message" style="max-width: 100%; height: auto;" />
        </div>
      `;
    } else if (messageType === 'normal' && message) {
      emailContent += `
        <p><strong>Message:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5;">
          <p style="margin: 0; font-style: italic;">"${message}"</p>
        </div>
      `;
    }

    // Add RSVP information
    if (rsvpAttending) {
      emailContent += `
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin: 0 0 10px 0;">RSVP Information</h3>
          <p><strong>Attending:</strong> ${rsvpAttending === 'yes' ? 'Yes, I\'ll be there!' : 'Sorry, can\'t make it'}</p>
      `;
      
      if (rsvpAttending === 'yes' && rsvpName) {
        emailContent += `
          <p><strong>Name:</strong> ${rsvpName}</p>
          ${rsvpPlusOne ? `<p><strong>Plus One:</strong> ${rsvpPlusOne}</p>` : ''}
          <p><strong>Total Guests:</strong> ${rsvpGuestCount || '1'}</p>
        `;
      }
      
      emailContent += `</div>`;
    }

    emailContent += `
        </div>
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
          Sent from your beautiful engagement website!
        </p>
      </div>
    `;

    // Send mail
    const info = await transporter.sendMail({
      from: '"Engagement Website" <digitivaa@gmail.com>',
      to: toEmail,
      subject: `New Message from ${name} - Engagement Website`,
      html: emailContent,
      attachments
    });

    return Response.json({ 
      success: true, 
      message: 'Message sent successfully!',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to send message. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}