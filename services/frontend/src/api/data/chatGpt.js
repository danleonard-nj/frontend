const requestType = {
  completion: 'completion',
  image: 'image',
  chat: 'chat',
};

const imageSizes = ['256x256', '512x512', '1024x1024'];

const chatGptEndpoints = {
  engines: '/v1/engines',
  completions: '/v1/completions',
  imageGenerations: '/v1/images/generations',
  chatCompletions: '/v1/chat/completions',
};

export { requestType, imageSizes, chatGptEndpoints };
