import { axiosInstance } from 'boot/axios';
import CrudApi from './crud';

class CycleApi extends CrudApi {
  axiosInstance = axiosInstance;

  constructor() {
    super('cycles');
  }

  getUserCycle() {
    return this.axiosInstance.get('cycles/user-cycle').then(r => r.data);
  }

  getCycleCronogram(cycleId) {
    return this.axiosInstance.get(`cycles/cycle-cronogram/${cycleId}`).then(r => r.data);
  }

  saveInformativeContentOpenedDate(informativeContentId) {
    return this.axiosInstance
      .post(`cycles/save-informative-content-opened-date/${informativeContentId}`)
      .then(r => r.data);
  }

  saveInformativeContentRating({ informativeContentId, ...payload }) {
    return this.axiosInstance
      .post(`cycles/save-informative-content-rating/${informativeContentId}`, payload)
      .then(r => r.data);
  }

  getProfessionalCycleWithStatus(payload) {
    return this.axiosInstance
      .post('professional-cycle/professional-cycle-with-status', payload)
      .then(r => r.data);
  }

  createAndOpenChatWithProfessionalInCycle(cycleId) {
    return this.axiosInstance
      .get(`professional-cycle/create-open-chat-with-professional-cycle/${cycleId}`)
      .then(r => r.data);
  }

  getChatMessages(chatCode) {
    return this.axiosInstance.get(`chat-messages/${chatCode}`).then(r => r.data);
  }

  sendMessage(payload) {
    return this.axiosInstance.post('chat-messages', payload).then(r => r.data);
  }

  sendTypingEvent(payload) {
    return this.axiosInstance.post('chat-messages/send-typing-event', payload).then(r => r.data);
  }

  getScheduleDateSuggestionsFromMessage(messageId) {
    return this.axiosInstance
      .get('schedule-date-suggestions', { params: { messageId } })
      .then(r => r.data);
  }

  schedule(payload) {
    return this.axiosInstance.post('schedule/schedule', payload).then(r => r.data);
  }

  cancelSchedule(id) {
    return this.axiosInstance.put(`schedule/cancel/${id}`).then(r => r.data);
  }

  listPendingSchedule() {
    return this.axiosInstance.get('schedule/user-pending-schedules').then(r => r.data);
  }

  updateMessageInteraction(payload) {
    return this.axiosInstance
      .post('chat-messages/update-message-interaction', payload)
      .then(r => r.data);
  }

  getUnreadMessagesFromChat(chatId) {
    return this.axiosInstance.get(`chat-messages/unread-messages/${chatId}`).then(r => r.data);
  }

  updateUnreadMessages(payload) {
    return this.axiosInstance
      .post('chat-messages/update-unread-messages', payload)
      .then(r => r.data);
  }

  getPros(params) {
    return this.axiosInstance
      .get('pros-schedules', {
        params,
      })
      .then(r => r.data);
  }

  getNotifications(params) {
    return this.axiosInstance
      .get('motivational-schedules', {
        params,
      })
      .then(r => r.data);
  }

  updateMessageNotificationToRead(messageId) {
    return this.axiosInstance
      .put(`motivational-schedules/update-to-read/${messageId}`)
      .then(r => r.data);
  }

  savePROQuestionAnswer(payload) {
    return this.axiosInstance.post('pro-client-answers', payload).then(r => r.data);
  }

  getProReport() {
    return this.axiosInstance.get('client-pro-report/client-report').then(r => r.data);
  }

  getClientProReports() {
    return this.axiosInstance.get('client-pro-report/client-reports').then(r => r.data);
  }

  sendProfessionalCalendarSuggestion(chatCode) {
    return this.axiosInstance
      .post('professional-cycle/send-professional-calendar-suggestion', { chatCode })
      .then(r => r.data);
  }

  getProfessionalsBasedOnAreas(areas) {
    return this.axiosInstance
      .post('professionals/professionals-based-on-areas', { areas })
      .then(r => r.data);
  }
}

export default CycleApi;
