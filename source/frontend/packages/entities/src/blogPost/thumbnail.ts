export class Thumbnail {
  private id: string;
  private path: string;

  constructor(id: string, path: string) {
    this.id = id;
    this.path = path;
  }

  getId() {
    return this.id;
  }

  getPath() {
    return this.path;
  }
}
