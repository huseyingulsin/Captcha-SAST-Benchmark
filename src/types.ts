export type CaptchaResult = {
  success: boolean;
  score: number;
  action: string;
  hostname: string;
  challengeTs: number;
  tokenId: string;
};
