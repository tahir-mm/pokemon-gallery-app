export class Pokemon {

  name: string;
  id: number;

  constructor() {}

  formattedName() {
    return this.name ?
      this.name[0].toUpperCase() + this.name.substr(1) : "";
  }

  image() {
    return "assets/images/" + this.id + ".png";
  }

}
