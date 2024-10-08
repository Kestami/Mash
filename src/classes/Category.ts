import Item from '@classes/Item';

export default class Category {
    items: Item[];
    headerItem: Item;
    isStartingMashCategory: boolean;

    public get outOfGame(): boolean {
        //return true if only one item isn't eliminated
        return this.items.filter(x => x.isEliminated).length == this.items.length - 1;
    }

    constructor(title: string) {
        this.headerItem = new Item(title);
        this.items = [];
        this.isStartingMashCategory = false;
    }
}