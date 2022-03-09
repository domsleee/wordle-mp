import Rand, { PRNG } from "rand-seed";
import { dictionary } from "./Dictionary";
import { PatternChar, PatternType } from "./utils";

export const A_CHAR_CODE = "a".charCodeAt(0);

export class PatternGetter {
  readonly rand: Rand;
  answer = "";
  constructor(seed = "1234") {
    this.rand = new Rand(seed);
    this.getNextWord();
  }

  getNextWord() {
    const answers = dictionary.answers;
    const ind = Math.floor(this.rand.next() * answers.length);
    this.answer = answers[ind];
  }

  evaluate(guess: string): PatternType {
    const answerLetterCount: { [key: number]: number } = {};
    for (let i = 0; i < 26; ++i) {
      answerLetterCount[i] = 0;
    }
    const result: PatternType = Array<PatternChar>(5);

    for (let i = 0; i < this.answer.length; ++i) {
      const c = this.answer[i];
      if (guess[i] == c) {
        result[i] = "+";
      } else {
        answerLetterCount[c.charCodeAt(0) - A_CHAR_CODE]++;
      }
    }

    for (let i = 0; i < this.answer.length; ++i) {
      if (guess[i] == this.answer[i]) continue;

      const letterInd = guess[i].charCodeAt(0) - A_CHAR_CODE;
      if (answerLetterCount[letterInd] > 0) {
        result[i] = "?";
        answerLetterCount[letterInd]--;
      } else {
        result[i] = "_";
      }
    }

    return result;
  }
}
