import { paymentRepository } from './payment.repository.js';
import { NotFoundException, ConflictException, BadRequestException } from '../../shared/exceptions/index.js';

export const paymentService = {
  processNewPayment: async (userId, payload) => {
    // 1. Verify Event exists and is active
    const event = await paymentRepository.findEventById(payload.eventId);
    if (!event || !event.isActive) {
      throw new NotFoundException('Event not found or is no longer active.');
    }

    // --- NEW BUSINESS RULES ---
    // 1a. Check if the event is actually paid
    if (event.isFree) {
      throw new BadRequestException('This is a free event. No payment is required.');
    }

    // 1b. Verify the payment amount matches the event price
    if (payload.amount < event.price) {
      throw new BadRequestException(`The payment amount (${payload.amount}) is less than the required event price (${event.price}).`);
    }
    // --------------------------

    // 2. Verify no existing enrollment
    const existingEnrollment = await paymentRepository.findEnrollmentByUserAndEvent(userId, payload.eventId);
    if (existingEnrollment) {
      throw new ConflictException(`You already have a ${existingEnrollment.status} enrollment for this event.`);
    }

    // 3. Execute Transaction
    return paymentRepository.createPaymentAndEnrollment({
      userId,
      ...payload
    });
  },

  reviewPendingPayment: async (paymentId, adminId, payload) => {
    // ... [Your existing reviewPendingPayment logic remains exactly the same] ...
    const payment = await paymentRepository.findPaymentById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment record not found.');
    }

    if (payment.status !== 'PENDING') {
      throw new ConflictException(`This payment has already been processed (Current status: ${payment.status}).`);
    }

    const newEnrollmentStatus = payload.status === 'SUCCESS' ? 'APPROVED' : 'REJECTED';

    const result = await paymentRepository.updatePaymentAndEnrollmentStatus({
      paymentId,
      userId: payment.userId,
      eventId: payment.eventId,
      status: payload.status,
      enrollmentStatus: newEnrollmentStatus,
      adminId,
      rejectionReason: payload.status === 'REJECTED' ? payload.rejectionReason : null,
    });

    return result;
  }
};