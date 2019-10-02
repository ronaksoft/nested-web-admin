export const MeasureTypeValues = {
    TIME: {
        ms: 1024,
        sec: 61440,
        min: 3686400,
        h: 221184000,
    },
    FILE_SIZE: {
        KB: 1024,
        MB: 1048576,
        GB: 1073741824,
        TB: 1099511627776,
        PB: 1125899906842624,
    },
};

enum MeasureType {
    FILE_SIZE,
    TIME,
    NUMBER
}

export default MeasureType;
