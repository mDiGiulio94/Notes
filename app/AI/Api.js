import axios from "axios";

const openAIUrl = "https://api.openai.com/v1/chat/completions";

const getChatGPTResponse = async (promptText, personNumber) => {
  const body = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content:
          "Rispondi in italiano e restituiscimi solamente la lista degli ingredienti per " +
          personNumber +
          " persone, e il numero delle persone a cui è rivolta la ricetta, ricetta: " +
          promptText,
      },
    ],
    temperature: 1,
    top_p: 1,
    n: 1,
    stream: false,
    max_tokens: 250,
    presence_penalty: 0,
    frequency_penalty: 0,
  };

  try {
    console.log("sei nel try di chatGpt");
    const response = await axios.post(openAIUrl, body, {
      headers: {
        Authorization: "API KEY",
      },
    });
    console.log("risposta da chat: ", response.data);
    console.log(
      "contenuto messaggio: ",
      response.data.choices[0].message.content
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
};

const chatApi = {
  getChatGPTResponse: getChatGPTResponse,
};

export default chatApi;
