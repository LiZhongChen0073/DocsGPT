import { Answer, FEEDBACK } from './conversationModels';
import { Doc, Index } from '../preferences/preferenceApi';

const apiHost = import.meta.env.VITE_API_HOST || 'https://docsapi.arc53.com';

export function fetchAnswerApi(
  question: string,
  selectedDocs: Doc,
  selectedIndex: Index,
): Promise<Answer> {
  let namePath = selectedDocs.name;
  if (selectedDocs.language === namePath) {
    namePath = '.project';
  }

  const docPath =
    selectedDocs.name === 'default'
      ? 'default'
      : selectedDocs.language +
        '/' +
        namePath +
        '/' +
        selectedDocs.version +
        '/' +
        selectedDocs.model +
        '/';

  return fetch(apiHost + '/api/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      index: selectedIndex.name,
      docs_key: '',
      history: localStorage.getItem('chatHistory'),
      active_docs: docPath,
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
