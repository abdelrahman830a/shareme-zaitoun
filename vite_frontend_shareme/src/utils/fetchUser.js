export const fetchUser = () => {
    const userInfo = localStorage.getItem('user') !== 'undefined' || localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

    return userInfo;
}