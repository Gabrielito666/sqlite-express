module.exports = (str, arr)=>{
    let index = 0;
    const newStr = str.replace(/\?/g, () => {
        if (index < arr.length) {
        return arr[index++];
        }
        return '?';
    });
    console.log(`the query generated is: ${newStr}`);
}