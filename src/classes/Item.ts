export default class Item {
    name: string;
    isEditingName: boolean;
    isSelected: boolean;
    isEliminated: boolean;

    constructor(name: string) {
        this.name = name;
        this.isEditingName = false;
        this.isSelected = false
        this.isEliminated = false;
    }
}