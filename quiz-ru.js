//  Русификатор для квизов
(function() {
  function СупчикUI() {

    const супПайлоад = {
      'Answer Review': 'Проверка ответов',
      'You answered': 'Вы ответили на',
      'questions correctly': 'вопросов правильно',
      'You can either': 'Вы можете',
      'or': 'или','retry the quiz': 'повторить викторину','view the answers': 'посмотреть ответы','Question': 'Вопрос',
      'Submit': 'Отправить',
      'Start': 'Начать',
      'Next': 'Далее',
      'Finish': 'Завершить',
      'Correct!': 'Правильно!',
      'Incorrect': 'Неправильно',  'Try again': 'Попробуйте снова', 'Show answer': 'Показать ответ'
    };

    function реплейсСуп(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        for (const [en, ru] of Object.entries(супПайлоад)) {
          text = text.replace(new RegExp(en, 'g'), ru);
        }
        node.textContent = text;
      } else {
        for (const child of node.childNodes) {
          реплейсСуп(child);
        }
      }
    } document.querySelectorAll('.quiz-container, .quiz-answer-review').forEach(реплейсСуп);

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', СупчикUI);
  } else {
    СупчикUI(); 
  } 
  const observer = new MutationObserver(СупчикUI);
  observer.observe(document.body, { childList: true, subtree: true });

})();
