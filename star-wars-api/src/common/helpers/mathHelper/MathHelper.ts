export class MathHelper {
    public static integerValue(number: number): number {
        return Math.trunc(number)
    }

    public static nearestValue(number: number): number {
        return Math.round(number)
    }
}