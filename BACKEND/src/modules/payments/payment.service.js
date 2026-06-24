import { paymentRepository } from './payment.repository.js';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '../../shared/exceptions/index.js';

export const paymentService = {
  processNewPayment: async (userId, payload) => {
    // 1. Event must exist and be active.
    const event = await paymentRepository.findEventById(payload.eventId);
    if (!event || !event.isActive) {
      throw new NotFoundException('Event not found or is no longer active.');
    }

    // 2. Must be a paid event.
    if (event.isFree) {
      throw new BadRequestException('This is a free event. No payment is required.');
    }

    // 3. No underpaying (authoritative DB price).
    if (payload.amount < event.price) {
      throw new BadRequestException(
        `The payment amount (${payload.amount}) is less than the required event price (${event.price}).`
      );
    }

    // 4. Friendly early guard. REJECTED is intentionally allowed to fall through
    //    so the user can retry; the transaction recycles that enrollment. Only
    //    PENDING (in review) and APPROVED (already paid) are blocked here. The
    //    transaction re-checks these atomically as the source of truth.
    const existing = await paymentRepository.findEnrollmentByUserAndEvent(
      userId,
      payload.eventId
    );
    if (existing && existing.status === 'PENDING') {
      throw new ConflictException(
        'You already have a payment pending verification for this event.'
      );
    }
    if (existing && existing.status === 'APPROVED') {
      throw new ConflictException('You are already enrolled in this event.');
    }

    // 5. Atomic create-or-retry.
    return paymentRepository.createOrRetryPaymentAndEnrollment({
      userId,
      eventId: payload.eventId,
      amount: payload.amount,
      utr: payload.utr,
      screenshotUrl: payload.screenshotUrl,
    });
  },

  reviewPendingPayment: async (paymentId, adminId, payload) => {
    const payment = await paymentRepository.findPaymentById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment record not found.');
    }

    if (payment.status !== 'PENDING') {
      throw new ConflictException(
        `This payment has already been processed (current status: ${payment.status}).`
      );
    }

    const newEnrollmentStatus =
      payload.status === 'SUCCESS' ? 'APPROVED' : 'REJECTED';

    const result = await paymentRepository.reviewPaymentTransition({
      paymentId,
      userId: payment.userId,
      eventId: payment.eventId,
      status: payload.status,
      enrollmentStatus: newEnrollmentStatus,
      adminId,
      rejectionReason:
        payload.status === 'REJECTED' ? payload.rejectionReason : null,
    });

    if (result === null) {
      throw new ConflictException(
        'This payment was just processed by another request. Please refresh.'
      );
    }

    return result;
  },
};