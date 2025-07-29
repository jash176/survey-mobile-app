export const SURVEY_TEMPLATES = [
  {
    id: 'text-feedback',
    title: 'Text Feedback',
    description: 'Collect open-ended feedback using a text input.',
    pages: [
      {
        type: 'text',
        title: 'What can we do better?',
        description: "Is there anything we can do to make tempo better for you?",
        placeholder: 'Type your answer here',
      },
    ],
    color: "border-cyan-400"
  },
  {
    id: 'rating-feedback',
    title: 'Rating Survey',
    description: 'Let users rate your product or service.',
    pages: [
      {
        type: 'rating',
        rating_type: "number",
        title: 'How satisfied are you?',
        description: 'Rate from 1 to 5 stars',
        rating_scale: 5,
      },
    ],
    color: "border-blue-400"
  },
  {
    id: 'mcq-feedback',
    title: 'Multiple Choice',
    description: 'Ask a question with several possible answers.',
    pages: [
      {
        type: 'mcq',
        title: 'What feature do you use the most?',
        allow_multiple: false,
        options: [
          'Search',
          'Dashboard',
          'Notifications',
        ],
      },
    ],
    color: "border-purple-600"
  },
  {
    id: 'link-redirect',
    title: 'Link Redirect',
    description: 'Send users to a URL after answering a question.',
    pages: [
      {
        type: 'link',
        title: 'Thanks for your interest!',
        redirect_url: 'https://youtube.com',
      },
    ],
    color: "border-orange-500"
  },
  {
    id: 'emoji-rating',
    title: 'Customer Effort Score',
    description: 'Evaluates ease of use. A low score indicates a high level of effort and potential churn.',
    pages: [
      {
        type: 'rating',
        rating_type: "emoji",
        title: 'How easy was it to user our product?',
        rating_scale: 5,
      },
    ],
    color: "border-orange-400"
  },
];
