import { Answer, FEEDBACK } from './conversationModels';
import { Doc, Index } from '../preferences/preferenceApi';

const apiHost = import.meta.env.VITE_API_HOST || 'http://127.0.0.1:5601';

export function fetchAnswerApi(
  question: string,
  selectedDocs: Doc,
  selectedIndex: Index,
): Promise<Answer> {
  return fetch(apiHost + '/api/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      index: selectedIndex.name,
      docs_key: selectedIndex.key,
      history: localStorage.getItem('chatHistory'),
      active_docs: selectedDocs.name,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject(response);
      }
    })
    .then((data) => {
      const result = data.answer;
      return { answer: result, query: question, result };
    });
}

export function sendFeedback(
  prompt: string,
  response: string,
  feedback: FEEDBACK,
) {
  return fetch(`${apiHost}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question: prompt,
      answer: response,
      feedback: feedback,
    }),
  }).then((response) => {
    if (response.ok) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  });
}
