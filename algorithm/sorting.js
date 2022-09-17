const mergeSort = (arr) => {
    if(arr.length === 1)return arr
    //split
    const pivot = Math.floor(arr.length / 2)
    const left = []
    const right = []
    for(let i = 0; i < pivot; i++) {
        left.push(arr[i])
    }
    for(let i = pivot; i < arr.length; i++) {
        right.push(arr[i])
    }
    return mergeArr(mergeSort(left), mergeSort(right))
}

const mergeArr = (leftArr,rightArr) => {
    const result = []
    let leftIndex = 0
    let rightIndex = 0
    while(leftIndex < leftArr.length && rightIndex < rightArr.length) {
        if(leftArr[leftIndex] > rightArr[rightIndex]) {
            result.push(rightArr[rightIndex])
            rightIndex++
        } else {
            result.push(leftArr[leftIndex])
            leftIndex++
        }
    }
    if(leftIndex < leftArr.length){
        for(let i = leftIndex; i < leftArr.length; i++){
            result.push(leftArr[i])
        }
    } else {
        for(let i = rightIndex; i < rightArr.length; i++){
            result.push(rightArr[i])
        }
    }
    return result
}

const bubbleSort = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1; j++) {
            if(arr[j] > arr[j+1]){
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
            }
        }
    }
    return arr
}

const quickSort = (arr,left,right) => {
    if(left > right)return
    let pivot = arr[left]
    let i = left
    let j = right
    while(i !== j){
        while(arr[j] > pivot && i < j)j--
        while(arr[i] <= pivot && i < j)i++
        if(i < j){
            [arr[i],arr[j]] = [arr[j],arr[i]]
        }
    }
    arr[left] = arr[i]
    arr[i] = pivot
    quickSort(arr,left,i-1)
    quickSort(arr,i+1,right)
}

console.log(bubbleSort([3,1,2,5,4,7,9,8]));
// console.log(mergeArr([1,3,5],[2,4]))

// [3,1,2,5,4]