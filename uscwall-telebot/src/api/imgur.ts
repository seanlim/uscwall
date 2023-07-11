import { HttpClient, Header } from "@hqoss/http-client";
class ImgurClient extends HttpClient {
  constructor() {
    super("https://api.imgur.com/3/", {
      headers: {
        [Header.Authorization]: `Bearer ${process.env.IMGUR_TOKEN}`,
      },
      timeout: 5000,
    });
  }
}
