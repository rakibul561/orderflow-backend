export interface IChatbotRequest {
  message: string;
}

export interface IChatbotResponse {
  reply: string;
  model?: string;
}