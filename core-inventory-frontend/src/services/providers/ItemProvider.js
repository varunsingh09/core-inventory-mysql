import HttpProvider from './HttpProvider';
import axios from 'axios';

const baseURL = 'items';

const uploadImagesURL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_IMAGES_CLOUD_NAME}/image/upload`;


export default class ItemProvider {

    static getItems(filter) {
        return HttpProvider.get(`${baseURL}?${filter}`).then(response => response.data);
    }

    static getItem(id) {
        return HttpProvider.get(`${baseURL}/${id}`).then(response => response.data);
    }

    static createItem(data) {
        return HttpProvider.post(`${baseURL}`, data).then(response => response.data);
    }

    static uploadItemImage(image) {
        return axios.post(uploadImagesURL, image).then(response => response.data);
    }
    
    static updateItem(id, data) {
        return HttpProvider.put(`${baseURL}/${id}`, data).then(response => response.data);
    }

    static updateItemQuantity(id, quantity) {
        return HttpProvider.patch(`${baseURL}/${id}`, quantity).then(response => response.data);
    }

    static updateItemImage(id, imageURL) {
        return HttpProvider.patch(`${baseURL}/${id}`, imageURL).then(response => response.data);
    }

    static deleteItem(id) {
        return HttpProvider.delete(`${baseURL}/${id}`).then(response => response.data);
    }

}