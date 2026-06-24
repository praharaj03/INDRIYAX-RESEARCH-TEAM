import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma.config.js';
import {
  ConflictException,
} from '../../shared/exceptions/index.js';

export const paymentRepository = {
  findEventById: async (eventId) => {
    return prisma.event.findUnique({ where: { id: eventId } });
  },

  findEnrollmentByUserAndEvent: async (userId, eventId) => {
    return prisma.enrollment.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
  },

  findPaymentById: async (paymentId) => {
    return prisma.payment.findUnique({ where: { id: paymentId } });
  },

  // Handles BOTH first-time submission and retry-after-rejection, atomically.
  //   - No enrollment yet           -> create payment + enrollment (PENDING)
  //   - Enrollment is REJECTED       -> recycle it to PENDING + create new payment
  //   - Enrollment is PENDING/APPROVED -> block (already in flight / already paid)
  // The @@unique([userId,eventId]) and @unique(utr) constraints are the ultimate
  // guards against concurrent duplicates; the in-transaction checks give clean
  // messages for the common cases.
  createOrRetryPaymentAndEnrollment: async (data) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const existing = await tx.enrollment.findUnique({
          where: { userId_eventId: { userId: data.userId, eventId: data.eventId } },
        });

        if (existing) {
          if (existing.status === 'PENDING') {
            throw new ConflictException(
              'You already have a payment pending verification for this event.'
            );
          }
          if (existing.status === 'APPROVED') {
            throw new ConflictException(
              'You are already enrolled in this event.'
            );
          }
          // existing.status === 'REJECTED' -> allow a fresh attempt.
          // Recycle the SAME enrollment row back to PENDING (can't create a
          // second one due to the unique constraint).
          const enrollment = await tx.enrollment.update({
            where: {
              userId_eventId: { userId: data.userId, eventId: data.eventId },
            },
            data: { status: 'PENDING' },
          });

          const payment = await tx.payment.create({
            data: {
              userId: data.userId,
              eventId: data.eventId,
              amount: data.amount,
              utr: data.utr,
              screenshotUrl: data.screenshotUrl,
              status: 'PENDING',
            },
          });

          return { payment, enrollment, retried: true };
        }

        // First-time submission.
        const payment = await tx.payment.create({
          data: {
            userId: data.userId,
            eventId: data.eventId,
            amount: data.amount,
            utr: data.utr,
            screenshotUrl: data.screenshotUrl,
            status: 'PENDING',
          },
        });

        const enrollment = await tx.enrollment.create({
          data: {
            userId: data.userId,
            eventId: data.eventId,
            status: 'PENDING',
          },
        });

        return { payment, enrollment, retried: false };
      });
    } catch (err) {
      if (err instanceof ConflictException) throw err;

      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const target = err.meta?.target;
        const fields = Array.isArray(target) ? target.join(',') : String(target || '');

        if (fields.includes('utr')) {
          throw new ConflictException(
            'This UTR / transaction reference has already been used.'
          );
        }
        // Concurrent first-time submit hit the enrollment uniqueness.
        throw new ConflictException(
          'A payment for this event is already being processed.'
        );
      }
      throw err;
    }
  },

  // Atomic, guarded status transition (review). Unchanged from prior turn.
  reviewPaymentTransition: async (data) => {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.payment.updateMany({
        where: { id: data.paymentId, status: 'PENDING' },
        data: {
          status: data.status,
          reviewedById: data.adminId,
          reviewedAt: new Date(),
          rejectionReason: data.rejectionReason,
        },
      });

      if (updated.count === 0) return null;

      await tx.enrollment.update({
        where: {
          userId_eventId: { userId: data.userId, eventId: data.eventId },
        },
        data: { status: data.enrollmentStatus },
      });

      const payment = await tx.payment.findUnique({
        where: { id: data.paymentId },
        include: {
          user: { select: { email: true, fullName: true } },
          event: { select: { title: true } },
        },
      });
      const enrollment = await tx.enrollment.findUnique({
        where: {
          userId_eventId: { userId: data.userId, eventId: data.eventId },
        },
      });

      return { payment, enrollment };
    });
  },
};