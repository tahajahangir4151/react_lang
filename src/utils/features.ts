import axios from "axios";
import { generate } from "random-words";
import _ from "lodash";

const generateMCQ = (
  meaning: {
    Text: string;
  }[],
  idx: number
): string[] => {
  const correctAns: string = meaning[idx].Text;

  // An Array with all words except for correct ans
  const allMeaningExceptForCorrect = meaning.filter(
    (i) => i.Text !== correctAns
  );

  // Randomly genrating 3 elements from incorrectArray
  const incorrectOptions: string[] = _.sampleSize(
    allMeaningExceptForCorrect,
    3
  ).map((i) => i.Text);

  const mcqOptions = _.shuffle([...incorrectOptions, correctAns]);

  return mcqOptions;
};

export const translateWords = async (params: LangType): Promise<WordType[]> => {
  try {
    const words = generate(8).map((i) => ({
      Text: i,
    }));

    const response = await axios.post(
      "https://microsoft-translator-text.p.rapidapi.com/translate",
      words,
      {
        params: {
          "to[0]": params,
          "api-version": "3.0",
          profanityAction: "NoAction",
          textType: "plain",
        },

        headers: {
          'x-rapidapi-key': '4af9f7d618msh3183ed1402bd3e5p11e1c6jsn3e0427b9e6fa',
          'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
      }
    );

    const receive: FetchedDataType[] = response.data;

    const arr: WordType[] = receive.map((i, idx) => {
      const options: string[] = generateMCQ(words, idx);

      return {
        word: i.translations[0].text,
        meaning: words[idx].Text,
        options,
      };
    });

    return arr;
  } catch (error: any) {
    // Dispatch just the error message (serializable)
    throw new Error('Translation Error: ' + error.message);
  }
};


export const countMatchingElements = (
  arr1: string[],
  arr2: string[]
): number => {
  if (arr1.length !== arr2.length) throw new Error("Arrays are not equal");

  let matchedCount = 0;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] === arr2[i]) matchedCount++;
  }

  return matchedCount;
};

// Function to handle text-to-speech using Web Speech API
export const fetchAudio = (text: string, language: LangType): void => {
  const synth = window.speechSynthesis;

  
  const languageMap: Record<string, string> = {
    'ja': 'ja-JP',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'hi': 'hi-IN',
    'en': 'en-US', 
  };

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languageMap[language] || 'en-US';

  // Start speaking the text
  synth.speak(utterance);

  // Optional: Add event listeners if you want to track when the speech starts/ends
  utterance.onend = () => {
    console.log('Speech has finished');
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
  };
};
