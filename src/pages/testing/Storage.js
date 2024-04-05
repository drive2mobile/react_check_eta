import { Button } from "react-bootstrap";
import { getStorageItem, setStorageItem } from "../../utilities/LocalStorage";

const Storage = () => {
    var savedItem = {};

    function set1(){
        const obj = {'key1':['abc', 'def']};
        setStorageItem('item2', obj);
    }

    function set2(){
        var arr = savedItem['key1'];
        arr.push('aaa', 'bbb');
        savedItem['key1'] = arr;

        setStorageItem('item2', savedItem);
    }

    function set3(){
        var arr = ['aaa', 'bbb'];
        savedItem['key2'] = arr;

        setStorageItem('item2', savedItem);
    }

    async function read(){
        var itemTemp = await getStorageItem('item2');
        savedItem = itemTemp;
    }

    function logItem()
    {
        console.log(savedItem);
    }

    function reset()
    {
        const obj = {};
        setStorageItem('item2', obj);
    }


    return (
        <div>
            <Button onClick={() => set1() }>Set 1</Button>
            <Button onClick={() => set2() }>Set 2</Button>
            <Button onClick={() => set3() }>Set 3</Button>
            <Button onClick={() => read() }>Read</Button>
            <Button onClick={() => reset() }>Reset</Button>
            <Button onClick={() => logItem() }>log</Button>
        </div>
    )
}

export default Storage;