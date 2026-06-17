import apiClient from '../../api/client';

export const paymentsService = {
  submitPayment: async (paymentData) => {
    const response = await apiClient.post('/api/v1/payments', paymentData);
    return response.data;
  },

  // NEW: Admin review endpoint
  reviewPayment: async (paymentId, reviewData) => {
    // reviewData expects { status: 'SUCCESS' | 'REJECTED', rejectionReason: string }
    const response = await apiClient.patch(`/api/v1/payments/${paymentId}/review`, reviewData);
    return response.data;
  }
};