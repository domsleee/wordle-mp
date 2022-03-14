export const primaryHpColor = "green";

export class HpColorDefinitions {
  getHpColor(hp: number): string {
    if (hp > 120) return "pink lighten-1";
    if (hp > 60) return "blue lighten-1";
    if (hp > 30) return `${primaryHpColor} lighten-1`;
    if (hp > 15) return "amber";
    return "red";
  }
  getHpValue(hp: number, partialSecond: number): number {
    if (hp >= 180) return 100;
    if (hp > 60) return this.getHpValue(hp % 60, partialSecond);
    return ((hp - partialSecond) * 100) / 60;
  }
  getHpBackgroundColor(hp: number) {
    if (hp > 60) return this.getHpColor(45);
    return "";
  }
  getHpShouldAnimationBeDisabled(hp: number) {
    return hp >= 55;
  }
}
