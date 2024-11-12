export class Thumbnail {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  getPath() {
    return this.path;
  }
}
