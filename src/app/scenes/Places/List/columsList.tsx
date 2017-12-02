export interface IPlaceListColumn {
    key: string;
    title: string;
    renderer: string;
    index: number;
    icon ?: string;
    width?: number;
}

export const columnsList: Array<IPlaceListColumn> = [
    {
        key: 'name',
        index: 0,
        title: 'Place Name',
        renderer: 'place',
    },
    {
        key: 'creators',
        index: 2,
        title: 'Managers',
        renderer: 'users',
        width: 140,
    },
    {
        key: 'counters.counters',
        index: 3,
        title: 'Members',
        renderer: 'memberCounter',
        icon: 'member',
        width: 84,
    },
    {
        key: 'type',
        index: 4,
        title: 'Place Type',
        renderer: 'placeType',
        width: 128,
    },
    {
        key: 'sub-places',
        index: 4,
        title: 'Sub-places',
        renderer: 'subPlaceCounter',
        width: 92,
    },
    {
        key: 'policies',
        index: 5,
        title: 'Policies',
        renderer: 'placePolicy',
        width: 80
    },
    {
        key: 'options',
        index: 6,
        title: '',
        renderer: 'options',
        width: 80
    }
];
