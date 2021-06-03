import { LightningElement } from 'lwc';
import LightningDatatable from 'lightning/datatable';
import imageTableControl from './imgAux.html';

export default class ImageTableController extends LightningDatatable {
    static customTypes = {
        image: {
            template: imageTableControl
        }
    };
}