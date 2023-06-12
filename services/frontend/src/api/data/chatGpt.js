const requestType = {
  completion: 'completion',
  image: 'image',
};

const imageSizes = ['256x256', '512x512', '1024x1024'];

const chatGptEndpoints = {
  engines: '/v1/engines',
  completions: '/v1/completions',
  imageGenerations: '/v1/images/generations',
};

export { requestType, imageSizes, chatGptEndpoints };
