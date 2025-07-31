import { RatingType } from "@/components/survey/Rating";

export const SURVEY_TEMPLATES = [
  {
    id: "text-feedback",
    title: "Text Feedback",
    description: "Collect open-ended feedback using a text input.",
    pages: [
      {
        type: "text",
        title: "What can we do better?",
        description:
          "Is there anything we can do to make tempo better for you?",
        placeholder: "Type your answer here",
        low_label: "",
        high_label: "",
        link_text: "",
        redirect_url: "",
        options: [""],
        allow_multiple: false,
      },
    ],
    color: "border-cyan-400",
  },
  {
    id: "rating-feedback",
    title: "Rating Survey",
    description: "Let users rate your product or service.",
    pages: [
      {
        type: "rating",
        title: "How satisfied are you?",
        description: "Rate from 1 to 5 stars",
        rating_type: RatingType.NUMBER,
        rating_scale: 10,
        low_label: "Poor",
        high_label: "Excellent",
        link_text: "",
        redirect_url: "",
        options: [""],
        allow_multiple: false,
      },
    ],
    color: "border-blue-400",
  },
  {
    id: "mcq-feedback",
    title: "Multiple Choice",
    description: "Ask a question with several possible answers.",
    pages: [
      {
        type: "mcq",
        title: "What feature do you use the most?",
        allow_multiple: false,
        options: ["Search", "Dashboard", "Notifications"],
        rating_type: RatingType.NUMBER,
        rating_scale: 10,
        low_label: "Poor",
        high_label: "Excellent",
        link_text: "",
        redirect_url: "",
      },
    ],
    color: "border-purple-600",
  },
  {
    id: "link-redirect",
    title: "Link Redirect",
    description: "Send users to a URL after answering a question.",
    pages: [
      {
        type: "link",
        title: "Thanks for your interest!",
        redirect_url: "https://tempo.new",
        link_text: "",
        options: [""],
      },
    ],
    color: "border-orange-500",
  },
  {
    id: "emoji-rating",
    title: "Customer Effort Score",
    description:
      "Evaluates ease of use. A low score indicates a high level of effort and potential churn.",
    pages: [
      {
        type: "rating",
        title: "How easy was it to user our product?",
        rating_type: RatingType.EMOJI,
        low_label: "Poor",
        high_label: "Excellent",
        link_text: "",
        redirect_url: "",
      },
    ],
    color: "border-orange-400",
  },
];

export const SURVEY_TYPES = [
  {
    type: "text",
    label: "Text",
    icon: "edit-3",
  },
  {
    type: "link",
    label: "Link",
    icon: "external-link",
  },
  {
    type: "rating",
    label: "Rating",
    icon: "star",
  },
  {
    type: "mcq",
    label: "Multi-Choice",
    icon: "list",
  },
];
