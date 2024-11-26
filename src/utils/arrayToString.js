export const arrayToString = (array) => {
    for(let i=0; i < array.length; i ++){
        if(array[i] === null){
            array[i] = ''
        }
    }
    return array.join(',');
}