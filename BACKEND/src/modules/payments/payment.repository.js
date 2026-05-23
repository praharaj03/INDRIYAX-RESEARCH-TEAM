import { getDb } from '../../config/prisma.config.js';

export const paymentRepository = {
  findAllPayments: async () => {
    const db = getDb(); return db.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, imageUrl: true }
        },
        event: {
          select: { id: true, title: true, date: true, price: true }
        },
        reviewer: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });
  },

  findEventById: async (eventId) => {
    const db = getDb(); return db.event.findUnique({ where: { id: eventId } });
  },

  findEnrollmentByUserAndEvent: async (userId, eventId) => {
    const db = getDb(); return db.enrollment.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });
  },

  findPaymentById: async (paymentId) => {
    const db = getDb(); return db.payment.findUnique({ where: { id: paymentId } });
  },

  createPaymentAndEnrollment: async (data) => {
    const db = getDb(); return db.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId: data.userId,
          eventId: data.eventId,
          amount: data.amount,
          utr: data.utr,
          screenshotUrl: data.screenshotUrl,
          status: 'PENDING'
        }
      });

      const enrollment = await tx.enrollment.create({
        data: {
          userId: data.userId,
          eventId: data.eventId,
          status: 'PENDING'
        }
      });

      return { payment, enrollment };
    });
  },

  updatePaymentAndEnrollmentStatus: async (data) => {
    const db = getDb(); return db.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: data.paymentId },
        data: {
          status: data.status,
          reviewedById: data.adminId,
          reviewedAt: new Date(),
          rejectionReason: data.rejectionReason,
        },
        include: {
          user: { select: { email: true, fullName: true } },
          event: { select: { title: true } }
        }
      });

      const enrollment = await tx.enrollment.update({
        where: {
          userId_eventId: { userId: data.userId, eventId: data.eventId }
        },
        data: { status: data.enrollmentStatus }
      });

      return { payment, enrollment };
    });
  }
};