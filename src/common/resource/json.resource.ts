export class JsonResource {
  public static toJson(data: unknown) {
    return data;
  }

  public static toArrayJson(data: unknown[]) {
    return data.map((value) => this.toJson(value));
  }
}
