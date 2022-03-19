import { Data, colouredText } from '../helpers.js'

export class Chart extends Data
{
    constructor(shared, data)
    {
        super(shared);
        this.id = '';
        this.data = data;
        this.col = 'black';
        this.max = 0;
        this.min = 0;
        this.onto = true;
    }
}