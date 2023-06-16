import HttpProvider from './HttpProvider';

const baseURL = 'categories';

export default class CategoryProvider {

    static getCategories() {
        return HttpProvider.get(`${baseURL}`).then(response => response.data);
    }

    static getCategory(id) {
        return HttpProvider.get(`${baseURL}/${id}`).then(response => response.data);
    }

    static createCategory(data) {
        return HttpProvider.post(`${baseURL}`, data).then(response => response.data);
    }

    static updateCategory(id, data) {
        return HttpProvider.patch(`${baseURL}/${id}`, data).then(response => response.data);
    }

    static deleteCategory(id) {
        return HttpProvider.delete(`${baseURL}/${id}`).then(response => response.data);
    }
        
}