//----
var intadd01=10;
var intadd02=20;
var intresult=0;
//----
const Test = {
    _value: undefined,

    setValue(newValue) {
        if (this._value === undefined) {
            if (newValue === 1) {
                this._value = 100;
            } else if (newValue === 2) {
                this._value = 200;
            } else {
                throw new Error('Invalid value. Only 1 or 2 are allowed.');
            }
        } else {
            throw new Error('Value has already been set and cannot be changed.');
        }
    },

    get value() {
        return this._value;
    },

    toString() {
        return this._value;
    }
};

function createConstManager(valueMap) {
    let _value;

    return {
        setValue(newValue) {
            if (_value === undefined) {
                const index = valueMap.findIndex(entry => entry.newValue === newValue);
                if (index !== -1) {
                    _value = valueMap[index].assignedValue;
                } else {
                    throw new Error('Invalid value. The provided value is not in the value map.');
                }
            } else {
                throw new Error('Value has already been set and cannot be changed.');
            }
        },

        get value() {
            return _value;
        },

        toString() {
            return _value;
        }
    };
}
var valueMap01 = [
    { newValue: 1, assignedValue: '100' },
    { newValue: 2, assignedValue: '200' },
    { newValue: 3, assignedValue: '300' }
];
const firstConst = createConstManager(valueMap01);
const secondConst = createConstManager(valueMap01);

function Main() {
    var Result = {};//最終結果物件
    // 設置值
    Test.setValue(2);
    intresult = intadd01 + Test;

    // 設置常量
    firstConst.setValue(1);
    secondConst.setValue(2);
    intresult = intadd01 + firstConst + secondConst;

    Result.state_code = 0;
    Result.value = intresult;

    return JSON.stringify(Result);
}