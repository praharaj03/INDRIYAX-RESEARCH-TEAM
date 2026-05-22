import { paymentRepository } from './payment.repository.js';
import { NotFoundException, ConflictException } from '../../shared/exceptions/index.js';

export const paymentService = {
  getAllPayments: async () => {
    return paymentRepository.findAllPayments();
  },

  processNewPayment: async (userId, payload) => {
    // 1. Verify Event
    const event = await paymentRepository.findEventById(payload.eventId);
    if (!event || !event.isActive) {
      throw new NotFoundException('Event not found or is no longer active.');
    }

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
    // 1. Find the payment
    const payment = await paymentRepository.findPaymentById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment record not found.');
    }

    if (payment.status !== 'PENDING') {
      throw new ConflictException(`This payment has already been processed (Current status: ${payment.status}).`);
    }

    // 2. Determine new statuses
    const newEnrollmentStatus = payload.status === 'SUCCESS' ? 'APPROVED' : 'REJECTED';

    // 3. Execute Transaction
    const result = await paymentRepository.updatePaymentAndEnrollmentStatus({
      paymentId,
      userId: payment.userId,
      eventId: payment.eventId,
      status: payload.status,
      enrollmentStatus: newEnrollmentStatus,
      adminId,
      rejectionReason: payload.status === 'REJECTED' ? payload.rejectionReason : null,
    });

    // TODO: Trigger Email Notifications here based on result

    return result;
  }
};